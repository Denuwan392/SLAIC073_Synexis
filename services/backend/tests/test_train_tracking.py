from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_train_tracking_endpoint():
    response = client.get("/train-tracking/T001")
    assert response.status_code == 200
    data = response.json()
    assert data["train_id"] == "T001"
    assert "status" in data
