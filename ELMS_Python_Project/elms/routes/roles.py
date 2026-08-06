from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import Role, Employee
from utils.decorators import roles_required

roles_bp = Blueprint("roles", __name__)


@roles_bp.get("/roles")
@jwt_required()
def list_roles():
    return jsonify([r.to_dict() for r in Role.query.all()])


@roles_bp.post("/roles")
@roles_required("ROLE_ADMIN")
def create_role():
    data = request.get_json(force=True) or {}
    if not data.get("name"):
        return jsonify({"message": "'name' is required"}), 400
    if Role.query.filter_by(name=data["name"]).first():
        return jsonify({"message": "Role already exists"}), 409

    role = Role(name=data["name"])
    db.session.add(role)
    db.session.commit()
    return jsonify(role.to_dict()), 201


@roles_bp.post("/employees/<int:employee_id>/roles/<int:role_id>")
@roles_required("ROLE_ADMIN")
def assign_role(employee_id, role_id):
    employee = Employee.query.get_or_404(employee_id)
    role = Role.query.get_or_404(role_id)
    if role not in employee.roles:
        employee.roles.append(role)
        db.session.commit()
    return jsonify(employee.to_dict())
