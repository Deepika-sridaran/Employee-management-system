from flask import Blueprint

from controllers.employee_controller import (
    create_employee,
    delete_employee,
    get_all_employees,
    update_employee,
    upload_profile_image
)


employee_bp = Blueprint("employee_bp", __name__)


@employee_bp.route("/employees", methods=["GET"])
def employees():
    return get_all_employees()


@employee_bp.route("/employees", methods=["POST"])
def add_employee():
    return create_employee()


@employee_bp.route("/employees/<int:employee_id>", methods=["PUT"])
def edit_employee(employee_id):
    return update_employee(employee_id)


@employee_bp.route("/employees/<int:employee_id>", methods=["DELETE"])
def remove_employee(employee_id):
    return delete_employee(employee_id)


@employee_bp.route(
    "/employees/<int:employee_id>/profile-image",
    methods=["POST"]
)
def add_profile_image(employee_id):
    return upload_profile_image(employee_id)