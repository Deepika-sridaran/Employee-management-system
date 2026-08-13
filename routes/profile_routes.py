from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.profile_controller import (
    get_profile,
    update_profile
)


profile_bp = Blueprint("profile_bp", __name__)


@profile_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    return get_profile()


@profile_bp.route("/profile", methods=["PUT"])
@jwt_required()
def edit_profile():
    return update_profile()