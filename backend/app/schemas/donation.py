from __future__ import annotations

from datetime import date, datetime
from typing import Optional

from pydantic import Field

from .base import APIModel
from .donor import BloodType


class DonationCreate(APIModel):
    donor_id: Optional[str] = None
    donor_name: str = Field(min_length=1, max_length=255)
    blood_type: BloodType
    quantity: int = Field(ge=1, le=5000)
    donation_date: date


class DonationOut(APIModel):
    id: str
    donor_id: Optional[str] = None
    donor_name: str
    blood_type: BloodType
    quantity: int
    donation_date: date
    created_at: datetime
