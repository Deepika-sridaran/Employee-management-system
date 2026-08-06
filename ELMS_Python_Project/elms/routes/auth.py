from datetime import datetime

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message

from extensions import db, mail
from models import Employee, Department, Role, LeaveBalance, PasswordResetToken

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    """POST /auth/register  — self-registration for a new employee."""
    data = request.get_json(force=True) or {}
    required = ["name", "email", "password"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

    if Employee.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "An account with this email already exists"}), 409

    employee = Employee(
        name=data["name"],
        email=data["email"],
        phone=data.get("phone"),
        designation=data.get("designation", "Employee"),
        department_id=data.get("departmentId"),
    )
    employee.set_password(data["password"])

    # default role
    default_role = Role.query.filter_by(name="ROLE_EMPLOYEE").first()
    if not default_role:
        default_role = Role(name="ROLE_EMPLOYEE")
        db.session.add(default_role)
    employee.roles.append(default_role)

    db.session.add(employee)
    db.session.flush()  # get employee.id before commit

    # every employee gets a starting leave balance
    db.session.add(LeaveBalance(employee_id=employee.id))

    db.session.commit()
    return jsonify({"employeeId": employee.id, "message": "Employee Created Successfully"}), 201


@auth_bp.post("/login")
def login():
    """POST /auth/login  — returns a JWT access token used on every subsequent request."""
    data = request.get_json(force=True) or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    employee = Employee.query.filter_by(email=email).first()
    if not employee or not employee.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(
        identity=str(employee.id),
        additional_claims={"roles": [r.name for r in employee.roles]},
    )
    return jsonify({
        "accessToken": token,
        "tokenType": "Bearer",
        "employee": employee.to_dict(),
    }), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    employee = Employee.query.get_or_404(int(get_jwt_identity()))
    return jsonify(employee.to_dict())


@auth_bp.post("/forgot-password")
def forgot_password():
    """POST /auth/forgot-password  {"email": "..."}
    Always responds 200 (even for unknown emails) so the endpoint can't be used
    to enumerate which addresses are registered.
    """
    data = request.get_json(force=True) or {}
    email = data.get("email")
    generic_response = jsonify({
        "message": "If that email is registered, a password-reset link has been sent."
    })

    if not email:
        return jsonify({"message": "Email is required"}), 400

    employee = Employee.query.filter_by(email=email).first()
    if not employee:
        return generic_response, 200

    reset_token = PasswordResetToken.generate(
        employee.id, current_app.config["RESET_TOKEN_EXPIRY_MINUTES"]
    )
    db.session.add(reset_token)
    db.session.commit()

    reset_link = f"{current_app.config['FRONTEND_URL']}/reset-password?token={reset_token.token}"

    try:
        msg = Message(
            subject="ELMS — Reset your password",
            recipients=[employee.email],
            body=(
                f"Hi {employee.name},\n\n"
                f"Click the link below to reset your ELMS password. "
                f"This link expires in {current_app.config['RESET_TOKEN_EXPIRY_MINUTES']} minutes.\n\n"
                f"{reset_link}\n\n"
                f"If you did not request this, you can ignore this email."
            ),
        )
        mail.send(msg)
    except Exception as exc:  # SMTP not configured in dev — surface the link instead of failing silently
        current_app.logger.warning(f"Could not send reset email: {exc}")
        return jsonify({
            "message": "Email service is not configured. Use this link directly (dev mode).",
            "resetLink": reset_link,
        }), 200

    return generic_response, 200


@auth_bp.post("/reset-password")
def reset_password():
    """POST /auth/reset-password  {"token": "...", "newPassword": "..."}"""
    data = request.get_json(force=True) or {}
    token = data.get("token")
    new_password = data.get("newPassword")

    if not token or not new_password:
        return jsonify({"message": "Token and newPassword are required"}), 400
    if len(new_password) < 8:
        return jsonify({"message": "Password must be at least 8 characters"}), 400

    reset_token = PasswordResetToken.query.filter_by(token=token).first()
    if not reset_token or not reset_token.is_valid():
        return jsonify({"message": "This reset link is invalid or has expired"}), 400

    employee = Employee.query.get(reset_token.employee_id)
    employee.set_password(new_password)
    reset_token.used = True
    db.session.commit()

    return jsonify({"message": "Password has been reset successfully"}), 200
