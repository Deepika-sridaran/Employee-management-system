from flask import Blueprint

from controllers.employee_controller import get_all_employees


employee_bp = Blueprint("employee_bp", __name__)


@employee_bp.route("/employees", methods=["GET"])
def employees():
    return get_all_employees()