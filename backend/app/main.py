from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.settings import settings
from app.api.routes import auth, donors, requests, users, donations, inventory

app = FastAPI(title="Blood Donation System API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(donors.router, prefix="/api")
app.include_router(requests.router, prefix="/api")
app.include_router(donations.router, prefix="/api")
app.include_router(inventory.router, prefix="/api")


@app.get("/health")
def health():
    return {"ok": True}