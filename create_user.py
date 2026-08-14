"""
Run once: python create_user.py
Creates one test login directly in the `users` table.
"""
from app import create_app
from extensions import db
from models.user import User

app = create_app()

with app.app_context():
    db.create_all()  # safe to call even if tables already exist

    existing = User.query.filter_by(email="admin@abctechnologies.com").first()
    if existing:
        print("User already exists.")
    else:
        user = User(
            full_name="Admin User",
            email="admin@abctechnologies.com",
            role="Admin",
        )
        user.set_password("Admin@123")
        db.session.add(user)
        db.session.commit()
        print("Created user -> admin@abctechnologies.com / Admin@123")