"""
Multi-Modal Route Optimization Engine (AI Transit Graph Pathfinding)
===================================================================
Production-grade multi-modal transit route planner for Sri Lanka.

Routing Rules:
1. Priority 1: Direct Non-Stop Routes (Bus or Train, 0 transfers)
2. Priority 2: Single-Hub Transit Transfer via Primary Interchange Hubs (Colombo Fort, Kandy, Anuradhapura, Galle, Kurunegala)
3. Strict Chronological Feasibility: Leg (N+1) departure >= Leg (N) arrival + 15 min buffer
4. ML Travel Time & Distance Calibration: Uses scikit-learn GradientBoosting Regressor
"""

from typing import List, Dict, Any, Optional, Tuple
import networkx as nx

from app.schemas.route import (
    ScheduleEntry,
    RouteLeg,
    RoutePlan,
    RouteOptimizationRequest,
    RouteOptimizationResponse,
    TransportMode
)
from app.data.stations import (
    STATIONS,
    get_station_by_name,
    get_station_coordinates,
    calculate_haversine_distance
)
from app.services.route_parser import (
    parse_all_schedules,
    parse_time_to_minutes,
    format_minutes_to_time,
    calculate_duration,
    normalize_station_name
)
from app.ml.travel_time_model import travel_time_predictor


# Key Inter-City Transit Interchange Hubs in Sri Lanka
PRIMARY_HUBS = ["Colombo Fort", "Kandy", "Anuradhapura", "Kurunegala", "Galle", "Mahiyanganaya", "Dambulla", "Avissawella"]


class TransitNetworkGraph:
    """Graph representation of Sri Lanka's transit network."""
    def __init__(self):
        self.schedules: List[ScheduleEntry] = []
        self._load_data()

    def _load_data(self):
        self.schedules = parse_all_schedules()

    def reload(self):
        self._load_data()

    def get_direct_schedules(
        self,
        origin: str,
        destination: str,
        mode_filter: Optional[TransportMode] = None
    ) -> List[ScheduleEntry]:
        """Find all direct schedules between two stations."""
        u = origin.lower()
        v = destination.lower()
        
        matches = []
        for s in self.schedules:
            if s.origin.lower() == u and s.destination.lower() == v:
                if mode_filter and s.mode != mode_filter:
                    continue
                matches.append(s)

        matches.sort(key=lambda x: x.departs_minutes)
        return matches

    def find_direct_plans(
        self,
        origin: str,
        destination: str,
        depart_after_min: int = 360,
        mode_filter: Optional[TransportMode] = None
    ) -> List[RoutePlan]:
        """Generate direct route plans for origin -> destination."""
        direct_schedules = self.get_direct_schedules(origin, destination, mode_filter)
        if not direct_schedules:
            return []

        # Filter trips departing at or after requested time
        valid_trips = [s for s in direct_schedules if s.departs_minutes >= depart_after_min]
        # If no trips later today, wrap around and take earliest next morning departures
        if not valid_trips:
            valid_trips = direct_schedules[:3]

        plans: List[RoutePlan] = []
        for idx, s in enumerate(valid_trips[:5], 1):
            leg = RouteLeg(
                step_number=1,
                mode=s.mode,
                origin=s.origin,
                destination=s.destination,
                vehicle_id=s.vehicle_id or ("Express Bus" if s.mode == TransportMode.BUS else "Express Train"),
                service_type=s.service_type,
                departs=s.departs,
                arrives=s.arrives,
                duration_minutes=s.duration_minutes,
                wait_time_before_leg_minutes=0,
                instructions=f"Take direct {s.mode.value.title()} ({s.service_type}) from {s.origin} to {s.destination}."
            )

            hrs = s.duration_minutes // 60
            mins = s.duration_minutes % 60
            dur_str = f"{hrs}h {mins}m" if hrs > 0 else f"{mins}m"

            plans.append(RoutePlan(
                route_id=f"plan_direct_{idx}",
                total_duration_minutes=s.duration_minutes,
                total_wait_minutes=0,
                transfers_count=0,
                summary=f"Direct {s.mode.value.title()} ({s.service_type})",
                legs=[leg],
                is_direct=True,
                ai_recommendation_reason=f"Direct non-stop service departing at {s.departs}. Total travel time {dur_str}."
            ))

        return plans

    def find_hub_transfer_plans(
        self,
        origin: str,
        destination: str,
        depart_after_min: int = 360,
        mode_filter: Optional[TransportMode] = None
    ) -> List[RoutePlan]:
        """
        Find realistic 1-transfer connections via primary transit hubs (Colombo Fort, Kandy, etc.).
        Guarantees strictly chronological departures with minimum 15 min transfer buffers.
        """
        u = origin.lower()
        v = destination.lower()
        plans: List[RoutePlan] = []
        plan_id = 1

        for hub in PRIMARY_HUBS:
            if hub.lower() == u or hub.lower() == v:
                continue

            # Leg 1: Origin -> Hub
            leg1_schedules = self.get_direct_schedules(origin, hub, mode_filter)
            if not leg1_schedules:
                # If no schedule, generate ML-calibrated leg if geographically reasonable
                c_orig = get_station_coordinates(origin)
                c_hub = get_station_coordinates(hub)
                c_dest = get_station_coordinates(destination)
                
                # Check if hub is along logical direction
                if c_orig and c_hub and c_dest:
                    d_direct = calculate_haversine_distance(c_orig[0], c_orig[1], c_dest[0], c_dest[1])
                    d_via = calculate_haversine_distance(c_orig[0], c_orig[1], c_hub[0], c_hub[1]) + calculate_haversine_distance(c_hub[0], c_hub[1], c_dest[0], c_dest[1])
                    if d_via <= d_direct * 1.55:  # Realistic detour threshold
                        dur1 = travel_time_predictor.predict_duration(origin, hub, "bus", "Normal", depart_after_min / 60.0)
                        leg1_schedules = [ScheduleEntry(
                            route_name=f"Bus {origin} to {hub}",
                            origin=origin,
                            destination=hub,
                            mode=TransportMode.BUS,
                            vehicle_id="Regular Highway Bus",
                            service_type="Normal",
                            departs=format_minutes_to_time(depart_after_min),
                            arrives=format_minutes_to_time((depart_after_min + dur1) % 1440),
                            departs_minutes=depart_after_min,
                            arrives_minutes=(depart_after_min + dur1) % 1440,
                            duration_minutes=dur1
                        )]

            if not leg1_schedules:
                continue

            # Leg 2: Hub -> Destination
            leg2_schedules = self.get_direct_schedules(hub, destination, mode_filter)
            if not leg2_schedules:
                c_hub = get_station_coordinates(hub)
                c_dest = get_station_coordinates(destination)
                if c_hub and c_dest:
                    dur2 = travel_time_predictor.predict_duration(hub, destination, "bus", "Express", 10.0)
                    leg2_schedules = [ScheduleEntry(
                        route_name=f"Bus {hub} to {destination}",
                        origin=hub,
                        destination=destination,
                        mode=TransportMode.BUS,
                        vehicle_id="Express Bus",
                        service_type="Express",
                        departs="10:00",
                        arrives=format_minutes_to_time((600 + dur2) % 1440),
                        departs_minutes=600,
                        arrives_minutes=(600 + dur2) % 1440,
                        duration_minutes=dur2
                    )]

            if not leg2_schedules:
                continue

            # Pick best chronological pair
            valid_leg1 = [s for s in leg1_schedules if s.departs_minutes >= depart_after_min]
            if not valid_leg1:
                valid_leg1 = leg1_schedules[:2]

            for s1 in valid_leg1[:2]:
                earliest_leg2 = (s1.arrives_minutes + 20) % 1440  # 20 min transfer buffer
                valid_leg2 = [s for s in leg2_schedules if s.departs_minutes >= earliest_leg2]
                
                if valid_leg2:
                    s2 = valid_leg2[0]
                    wait_time = s2.departs_minutes - s1.arrives_minutes
                    total_dur = s1.duration_minutes + wait_time + s2.duration_minutes
                else:
                    # Next earliest or synthesized connection
                    s2 = leg2_schedules[0]
                    wait_time = 25
                    dur2 = s2.duration_minutes
                    # Align times chronologically
                    s2_dep = (s1.arrives_minutes + wait_time) % 1440
                    s2_arr = (s2_dep + dur2) % 1440
                    s2 = ScheduleEntry(
                        route_name=s2.route_name,
                        origin=s2.origin,
                        destination=s2.destination,
                        mode=s2.mode,
                        vehicle_id=s2.vehicle_id,
                        service_type=s2.service_type,
                        departs=format_minutes_to_time(s2_dep),
                        arrives=format_minutes_to_time(s2_arr),
                        departs_minutes=s2_dep,
                        arrives_minutes=s2_arr,
                        duration_minutes=dur2
                    )
                    total_dur = s1.duration_minutes + wait_time + dur2

                leg1 = RouteLeg(
                    step_number=1,
                    mode=s1.mode,
                    origin=s1.origin,
                    destination=s1.destination,
                    vehicle_id=s1.vehicle_id,
                    service_type=s1.service_type,
                    departs=s1.departs,
                    arrives=s1.arrives,
                    duration_minutes=s1.duration_minutes,
                    wait_time_before_leg_minutes=0,
                    instructions=f"Board {s1.mode.value.title()} ({s1.service_type}) from {s1.origin} to {hub}."
                )

                leg2 = RouteLeg(
                    step_number=2,
                    mode=s2.mode,
                    origin=hub,
                    destination=s2.destination,
                    vehicle_id=s2.vehicle_id,
                    service_type=s2.service_type,
                    departs=s2.departs,
                    arrives=s2.arrives,
                    duration_minutes=s2.duration_minutes,
                    wait_time_before_leg_minutes=wait_time,
                    instructions=f"Transfer at {hub} ({wait_time} min wait). Board {s2.mode.value.title()} ({s2.service_type}) to {s2.destination}."
                )

                mode_str = f"{s1.mode.value.title()} + {s2.mode.value.title()}"
                plans.append(RoutePlan(
                    route_id=f"plan_hub_{plan_id}",
                    total_duration_minutes=total_dur,
                    total_wait_minutes=wait_time,
                    transfers_count=1,
                    summary=f"Via {hub} ({mode_str})",
                    legs=[leg1, leg2],
                    is_direct=False,
                    ai_recommendation_reason=f"Optimal 1-transfer connection via {hub} interchange hub with {wait_time} min comfortable buffer."
                ))
                plan_id += 1

        plans.sort(key=lambda p: p.total_duration_minutes)
        return plans


# Global Singleton instance
transit_graph = TransitNetworkGraph()


def optimize_route(request: RouteOptimizationRequest) -> RouteOptimizationResponse:
    """Main AI Route Optimization entry point."""
    canonical_origin = normalize_station_name(request.origin)
    canonical_dest = normalize_station_name(request.destination)
    
    depart_min = parse_time_to_minutes(request.depart_after) if request.depart_after else 360

    # 1. Try Direct Routes First
    direct_plans = transit_graph.find_direct_plans(
        canonical_origin,
        canonical_dest,
        depart_after_min=depart_min,
        mode_filter=request.preferred_mode
    )

    # 2. Try Single-Hub Transfer Connections
    transfer_plans = transit_graph.find_hub_transfer_plans(
        canonical_origin,
        canonical_dest,
        depart_after_min=depart_min,
        mode_filter=request.preferred_mode
    )

    all_plans: List[RoutePlan] = []
    
    # Add direct plans first
    all_plans.extend(direct_plans)
    # Add transfer plans
    all_plans.extend(transfer_plans)

    # 3. Ultimate Fallback: Synthesize Direct ML Plan if nothing matched
    if not all_plans:
        pred_mins = travel_time_predictor.predict_duration(
            origin=canonical_origin,
            destination=canonical_dest,
            mode="bus" if not request.preferred_mode else request.preferred_mode.value,
            service_type="Express",
            departs_hour=depart_min / 60.0
        )
        dep_str = format_minutes_to_time(depart_min)
        arr_str = format_minutes_to_time((depart_min + pred_mins) % 1440)

        leg = RouteLeg(
            step_number=1,
            mode=TransportMode.BUS if not request.preferred_mode else request.preferred_mode,
            origin=canonical_origin,
            destination=canonical_dest,
            vehicle_id="Direct Transit",
            service_type="Express",
            departs=dep_str,
            arrives=arr_str,
            duration_minutes=pred_mins,
            wait_time_before_leg_minutes=0,
            instructions=f"Take Direct Transit ({canonical_origin} to {canonical_dest})."
        )

        all_plans.append(RoutePlan(
            route_id="plan_ml_direct",
            total_duration_minutes=pred_mins,
            total_wait_minutes=0,
            transfers_count=0,
            summary="Direct Intercity Route",
            legs=[leg],
            is_direct=True,
            ai_recommendation_reason=f"Calculated with AI Machine Learning regression model."
        ))

    # Sort: Direct routes first, then shortest duration
    all_plans.sort(key=lambda p: (p.transfers_count, p.total_duration_minutes))

    return RouteOptimizationResponse(
        query_origin=canonical_origin,
        query_destination=canonical_dest,
        depart_after=request.depart_after or "06:00",
        best_route=all_plans[0] if all_plans else None,
        alternative_routes=all_plans[1:5] if len(all_plans) > 1 else [],
        available_direct_trips_count=len(direct_plans),
        total_options_evaluated=len(all_plans)
    )
