from flask import Flask
from flask_cors import CORS

from config import Config
from models import db
from routes.employee_routes import employee_bp


def create_app():
    # Create the Flask application
    app = Flask(__name__)

    # Load configuration from config.py
    app.config.from_object(Config)

    # Connect SQLAlchemy with Flask
    db.init_app(app)

    # Allow frontend JavaScript to access backend APIs
    CORS(app)

    # Register employee routes
    app.register_blueprint(employee_bp)

    # Home API
    @app.route("/")
    def home():
        return {
            "success": True,
            "message": "Employee Management System backend is running"
        }, 200

    # Database connection test API
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


# Create the application
app = create_app()


# Start Flask server
if __name__ == "__main__":
    app.run(debug=True)