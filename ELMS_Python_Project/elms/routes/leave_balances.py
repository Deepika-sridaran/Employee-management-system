from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import LeaveBalance
from utils.decorators import roles_required

leave_balances_bp = Blueprint("leave_balances", __name__)


@leave_balances_bp.get("/leave-balances/<int:employee_id>")
@jwt_required()
def get_leave_balance(employee_id):
    balance = LeaveBalance.query.filter_by(employee_id=employee_id).first_or_404()
    return jsonify(balance.to_dict())


@leave_balances_bp.put("/leave-balances/<int:employee_id>")
@roles_required("ROLE_ADMIN")
def update_leave_balance(employee_id):
    balance = LeaveBalance.query.filter_by(employee_id=employee_id).first_or_404()
    data = request.get_json(force=True) or {}

    if "sickLeaves" in data:
        balance.sick_leaves = data["sickLeaves"]
    if "casualLeaves" in data:
        balance.casual_leaves = data["casualLeaves"]
    if "earnedLeaves" in data:
        balance.earned_leaves = data["earnedLeaves"]

    db.session.commit()
    return jsonify(balance.to_dict())
