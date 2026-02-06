from __future__ import annotations

import traceback


def main() -> None:
    try:
        from src.config.settings import get_settings
        from src.models.resume_analyzer import ResumeAnalyzer

        settings = get_settings()
        print("Model path:", settings.model_path)
        ra = ResumeAnalyzer(settings)
        print("Loaded artifacts:", ra._artifacts)
    except Exception:
        traceback.print_exc()


if __name__ == "__main__":
    main()
