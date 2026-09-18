import json
from functools import lru_cache
from pathlib import Path

import pandas as pd

from app.core.config import settings
from app.schemas.prediction import PredictionRequest

# Column order/names must match exactly what the notebook trained on:
# numeric_features + categorical_features (see Section 4 of the notebook).
NUMERIC_FEATURES = ["area_sqft", "floor_num", "bathroom_num", "balcony_num", "carpark_num"]
CATEGORICAL_FEATURES = ["location_grouped", "Furnishing", "Transaction", "Ownership", "facing"]


@lru_cache
def get_known_locations() -> set[str]:
    path = Path(settings.LOCATIONS_PATH)
    with open(path) as f:
        return set(json.load(f))


def request_to_dataframe(payload: PredictionRequest) -> pd.DataFrame:
    """Build the single-row DataFrame the exported Pipeline expects.

    Because the model was exported as a full scikit-learn Pipeline (imputer +
    scaler + one-hot encoder bundled with the regressor), we do NOT need to
    manually encode anything here -- we just need to hand it a DataFrame with
    the right column names. Unknown locations are mapped to "other" exactly
    like they were during training, and any field the pipeline's own
    SimpleImputer can handle is passed through as None/NaN when the client
    didn't supply it.
    """
    known_locations = get_known_locations()
    location = payload.location.strip().lower()
    location_grouped = location if location in known_locations else "other"

    row = {
        "area_sqft": payload.area_sqft,
        "floor_num": payload.floor_num,
        "bathroom_num": payload.bathroom_num,
        "balcony_num": payload.balcony_num,
        "carpark_num": payload.carpark_num,
        "location_grouped": location_grouped,
        "Furnishing": payload.furnishing.value if payload.furnishing else None,
        "Transaction": payload.transaction.value if payload.transaction else None,
        "Ownership": payload.ownership.value if payload.ownership else None,
        "facing": payload.facing.value if payload.facing else None,
    }

    return pd.DataFrame([row], columns=NUMERIC_FEATURES + CATEGORICAL_FEATURES)
