from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_ask_bus_query():
    response = client.post("/ask", json={"query": "What time is the bus from Colombo to Kandy?"})
    assert response.status_code == 200
    data = response.json()
    assert "final_answer" in data
    assert data["original_query"] == "What time is the bus from Colombo to Kandy?"

def test_ask_sinhala_query():
    response = client.post("/ask", json={"query": "කොළඹ සිට මහනුවරට බස් තියෙන්නේ කීයටද?"})
    assert response.status_code == 200
    data = response.json()
    assert "final_answer" in data
