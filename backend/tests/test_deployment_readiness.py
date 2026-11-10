"""Production probes use disposable databases, never the operator's database."""
import json
import os
from pathlib import Path
import subprocess
import sys

import pytest

BACKEND = Path(__file__).resolve().parents[1]


@pytest.fixture(autouse=True)
def isolated_app_settings(client):
    # Initialize the shared test application's settings before the global
    # limiter fixture imports authentication. Production probes are subprocesses.
    return client


def production_env(path):
    return {**os.environ, "ENVIRONMENT": "production", "DATABASE_URL": f"sqlite:///{path}",
            "SECRET_KEY": "isolated-production-test-key-at-least-32-bytes", "SEED_DEMO_DATA": "false"}


def run_python(env, *args):
    return subprocess.run([sys.executable, *args], cwd=BACKEND, env=env, capture_output=True, text=True, timeout=60)


def probe(env):
    result = run_python(env, "-c", "from app.main import app; from fastapi.testclient import TestClient; "
                        "import json; c=TestClient(app); h=c.get('/health'); r=c.get('/ready'); "
                        "print(json.dumps({'health':h.status_code,'ready':r.status_code,'body':r.json()}))")
    assert result.returncode == 0, result.stderr
    return json.loads(result.stdout)


def test_ready_refuses_empty_database_but_health_stays_live(tmp_path):
    result = probe(production_env(tmp_path / "empty.db"))
    assert result["health"] == 200
    assert result["ready"] == 503
    assert "sqlite" not in json.dumps(result["body"])


def test_ready_accepts_migrated_database_and_refuses_old_revision(tmp_path):
    env = production_env(tmp_path / "migrated.db")
    result = run_python(env, "-m", "alembic", "upgrade", "head")
    assert result.returncode == 0, result.stderr
    assert probe(env)["ready"] == 200
    result = run_python(env, "-c", "from app.database import engine; from sqlalchemy import text; "
                        "c=engine.connect(); c.execute(text(\"UPDATE alembic_version SET version_num='0001'\")); c.commit()")
    assert result.returncode == 0, result.stderr
    assert probe(env)["ready"] == 503


def test_bootstrap_creates_only_admin_without_demo_seed_and_refuses_overwrite(tmp_path):
    env = {**production_env(tmp_path / "bootstrap.db"), "BOOTSTRAP_ADMIN_PASSWORD": "StrongAdmin12345"}
    result = run_python(env, "-m", "alembic", "upgrade", "head")
    assert result.returncode == 0, result.stderr
    args = ("-m", "app.bootstrap_admin", "--email", "operator@example.com", "--first-name", "مدیر", "--last-name", "باشگاه")
    result = run_python(env, *args)
    assert result.returncode == 0, result.stderr
    assert env["BOOTSTRAP_ADMIN_PASSWORD"] not in result.stdout + result.stderr
    duplicate = run_python(env, *args)
    assert duplicate.returncode != 0
    result = run_python(env, "-c", "from app.database import SessionLocal; from app.models import User; "
                        "s=SessionLocal(); rows=s.query(User).all(); assert len(rows)==1; "
                        "assert rows[0].role=='admin' and rows[0].status=='active'")
    assert result.returncode == 0, result.stderr


@pytest.mark.parametrize("password", ["short1", "onlyletterslong", "A1" + "x" * 80])
def test_bootstrap_rejects_weak_or_unhashable_password_without_leaking_it(tmp_path, password):
    env = {**production_env(tmp_path / "bootstrap-invalid.db"), "BOOTSTRAP_ADMIN_PASSWORD": password}
    result = run_python(env, "-m", "app.bootstrap_admin", "--email", "operator@example.com", "--first-name", "A", "--last-name", "B")
    assert result.returncode != 0
    assert password not in result.stdout + result.stderr
    assert "password" in (result.stdout + result.stderr).lower()
