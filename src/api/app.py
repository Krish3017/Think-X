from __future__ import annotations

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes.prediction_routes import router as prediction_router
from src.api.routes.resume_routes import router as resume_router
from src.config.settings import get_settings
from src.utils.model_loader import load_artifacts
from joblib import load


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.service_name,
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # basic logging
    logging.basicConfig(level=logging.INFO)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_allow_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(prediction_router)
    app.include_router(resume_router)

    # Try to load model artifacts at startup (non-fatal; app will still start)
    try:
        artifacts = load_artifacts(settings.model_path, settings.metadata_path)
        app.state.model_loaded = True
        app.state.artifacts = artifacts
        logging.info(f"Model artifacts loaded from {settings.model_path}")
    except Exception as exc:  # pragma: no cover - runtime behavior
        app.state.model_loaded = False
        app.state.artifacts = None
        logging.warning(f"Model artifacts not available: {exc}")

    @app.get("/")
    def root() -> dict:
        return {"service": settings.service_name, "status": "ok"}

    return app


app = create_app()
