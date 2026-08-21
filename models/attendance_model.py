from extensions import db


class Attendance(db.Model):
    __tablename__ = "attendance"

    attendance_id = db.Column(
        db.Integer,
        primary_key=True
    )

    employee_id = db.Column(
        db.Integer,
        db.ForeignKey("employees.employee_id"),
        nullable=False
    )

    attendance_date = db.Column(
        db.Date,
        nullable=False
    )

    check_in = db.Column(
        db.Time,
        nullable=True
    )

    check_out = db.Column(
        db.Time,
        nullable=True
    )

    total_working_hours = db.Column(
        db.Numeric(5, 2),
        nullable=True,
        default=0.00
    )

    status = db.Column(
        db.Enum(
            "Present",
            "Absent",
            "Half Day",
            "Leave"
        ),
        nullable=False,
        default="Present"
    )

    late_arrival = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    early_logout = db.Column(
        db.Boolean,
        nullable=False,
        default=False
    )

    def to_dict(self):
        return {
            "attendance_id": self.attendance_id,
            "employee_id": self.employee_id,

            "attendance_date": (
                self.attendance_date.isoformat()
                if self.attendance_date
                else None
            ),

            "check_in": (
                self.check_in.strftime("%H:%M:%S")
                if self.check_in
                else None
            ),

            "check_out": (
                self.check_out.strftime("%H:%M:%S")
                if self.check_out
                else None
            ),

            "total_working_hours": (
                float(self.total_working_hours)
                if self.total_working_hours is not None
                else 0.0
            ),

            "status": self.status,
            "late_arrival": self.late_arrival,
            "early_logout": self.early_logout
        }