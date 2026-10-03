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

def _row_to_out(row) -> BloodRequestOut:
    return BloodRequestOut(
        id=str(row["id"]),
        user_id=str(row["user_id"]),
        user_name=row["user_name"],
        blood_type=row["blood_type"],
        quantity=row["quantity"],
        city=row["city"],
        urgency=row["urgency"],
        reason=row["reason"],
        status=row["status"],
        created_at=row["created_at"],
        updated_at=row.get("updated_at"),
    )