from flask import Flask, render_template, jsonify

from config import Config
from extensions import db, bcrypt, jwt, mail, cors


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # --- init extensions ---
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # --- register API blueprints (all prefixed with /api) ---
    from routes.auth import auth_bp
    from routes.employees import employees_bp
    from routes.departments import departments_bp
    from routes.leaves import leaves_bp
    from routes.leave_balances import leave_balances_bp
    from routes.roles import roles_bp
    from routes.dashboard import dashboard_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(employees_bp, url_prefix="/api")
    app.register_blueprint(departments_bp, url_prefix="/api")
    app.register_blueprint(leaves_bp, url_prefix="/api")
    app.register_blueprint(leave_balances_bp, url_prefix="/api")
    app.register_blueprint(roles_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")

    # --- JWT error handlers -> clean JSON instead of default HTML ---
    @jwt.unauthorized_loader
    def unauthorized(_):
        return jsonify({"message": "Missing or invalid authentication token"}), 401

    @jwt.invalid_token_loader
    def invalid_token(_):
        return jsonify({"message": "Invalid authentication token"}), 422

    @jwt.expired_token_loader
    def expired_token(_jwt_header, _jwt_payload):
        return jsonify({"message": "Session expired, please log in again"}), 401

    # --- global error handlers ---
    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"message": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(_):
        return jsonify({"message": "Internal server error"}), 500

    # -----------------------------------------------------------------
    # Front-end page routes (each is a real URL you open in the browser)
    # -----------------------------------------------------------------
    @app.get("/")
    def index():
        return render_template("login.html")

    @app.get("/login")
    def login_page():
        return render_template("login.html")

    @app.get("/forgot-password")
    def forgot_password_page():
        return render_template("forgot_password.html")

    @app.get("/reset-password")
    def reset_password_page():
        return render_template("reset_password.html")

    @app.get("/dashboard")
    def dashboard_page():
        return render_template("dashboard.html")

    return app


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()  # creates tables from models.py if they don't exist yet
    app.run(debug=True, host="127.0.0.1", port=5000)
