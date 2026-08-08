from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_schedules_endpoint():
    response = client.get("/schedules?query=Colombo")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "Colombo"
    assert "answer" in data
    assert "passages" in data
