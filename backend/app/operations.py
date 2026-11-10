"""Database checks shared by deployment probes and administrator bootstrap."""
from pathlib import Path

from alembic.migration import MigrationContext
from alembic.script import ScriptDirectory
from sqlalchemy import text


def check_database(connection, *, require_migrations: bool = True) -> bool:
    connection.execute(text("SELECT 1"))
    if not require_migrations:
        return True
    migrations = Path(__file__).resolve().parents[1] / "migrations"
    expected = set(ScriptDirectory(str(migrations)).get_heads())
    actual = set(MigrationContext.configure(connection).get_current_heads())
    return bool(expected) and actual == expected
