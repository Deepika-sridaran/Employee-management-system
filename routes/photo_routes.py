import os
from flask import Blueprint, send_from_directory
from flask_jwt_extended import jwt_required

from controllers.photo_controller import upload_my_photo, get_my_photo

photo_bp = Blueprint("photo_bp", __name__)


@photo_bp.route("/profile/photo", methods=["POST"])
@jwt_required()
def upload_photo_route():
    return upload_my_photo()


@photo_bp.route("/profile/photo", methods=["GET"])
@jwt_required()
def get_photo_route():
    return get_my_photo()


@photo_bp.route("/uploads/<filename>")
def serve_upload(filename):
    upload_folder = os.path.join(os.getcwd(), "uploads")
    return send_from_directory(upload_folder, filename)