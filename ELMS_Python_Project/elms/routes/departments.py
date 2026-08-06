from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import Department
from utils.decorators import roles_required

departments_bp = Blueprint("departments", __name__)


@departments_bp.get("/departments")
@jwt_required()
def list_departments():
    return jsonify([d.to_dict() for d in Department.query.all()])


@departments_bp.post("/departments")
@roles_required("ROLE_ADMIN")
def create_department():
    data = request.get_json(force=True) or {}
    if not data.get("name"):
        return jsonify({"message": "'name' is required"}), 400
    if Department.query.filter_by(name=data["name"]).first():
        return jsonify({"message": "Department already exists"}), 409

    department = Department(name=data["name"])
    db.session.add(department)
    db.session.commit()
    return jsonify(department.to_dict()), 201


@departments_bp.put("/departments/<int:department_id>")
@roles_required("ROLE_ADMIN")
def update_department(department_id):
    department = Department.query.get_or_404(department_id)
    data = request.get_json(force=True) or {}
    department.name = data.get("name", department.name)
    db.session.commit()
    return jsonify(department.to_dict())


@departments_bp.delete("/departments/<int:department_id>")
@roles_required("ROLE_ADMIN")
def delete_department(department_id):
    department = Department.query.get_or_404(department_id)
    db.session.delete(department)
    db.session.commit()
    return jsonify({"message": "Department deleted"}), 200


@departments_bp.get("/departments/<int:department_id>/employees")
@jwt_required()
def department_employees(department_id):
    department = Department.query.get_or_404(department_id)
    return jsonify([e.to_dict() for e in department.employees])
