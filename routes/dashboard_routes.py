from flask import Blueprint

from controllers.dashboard_controller import get_dashboard


dashboard_bp = Blueprint("dashboard_bp", __name__)


@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard():
    return get_dashboard()