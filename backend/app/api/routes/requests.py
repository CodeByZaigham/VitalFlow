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

@router.get("", response_model=list[BloodRequestOut])
def get_all_requests(
    status_filter: Optional[str] = Query(default=None, alias="status"),
    blood_type: Optional[BloodType] = Query(default=None, alias="blood_type"),
    user_id: Optional[int] = Query(default=None, alias="user_id"),
    current_user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    if current_user["role"] != "admin":
        if user_id is None or int(user_id) != int(current_user["id"]):
            raise HTTPException(status_code=403, detail="Forbidden")

    conditions = []
    params = []
    if status_filter:
        conditions.append("status=%s")
        params.append(status_filter)
    if blood_type:
        conditions.append("blood_type=%s")
        params.append(blood_type)
    if user_id is not None:
        conditions.append("user_id=%s")
        params.append(user_id)

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    cur = conn.cursor(dictionary=True)
    cur.execute(
        "SELECT id, user_id, user_name, blood_type, quantity, city, urgency, reason, status, created_at, updated_at "
        f"FROM blood_requests {where} ORDER BY created_at DESC",
        tuple(params),
    )
    rows = cur.fetchall() or []
    cur.close()
    return [_row_to_out(r) for r in rows]


@router.get("/user/{user_id}", response_model=list[BloodRequestOut])
def get_user_requests(
    user_id: int,
    current_user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    if current_user["role"] != "admin" and int(current_user["id"]) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    cur = conn.cursor(dictionary=True)
    cur.execute(
        "SELECT id, user_id, user_name, blood_type, quantity, city, urgency, reason, status, created_at, updated_at "
        "FROM blood_requests WHERE user_id=%s ORDER BY created_at DESC",
        (user_id,),
    )
    rows = cur.fetchall() or []
    cur.close()
    return [_row_to_out(r) for r in rows]

@router.post("", response_model=BloodRequestOut, status_code=status.HTTP_201_CREATED)
def create_request(
    payload: BloodRequestCreate,
    current_user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    if current_user["role"] != "admin" and int(payload.user_id) != int(current_user["id"]):
        raise HTTPException(status_code=403, detail="Cannot create request for another user")

    # Validate user exists
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id FROM users WHERE id=%s", (int(payload.user_id),))
    if not cur.fetchone():
        cur.close()
        raise HTTPException(status_code=404, detail="User not found")
    cur.close()

    cur = conn.cursor(dictionary=True)
    cur.execute(
        "INSERT INTO blood_requests (user_id, user_name, blood_type, quantity, city, urgency, reason, status) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, 'Pending')",
        (
            int(payload.user_id),
            payload.user_name,
            payload.blood_type,
            payload.quantity,
            payload.city,
            payload.urgency,
            payload.reason,
        ),
    )
    conn.commit()
    request_id = cur.lastrowid

    cur.execute(
        "SELECT id, user_id, user_name, blood_type, quantity, city, urgency, reason, status, created_at, updated_at "
        "FROM blood_requests WHERE id=%s",
        (request_id,),
    )
    row = cur.fetchone()
    cur.close()
    if not row:
        raise HTTPException(status_code=500, detail="Failed to create request")
    return _row_to_out(row)
