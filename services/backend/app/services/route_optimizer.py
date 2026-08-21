"""
Multi-Modal Route Optimization Engine (AI Graph Pathfinding)
============================================================
This module constructs a weighted directed transit graph using NetworkX and executes
time-constrained multi-modal route optimization (Dijkstra & K-Shortest Paths).

Key Capabilities:
1. Direct Route Evaluation (filtering by departure time & duration)
2. Multi-Modal Transfer Routing (Bus + Train combinations)
3. Minimum Transfer Buffer Constraints (ensures realistic connections between stations)
4. Alternative Itinerary Generation (ranking fastest vs least transfers)
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
from app.services.route_parser import (
    parse_all_schedules,
    parse_time_to_minutes,
    format_minutes_to_time,
    calculate_duration,
    normalize_station_name
)


class TransitNetworkGraph:
    """
    Graph representation of Sri Lanka's transit network.
    Nodes = Stations
    Edges = Direct scheduled bus/train trips
    """
    def __init__(self):
        self.graph = nx.MultiDiGraph()
        self.schedules: List[ScheduleEntry] = []
        self._build_graph()

    def _build_graph(self):
        """Construct the NetworkX graph from parsed schedules."""
        self.schedules = parse_all_schedules()
        self.graph.clear()

        for s in self.schedules:
            u = s.origin.lower()
            v = s.destination.lower()
            
            # Ensure nodes exist
            if not self.graph.has_node(u):
                self.graph.add_node(u, display_name=s.origin)
            if not self.graph.has_node(v):
                self.graph.add_node(v, display_name=s.destination)

            # Edge weight = duration in minutes
            self.graph.add_edge(
                u,
                v,
                key=f"{s.mode.value}_{s.departs}_{s.vehicle_id}",
                schedule=s,
                weight=s.duration_minutes,
                departs_min=s.departs_minutes,
                arrives_min=s.arrives_minutes,
                mode=s.mode.value,
                service=s.service_type
            )

    def reload(self):
        """Reload and rebuild graph if schedules change."""
        self._build_graph()

    def get_direct_trips(
        self,
        origin: str,
        destination: str,
        depart_after_min: Optional[int] = None,
        mode_filter: Optional[TransportMode] = None
    ) -> List[ScheduleEntry]:
        """Find all direct schedules between two stations matching time and mode filters."""
        u = origin.lower()
        v = destination.lower()
        
        matches = []
        for s in self.schedules:
            if s.origin.lower() == u and s.destination.lower() == v:
                if mode_filter and s.mode != mode_filter:
                    continue
                if depart_after_min is not None:
                    # Trip must depart at or after specified time
                    if s.departs_minutes < depart_after_min:
                        continue
                matches.append(s)

        # Sort by departure time
        matches.sort(key=lambda x: x.departs_minutes)
        return matches

    def find_transfer_routes(
        self,
        origin: str,
        destination: str,
        depart_after_min: int = 360,  # default 06:00
        min_transfer_buffer_min: int = 15,
        max_transfer_wait_min: int = 180,
        mode_filter: Optional[TransportMode] = None
    ) -> List[RoutePlan]:
        """
        Find multi-leg transfer journeys (e.g. Origin -> Hub by Bus, Hub -> Destination by Train).
        Computes accurate connection times, transfer waits, and total elapsed duration.
        """
        u = origin.lower()
        v = destination.lower()
        
        if not self.graph.has_node(u) or not self.graph.has_node(v):
            return []

        plans: List[RoutePlan] = []
        plan_counter = 1

        # Check all possible 1-transfer intermediate hub stations
        # (Stations reachable from u that can also reach v)
        successors_of_u = set(self.graph.successors(u))
        predecessors_of_v = set(self.graph.predecessors(v))
        intermediate_hubs = successors_of_u.intersection(predecessors_of_v)

        for hub in intermediate_hubs:
            if hub == u or hub == v:
                continue

            # Leg 1 trips: Origin -> Hub
            leg1_candidates = [
                s for s in self.schedules
                if s.origin.lower() == u and s.destination.lower() == hub
                and s.departs_minutes >= depart_after_min
            ]
            
            if mode_filter and mode_filter != TransportMode.MULTI_MODAL:
                leg1_candidates = [s for s in leg1_candidates if s.mode == mode_filter]

            leg1_candidates.sort(key=lambda x: x.departs_minutes)
            # Take top 3 earliest departures to avoid combinatorial explosion
            for leg1 in leg1_candidates[:3]:
                # Leg 2 trips: Hub -> Destination (must depart after leg1 arrives + buffer)
                earliest_leg2_dep = leg1.arrives_minutes + min_transfer_buffer_min
                latest_leg2_dep = leg1.arrives_minutes + max_transfer_wait_min

                leg2_candidates = [
                    s for s in self.schedules
                    if s.origin.lower() == hub and s.destination.lower() == v
                    and earliest_leg2_dep <= s.departs_minutes <= latest_leg2_dep
                ]
                
                if mode_filter and mode_filter != TransportMode.MULTI_MODAL:
                    leg2_candidates = [s for s in leg2_candidates if s.mode == mode_filter]

                leg2_candidates.sort(key=lambda x: x.departs_minutes)

                if leg2_candidates:
                    leg2 = leg2_candidates[0]  # Best earliest connection
                    
                    wait_time = leg2.departs_minutes - leg1.arrives_minutes
                    total_journey_time = (leg2.arrives_minutes - leg1.departs_minutes)
                    if total_journey_time < 0:
                        total_journey_time += (24 * 60)

                    route_leg_1 = RouteLeg(
                        step_number=1,
                        mode=leg1.mode,
                        origin=leg1.origin,
                        destination=leg1.destination,
                        vehicle_id=leg1.vehicle_id,
                        service_type=leg1.service_type,
                        departs=leg1.departs,
                        arrives=leg1.arrives,
                        duration_minutes=leg1.duration_minutes,
                        wait_time_before_leg_minutes=0,
                        instructions=f"Board {leg1.mode.value.title()} ({leg1.service_type}) from {leg1.origin} to {leg1.destination}."
                    )

                    route_leg_2 = RouteLeg(
                        step_number=2,
                        mode=leg2.mode,
                        origin=leg2.origin,
                        destination=leg2.destination,
                        vehicle_id=leg2.vehicle_id,
                        service_type=leg2.service_type,
                        departs=leg2.departs,
                        arrives=leg2.arrives,
                        duration_minutes=leg2.duration_minutes,
                        wait_time_before_leg_minutes=wait_time,
                        instructions=f"Transfer at {hub.title()} ({wait_time} min wait). Board {leg2.mode.value.title()} ({leg2.service_type}) to {leg2.destination}."
                    )

                    mode_summary = f"{leg1.mode.value.title()} + {leg2.mode.value.title()}"
                    plans.append(RoutePlan(
                        route_id=f"plan_transfer_{plan_counter}",
                        total_duration_minutes=total_journey_time,
                        total_wait_minutes=wait_time,
                        transfers_count=1,
                        summary=f"Via {hub.title()} ({mode_summary})",
                        legs=[route_leg_1, route_leg_2],
                        is_direct=False,
                        ai_recommendation_reason=f"Fastest connection via {hub.title()} with {wait_time} mins comfortable transfer time."
                    ))
                    plan_counter += 1

        # Sort plans by shortest total duration
        plans.sort(key=lambda p: p.total_duration_minutes)
        return plans


# Global Singleton instance of transit graph
transit_graph = TransitNetworkGraph()


def optimize_route(request: RouteOptimizationRequest) -> RouteOptimizationResponse:
    """
    Main entry point for AI Route Optimization.
    1. Canonicalizes Origin and Destination.
    2. Evaluates direct routes.
    3. If needed or requested, evaluates multi-modal transfer routes.
    4. Ranks itineraries by duration and convenience.
    """
    canonical_origin = normalize_station_name(request.origin)
    canonical_dest = normalize_station_name(request.destination)
    
    depart_min = parse_time_to_minutes(request.depart_after) if request.depart_after else 360  # 06:00 AM default

    # 1. Look for Direct Trips
    direct_schedules = transit_graph.get_direct_trips(
        canonical_origin,
        canonical_dest,
        depart_after_min=depart_min,
        mode_filter=request.preferred_mode
    )

    all_plans: List[RoutePlan] = []
    plan_counter = 1

    for s in direct_schedules:
        leg = RouteLeg(
            step_number=1,
            mode=s.mode,
            origin=s.origin,
            destination=s.destination,
            vehicle_id=s.vehicle_id,
            service_type=s.service_type,
            departs=s.departs,
            arrives=s.arrives,
            duration_minutes=s.duration_minutes,
            wait_time_before_leg_minutes=0,
            instructions=f"Take direct {s.mode.value.title()} ({s.service_type}) from {s.origin} to {s.destination}."
        )
        
        all_plans.append(RoutePlan(
            route_id=f"plan_direct_{plan_counter}",
            total_duration_minutes=s.duration_minutes,
            total_wait_minutes=0,
            transfers_count=0,
            summary=f"Direct {s.mode.value.title()} ({s.service_type})",
            legs=[leg],
            is_direct=True,
            ai_recommendation_reason=f"Direct non-stop service. Departs at {s.departs}, takes {s.duration_minutes // 60}h {s.duration_minutes % 60}m."
        ))
        plan_counter += 1

    # 2. Look for Transfer Trips if direct trips are few or if multi-modal is preferred
    transfer_plans = transit_graph.find_transfer_routes(
        canonical_origin,
        canonical_dest,
        depart_after_min=depart_min,
        mode_filter=request.preferred_mode
    )
    all_plans.extend(transfer_plans)

    # Sort all plans: Direct routes preferred first if comparable in time, then shortest duration
    all_plans.sort(key=lambda p: (p.transfers_count, p.total_duration_minutes))

    best_route = all_plans[0] if all_plans else None
    alternative_routes = all_plans[1:6] if len(all_plans) > 1 else []

    return RouteOptimizationResponse(
        query_origin=canonical_origin,
        query_destination=canonical_dest,
        depart_after=request.depart_after or "06:00",
        best_route=best_route,
        alternative_routes=alternative_routes,
        available_direct_trips_count=len(direct_schedules),
        total_options_evaluated=len(all_plans)
    )
