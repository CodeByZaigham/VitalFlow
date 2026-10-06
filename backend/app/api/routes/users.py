from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from mysql.connector.connection import MySQLConnection

from app.schemas.user import UserOut, UserUpdate
from app.core.security import hash_password
from app.utils.dependencies import get_db, get_current_user, get_admin_user

router = APIRouter(prefix="/users", tags=["users"])


def _row_to_out(row) -> UserOut:
    return UserOut(
        id=str(row["id"]),
        email=row["email"],
        name=row["name"],
        role=row["role"],
        created_at=row["created_at"],
    )