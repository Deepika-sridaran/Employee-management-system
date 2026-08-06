import enum
import secrets
from datetime import datetime, timedelta

from extensions import db, bcrypt


# ---------------------------------------------------------------------------
# Enums (Domain Model Rules & Enums — section 3 of the spec)
# ---------------------------------------------------------------------------
class LeaveType(str, enum.Enum):
    SICK = "SICK"
    CASUAL = "CASUAL"
    EARNED = "EARNED"


class LeaveStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"


# ---------------------------------------------------------------------------
# Association table: Employee <-> Role  (ManyToMany)
# ---------------------------------------------------------------------------
employee_roles = db.Table(
    "employee_roles",
    db.Column("employee_id", db.Integer, db.ForeignKey("employees.id"), primary_key=True),
    db.Column("role_id", db.Integer, db.ForeignKey("roles.id"), primary_key=True),
)


class Department(db.Model):
    __tablename__ = "departments"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)

    employees = db.relationship("Employee", back_populates="department")

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)  # ROLE_EMPLOYEE / ROLE_MANAGER / ROLE_ADMIN

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class Employee(db.Model):
    __tablename__ = "employees"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)
    designation = db.Column(db.String(100))

    department_id = db.Column(db.Integer, db.ForeignKey("departments.id"))
    manager_id = db.Column(db.Integer, db.ForeignKey("employees.id"), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    department = db.relationship("Department", back_populates="employees")
    manager = db.relationship("Employee", remote_side=[id], backref="direct_reports")
    roles = db.relationship("Role", secondary=employee_roles, backref="employees")
    leave_requests = db.relationship(
        "LeaveRequest", back_populates="employee", foreign_keys="LeaveRequest.employee_id"
    )
    leave_balance = db.relationship(
        "LeaveBalance", back_populates="employee", uselist=False, cascade="all, delete-orphan"
    )

    # --- password helpers ---
    def set_password(self, raw_password: str):
        self.password_hash = bcrypt.generate_password_hash(raw_password).decode("utf-8")

    def check_password(self, raw_password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, raw_password)

    def has_role(self, role_name: str) -> bool:
        return any(r.name == role_name for r in self.roles)

    def to_dict(self, include_roles=True):
        data = {
            "employeeId": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "designation": self.designation,
            "departmentId": self.department_id,
            "department": self.department.name if self.department else None,
            "managerId": self.manager_id,
        }
        if include_roles:
            data["roles"] = [r.name for r in self.roles]
        return data


class LeaveBalance(db.Model):
    __tablename__ = "leave_balances"

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("employees.id"), unique=True, nullable=False)

    sick_leaves = db.Column(db.Integer, default=10, nullable=False)
    casual_leaves = db.Column(db.Integer, default=8, nullable=False)
    earned_leaves = db.Column(db.Integer, default=15, nullable=False)

    employee = db.relationship("Employee", back_populates="leave_balance")

    def balance_for(self, leave_type: str) -> int:
        return {
            LeaveType.SICK.value: self.sick_leaves,
            LeaveType.CASUAL.value: self.casual_leaves,
            LeaveType.EARNED.value: self.earned_leaves,
        }[leave_type]

    def debit(self, leave_type: str, days: int):
        if leave_type == LeaveType.SICK.value:
            self.sick_leaves -= days
        elif leave_type == LeaveType.CASUAL.value:
            self.casual_leaves -= days
        elif leave_type == LeaveType.EARNED.value:
            self.earned_leaves -= days

    def credit(self, leave_type: str, days: int):
        self.debit(leave_type, -days)

    def to_dict(self):
        return {
            "sickLeaves": self.sick_leaves,
            "casualLeaves": self.casual_leaves,
            "earnedLeaves": self.earned_leaves,
        }


class LeaveRequest(db.Model):
    __tablename__ = "leave_requests"

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("employees.id"), nullable=False)

    leave_type = db.Column(db.Enum(LeaveType), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    reason = db.Column(db.String(500))
    status = db.Column(db.Enum(LeaveStatus), default=LeaveStatus.PENDING, nullable=False)
    rejection_reason = db.Column(db.String(500), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employee = db.relationship("Employee", back_populates="leave_requests", foreign_keys=[employee_id])

    @property
    def total_days(self) -> int:
        return (self.end_date - self.start_date).days + 1

    def to_dict(self):
        return {
            "id": self.id,
            "employeeId": self.employee_id,
            "employeeName": self.employee.name if self.employee else None,
            "leaveType": self.leave_type.value,
            "startDate": self.start_date.isoformat(),
            "endDate": self.end_date.isoformat(),
            "totalDays": self.total_days,
            "reason": self.reason,
            "status": self.status.value,
            "rejectionReason": self.rejection_reason,
        }


class PasswordResetToken(db.Model):
    """Stores single-use tokens emailed to a user for the Forgot Password flow."""

    __tablename__ = "password_reset_tokens"

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey("employees.id"), nullable=False)
    token = db.Column(db.String(64), unique=True, nullable=False, index=True)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)

    employee = db.relationship("Employee")

    @staticmethod
    def generate(employee_id: int, expiry_minutes: int = 30):
        token = secrets.token_urlsafe(32)
        return PasswordResetToken(
            employee_id=employee_id,
            token=token,
            expires_at=datetime.utcnow() + timedelta(minutes=expiry_minutes),
        )

    def is_valid(self) -> bool:
        return not self.used and datetime.utcnow() <= self.expires_at
