from __future__ import annotations


class DummyPipeline:
    """Minimal pipeline that implements predict_proba for testing."""

    def predict_proba(self, X):
        return [[0.5, 0.5]]
