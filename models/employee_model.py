from models import db
from datetime import datetime


class Employee(db.Model):
    __tablename__ = "employees"

    employee_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    department_id = db.Column(db.Integer, nullable=True)
    designation = db.Column(db.String(100), nullable=True)
    salary = db.Column(db.Numeric(12, 2), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    profile_image = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=True, default=datetime.utcnow)

    def to_dict(self):
        return {
            "employee_id": self.employee_id,
            "user_id": self.user_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone,
            "department_id": self.department_id,
            "designation": self.designation,
            "salary": float(self.salary) if self.salary is not None else None,
            "address": self.address,
            "profile_image": self.profile_image,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }