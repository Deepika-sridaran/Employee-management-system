from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.department_controller import get_all_departments

department_bp = Blueprint("department_bp", __name__)


@department_bp.route("/departments", methods=["GET"])
@jwt_required()
def departments():
    return get_all_departments()