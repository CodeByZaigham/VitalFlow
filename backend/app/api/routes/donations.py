from __future__ import annotations

from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from mysql.connector.connection import MySQLConnection

from app.schemas.donation import DonationCreate, DonationOut
from app.schemas.donor import BloodType
from app.utils.dependencies import get_admin_user, get_db

router = APIRouter(prefix="/donations", tags=["donations"])

def _row_to_out(row) -> DonationOut:
    return DonationOut(
        id=str(row["id"]),
        donor_id=str(row["donor_id"]) if row.get("donor_id") is not None else None,
        donor_name=row["donor_name"],
        blood_type=row["blood_type"],
        quantity=row["quantity"],
        donation_date=row["donation_date"],
        created_at=row["created_at"],
    )

@router.get("", response_model=list[DonationOut])
def get_all_donations(
    donor_id: Optional[int] = Query(default=None),
    blood_type: Optional[BloodType] = Query(default=None),
    date_from: Optional[date] = Query(default=None),
    date_to: Optional[date] = Query(default=None),
    _admin=Depends(get_admin_user),
    conn: MySQLConnection = Depends(get_db),
):
    where = []
    params = []
    if donor_id is not None:
        where.append("donor_id=%s")
        params.append(donor_id)
    if blood_type is not None:
        where.append("blood_type=%s")
        params.append(blood_type)
    if date_from is not None:
        where.append("donation_date >= %s")
        params.append(date_from)
    if date_to is not None:
        where.append("donation_date <= %s")
        params.append(date_to)

    sql = "SELECT id, donor_id, donor_name, blood_type, quantity, donation_date, created_at FROM donations"
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += " ORDER BY donation_date DESC, id DESC"

    cur = conn.cursor(dictionary=True)
    cur.execute(sql, tuple(params))
    rows = cur.fetchall()
    cur.close()
    return [_row_to_out(r) for r in rows]

@router.get("/{donation_id}", response_model=DonationOut)
def get_donation_by_id(
    donation_id: int,
    _admin=Depends(get_admin_user),
    conn: MySQLConnection = Depends(get_db),
):
    cur = conn.cursor(dictionary=True)
    cur.execute(
        "SELECT id, donor_id, donor_name, blood_type, quantity, donation_date, created_at FROM donations WHERE id=%s",
        (donation_id,),
    )
    row = cur.fetchone()
    cur.close()
    if not row:
        raise HTTPException(status_code=404, detail="Donation not found")
    return _row_to_out(row)

@router.get("/donor/{donor_id}", response_model=list[DonationOut])
def get_donations_by_donor(
    donor_id: int,
    _admin=Depends(get_admin_user),
    conn: MySQLConnection = Depends(get_db),
):
    cur = conn.cursor(dictionary=True)
    cur.execute(
        "SELECT id, donor_id, donor_name, blood_type, quantity, donation_date, created_at FROM donations WHERE donor_id=%s ORDER BY donation_date DESC, id DESC",
        (donor_id,),
    )
    rows = cur.fetchall()
    cur.close()
    return [_row_to_out(r) for r in rows]