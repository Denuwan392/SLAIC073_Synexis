from fastapi.testclient import TestClient
from app.main import app
from app.data.stations import get_all_stations, get_station_by_name, calculate_haversine_distance
from app.services.route_parser import parse_all_schedules, get_all_schedules_dataframe
from app.services.route_optimizer import optimize_route, RouteOptimizationRequest

client = TestClient(app)


def test_station_geodata():
    """Verify registered Sri Lanka transit stations have valid coordinates."""
    stations = get_all_stations()
    assert len(stations) >= 25

    colombo = get_station_by_name("Colombo")
    assert colombo is not None
    assert colombo.name == "Colombo Fort"
    assert 5.0 <= colombo.lat <= 10.0
    assert 79.0 <= colombo.lng <= 82.0

    kandy = get_station_by_name("Kandy")
    assert kandy is not None
    dist = calculate_haversine_distance(colombo.lat, colombo.lng, kandy.lat, kandy.lng)
    # Haversine straight-line distance Colombo-Kandy is roughly ~90-115 km
    assert 80.0 <= dist <= 130.0


def test_schedule_parser():
    """Verify schedule parser extracts valid trips from documents.py."""
    schedules = parse_all_schedules()
    assert len(schedules) > 100

    df = get_all_schedules_dataframe()
    assert not df.empty
    assert "origin" in df.columns
    assert "destination" in df.columns
    assert "distance_km" in df.columns
    assert "duration_minutes" in df.columns


def test_route_optimizer_direct():
    """Test AI route optimizer for direct connection (Colombo to Kandy)."""
    req = RouteOptimizationRequest(
        origin="Colombo",
        destination="Kandy",
        depart_after="06:00"
    )
    res = optimize_route(req)
    assert res.query_origin == "Colombo Fort"
    assert res.query_destination == "Kandy"
    assert res.best_route is not None
    assert res.best_route.total_duration_minutes > 0
    assert len(res.best_route.legs) >= 1


def test_api_stations_endpoint():
    """Test GET /api/stations endpoint."""
    res = client.get("/api/stations")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 25
    assert any(s["name"] == "Colombo Fort" for s in data)


def test_api_routes_geo_endpoint():
    """Test GET /api/routes/geo GeoJSON endpoint for Leaflet.js."""
    res = client.get("/api/routes/geo")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "FeatureCollection"
    assert len(data["features"]) > 0
    first_feat = data["features"][0]
    assert first_feat["type"] == "Feature"
    assert first_feat["geometry"]["type"] == "LineString"
    assert len(first_feat["geometry"]["coordinates"]) == 2


def test_api_routes_optimize_endpoint():
    """Test POST /api/routes/optimize endpoint with ML prediction enrichment."""
    payload = {
        "origin": "Colombo Fort",
        "destination": "Kandy",
        "depart_after": "07:30"
    }
    res = client.post("/api/routes/optimize", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["best_route"] is not None
    assert "legs" in data["best_route"]
    assert len(data["best_route"]["legs"]) >= 1
    # Check that ML predicted duration was populated
    first_leg = data["best_route"]["legs"][0]
    assert first_leg["predicted_duration_minutes"] is not None
    assert first_leg["predicted_duration_minutes"] > 0
