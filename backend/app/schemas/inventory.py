from __future__ import annotations

from datetime import datetime

from pydantic import Field

from .base import APIModel
from .donor import BloodType


class InventoryOut(APIModel):
    blood_type: BloodType
    quantity: int
    last_updated: datetime


class InventoryUpdate(APIModel):
    quantity: int = Field(ge=0, le=1000000)
