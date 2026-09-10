from __future__ import annotations

import json
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    cors_origins: str = '["http://localhost:5173"]'

    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "blood_donation_db"

    jwt_secret_key: str = "change_me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    def cors_origins_list(self) -> List[str]:
        try:
            val = json.loads(self.cors_origins)
            if isinstance(val, list):
                return [str(x) for x in val]
        except Exception:
            pass
        return ["http://localhost:5173"]


settings = Settings()
