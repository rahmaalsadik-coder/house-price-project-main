import logging

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import HealthResponse, PredictionRequest, PredictionResponse
from app.services.inference import predict_price
from app.services.preprocessing import get_known_locations

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["health"])
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@router.get("/locations", response_model=list[str], tags=["prediction"])
def locations() -> list[str]:
    """The exact set of locations the model was trained on (everything else
    is treated as 'other'). Powers the frontend's location dropdown."""
    return sorted(get_known_locations())


@router.post("/predict", response_model=PredictionResponse, tags=["prediction"])
def predict(payload: PredictionRequest) -> PredictionResponse:
    try:
        price = predict_price(payload)
    except Exception as exc:  # pragma: no cover - defensive guard
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc

    return PredictionResponse(predicted_price=round(price, 2))
