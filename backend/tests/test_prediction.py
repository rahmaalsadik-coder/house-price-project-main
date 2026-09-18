import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="module")
def client():
    # TestClient triggers the FastAPI lifespan (startup/shutdown), so the
    # model is loaded exactly once for all tests in this module.
    with TestClient(app) as c:
        yield c


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_locations(client):
    response = client.get("/locations")
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body, list)
    assert "other" in body
    assert "mumbai" in body


def test_predict_happy_path(client):
    payload = {
        "location": "pune",
        "area_sqft": 1150,
        "floor_num": 4,
        "bathroom_num": 2,
        "balcony_num": 2,
        "carpark_num": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert "predicted_price" in body
    assert body["predicted_price"] > 0


def test_predict_minimal_payload(client):
    """Only the required fields -- optional fields should be handled by the
    pipeline's own imputers."""
    payload = {"location": "unknown-city", "area_sqft": 900, "bathroom_num": 1}
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    assert response.json()["predicted_price"] > 0


def test_predict_invalid_input_missing_required_field(client):
    payload = {"location": "pune", "area_sqft": 1150}  # missing bathroom_num
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_predict_invalid_input_negative_area(client):
    payload = {"location": "pune", "area_sqft": -50, "bathroom_num": 2}
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_predict_invalid_input_bad_enum(client):
    payload = {
        "location": "pune",
        "area_sqft": 1150,
        "bathroom_num": 2,
        "furnishing": "Not-A-Real-Option",
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
