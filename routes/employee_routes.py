from flask import Blueprint

from controllers.employee_controller import (
    create_employee,
    delete_employee,
    get_all_employees,
    update_employee,
    upload_profile_image
)
from utils import admin_required


employee_bp = Blueprint("employee_bp", __name__)


@employee_bp.route("/employees", methods=["GET"])
@admin_required()
def employees():
    return get_all_employees()


@employee_bp.route("/employees", methods=["POST"])
@admin_required()
def add_employee():
    return create_employee()


@employee_bp.route("/employees/<int:employee_id>", methods=["PUT"])
@admin_required()
def edit_employee(employee_id):
    return update_employee(employee_id)


@employee_bp.route("/employees/<int:employee_id>", methods=["DELETE"])
@admin_required()
def remove_employee(employee_id):
    return delete_employee(employee_id)


@employee_bp.route(
    "/employees/<int:employee_id>/profile-image",
    methods=["POST"]
)
@admin_required()
def add_profile_image(employee_id):
    return upload_profile_image(employee_id)