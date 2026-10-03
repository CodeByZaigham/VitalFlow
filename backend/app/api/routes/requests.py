from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from mysql.connector.connection import MySQLConnection

from app.schemas.blood_request import (
    BloodRequestCreate,
    BloodRequestOut,
    UpdateRequestStatus,
    BloodType,
)
from app.utils.dependencies import get_db, get_current_user, get_admin_user

router = APIRouter(prefix="/requests", tags=["requests"])
