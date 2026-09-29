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

@router.get("", response_model=list[DonorOut])
def get_all_donors(
    city: Optional[str] = None,
    blood_type: Optional[BloodType] = Query(default=None, alias="blood_type"),
    is_available: Optional[bool] = Query(default=None, alias="is_available"),
    _user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    conditions = []
    params = []

    if city:
        conditions.append("city=%s")
        params.append(city)
    if blood_type:
        conditions.append("blood_type=%s")
        params.append(blood_type)
    if is_available is not None:
        conditions.append("is_available=%s")
        params.append(1 if is_available else 0)

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    cur = conn.cursor(dictionary=True)
    cur.execute(
        f"SELECT id, user_id, name, age, blood_type, gender, health_status, city, phone, last_donation_date, is_available, created_at "
        f"FROM donors {where} ORDER BY created_at DESC",
        tuple(params),
    )
    rows = cur.fetchall() or []
    cur.close()
    return [_row_to_out(r) for r in rows]

@router.get("/{donor_id}", response_model=DonorOut)
def get_donor_by_id(
    donor_id: int,
    _user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    cur = conn.cursor(dictionary=True)
    cur.execute(
        "SELECT id, user_id, name, age, blood_type, gender, health_status, city, phone, last_donation_date, is_available, created_at "
        "FROM donors WHERE id=%s",
        (donor_id,),
    )
    row = cur.fetchone()
    cur.close()
    if not row:
        raise HTTPException(status_code=404, detail="Donor not found")
    return _row_to_out(row)

@router.post("", response_model=DonorOut, status_code=status.HTTP_201_CREATED)
def create_donor(
    payload: DonorCreate,
    current_user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    user_id = payload.user_id or str(current_user["id"])
    # Validate user
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id FROM users WHERE id=%s", (int(user_id),))
    if not cur.fetchone():
        cur.close()
        raise HTTPException(status_code=404, detail="User not found")
    cur.close()

    if current_user["role"] != "admin" and str(current_user["id"]) != str(user_id):
        raise HTTPException(status_code=403, detail="Cannot create donor for another user")

    cur = conn.cursor(dictionary=True)
    cur.execute(
        "INSERT INTO donors (user_id, name, age, blood_type, gender, health_status, city, phone, last_donation_date, is_available) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (
            int(user_id) if user_id is not None else None,
            payload.name,
            payload.age,
            payload.blood_type,
            payload.gender,
            payload.health_status,
            payload.city,
            payload.phone,
            payload.last_donation_date,
            1 if payload.is_available else 0,
        ),
    )
    conn.commit()
    donor_id = cur.lastrowid
    cur.execute(
        "SELECT id, user_id, name, age, blood_type, gender, health_status, city, phone, last_donation_date, is_available, created_at "
        "FROM donors WHERE id=%s",
        (donor_id,),
    )
    row = cur.fetchone()
    cur.close()
    if not row:
        raise HTTPException(status_code=500, detail="Failed to create donor")
    return _row_to_out(row)

@router.put("/{donor_id}", response_model=DonorOut)
def update_donor(
    donor_id: int,
    payload: DonorUpdate,
    current_user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, user_id FROM donors WHERE id=%s", (donor_id,))
    existing = cur.fetchone()
    if not existing:
        cur.close()
        raise HTTPException(status_code=404, detail="Donor not found")
    owner_id = existing.get("user_id")

    if current_user["role"] != "admin":
        if owner_id is None or int(owner_id) != int(current_user["id"]):
            cur.close()
            raise HTTPException(status_code=403, detail="Forbidden")

    updates = []
    params = []

    def add(field, value):
        if value is not None:
            updates.append(f"{field}=%s")
            params.append(value)

    add("name", payload.name)
    add("age", payload.age)
    add("blood_type", payload.blood_type)
    add("gender", payload.gender)
    add("health_status", payload.health_status)
    add("city", payload.city)
    add("phone", payload.phone)
    if payload.last_donation_date is not None:
        updates.append("last_donation_date=%s")
        params.append(payload.last_donation_date)
    if payload.is_available is not None:
        updates.append("is_available=%s")
        params.append(1 if payload.is_available else 0)

    if updates:
        params.append(donor_id)
        cur.execute(f"UPDATE donors SET {', '.join(updates)} WHERE id=%s", tuple(params))
        conn.commit()

    cur.execute(
        "SELECT id, user_id, name, age, blood_type, gender, health_status, city, phone, last_donation_date, is_available, created_at "
        "FROM donors WHERE id=%s",
        (donor_id,),
    )
    row = cur.fetchone()
    cur.close()
    return _row_to_out(row)
