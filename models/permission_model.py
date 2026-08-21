from models import db
from datetime import datetime


class Permission(db.Model):

    __tablename__ = "permissions"

    permission_id = db.Column(
        db.Integer,
        primary_key=True,
        autoincrement=True
    )

    employee_id = db.Column(
        db.Integer,
        nullable=False
    )

    permission_date = db.Column(
        db.Date,
        nullable=False
    )

    start_time = db.Column(
        db.Time,
        nullable=False
    )

    end_time = db.Column(
        db.Time,
        nullable=False
    )

    total_hours = db.Column(
        db.Numeric(5, 2),
        nullable=True
    )

    reason = db.Column(
        db.String(255),
        nullable=False
    )

    status = db.Column(
        db.Enum(
            "Pending",
            "Approved",
            "Rejected"
        ),
        nullable=False,
        default="Pending"
    )

    approved_by = db.Column(
        db.Integer,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    def to_dict(self):

        return {
            "permission_id": self.permission_id,
            "employee_id": self.employee_id,
            "permission_date": str(self.permission_date),
            "start_time": str(self.start_time),
            "end_time": str(self.end_time),
            "total_hours": float(self.total_hours)
            if self.total_hours else None,
            "reason": self.reason,
            "status": self.status,
            "approved_by": self.approved_by,
            "created_at": str(self.created_at)
        }