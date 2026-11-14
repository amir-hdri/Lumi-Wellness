"""Initialize clean production database with zero fake/mock data."""
import os
import uuid
from sqlalchemy.orm import Session
from app.auth import hash_password
from app.database import SessionLocal, engine, Base
from app.models import Branch, Exercise, User

def reset_and_seed_clean():
    # Ensure all tables exist
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Clear any existing tables content
        print("Purging fake/demo rows...")
        for table in reversed(Base.metadata.sorted_tables):
            db.execute(table.delete())
        db.commit()

        # 1. Main Branch
        main_branch = Branch(
            id=str(uuid.uuid4()),
            name="Lumi Wellness",
            address="شعبه مرکزی",
            phone="021-88888888",
            email="info@lumiwellness.ir",
            is_active=True,
        )
        db.add(main_branch)
        db.flush()

        # 2. Real Administrator (mahshid-amiri)
        admin = User(
            id=str(uuid.uuid4()),
            email="mahshid-amiri@gymapp.ir",
            password_hash=hash_password("M@hshid"),
            first_name="مهشید",
            last_name="امیری",
            phone="09120000000",
            role="admin",
            status="active",
            branch_id=main_branch.id,
        )
        db.add(admin)

        # 3. Standard Exercise Library (reference catalog only, no fake athletes/programs)
        EXERCISES = [
            {"name": "پرس سینه هالتر", "name_en": "Barbell Bench Press", "category": "strength", "muscle_group": "chest", "difficulty": "intermediate", "equipment": "barbell"},
            {"name": "اسکات", "name_en": "Squat", "category": "strength", "muscle_group": "legs", "difficulty": "intermediate", "equipment": "barbell"},
            {"name": "ددلیفت", "name_en": "Deadlift", "category": "strength", "muscle_group": "back", "difficulty": "advanced", "equipment": "barbell"},
            {"name": "پول‌آپ", "name_en": "Pull-Up", "category": "strength", "muscle_group": "back", "difficulty": "intermediate", "equipment": "bodyweight"},
            {"name": "پرس شانه دمبل", "name_en": "Dumbbell Shoulder Press", "category": "strength", "muscle_group": "shoulders", "difficulty": "beginner", "equipment": "dumbbell"},
            {"name": "جلوبازو هالتر", "name_en": "Barbell Curl", "category": "strength", "muscle_group": "biceps", "difficulty": "beginner", "equipment": "barbell"},
            {"name": "پشت بازو سیم کش", "name_en": "Tricep Pushdown", "category": "strength", "muscle_group": "triceps", "difficulty": "beginner", "equipment": "cable"},
            {"name": "پرس پا", "name_en": "Leg Press", "category": "strength", "muscle_group": "legs", "difficulty": "beginner", "equipment": "machine"},
            {"name": "لت پول‌داون", "name_en": "Lat Pulldown", "category": "strength", "muscle_group": "back", "difficulty": "beginner", "equipment": "cable"},
            {"name": "کرانچ", "name_en": "Crunch", "category": "core", "muscle_group": "abs", "difficulty": "beginner", "equipment": "bodyweight"},
            {"name": "پلانک", "name_en": "Plank", "category": "core", "muscle_group": "abs", "difficulty": "beginner", "equipment": "bodyweight"},
            {"name": "پرس سینه دمبل", "name_en": "Dumbbell Bench Press", "category": "strength", "muscle_group": "chest", "difficulty": "beginner", "equipment": "dumbbell"},
        ]
        for ex in EXERCISES:
            db.add(Exercise(id=str(uuid.uuid4()), **ex))

        db.commit()
        print("Clean database ready! Real admin created: mahshid-amiri (email: mahshid-amiri@gymapp.ir, password: M@hshid)")
    finally:
        db.close()

if __name__ == "__main__":
    reset_and_seed_clean()
