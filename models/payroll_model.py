from models import db
from datetime import datetime


class Payroll(db.Model):
    __tablename__ = "payroll"

    payroll_id = db.Column(db.Integer, primary_key=True)

    employee_id = db.Column(
        db.Integer,
        db.ForeignKey("employees.employee_id"),
        nullable=False
    )

    payroll_month = db.Column(db.Date, nullable=False)

    basic_salary = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    hra = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    da = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    bonus = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    overtime = db.Column(db.Numeric(12, 2), nullable=False, default=0)

    pf = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    tax = db.Column(db.Numeric(12, 2), nullable=False, default=0)

    gross_salary = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    net_salary = db.Column(db.Numeric(12, 2), nullable=False, default=0)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "payroll_id": self.payroll_id,
            "employee_id": self.employee_id,
            "payroll_month": self.payroll_month.isoformat(),
            "basic_salary": float(self.basic_salary),
            "hra": float(self.hra),
            "da": float(self.da),
            "bonus": float(self.bonus),
            "overtime": float(self.overtime),
            "pf": float(self.pf),
            "tax": float(self.tax),
            "gross_salary": float(self.gross_salary),
            "net_salary": float(self.net_salary),
            "created_at": self.created_at.isoformat()
            if self.created_at else None
        }