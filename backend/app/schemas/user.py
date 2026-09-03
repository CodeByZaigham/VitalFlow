from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import EmailStr, Field

from .base import APIModel

UserRole = Literal["customer", "admin"]


class UserOut(APIModel):
    id: str
    email: EmailStr
    name: str
    role: UserRole
    created_at: datetime


class UserUpdate(APIModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    password: Optional[str] = Field(default=None, min_length=4, max_length=255)
