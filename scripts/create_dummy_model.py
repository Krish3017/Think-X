from __future__ import annotations

from pathlib import Path
import joblib

from src.models.dummy_model import DummyPipeline


def main():
    artifacts_dir = Path("artifacts")
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    model_path = artifacts_dir / "model.joblib"
    joblib.dump(DummyPipeline(), model_path)
    print(f"Wrote dummy model to: {model_path}")


if __name__ == "__main__":
    main()
