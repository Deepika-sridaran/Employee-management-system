from flask import Flask
from flask_cors import CORS

from config import Config
from extensions import db, bcrypt, jwt, mail

from routes.department_routes import department_bp
from routes.auth import auth_bp
from routes.dashboard_routes import dashboard_bp
from routes.employee_routes import employee_bp
from routes.profile_routes import profile_bp
from routes.leave_routes import leave_bp
from routes.photo_routes import photo_bp
from routes.payroll_routes import payroll_bp
from routes.permission_routes import permission_bp


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    CORS(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(leave_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(department_bp)
    app.register_blueprint(photo_bp)
    app.register_blueprint(payroll_bp, url_prefix="/api/payroll")
    app.register_blueprint(permission_bp, url_prefix="/api/permissions")

    @app.route("/")
    def home():
        return {
            "success": True,
            "message": "Employee Management System API is running"
        }, 200

    @app.route("/database-test")
    def database_test():
        try:
            db.session.execute(db.text("SELECT 1"))

            return {
                "success": True,
                "message": "Flask connected to MySQL successfully"
            }, 200

        except Exception as error:
            return {
                "success": False,
                "message": "Database connection failed",
                "error": str(error)
            }, 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)