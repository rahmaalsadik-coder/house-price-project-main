import logging
from pathlib import Path
from typing import Optional

import joblib

from app.core.config import settings
from app.schemas.prediction import PredictionRequest
from app.services.preprocessing import request_to_dataframe

logger = logging.getLogger(__name__)

_model = None  # loaded once, at startup, via load_model()


def load_model() -> None:
    """Load the exported scikit-learn Pipeline from disk. Call once, at
    application startup (see main.py's lifespan handler) -- NOT on every
    request, which would be slow and wasteful."""
    global _model
    path = Path(settings.MODEL_PATH)
    if not path.exists():
        raise FileNotFoundError(
            f"Model file not found at '{path}'. Run the training notebook "
            "(notebooks/house_price_model.ipynb) first, or copy house_price.pkl "
            "into backend/models/."
        )
    logger.info("Loading model from %s ...", path)
    _model = joblib.load(path)
    logger.info("Model loaded successfully.")


def get_model():
    if _model is None:
        raise RuntimeError("Model is not loaded yet. Did the app startup lifespan run?")
    return _model


def predict_price(payload: PredictionRequest) -> float:
    model = get_model()
    X = request_to_dataframe(payload)
    prediction = model.predict(X)
    return float(prediction[0])
