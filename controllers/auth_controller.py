from flask import request, jsonify
from flask_jwt_extended import create_access_token

from extensions import db
from models.user import User


def register():
    data = request.get_json()

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    confirm_password = data.get("confirm_password")
    role = data.get("role", "User")

    # Required Fields Validation
    if not full_name or not email or not password or not confirm_password:
        return jsonify({
            "message": "Required fields should not be empty"
        }), 400

    # Password Validation
    if password != confirm_password:
        return jsonify({
            "message": "Password and Confirm Password should match"
        }), 400

    # Email Validation
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "message": "Email already exists"
        }), 409

    # Create User
    user = User(
        full_name=full_name,
        email=email,
        role=role
    )

    # Hash Password
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully",
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at
        }
    }), 201


def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Required Fields Validation
    if not email or not password:
        return jsonify({
            "message": "Email and Password are required"
        }), 400

    # Find User
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    # Check Password
    if not user.check_password(password):
        return jsonify({
            "message": "Invalid password"
        }), 401

    # Create JWT Token
    access_token = create_access_token(
        identity=str(user.user_id),
        additional_claims={
            "role": user.role
        }
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role
        }
    }), 200


def forgot_password():
    data = request.get_json()

    email = data.get("email")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    # Required Fields Validation
    if not email or not new_password or not confirm_password:
        return jsonify({
            "message": "Email, New Password and Confirm Password are required"
        }), 400

    # Password Validation
    if new_password != confirm_password:
        return jsonify({
            "message": "New Password and Confirm Password should match"
        }), 400

    # Find User
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    # Hash and Update New Password
    user.set_password(new_password)

    db.session.commit()

    return jsonify({
        "message": "Password reset successfully"
    }), 200


def logout():
    return jsonify({
        "message": "Logout successful"
    }), 200