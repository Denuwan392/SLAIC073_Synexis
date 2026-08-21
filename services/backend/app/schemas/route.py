from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class TransportMode(str, Enum):
    """Transit mode category: Bus or Train."""
    BUS = "bus"
    TRAIN = "train"
    MULTI_MODAL = "multi_modal"


class StationType(str, Enum):
    """Type of transit facility."""
    BUS_STAND = "bus_stand"
    RAILWAY_STATION = "railway_station"
    MULTI_MODAL_HUB = "multi_modal_hub"


class Station(BaseModel):
    """Represents a physical transit station in Sri Lanka."""
    id: str = Field(..., description="Unique slug ID, e.g. 'colombo_fort'")
    name: str = Field(..., description="English display name, e.g. 'Colombo Fort'")
    name_si: str = Field(..., description="Sinhala name, e.g. 'කොළඹ කොටුව'")
    name_ta: str = Field(..., description="Tamil name, e.g. 'கொழும்பு கோட்டை'")
    lat: float = Field(..., description="Latitude coordinate")
    lng: float = Field(..., description="Longitude coordinate")
    station_type: StationType = Field(default=StationType.MULTI_MODAL_HUB)
    province: str = Field(default="Western")
    aliases: List[str] = Field(default_factory=list, description="Alternative names for fuzzy search")


class ScheduleEntry(BaseModel):
    """Structured representation of a single bus or train trip."""
    route_name: str = Field(..., description="e.g. 'Route 01 - Colombo to Kandy'")
    origin: str = Field(..., description="Departure station name")
    destination: str = Field(..., description="Arrival station name")
    mode: TransportMode = Field(default=TransportMode.BUS)
    vehicle_id: str = Field(default="", description="Bus run number or Train name/ID")
    service_type: str = Field(default="Normal", description="Normal, Express, Luxury, Intercity, AC")
    departs: str = Field(..., description="Departure time in HH:MM format (24h or 12h)")
    arrives: str = Field(..., description="Arrival time in HH:MM format (24h or 12h)")
    departs_minutes: int = Field(..., description="Departure time in minutes from midnight (0-1439)")
    arrives_minutes: int = Field(..., description="Arrival time in minutes from midnight (0-1439)")
    duration_minutes: int = Field(..., description="Trip duration in minutes")
    stops: List[str] = Field(default_factory=list, description="Intermediate stops")


class RouteLeg(BaseModel):
    """A single segment of an optimized journey (e.g. Bus from A to B, then Train from B to C)."""
    step_number: int
    mode: TransportMode
    origin: str
    destination: str
    vehicle_id: str
    service_type: str
    departs: str
    arrives: str
    duration_minutes: int
    predicted_duration_minutes: Optional[int] = None
    delay_risk_score: Optional[float] = None  # 0.0 (low) to 1.0 (high)
    wait_time_before_leg_minutes: int = 0
    instructions: str = ""


class RouteOptimizationRequest(BaseModel):
    """Request payload to find optimal transit route between two stations."""
    origin: str = Field(..., description="Starting city/station, e.g. 'Colombo'")
    destination: str = Field(..., description="Target city/station, e.g. 'Badulla'")
    depart_after: Optional[str] = Field(default=None, description="Earliest departure time (HH:MM), e.g. '08:00'")
    preferred_mode: Optional[TransportMode] = Field(default=None, description="Filter by bus, train, or any")
    max_transfers: Optional[int] = Field(default=2, description="Maximum number of vehicle transfers allowed")


class RoutePlan(BaseModel):
    """A complete journey plan containing one or more legs."""
    route_id: str
    total_duration_minutes: int
    total_wait_minutes: int
    transfers_count: int
    summary: str
    legs: List[RouteLeg]
    is_direct: bool = True
    ai_recommendation_reason: str = ""


class RouteOptimizationResponse(BaseModel):
    """Response containing the AI-recommended best route and alternative options."""
    query_origin: str
    query_destination: str
    depart_after: Optional[str]
    best_route: Optional[RoutePlan] = None
    alternative_routes: List[RoutePlan] = Field(default_factory=list)
    available_direct_trips_count: int = 0
    total_options_evaluated: int = 0


# GeoJSON schemas for Leaflet.js
class GeoJSONGeometry(BaseModel):
    type: str = "LineString"
    coordinates: List[List[float]]  # [[lng, lat], [lng, lat], ...]


class GeoJSONFeatureProperties(BaseModel):
    route_name: str
    origin: str
    destination: str
    mode: str
    service_types: List[str]
    frequency_daily: int
    avg_duration_minutes: int


class GeoJSONFeature(BaseModel):
    type: str = "Feature"
    geometry: GeoJSONGeometry
    properties: GeoJSONFeatureProperties


class GeoJSONFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJSONFeature]
