from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import Field

from .base import APIModel

BloodType = Literal["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
RequestStatus = Literal["Pending", "Approved", "Rejected"]
Urgency = Literal["Low", "Medium", "High"]


class BloodRequestCreate(APIModel):
    # For the customer flow, the frontend does NOT need to send user_id/user_name.
    # We derive them from the JWT token in the route handler.
    # For admin flow, these may still be provided to create a request on behalf of a user.
    user_id: Optional[str] = None
    user_name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    blood_type: BloodType
    quantity: int = Field(ge=1, le=1000)
    city: str = Field(min_length=1, max_length=255)
    urgency: Urgency
    reason: str = Field(min_length=1, max_length=1000)


class BloodRequestOut(APIModel):
    id: str
    user_id: str
    user_name: str
    blood_type: BloodType
    quantity: int
    city: str
    urgency: Urgency
    reason: str
    status: RequestStatus
    created_at: datetime
    updated_at: datetime


class UpdateRequestStatus(APIModel):
    status: Literal["Approved", "Rejected"]
