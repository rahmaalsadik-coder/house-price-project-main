from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class Furnishing(str, Enum):
    furnished = "Furnished"
    semi_furnished = "Semi-Furnished"
    unfurnished = "Unfurnished"


class Transaction(str, Enum):
    new_property = "New Property"
    resale = "Resale"
    rent_lease = "Rent/Lease"
    other = "Other"


class Ownership(str, Enum):
    freehold = "Freehold"
    leasehold = "Leasehold"
    co_operative_society = "Co-operative Society"
    power_of_attorney = "Power Of Attorney"


class Facing(str, Enum):
    east = "East"
    west = "West"
    north = "North"
    south = "South"
    north_east = "North - East"
    north_west = "North - West"
    south_east = "South - East"
    south_west = "South -West"


class PredictionRequest(BaseModel):
    """Matches the exact feature schema the model's Pipeline was trained on
    (see notebooks/house_price_model.ipynb, Section 4)."""

    location: str = Field(..., min_length=1, description="City / locality, e.g. 'mumbai'. "
                           "Unrecognised locations are treated as 'other' by the model.")
    area_sqft: float = Field(..., gt=0, description="Carpet or super area, in square feet.")
    floor_num: Optional[int] = Field(
        None, ge=-1, le=120, description="Floor number (0 = ground, -1 = basement)."
    )
    bathroom_num: int = Field(..., ge=1, le=20, description="Number of bathrooms.")
    balcony_num: Optional[int] = Field(None, ge=0, le=20, description="Number of balconies.")
    carpark_num: Optional[int] = Field(None, ge=0, le=20, description="Number of car-parking spots.")
    furnishing: Optional[Furnishing] = None
    transaction: Optional[Transaction] = None
    ownership: Optional[Ownership] = None
    facing: Optional[Facing] = None

    model_config = {
        "json_schema_extra": {
            "example": {
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
        }
    }


class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted price in Indian Rupees (INR).")


class HealthResponse(BaseModel):
    status: str
