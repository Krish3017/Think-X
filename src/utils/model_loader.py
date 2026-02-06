from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional

import joblib


@dataclass(frozen=True)
class ModelArtifacts:
    """Container for model artifacts."""

    pipeline: Any
    metadata: Optional[dict]


@lru_cache(maxsize=1)
def load_artifacts(model_path: Path, metadata_path: Optional[Path] = None) -> ModelArtifacts:
    """Load serialized model artifacts."""
    pipeline = joblib.load(model_path)
    metadata: Optional[dict] = None
    if metadata_path and metadata_path.exists():
        metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
    return ModelArtifacts(pipeline=pipeline, metadata=metadata)
