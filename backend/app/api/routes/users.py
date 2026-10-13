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

@router.get("", response_model=list[UserOut])
def get_all_users(
    _admin=Depends(get_admin_user),
    conn: MySQLConnection = Depends(get_db),
):
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC")
    rows = cur.fetchall() or []
    cur.close()
    return [_row_to_out(r) for r in rows]

@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(
    user_id: int,
    current_user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    # customers can only fetch themselves
    if current_user["role"] != "admin" and int(current_user["id"]) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, email, name, role, created_at FROM users WHERE id=%s", (user_id,))
    row = cur.fetchone()
    cur.close()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return _row_to_out(row)

@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    payload: UserUpdate,
    current_user=Depends(get_current_user),
    conn: MySQLConnection = Depends(get_db),
):
    if current_user["role"] != "admin" and int(current_user["id"]) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    updates = []
    params = []
    if payload.email is not None:
        updates.append("email=%s")
        params.append(payload.email)
    if payload.name is not None:
        updates.append("name=%s")
        params.append(payload.name)
    if payload.password is not None:
        updates.append("password=%s")
        params.append(hash_password(payload.password))

    if not updates:
        # Return current state
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, email, name, role, created_at FROM users WHERE id=%s", (user_id,))
        row = cur.fetchone()
        cur.close()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")
        return _row_to_out(row)

    params.append(user_id)
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute(f"UPDATE users SET {', '.join(updates)} WHERE id=%s", tuple(params))
        if cur.rowcount == 0:
            conn.rollback()
            raise HTTPException(status_code=404, detail="User not found")
        conn.commit()
        cur.execute("SELECT id, email, name, role, created_at FROM users WHERE id=%s", (user_id,))
        row = cur.fetchone()
        return _row_to_out(row)
    finally:
        cur.close()