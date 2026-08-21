from extensions import db


class Permission(db.Model):
    __tablename__ = "permissions"

    permission_id = db.Column(
        db.Integer,
        primary_key=True
    )

    employee_id = db.Column(
        db.Integer,
        db.ForeignKey("employees.employee_id"),
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
        db.Enum("Pending", "Approved", "Rejected"),
        nullable=False,
        default="Pending"
    )

    approved_by = db.Column(
        db.Integer,
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.current_timestamp()
    )

    def to_dict(self):
        return {
            "permission_id": self.permission_id,
            "employee_id": self.employee_id,
            "permission_date": (
                self.permission_date.isoformat()
                if self.permission_date else None
            ),
            "start_time": (
                self.start_time.strftime("%H:%M:%S")
                if self.start_time else None
            ),
            "end_time": (
                self.end_time.strftime("%H:%M:%S")
                if self.end_time else None
            ),
            "total_hours": (
                float(self.total_hours)
                if self.total_hours is not None else 0.0
            ),
            "reason": self.reason,
            "status": self.status,
            "approved_by": self.approved_by,
            "created_at": (
                self.created_at.isoformat()
                if self.created_at else None
            )
        }