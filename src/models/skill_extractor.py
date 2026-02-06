from __future__ import annotations

import json
from pathlib import Path

from src.pipeline.data_cleaning import normalize_text


class SkillExtractor:
    """Extract skills using a curated taxonomy.

    Enhancements:
    - support common alias normalization (e.g. `js` -> `javascript`)
    - match normalized tokens with word boundaries
    """

    # simple alias map to normalize common short forms and variants
    _ALIASES: dict[str, str] = {
        "js": "javascript",
        "nodejs": "node",
        "py": "python",
        "csharp": "c#",
        "postgres": "postgresql",
        "tf": "tensorflow",
        "sklearn": "scikit-learn",
    }

    def __init__(self, taxonomy_path: Path | None = None) -> None:
        self._skills = self._load_taxonomy(taxonomy_path)
        # build normalized set for faster matching
        self._normalized_to_canonical: dict[str, str] = {}
        for s in self._skills:
            norm = normalize_text(s)
            if norm:
                self._normalized_to_canonical[norm] = s
        # incorporate aliases
        for a, canonical in self._ALIASES.items():
            self._normalized_to_canonical[normalize_text(a)] = canonical

    @staticmethod
    def _load_taxonomy(taxonomy_path: Path | None) -> list[str]:
        if taxonomy_path is None or not taxonomy_path.exists():
            return [
                "python",
                "java",
                "c++",
                "sql",
                "aws",
                "gcp",
                "azure",
                "docker",
                "kubernetes",
                "fastapi",
                "django",
                "flask",
                "react",
                "typescript",
                "node",
                "postgresql",
                "mongodb",
                "pandas",
                "numpy",
                "scikit-learn",
                "spark",
                "airflow",
            ]
        if taxonomy_path.suffix.lower() == ".json":
            return json.loads(taxonomy_path.read_text(encoding="utf-8"))
        return [
            line.strip()
            for line in taxonomy_path.read_text(encoding="utf-8").splitlines()
            if line.strip()
        ]

    def extract(self, text: str) -> list[str]:
        """Extract skills from text using normalized tokens and alias mapping."""
        normalized = f" {normalize_text(text)} "
        found: set[str] = set()
        for norm, canonical in self._normalized_to_canonical.items():
            if not norm:
                continue
            if f" {norm} " in normalized:
                found.add(canonical)
        return sorted(found)
