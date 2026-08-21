"""
Transit Route & Schedule Parser (ETL & Feature Extraction)
===========================================================
This module parses raw semi-structured text schedules from `documents.py` into
validated Pydantic models, structured Python dictionaries, and Pandas DataFrames.

It supports intermediate stop expansion, distance computation, and feature engineering.
"""

import re
from typing import List, Dict, Any, Tuple, Optional
import pandas as pd

from app.data.documents import documents
from app.data.stations import STATIONS, get_station_coordinates, get_station_by_name, calculate_haversine_distance
from app.schemas.route import ScheduleEntry, TransportMode


def parse_time_to_minutes(time_str: str) -> Optional[int]:
    """
    Convert a time string like "05:30", "5:30", or "14:15" into total minutes from midnight (0-1439).
    """
    if not time_str:
        return None
    time_str = time_str.strip()
    match = re.search(r"(\d{1,2}):(\d{2})", time_str)
    if not match:
        return None
    hours = int(match.group(1))
    minutes = int(match.group(2))
    return (hours * 60) + minutes


def format_minutes_to_time(minutes: int) -> str:
    """Convert minutes from midnight back to a 24-hour time string "HH:MM"."""
    normalized_minutes = minutes % (24 * 60)
    hours = normalized_minutes // 60
    mins = normalized_minutes % 60
    return f"{hours:02d}:{mins:02d}"


def calculate_duration(dep_min: int, arr_min: int) -> int:
    """Calculate duration in minutes, handling overnight journeys."""
    if arr_min >= dep_min:
        return arr_min - dep_min
    else:
        return (24 * 60 - dep_min) + arr_min


def normalize_station_name(raw_name: str) -> str:
    """Map informal or partial city name to canonical Station English display name."""
    if not raw_name:
        return ""
    station = get_station_by_name(raw_name)
    if station:
        return station.name
    return raw_name.strip().title()


def parse_single_line(line: str) -> List[ScheduleEntry]:
    """
    Parse a single raw schedule sentence from documents.py.
    Expands intermediate stops into valid sub-legs where possible.
    """
    line_clean = line.strip()
    if not line_clean or len(line_clean) < 10:
        return []
    
    line_lower = line_clean.lower()
    mode = TransportMode.TRAIN if "train" in line_lower else TransportMode.BUS
    
    # Extract Origin and Destination
    origin, destination = "", ""
    route_match = re.search(r"route\s*:\s*([^\.]+?)(?:\.|$|\|)", line_clean, re.IGNORECASE)
    if route_match:
        route_text = route_match.group(1).strip()
        if "-" in route_text:
            route_text = route_text.split("-", 1)[1].strip()
        if " to " in route_text.lower():
            parts = re.split(r"\s+to\s+", route_text, flags=re.IGNORECASE)
            origin = parts[0].strip()
            destination = parts[1].strip()
        elif "➔" in route_text or "->" in route_text:
            parts = re.split(r"➔|->", route_text)
            origin = parts[0].strip()
            destination = parts[1].strip()

    if not origin or not destination:
        from_to_match = re.search(r"from\s+([a-zA-Z\s]+?)\s+to\s+([a-zA-Z\s]+?)(?:\.|$|\|)", line_clean, re.IGNORECASE)
        if from_to_match:
            origin = from_to_match.group(1).strip()
            destination = from_to_match.group(2).strip()

    if not origin or not destination:
        return []

    canonical_origin = normalize_station_name(origin)
    canonical_dest = normalize_station_name(destination)

    # Extract Times
    dep_match = re.search(r"departs?\s*:\s*(\d{1,2}:\d{2})", line_clean, re.IGNORECASE)
    arr_match = re.search(r"arrives?\s*:\s*(\d{1,2}:\d{2})", line_clean, re.IGNORECASE)
    
    dep_str = dep_match.group(1) if dep_match else "06:00"
    arr_str = arr_match.group(1) if arr_match else "09:00"

    dep_min = parse_time_to_minutes(dep_str) or 360
    arr_min = parse_time_to_minutes(arr_str) or 540
    duration = calculate_duration(dep_min, arr_min)

    # Extract Service Type & Vehicle ID
    service_type = "Normal"
    serv_match = re.search(r"service\s*:\s*([^\.]+?)(?:\.|$|\|)", line_clean, re.IGNORECASE)
    if serv_match:
        service_type = serv_match.group(1).strip().capitalize()
    elif "luxury" in line_lower:
        service_type = "Luxury"
    elif "express" in line_lower or "intercity" in line_lower:
        service_type = "Express"
    elif "ac" in line_lower:
        service_type = "AC"

    vehicle_id = ""
    bus_match = re.search(r"bus\s*:\s*([^\.]+?)(?:\.|$|\|)", line_clean, re.IGNORECASE)
    train_match = re.search(r"train\s*:\s*([^\.]+?)(?:\.|$|\|)", line_clean, re.IGNORECASE)
    if train_match:
        vehicle_id = train_match.group(1).strip()
    elif bus_match:
        vehicle_id = bus_match.group(1).strip()

    # Extract Intermediate Stops
    stops = []
    stops_match = re.search(r"stops?\s*:\s*([^\.]+?)(?:\.|$)", line_clean, re.IGNORECASE)
    if stops_match:
        stops = [s.strip().title() for s in stops_match.group(1).split(",") if s.strip()]

    entries: List[ScheduleEntry] = []

    # 1. Main End-to-End Entry
    main_entry = ScheduleEntry(
        route_name=f"{'🚆 Train' if mode == TransportMode.TRAIN else '🚌 Bus'} {canonical_origin} to {canonical_dest}",
        origin=canonical_origin,
        destination=canonical_dest,
        mode=mode,
        vehicle_id=vehicle_id,
        service_type=service_type,
        departs=dep_str,
        arrives=arr_str,
        departs_minutes=dep_min,
        arrives_minutes=arr_min,
        duration_minutes=duration,
        stops=stops
    )
    entries.append(main_entry)

    # 2. Expand Intermediate Stops (Sub-Legs)
    if stops and len(stops) >= 1:
        valid_stop_names = [normalize_station_name(s) for s in stops if normalize_station_name(s) in [st.name for st in STATIONS.values()]]
        all_points = [canonical_origin] + [s for s in valid_stop_names if s != canonical_origin and s != canonical_dest] + [canonical_dest]
        
        # Total distance
        total_dist = 1.0
        coords_orig = get_station_coordinates(canonical_origin)
        coords_dest = get_station_coordinates(canonical_dest)
        if coords_orig and coords_dest:
            total_dist = max(1.0, calculate_haversine_distance(coords_orig[0], coords_orig[1], coords_dest[0], coords_dest[1]))

        for i in range(len(all_points)):
            for j in range(i + 1, len(all_points)):
                sub_orig = all_points[i]
                sub_dest = all_points[j]
                if sub_orig == canonical_origin and sub_dest == canonical_dest:
                    continue  # already added

                # Approximate sub-leg time proportionally based on distance
                c_sub_orig = get_station_coordinates(sub_orig)
                c_sub_dest = get_station_coordinates(sub_dest)
                if c_sub_orig and c_sub_dest:
                    sub_dist = calculate_haversine_distance(c_sub_orig[0], c_sub_orig[1], c_sub_dest[0], c_sub_dest[1])
                    sub_dur = max(20, int((sub_dist / total_dist) * duration))
                    
                    # Distance from origin to sub_orig
                    orig_to_sub = calculate_haversine_distance(coords_orig[0], coords_orig[1], c_sub_orig[0], c_sub_orig[1]) if coords_orig else 0
                    sub_dep_min = (dep_min + int((orig_to_sub / total_dist) * duration)) % (24 * 60)
                    sub_arr_min = (sub_dep_min + sub_dur) % (24 * 60)

                    entries.append(ScheduleEntry(
                        route_name=f"{'🚆 Train' if mode == TransportMode.TRAIN else '🚌 Bus'} {sub_orig} to {sub_dest}",
                        origin=sub_orig,
                        destination=sub_dest,
                        mode=mode,
                        vehicle_id=vehicle_id,
                        service_type=service_type,
                        departs=format_minutes_to_time(sub_dep_min),
                        arrives=format_minutes_to_time(sub_arr_min),
                        departs_minutes=sub_dep_min,
                        arrives_minutes=sub_arr_min,
                        duration_minutes=sub_dur,
                        stops=[]
                    ))

    return entries


def parse_all_schedules() -> List[ScheduleEntry]:
    """Parse the entire `documents.py` collection into a structured list of ScheduleEntry models."""
    all_entries: List[ScheduleEntry] = []
    seen_keys = set()

    for doc in documents:
        lines = doc.split("\n")
        for line in lines:
            line_entries = parse_single_line(line)
            for entry in line_entries:
                key = (entry.origin.lower(), entry.destination.lower(), entry.departs, entry.vehicle_id.lower(), entry.mode.value)
                if key not in seen_keys:
                    seen_keys.add(key)
                    all_entries.append(entry)

    return all_entries


def get_all_schedules_dataframe() -> pd.DataFrame:
    """Transform all parsed schedules into a Pandas DataFrame for ML feature extraction."""
    schedules = parse_all_schedules()
    records = []

    for s in schedules:
        dep_hour = s.departs_minutes / 60.0
        
        if 4.0 <= dep_hour < 7.0:
            period = "early_morning"
        elif 7.0 <= dep_hour < 10.0:
            period = "morning_rush"
        elif 10.0 <= dep_hour < 16.0:
            period = "afternoon"
        elif 16.0 <= dep_hour < 20.0:
            period = "evening_rush"
        else:
            period = "night"

        coords_orig = get_station_coordinates(s.origin)
        coords_dest = get_station_coordinates(s.destination)
        if coords_orig and coords_dest:
            dist = calculate_haversine_distance(coords_orig[0], coords_orig[1], coords_dest[0], coords_dest[1])
        else:
            dist = max(15.0, (s.duration_minutes / 60.0) * 40.0)

        records.append({
            "origin": s.origin,
            "destination": s.destination,
            "mode": s.mode.value,
            "service_type": s.service_type,
            "departs_hour": dep_hour,
            "departs_minutes": s.departs_minutes,
            "departure_time_period": period,
            "distance_km": round(dist, 2),
            "duration_minutes": s.duration_minutes
        })

    return pd.DataFrame(records)


def get_unique_corridors() -> List[Tuple[str, str, str]]:
    """Return all unique (Origin, Destination, Mode) corridors available."""
    schedules = parse_all_schedules()
    corridors = set()
    for s in schedules:
        corridors.add((s.origin, s.destination, s.mode.value))
    return sorted(list(corridors))
