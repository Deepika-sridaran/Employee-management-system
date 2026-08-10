from flask import Flask

from config import Config
from extensions import db, bcrypt, jwt, mail
from routes.auth import auth_bp

app = Flask(__name__)

app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
mail.init_app(app)

app.register_blueprint(auth_bp, url_prefix="/auth")

@app.route("/")
def home():
    return "Employee Management System API is running"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)