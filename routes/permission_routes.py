from flask import Blueprint

from controllers.permission_controller import (
    create_permission,
    get_permissions,
    get_permissions_by_employee,
    update_permission_status
)


permission_bp = Blueprint(
    "permission",
    __name__
)


@permission_bp.route(
    "/",
    methods=["POST"]
)
def create_permission_route():
    return create_permission()


@permission_bp.route(
    "/",
    methods=["GET"]
)
def get_permissions_route():
    return get_permissions()


@permission_bp.route(
    "/employee/<int:employee_id>",
    methods=["GET"]
)
def get_permissions_by_employee_route(employee_id):
    return get_permissions_by_employee(employee_id)


@permission_bp.route(
    "/<int:permission_id>/status",
    methods=["PUT"]
)
def update_permission_status_route(permission_id):
    return update_permission_status(permission_id)