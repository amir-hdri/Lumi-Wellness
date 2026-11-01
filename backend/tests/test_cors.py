"""CORS policy tests.

The frontend runs on Vercel, where every preview deployment gets its own
hostname (`<project>-<branch>-<hash>.vercel.app`). Listing those origins one by
one is impossible, so the API accepts an optional origin regex.
"""

import os
import subprocess
import sys

BACKEND = os.path.join(os.path.dirname(__file__), "..")


def _origin_allowed(origin: str, regex: str) -> bool:
    """Boot the API in a subprocess with CORS_ALLOW_ORIGIN_REGEX set and ask
    the real CORS middleware whether it echoes the origin back."""
    env = {
        **os.environ,
        "CORS_ALLOW_ORIGIN_REGEX": regex,
        "SECRET_KEY": "test-only-key-with-at-least-32-bytes",
        "ENVIRONMENT": "development",
    }
    script = (
        "from fastapi.testclient import TestClient\n"
        "from app.main import app\n"
        "client = TestClient(app)\n"
        f"r = client.get('/health', headers={{'Origin': {origin!r}}})\n"
        "print(r.headers.get('access-control-allow-origin'))\n"
    )
    r = subprocess.run(
        [sys.executable, "-c", script],
        cwd=BACKEND,
        env=env,
        capture_output=True,
        text=True,
        timeout=60,
    )
    assert r.returncode == 0, r.stderr
    return r.stdout.strip() == origin


def test_preview_origin_allowed_by_regex():
    assert _origin_allowed(
        "https://lumi-wellness-git-feature-x1.vercel.app",
        r"^https://lumi-wellness-.*\.vercel\.app$",
    )


def test_foreign_origin_not_allowed_by_regex():
    assert not _origin_allowed(
        "https://evil.example.com",
        r"^https://lumi-wellness-.*\.vercel\.app$",
    )


def test_explicit_origin_list_still_allowed():
    env = {
        **os.environ,
        "CORS_ORIGINS": "https://gymapp.ir",
        "SECRET_KEY": "test-only-key-with-at-least-32-bytes",
        "ENVIRONMENT": "development",
    }
    script = (
        "from fastapi.testclient import TestClient\n"
        "from app.main import app\n"
        "client = TestClient(app)\n"
        "r = client.get('/health', headers={'Origin': 'https://gymapp.ir'})\n"
        "print(r.headers.get('access-control-allow-origin'))\n"
    )
    r = subprocess.run(
        [sys.executable, "-c", script],
        cwd=BACKEND,
        env=env,
        capture_output=True,
        text=True,
        timeout=60,
    )
    assert r.returncode == 0, r.stderr
    assert r.stdout.strip() == "https://gymapp.ir"
