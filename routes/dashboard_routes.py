from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from controllers.dashboard_controller import get_dashboard


dashboard_bp = Blueprint("dashboard_bp", __name__)


@dashboard_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    claims = get_jwt()

    if claims.get("role") != "Admin":
        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    return get_dashboard()