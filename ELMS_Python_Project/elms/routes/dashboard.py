import time

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from models import Employee, LeaveRequest, LeaveStatus

dashboard_bp = Blueprint("dashboard", __name__)

# --- Simple in-memory cache, mirrors the spec's @Cacheable("dashboardStats") ---
_CACHE = {"data": None, "expires_at": 0}
_CACHE_TTL_SECONDS = 60


@dashboard_bp.get("/dashboard")
@jwt_required()
def dashboard_metrics():
    now = time.time()
    if _CACHE["data"] and _CACHE["expires_at"] > now:
        return jsonify(_CACHE["data"])

    data = {
        "totalEmployees": Employee.query.count(),
        "pendingLeaves": LeaveRequest.query.filter_by(status=LeaveStatus.PENDING).count(),
        "approvedLeaves": LeaveRequest.query.filter_by(status=LeaveStatus.APPROVED).count(),
        "rejectedLeaves": LeaveRequest.query.filter_by(status=LeaveStatus.REJECTED).count(),
    }
    _CACHE["data"] = data
    _CACHE["expires_at"] = now + _CACHE_TTL_SECONDS
    return jsonify(data)
