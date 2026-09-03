from __future__ import annotations

from pydantic import EmailStr, Field

from .base import APIModel
from .user import UserOut


class RegisterIn(APIModel):
    email: EmailStr
    password: str = Field(min_length=4, max_length=255)
    name: str = Field(min_length=1, max_length=255)


class LoginIn(APIModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=255)


class TokenOut(APIModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
