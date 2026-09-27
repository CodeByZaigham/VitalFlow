from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from mysql.connector.connection import MySQLConnection

from app.core.security import create_access_token, hash_password, verify_password
from app.schemas.auth import LoginIn, RegisterIn, TokenOut
from app.schemas.user import UserOut
from app.utils.dependencies import get_current_user, get_db

router = APIRouter(prefix="/auth", tags=["auth"])


def _row_to_user_out(row) -> UserOut:
    return UserOut(
        id=str(row["id"]),
        email=row["email"],
        name=row["name"],
        role=row["role"],
        created_at=row["created_at"],
    )


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterIn, conn: MySQLConnection = Depends(get_db)):
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id FROM users WHERE email=%s", (payload.email,))
    if cur.fetchone():
        cur.close()
        raise HTTPException(status_code=400, detail="Email already registered")
    cur.close()

    cur = conn.cursor(dictionary=True)
    try:
        cur.execute(
            "INSERT INTO users (email, password, name, role) VALUES (%s, %s, %s, 'customer')",
            (payload.email, hash_password(payload.password), payload.name),
        )
        conn.commit()
        user_id = cur.lastrowid
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail="Failed to register") from e
    finally:
        cur.close()

    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, email, name, role, created_at FROM users WHERE id=%s", (user_id,))
    row = cur.fetchone()
    cur.close()
    return _row_to_user_out(row)


@router.post("/login", response_model=TokenOut)
def login(payload: LoginIn, conn: MySQLConnection = Depends(get_db)):
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT id, email, password, name, role, created_at FROM users WHERE email=%s", (payload.email,))
    row = cur.fetchone()
    cur.close()
    if not row or not verify_password(payload.password, row["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(subject=str(row["id"]), role=row["role"])
    user = UserOut(
        id=str(row["id"]),
        email=row["email"],
        name=row["name"],
        role=row["role"],
        created_at=row["created_at"],
    )
    return TokenOut(access_token=token, token_type="bearer", user=user)


@router.get("/me", response_model=UserOut)
def me(current_user=Depends(get_current_user)):
    return _row_to_user_out(current_user)
