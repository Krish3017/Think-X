"""Simple script to import all Python modules under `src` to catch import errors.

Run from the repository root: `python scripts/check_imports.py`
"""

import importlib
import os
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"


def iter_modules(src_dir: Path):
    for dirpath, _, filenames in os.walk(src_dir):
        for fn in filenames:
            if not fn.endswith(".py"):
                continue
            if fn.startswith(".") or fn == "__init__.py":
                # still allow importing packages via their __init__ when needed
                pass
            full = Path(dirpath) / fn
            rel = full.relative_to(ROOT)
            # convert path like src/models/skill_extractor.py -> src.models.skill_extractor
            mod = ".".join(rel.with_suffix("").parts)
            yield mod, str(full)


def main():
    sys.path.insert(0, str(ROOT))
    successes = []
    failures = []
    for mod, path in sorted(iter_modules(SRC)):
        if any(p in path for p in ("__pycache__",)):
            continue
        try:
            importlib.import_module(mod)
            successes.append(mod)
            print(f"OK:    {mod}")
        except Exception as exc:
            failures.append((mod, exc))
            print(f"ERROR: {mod} -> {exc!r}")

    print("\nSummary:")
    print(f"  Successful imports: {len(successes)}")
    print(f"  Failed imports:     {len(failures)}")
    if failures:
        print("\nFailures details:")
        for mod, exc in failures:
            print(f"- {mod}: {exc!r}")
        sys.exit(1)


if __name__ == "__main__":
    main()
