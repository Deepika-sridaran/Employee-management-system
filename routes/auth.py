from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.auth_controller import (
    register,
    login,
    forgot_password,
    logout
)

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register_route():
    return register()


@auth_bp.route("/login", methods=["POST"])
def login_route():
    return login()


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password_route():
    return forgot_password()


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout_route():
    return logout()