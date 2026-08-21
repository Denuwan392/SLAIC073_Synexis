from fastapi.testclient import TestClient
from app.main import app
from app.ml.travel_time_model import travel_time_predictor

client = TestClient(app)


def test_travel_time_predictor_model():
    """Verify ML model loads and produces realistic travel predictions."""
    assert travel_time_predictor.is_trained is True

    # Test Colombo to Kandy
    mins = travel_time_predictor.predict_duration(
        origin="Colombo Fort",
        destination="Kandy",
        mode="bus",
        service_type="Luxury",
        departs_hour=8.0
    )
    assert 90 <= mins <= 300  # Reasonable travel window between 1.5h and 5h


def test_ml_direct_prediction_api():
    """Test POST /api/ml/predict-travel-time endpoint."""
    payload = {
        "origin": "Colombo Fort",
        "destination": "Badulla",
        "mode": "train",
        "service_type": "Express",
        "departs_hour": 6.0
    }
    res = client.post("/api/ml/predict-travel-time", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["predicted_duration_minutes"] > 180
    assert "h" in data["predicted_duration_formatted"]
    assert data["model_r2_score"] is not None
    assert data["model_r2_score"] > 0.70
