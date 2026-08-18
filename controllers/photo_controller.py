import os
from flask import request
from flask_jwt_extended import get_jwt_identity
from werkzeug.utils import secure_filename

from extensions import db
from models.user import User

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_my_photo():
    try:
        user_id = int(get_jwt_identity())
        user = db.session.get(User, user_id)
        if not user:
            return {"success": False, "message": "User not found"}, 404

        if "photo" not in request.files:
            return {"success": False, "message": "No photo file was sent"}, 400

        file = request.files["photo"]
        if file.filename == "":
            return {"success": False, "message": "No file selected"}, 400
        if not allowed_file(file.filename):
            return {"success": False, "message": "Only PNG, JPG, or JPEG files are allowed"}, 400

        filename = secure_filename(f"user_{user_id}_{file.filename}")
        upload_folder = os.path.join(os.getcwd(), "uploads")
        os.makedirs(upload_folder, exist_ok=True)
        file.save(os.path.join(upload_folder, filename))

        user.profile_image = filename
        db.session.commit()

        return {
            "success": True,
            "message": "Profile photo updated successfully",
            "profile_image": filename,
        }, 200

    except Exception as error:
        db.session.rollback()
        return {"success": False, "message": "Failed to upload photo", "error": str(error)}, 500


def get_my_photo():
    try:
        user_id = int(get_jwt_identity())
        user = db.session.get(User, user_id)
        if not user:
            return {"success": False, "message": "User not found"}, 404
        return {"success": True, "data": {"profile_image": user.profile_image}}, 200
    except Exception as error:
        return {"success": False, "message": "Failed to load photo", "error": str(error)}, 500