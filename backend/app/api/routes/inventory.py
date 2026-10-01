from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from mysql.connector.connection import MySQLConnection

from app.schemas.donor import BloodType
from app.schemas.inventory import InventoryOut, InventoryUpdate
from app.utils.dependencies import get_admin_user, get_current_user, get_db

router = APIRouter(prefix="/inventory", tags=["inventory"])


def _row_to_out(row) -> InventoryOut:
    return InventoryOut(
        blood_type=row["blood_type"],
        quantity=row["quantity"],
        last_updated=row["last_updated"],
    )