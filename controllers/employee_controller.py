import os
import re

from flask import request
from werkzeug.utils import secure_filename

from extensions import db
from models.department_model import Department
from models.employee_model import Employee
from models.user import User

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def get_all_employees():
    try:
        employees = Employee.query.all()

        return {
            "success": True,
            "message": "Employees retrieved successfully",
            "data": [employee.to_dict() for employee in employees]
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve employees",
            "error": str(error)
        }, 500


def create_employee():
    try:
        data = request.get_json()

        if not data:
            return {
                "success": False,
                "message": "Request body is required"
            }, 400

        required_fields = [
            "user_id",
            "first_name",
            "last_name",
            "email"
        ]

        for field in required_fields:
            if not data.get(field):
                return {
                    "success": False,
                    "message": f"{field} is required"
                }, 400

        user = db.session.get(User, data["user_id"])

        if not user:
            return {
                "success": False,
                "message": "User does not exist"
            }, 404

        existing_user = Employee.query.filter_by(
            user_id=data["user_id"]
        ).first()

        if existing_user:
            return {
                "success": False,
                "message": "This user already has an employee profile"
            }, 409

        email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

        if not re.match(email_pattern, data["email"]):
            return {
                "success": False,
                "message": "Invalid email format"
            }, 400

        existing_email = Employee.query.filter_by(
            email=data["email"]
        ).first()

        if existing_email:
            return {
                "success": False,
                "message": "Email already exists"
            }, 409

        if data.get("phone"):
            phone = str(data["phone"])

            if not phone.isdigit() or len(phone) != 10:
                return {
                    "success": False,
                    "message": "Phone number must contain exactly 10 digits"
                }, 400

        if data.get("department_id"):
            department = db.session.get(
                Department,
                data["department_id"]
            )

            if not department:
                return {
                    "success": False,
                    "message": "Department does not exist"
                }, 404

        employee = Employee(
            user_id=data["user_id"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            phone=data.get("phone"),
            department_id=data.get("department_id"),
            designation=data.get("designation"),
            salary=data.get("salary"),
            address=data.get("address"),
            profile_image=data.get("profile_image")
        )

        db.session.add(employee)
        db.session.commit()

        return {
            "success": True,
            "message": "Employee created successfully",
            "data": employee.to_dict()
        }, 201

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Failed to create employee",
            "error": str(error)
        }, 500


def update_employee(employee_id):
    try:
        employee = db.session.get(Employee, employee_id)

        if not employee:
            return {
                "success": False,
                "message": "Employee not found"
            }, 404

        data = request.get_json()

        if not data:
            return {
                "success": False,
                "message": "Request body is required"
            }, 400

        if "email" in data:
            email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"

            if not re.match(email_pattern, data["email"]):
                return {
                    "success": False,
                    "message": "Invalid email format"
                }, 400

            existing_email = Employee.query.filter(
                Employee.email == data["email"],
                Employee.employee_id != employee_id
            ).first()

            if existing_email:
                return {
                    "success": False,
                    "message": "Email already exists"
                }, 409

            employee.email = data["email"]

        if "phone" in data:
            phone = str(data["phone"])

            if not phone.isdigit() or len(phone) != 10:
                return {
                    "success": False,
                    "message": "Phone number must contain exactly 10 digits"
                }, 400

            employee.phone = phone

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

        if "first_name" in data:
            employee.first_name = data["first_name"]

        if "last_name" in data:
            employee.last_name = data["last_name"]

        if "designation" in data:
            employee.designation = data["designation"]

        if "salary" in data:
            employee.salary = data["salary"]

        if "address" in data:
            employee.address = data["address"]

        if "profile_image" in data:
            employee.profile_image = data["profile_image"]

        db.session.commit()

        return {
            "success": True,
            "message": "Employee updated successfully",
            "data": employee.to_dict()
        }, 200

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Failed to update employee",
            "error": str(error)
        }, 500


def delete_employee(employee_id):
    try:
        employee = db.session.get(Employee, employee_id)

        if not employee:
            return {
                "success": False,
                "message": "Employee not found"
            }, 404

        db.session.delete(employee)
        db.session.commit()

        return {
            "success": True,
            "message": "Employee deleted successfully"
        }, 200

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Failed to delete employee",
            "error": str(error)
        }, 500


def upload_profile_image(employee_id):
    try:
        employee = db.session.get(Employee, employee_id)

        if not employee:
            return {
                "success": False,
                "message": "Employee not found"
            }, 404

        if "profile_image" not in request.files:
            return {
                "success": False,
                "message": "Profile image is required"
            }, 400

        file = request.files["profile_image"]

        if file.filename == "":
            return {
                "success": False,
                "message": "No image selected"
            }, 400

        if not allowed_file(file.filename):
            return {
                "success": False,
                "message": "Only PNG, JPG and JPEG files are allowed"
            }, 400

        filename = secure_filename(
            f"{employee_id}_{file.filename}"
        )

        upload_folder = os.path.join(
            os.getcwd(),
            "uploads"
        )

        os.makedirs(upload_folder, exist_ok=True)

        file_path = os.path.join(
            upload_folder,
            filename
        )

        file.save(file_path)

        employee.profile_image = filename
        db.session.commit()

        return {
            "success": True,
            "message": "Profile image uploaded successfully",
            "profile_image": filename
        }, 200

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Failed to upload profile image",
            "error": str(error)
        }, 500