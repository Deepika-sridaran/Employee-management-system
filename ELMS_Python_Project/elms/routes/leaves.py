from datetime import date

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import LeaveRequest, LeaveBalance, LeaveStatus, LeaveType
from utils.decorators import roles_required
from utils.validators import parse_date, ranges_overlap

leaves_bp = Blueprint("leaves", __name__)

ACTIVE_STATUSES = (LeaveStatus.PENDING, LeaveStatus.APPROVED)


@leaves_bp.post("/leaves")
@jwt_required()
def apply_leave():
    """POST /leaves — enforces Rules 1, 2, 3 and 4 from the spec."""
    data = request.get_json(force=True) or {}
    required = ["employeeId", "leaveType", "startDate", "endDate"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

    if data["leaveType"] not in [t.value for t in LeaveType]:
        return jsonify({"message": "leaveType must be one of SICK, CASUAL, EARNED"}), 400

    start = parse_date(data["startDate"])
    end = parse_date(data["endDate"])

    # Rule 1 — Past Date Restriction
    if start < date.today():
        return jsonify({"message": "Leave cannot be applied for a past date"}), 400

    # Rule 2 — Chronological Consistency
    if end < start:
        return jsonify({"message": "endDate must be on or after startDate"}), 400

    employee_id = data["employeeId"]

    # Rule 3 — Overlapping Prevention
    existing = LeaveRequest.query.filter(
        LeaveRequest.employee_id == employee_id,
        LeaveRequest.status.in_(ACTIVE_STATUSES),
    ).all()
    for leave in existing:
        if ranges_overlap(leave.start_date, leave.end_date, start, end):
            return jsonify({
                "message": f"Overlaps with an existing {leave.status.value.lower()} "
                           f"leave from {leave.start_date} to {leave.end_date}"
            }), 409

    # Rule 4 — Balance Integrity
    balance = LeaveBalance.query.filter_by(employee_id=employee_id).first()
    requested_days = (end - start).days + 1
    if not balance or balance.balance_for(data["leaveType"]) < requested_days:
        return jsonify({"message": "Insufficient leave balance for this request"}), 400

    leave = LeaveRequest(
        employee_id=employee_id,
        leave_type=LeaveType(data["leaveType"]),
        start_date=start,
        end_date=end,
        reason=data.get("reason"),
        status=LeaveStatus.PENDING,
    )
    db.session.add(leave)
    db.session.commit()
    return jsonify(leave.to_dict()), 201


@leaves_bp.get("/leaves/<int:leave_id>")
@jwt_required()
def get_leave(leave_id):
    leave = LeaveRequest.query.get_or_404(leave_id)
    return jsonify(leave.to_dict())


@leaves_bp.get("/employees/<int:employee_id>/leaves")
@jwt_required()
def employee_leave_history(employee_id):
    leaves = LeaveRequest.query.filter_by(employee_id=employee_id).order_by(
        LeaveRequest.created_at.desc()
    ).all()
    return jsonify([leave.to_dict() for leave in leaves])


@leaves_bp.put("/leaves/<int:leave_id>/cancel")
@jwt_required()
def cancel_leave(leave_id):
    """Rule 6: an APPROVED leave cannot be self-cancelled (needs admin rollback)."""
    leave = LeaveRequest.query.get_or_404(leave_id)

    if leave.status == LeaveStatus.APPROVED:
        return jsonify({"message": "An approved leave requires administrative rollback to cancel"}), 400
    if leave.status in (LeaveStatus.CANCELLED, LeaveStatus.REJECTED):
        return jsonify({"message": f"Leave is already {leave.status.value.lower()}"}), 400

    leave.status = LeaveStatus.CANCELLED
    db.session.commit()
    return jsonify(leave.to_dict())


@leaves_bp.put("/leaves/<int:leave_id>/approve")
@roles_required("ROLE_MANAGER", "ROLE_ADMIN")
def approve_leave(leave_id):
    """Rule 5: a CANCELLED leave cannot be approved. Rule 7: a REJECTED leave cannot be re-approved."""
    leave = LeaveRequest.query.get_or_404(leave_id)

    if leave.status != LeaveStatus.PENDING:
        return jsonify({"message": f"Only PENDING leaves can be approved (current: {leave.status.value})"}), 400

    balance = LeaveBalance.query.filter_by(employee_id=leave.employee_id).first()
    balance.debit(leave.leave_type.value, leave.total_days)
    leave.status = LeaveStatus.APPROVED
    db.session.commit()
    return jsonify(leave.to_dict())


@leaves_bp.put("/leaves/<int:leave_id>/reject")
@roles_required("ROLE_MANAGER", "ROLE_ADMIN")
def reject_leave(leave_id):
    """Rejection requires a compulsory comment; Rule 5 blocks rejecting a CANCELLED leave."""
    data = request.get_json(force=True) or {}
    if not data.get("reason"):
        return jsonify({"message": "A rejection reason is required"}), 400

    leave = LeaveRequest.query.get_or_404(leave_id)
    if leave.status != LeaveStatus.PENDING:
        return jsonify({"message": f"Only PENDING leaves can be rejected (current: {leave.status.value})"}), 400

    leave.status = LeaveStatus.REJECTED
    leave.rejection_reason = data["reason"]
    db.session.commit()
    return jsonify(leave.to_dict())


@leaves_bp.get("/leaves/pending")
@roles_required("ROLE_MANAGER", "ROLE_ADMIN")
def pending_leaves():
    leaves = LeaveRequest.query.filter_by(status=LeaveStatus.PENDING).all()
    return jsonify([leave.to_dict() for leave in leaves])


@leaves_bp.get("/leaves/approved")
@jwt_required()
def approved_leaves():
    leaves = LeaveRequest.query.filter_by(status=LeaveStatus.APPROVED).all()
    return jsonify([leave.to_dict() for leave in leaves])


@leaves_bp.get("/leaves/search")
@jwt_required()
def search_leaves():
    """GET /leaves/search?status=PENDING&type=SICK"""
    query = LeaveRequest.query
    status = request.args.get("status")
    leave_type = request.args.get("type")
    if status:
        query = query.filter_by(status=LeaveStatus(status))
    if leave_type:
        query = query.filter_by(leave_type=LeaveType(leave_type))
    return jsonify([leave.to_dict() for leave in query.all()])
