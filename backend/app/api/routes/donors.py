from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from mysql.connector.connection import MySQLConnection

from app.schemas.donor import DonorCreate, DonorOut, DonorUpdate, BloodType
from app.utils.dependencies import get_db, get_current_user, get_admin_user

router = APIRouter(prefix="/donors", tags=["donors"])

def _row_to_out(row) -> DonorOut:
     return DonorOut(
          id=str(row["id"]),
          user_id=str(row["user_id"]) if row.get("user_id") is not None else None,
          name=row["name"],
          age=row["age"],
          blood_type=row["blood_type"],
          gender=row["gender"],
          health_status=row["health_status"],
          city=row["city"],
          phone=row["phone"],
          last_donation_date=row.get("last_donation_date"),
          is_available=bool(row["is_available"]),
          created_at=row["created_at"],
     )