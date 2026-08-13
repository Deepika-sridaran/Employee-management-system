import re

from flask import request
from flask_jwt_extended import get_jwt_identity

from extensions import db
from models.department_model import Department
from models.employee_model import Employee


def get_profile():
    try:
        # Rachel's JWT stores user_id as the identity
        user_id = int(get_jwt_identity())

        employee = Employee.query.filter_by(
            user_id=user_id
        ).first()

        if not employee:
            return {
                "success": False,
                "message": "Employee profile not found"
            }, 404

        return {
            "success": True,
            "message": "Profile retrieved successfully",
            "data": employee.to_dict()
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve profile",
            "error": str(error)
        }, 500


def update_profile():
    try:
        user_id = int(get_jwt_identity())

        employee = Employee.query.filter_by(
            user_id=user_id
        ).first()

        if not employee:
            return {
                "success": False,
                "message": "Employee profile not found"
            }, 404

        data = request.get_json()

        if not data:
            return {
                "success": False,
                "message": "Request body is required"
            }, 400

        # Validate email
        if "email" in data:
            email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

            if not re.match(email_pattern, data["email"]):
                return {
                    "success": False,
                    "message": "Invalid email format"
                }, 400

            existing_email = Employee.query.filter(
                Employee.email == data["email"],
                Employee.employee_id != employee.employee_id
            ).first()

            if existing_email:
                return {
                    "success": False,
                    "message": "Email already exists"
                }, 409

            employee.email = data["email"]

        # Validate phone
        if "phone" in data:
            phone = str(data["phone"])

            if not phone.isdigit() or len(phone) != 10:
                return {
                    "success": False,
                    "message": "Phone number must contain exactly 10 digits"
                }, 400

            employee.phone = phone

        # Validate department
        if "department_id" in data:
            if data["department_id"] is not None:
                department = db.session.get(
                    Department,
                    data["department_id"]
                )

                if not department:
                    return {
                        "success": False,
                        "message": "Department does not exist"
                    }, 404

            employee.department_id = data["department_id"]

        # Update allowed profile fields
        if "first_name" in data:
            employee.first_name = data["first_name"]

        if "last_name" in data:
            employee.last_name = data["last_name"]

        if "address" in data:
            employee.address = data["address"]

        db.session.commit()

        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": employee.to_dict()
        }, 200

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Failed to update profile",
            "error": str(error)
        }, 500