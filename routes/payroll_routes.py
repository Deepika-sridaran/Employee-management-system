from flask import Blueprint

from controllers.payroll_controller import (
    create_payroll,
    get_payrolls,
    get_payroll_by_employee
)


payroll_bp = Blueprint(
    "payroll",
    __name__
)


@payroll_bp.route(
    "/",
    methods=["POST"]
)
def create_payroll_route():
    return create_payroll()


@payroll_bp.route(
    "/",
    methods=["GET"]
)
def get_payrolls_route():
    return get_payrolls()


@payroll_bp.route(
    "/employee/<int:employee_id>",
    methods=["GET"]
)
def get_payroll_by_employee_route(employee_id):
    return get_payroll_by_employee(employee_id)