"""
Run once after the database is created, to seed reference data so you can
log in immediately:

    python seed.py

Creates:
  - Roles: ROLE_EMPLOYEE, ROLE_MANAGER, ROLE_ADMIN
  - Department: IT
  - Admin login -> email: admin@abctechnologies.com / password: Admin@123
"""
from app import create_app
from extensions import db
from models import Role, Department, Employee, LeaveBalance

app = create_app()

with app.app_context():
    db.create_all()

    role_names = ["ROLE_EMPLOYEE", "ROLE_MANAGER", "ROLE_ADMIN"]
    roles = {}
    for name in role_names:
        role = Role.query.filter_by(name=name).first()
        if not role:
            role = Role(name=name)
            db.session.add(role)
        roles[name] = role
    db.session.commit()

    dept = Department.query.filter_by(name="IT").first()
    if not dept:
        dept = Department(name="IT")
        db.session.add(dept)
        db.session.commit()

    admin = Employee.query.filter_by(email="admin@abctechnologies.com").first()
    if not admin:
        admin = Employee(
            name="Admin User",
            email="admin@abctechnologies.com",
            designation="HR Administrator",
            department_id=dept.id,
        )
        admin.set_password("Admin@123")
        admin.roles.append(roles["ROLE_ADMIN"])
        db.session.add(admin)
        db.session.flush()
        db.session.add(LeaveBalance(employee_id=admin.id))
        db.session.commit()
        print("Created admin login -> admin@abctechnologies.com / Admin@123")
    else:
        print("Admin already exists -> admin@abctechnologies.com")

    print("Seed complete.")
