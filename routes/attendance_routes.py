from flask import Blueprint, jsonify
from flask_jwt_extended import (
    get_jwt,
    jwt_required
)

from controllers.attendance_controller import (
    check_in,
    check_out,
    get_all_attendance,
    get_monthly_attendance,
    get_my_attendance
)


attendance_bp = Blueprint(
    "attendance_bp",
    __name__
)


@attendance_bp.route(
    "/attendance/check-in",
    methods=["POST"]
)
@jwt_required()
def check_in_route():
    return check_in()


@attendance_bp.route(
    "/attendance/check-out",
    methods=["POST"]
)
@jwt_required()
def check_out_route():
    return check_out()


@attendance_bp.route(
    "/attendance/my",
    methods=["GET"]
)
@jwt_required()
def my_attendance_route():
    return get_my_attendance()


@attendance_bp.route(
    "/attendance/monthly",
    methods=["GET"]
)
@jwt_required()
def monthly_attendance_route():
    return get_monthly_attendance()


@attendance_bp.route(
    "/attendance",
    methods=["GET"]
)
@jwt_required()
def all_attendance_route():
    claims = get_jwt()

    if claims.get("role") != "Admin":
        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    return get_all_attendance()