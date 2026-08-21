from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt, jwt_required

from controllers.permission_controller import (
    approve_permission,
    create_permission,
    get_all_permissions,
    get_monthly_permission_summary,
    get_my_permissions,
    get_permissions,
    get_permissions_by_employee,
    reject_permission,
    request_permission,
    update_permission_status
)


permission_bp = Blueprint(
    "permission_bp",
    __name__
)


# =========================================================
# YOUR JWT-BASED PERMISSION APIs
# =========================================================

@permission_bp.route(
    "/permissions/request",
    methods=["POST"]
)
@jwt_required()
def request_permission_route():
    return request_permission()


@permission_bp.route(
    "/permissions/my",
    methods=["GET"]
)
@jwt_required()
def my_permissions_route():
    return get_my_permissions()


@permission_bp.route(
    "/permissions/monthly",
    methods=["GET"]
)
@jwt_required()
def monthly_permission_route():
    return get_monthly_permission_summary()


@permission_bp.route(
    "/permissions",
    methods=["GET"]
)
@jwt_required()
def all_permissions_route():
    claims = get_jwt()

    if claims.get("role") != "Admin":
        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    return get_all_permissions()


@permission_bp.route(
    "/permissions/<int:permission_id>/approve",
    methods=["PUT"]
)
@jwt_required()
def approve_permission_route(permission_id):
    return approve_permission(permission_id)


@permission_bp.route(
    "/permissions/<int:permission_id>/reject",
    methods=["PUT"]
)
@jwt_required()
def reject_permission_route(permission_id):
    return reject_permission(permission_id)


# =========================================================
# TEAM / FRONTEND-COMPATIBLE PERMISSION APIs
# =========================================================

@permission_bp.route(
    "/api/permissions/",
    methods=["POST"]
)
def create_permission_route():
    return create_permission()


@permission_bp.route(
    "/api/permissions/",
    methods=["GET"]
)
def get_permissions_route():
    return get_permissions()


@permission_bp.route(
    "/api/permissions/employee/<int:employee_id>",
    methods=["GET"]
)
def get_permissions_by_employee_route(employee_id):
    return get_permissions_by_employee(employee_id)


@permission_bp.route(
    "/api/permissions/<int:permission_id>/status",
    methods=["PUT"]
)
def update_permission_status_route(permission_id):
    return update_permission_status(permission_id)