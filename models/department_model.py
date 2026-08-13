from models import db


class Department(db.Model):
    __tablename__ = "departments"

    department_id = db.Column(db.Integer, primary_key=True)
    department_name = db.Column(db.String(100), unique=True, nullable=False)

    def to_dict(self):
        return {
            "department_id": self.department_id,
            "department_name": self.department_name
        }