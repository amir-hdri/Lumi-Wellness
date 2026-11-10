"""Run after migrations: python -m app.bootstrap_admin --help.

Creates an active administrator without running demo seeds. Existing users are
never modified. Passwords come from a hidden prompt or an injected environment
variable, never command-line arguments or diagnostic output.
"""
import argparse
from getpass import getpass
import os
import sys

from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.schemas import AdminUserCreate


def main() -> int:
    parser = argparse.ArgumentParser(description="Create one administrator after applying database migrations.")
    parser.add_argument("--email", required=True)
    parser.add_argument("--first-name", required=True)
    parser.add_argument("--last-name", required=True)
    args = parser.parse_args()
    password = os.environ.get("BOOTSTRAP_ADMIN_PASSWORD")
    if password is None:
        if not sys.stdin.isatty():
            print("Inject BOOTSTRAP_ADMIN_PASSWORD or use an interactive terminal.", file=sys.stderr)
            return 1
        password = getpass("Administrator password: ")
        if password != getpass("Confirm password: "):
            print("Passwords do not match.", file=sys.stderr)
            return 1
    if len(password) < 12 or len(password.encode("utf-8")) > 72:
        print("Administrator password must have at least 12 characters and at most 72 UTF-8 bytes.", file=sys.stderr)
        return 1
    try:
        request = AdminUserCreate(
            email=args.email.strip(), password=password,
            first_name=args.first_name.strip(), last_name=args.last_name.strip(), role="admin", status="active",
        )
    except ValidationError:
        # Pydantic's default diagnostics include input values, including secrets.
        print("Invalid administrator details; check email, names and password policy (letter and digit required).", file=sys.stderr)
        return 1
    if not request.first_name or not request.last_name:
        print("Administrator names must not be empty.", file=sys.stderr)
        return 1

    from app.auth import hash_password
    from app.database import SessionLocal
    from app.models import User
    from app.operations import check_database

    try:
        with SessionLocal() as db:
            if not check_database(db.connection()):
                print("Apply python -m alembic upgrade head before creating the administrator.", file=sys.stderr)
                return 1
            if db.query(User.id).filter(User.email == request.email).first() is not None:
                print("An account with that email already exists; no account was changed.", file=sys.stderr)
                return 1
            db.add(User(
                email=request.email, password_hash=hash_password(request.password),
                first_name=request.first_name, last_name=request.last_name,
                role="admin", status="active", phone="",
            ))
            db.commit()
    except SQLAlchemyError:
        print("Administrator creation failed; check database connectivity and migrations.", file=sys.stderr)
        return 1
    print("Administrator created. Demo data was not seeded.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
