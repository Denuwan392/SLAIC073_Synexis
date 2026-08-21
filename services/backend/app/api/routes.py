"""
Transit Routes, Station Geodata, and AI Optimization API
========================================================
Exposes REST endpoints for:
1. `GET /api/stations`: Returns all Sri Lanka transit station coordinates & metadata
2. `GET /api/routes/geo`: Returns GeoJSON LineStrings for all connected transit corridors
3. `POST /api/routes/optimize`: Runs AI Dijkstra pathfinding with ML travel time predictions
4. `POST /api/ml/predict-travel-time`: Direct ML inference endpoint for travel duration
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.schemas.route import (
    Station,
    RouteOptimizationRequest,
    RouteOptimizationResponse,
    GeoJSONFeatureCollection,
    GeoJSONFeature,
    GeoJSONGeometry,
    GeoJSONFeatureProperties,
    TransportMode
)
from app.data.stations import (
    get_all_stations,
    get_station_by_name,
    get_station_coordinates,
    STATIONS
)
from app.services.route_parser import (
    get_unique_corridors,
    parse_all_schedules,
    parse_time_to_minutes
)
from app.services.route_optimizer import optimize_route
from app.ml.travel_time_model import travel_time_predictor


router = APIRouter(prefix="/api", tags=["Transit Routes & AI Map"])


class DirectMLPredictionRequest(BaseModel):
    origin: str = Field(..., description="Origin city, e.g. 'Colombo'")
    destination: str = Field(..., description="Destination city, e.g. 'Kandy'")
    mode: str = Field(default="bus", description="'bus' or 'train'")
    service_type: str = Field(default="Normal", description="'Normal', 'Express', 'Luxury', 'AC'")
    departs_hour: float = Field(default=8.0, description="Hour of departure (0.0 to 23.99), e.g. 8.5 for 08:30")


class DirectMLPredictionResponse(BaseModel):
    origin: str
    destination: str
    mode: str
    service_type: str
    departs_hour: float
    predicted_duration_minutes: int
    predicted_duration_formatted: str
    model_r2_score: Optional[float] = None
    model_mae_minutes: Optional[float] = None


@router.get("/stations", response_model=List[Station])
def list_stations():
    """Retrieve all ~30 registered Sri Lankan transit hubs and railway stations with geographic coordinates."""
    return get_all_stations()


@router.get("/routes/geo", response_model=GeoJSONFeatureCollection)
def get_geojson_routes():
    """
    Generate GeoJSON FeatureCollection of all transit lines across Sri Lanka.
    Consumed by Leaflet.js to draw polylines on the interactive map.
    """
    corridors = get_unique_corridors()
    all_schedules = parse_all_schedules()
    features: List[GeoJSONFeature] = []

    for orig, dest, mode in corridors:
        coords_orig = get_station_coordinates(orig)
        coords_dest = get_station_coordinates(dest)

        if coords_orig and coords_dest:
            # Leaflet / GeoJSON coordinates format is [lng, lat]
            line_coords = [
                [coords_orig[1], coords_orig[0]],
                [coords_dest[1], coords_dest[0]]
            ]

            matching_schedules = [
                s for s in all_schedules
                if s.origin == orig and s.destination == dest and s.mode.value == mode
            ]
            
            services = list(set([s.service_type for s in matching_schedules]))
            avg_dur = int(sum([s.duration_minutes for s in matching_schedules]) / len(matching_schedules)) if matching_schedules else 180

            feature = GeoJSONFeature(
                geometry=GeoJSONGeometry(coordinates=line_coords),
                properties=GeoJSONFeatureProperties(
                    route_name=f"{orig} to {dest}",
                    origin=orig,
                    destination=dest,
                    mode=mode,
                    service_types=services or ["Normal"],
                    frequency_daily=len(matching_schedules),
                    avg_duration_minutes=avg_dur
                )
            )
            features.append(feature)

    return GeoJSONFeatureCollection(features=features)


@router.post("/routes/optimize", response_model=RouteOptimizationResponse)
def get_optimized_route(request: RouteOptimizationRequest):
    """
    AI Multi-Modal Route Optimization with Machine Learning Travel Time Prediction.
    Executes Dijkstra shortest path algorithm across bus and train networks and predicts
    realistic travel durations based on departure time and service tier.
    """
    try:
        response = optimize_route(request)

        # Enrich legs with Machine Learning predicted travel durations
        dep_hour = 8.0
        if request.depart_after:
            mins = parse_time_to_minutes(request.depart_after)
            if mins is not None:
                dep_hour = mins / 60.0

        if response.best_route:
            for leg in response.best_route.legs:
                predicted = travel_time_predictor.predict_duration(
                    origin=leg.origin,
                    destination=leg.destination,
                    mode=leg.mode.value,
                    service_type=leg.service_type,
                    departs_hour=dep_hour
                )
                leg.predicted_duration_minutes = predicted

        for alt in response.alternative_routes:
            for leg in alt.legs:
                predicted = travel_time_predictor.predict_duration(
                    origin=leg.origin,
                    destination=leg.destination,
                    mode=leg.mode.value,
                    service_type=leg.service_type,
                    departs_hour=dep_hour
                )
                leg.predicted_duration_minutes = predicted

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Route optimization error: {str(e)}")


@router.post("/ml/predict-travel-time", response_model=DirectMLPredictionResponse)
def predict_travel_time(req: DirectMLPredictionRequest):
    """Direct Machine Learning inference endpoint for travel duration prediction."""
    pred_mins = travel_time_predictor.predict_duration(
        origin=req.origin,
        destination=req.destination,
        mode=req.mode,
        service_type=req.service_type,
        departs_hour=req.departs_hour
    )
    hrs = pred_mins // 60
    mins = pred_mins % 60
    formatted = f"{hrs}h {mins}m" if hrs > 0 else f"{mins} mins"

    metrics = travel_time_predictor.metrics or {}
    return DirectMLPredictionResponse(
        origin=req.origin,
        destination=req.destination,
        mode=req.mode,
        service_type=req.service_type,
        departs_hour=req.departs_hour,
        predicted_duration_minutes=pred_mins,
        predicted_duration_formatted=formatted,
        model_r2_score=metrics.get("r2_score"),
        model_mae_minutes=metrics.get("mae_minutes")
    )
