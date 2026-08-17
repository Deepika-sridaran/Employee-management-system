from flask import Blueprint
from flask_jwt_extended import jwt_required

from controllers.leave_controller import (
    apply_leave,
    get_my_leaves,
    get_all_leaves,
    approve_leave,
    reject_leave,
)
from utils import admin_required

leave_bp = Blueprint("leave_bp", __name__)


@leave_bp.route("/leaves/apply", methods=["POST"])
@jwt_required()
def apply_leave_route():
    return apply_leave()


@leave_bp.route("/leaves/my-leaves", methods=["GET"])
@jwt_required()
def my_leaves_route():
    return get_my_leaves()


@leave_bp.route("/leaves", methods=["GET"])
@admin_required()
def all_leaves_route():
    return get_all_leaves()


@leave_bp.route("/leaves/<int:leave_id>/approve", methods=["PUT"])
@admin_required()
def approve_leave_route(leave_id):
    return approve_leave(leave_id)


@leave_bp.route("/leaves/<int:leave_id>/reject", methods=["PUT"])
@admin_required()
def reject_leave_route(leave_id):
    return reject_leave(leave_id)