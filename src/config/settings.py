from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    """Application settings for the MLService."""

    model_config = SettingsConfigDict(
        env_prefix="ML_",
        case_sensitive=False,
        protected_namespaces=("settings_",),
    )

    service_name: str = "HireLens-MLService"
    host: str = "127.0.0.1"
    port: int = 8001

    model_path: Path = Field(default=Path("artifacts/model.joblib"))
    metadata_path: Path = Field(default=Path("artifacts/metadata.json"))

    max_resume_chars: int = 20000
    max_job_chars: int = 20000
    max_upload_mb: int = 10

    skill_taxonomy_path: Optional[Path] = None
    top_k_recommendations: int = 5
    cors_allow_origins: list[str] = ["*"]
    cors_allow_credentials: bool = False


@lru_cache(maxsize=1)
def get_settings() -> AppSettings:
    """Return cached settings instance."""
    return AppSettings()
