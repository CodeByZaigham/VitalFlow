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

@router.get("", response_model=list[InventoryOut])
def get_all_inventory(
    _user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT blood_type, quantity, last_updated FROM blood_inventory ORDER BY blood_type")
    rows = cur.fetchall()
    cur.close()
    return [_row_to_out(r) for r in rows]

@router.get("/{blood_type}", response_model=InventoryOut)
def get_inventory_by_type(
    blood_type: BloodType,
    _user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT blood_type, quantity, last_updated FROM blood_inventory WHERE blood_type=%s", (blood_type,))
    row = cur.fetchone()
    cur.close()
    if not row:
        raise HTTPException(status_code=404, detail="Blood type not found")
    return _row_to_out(row)

@router.put("/{blood_type}", response_model=InventoryOut)
def update_inventory(
    blood_type: BloodType,
    payload: InventoryUpdate,
    _admin=Depends(get_admin_user),
    conn: MySQLConnection = Depends(get_db),
):
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("UPDATE blood_inventory SET quantity=%s WHERE blood_type=%s", (payload.quantity, blood_type))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Blood type not found")
        conn.commit()
    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Failed to update inventory") from e
    finally:
        cur.close()

    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT blood_type, quantity, last_updated FROM blood_inventory WHERE blood_type=%s", (blood_type,))
    row = cur.fetchone()
    cur.close()
    return _row_to_out(row)

@router.get("/stats")
def inventory_stats(
    _user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT blood_type, quantity FROM blood_inventory")
    rows = cur.fetchall() or []
    cur.close()
    all_types = ["A+","A-","B+","B-","AB+","AB-","O+","O-"]
    by = {r["blood_type"]: int(r["quantity"]) for r in rows}
    by_full = {bt: by.get(bt, 0) for bt in all_types}
    total = sum(by_full.values())
    low_stock = [bt for bt,q in by_full.items() if q <= 2]
    return {"totalQuantity": total, "byBloodType": by_full, "lowStock": low_stock}
