from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import Employee, LeaveBalance
from utils.decorators import roles_required

employees_bp = Blueprint("employees", __name__)


@employees_bp.get("/employees")
@jwt_required()
def list_employees():
    """GET /employees?page=0&size=10&sort=name  (Pagination & Sorting)"""
    page = request.args.get("page", 0, type=int)
    size = request.args.get("size", 10, type=int)
    sort = request.args.get("sort", "name")

    query = Employee.query
    if hasattr(Employee, sort):
        query = query.order_by(getattr(Employee, sort))

    pagination = query.paginate(page=page + 1, per_page=size, error_out=False)
    return jsonify({
        "content": [e.to_dict() for e in pagination.items],
        "totalElements": pagination.total,
        "totalPages": pagination.pages,
        "page": page,
        "size": size,
    })


@employees_bp.get("/employees/search")
@jwt_required()
def search_employees():
    """GET /employees/search?keyword=..."""
    keyword = request.args.get("keyword", "")
    results = Employee.query.filter(
        Employee.name.ilike(f"%{keyword}%") | Employee.email.ilike(f"%{keyword}%")
    ).all()
    return jsonify([e.to_dict() for e in results])


@employees_bp.get("/employees/<int:employee_id>")
@jwt_required()
def get_employee(employee_id):
    employee = Employee.query.get_or_404(employee_id)
    return jsonify(employee.to_dict())


@employees_bp.post("/employees")
@roles_required("ROLE_ADMIN")
def create_employee():
    """POST /employees — Admin/HR provisions a new employee account."""
    data = request.get_json(force=True) or {}
    for field in ("name", "email", "password"):
        if not data.get(field):
            return jsonify({"message": f"'{field}' is required"}), 400

    if Employee.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already in use"}), 409

    employee = Employee(
        name=data["name"],
        email=data["email"],
        phone=data.get("phone"),
        designation=data.get("designation"),
        department_id=data.get("departmentId"),
        manager_id=data.get("managerId"),
    )
    employee.set_password(data["password"])
    db.session.add(employee)
    db.session.flush()
    db.session.add(LeaveBalance(employee_id=employee.id))
    db.session.commit()

    return jsonify({"employeeId": employee.id, "message": "Employee Created Successfully"}), 201


@employees_bp.put("/employees/<int:employee_id>")
@jwt_required()
def update_employee(employee_id):
    employee = Employee.query.get_or_404(employee_id)
    data = request.get_json(force=True) or {}

    for field in ("name", "phone", "designation"):
        if field in data:
            setattr(employee, field, data[field])
    if "departmentId" in data:
        employee.department_id = data["departmentId"]
    if "managerId" in data:
        employee.manager_id = data["managerId"]

    db.session.commit()
    return jsonify(employee.to_dict())


@employees_bp.delete("/employees/<int:employee_id>")
@roles_required("ROLE_ADMIN")
def delete_employee(employee_id):
    employee = Employee.query.get_or_404(employee_id)
    db.session.delete(employee)
    db.session.commit()
    return jsonify({"message": "Employee deleted"}), 200
