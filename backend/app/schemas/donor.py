from __future__ import annotations

from datetime import date, datetime
from typing import Literal, Optional

from pydantic import Field

from .base import APIModel

BloodType = Literal["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
Gender = Literal["Male", "Female", "Other"]
HealthStatus = Literal["Fit", "Not Fit"]


class DonorCreate(APIModel):
    user_id: Optional[str] = None
    name: str = Field(min_length=1, max_length=255)
    age: int = Field(ge=0, le=130)
    blood_type: BloodType
    gender: Gender
    health_status: HealthStatus = "Fit"
    city: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=3, max_length=20)
    last_donation_date: Optional[date] = None
    is_available: bool = True


class DonorUpdate(APIModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    age: Optional[int] = Field(default=None, ge=0, le=130)
    blood_type: Optional[BloodType] = None
    gender: Optional[Gender] = None
    health_status: Optional[HealthStatus] = None
    city: Optional[str] = Field(default=None, min_length=1, max_length=255)
    phone: Optional[str] = Field(default=None, min_length=3, max_length=20)
    last_donation_date: Optional[date] = None
    is_available: Optional[bool] = None


class DonorOut(APIModel):
    id: str
    user_id: Optional[str] = None
    name: str
    age: int
    blood_type: BloodType
    gender: Gender
    health_status: HealthStatus
    city: str
    phone: str
    last_donation_date: Optional[date] = None
    is_available: bool
    created_at: datetime
