from datetime import datetime, date
import calendar

from flask import request
from flask_jwt_extended import get_jwt_identity, get_jwt

from extensions import db
from models.employee_model import Employee
from models.permission_model import Permission


MONTHLY_PERMISSION_LIMIT = 4.0


def request_permission():
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

        required_fields = [
            "permission_date",
            "start_time",
            "end_time",
            "reason"
        ]

        for field in required_fields:
            if not data.get(field):
                return {
                    "success": False,
                    "message": f"{field} is required"
                }, 400

        try:
            permission_date = datetime.strptime(
                data["permission_date"],
                "%Y-%m-%d"
            ).date()

            start_time = datetime.strptime(
                data["start_time"],
                "%H:%M"
            ).time()

            end_time = datetime.strptime(
                data["end_time"],
                "%H:%M"
            ).time()

        except ValueError:
            return {
                "success": False,
                "message": "Invalid date or time format"
            }, 400

        start_datetime = datetime.combine(
            permission_date,
            start_time
        )

        end_datetime = datetime.combine(
            permission_date,
            end_time
        )

        if end_datetime <= start_datetime:
            return {
                "success": False,
                "message": "End time must be after start time"
            }, 400

        total_hours = (
            end_datetime - start_datetime
        ).total_seconds() / 3600

        first_day = date(
            permission_date.year,
            permission_date.month,
            1
        )

        last_day_number = calendar.monthrange(
            permission_date.year,
            permission_date.month
        )[1]

        last_day = date(
            permission_date.year,
            permission_date.month,
            last_day_number
        )

        approved_permissions = Permission.query.filter(
            Permission.employee_id == employee.employee_id,
            Permission.permission_date >= first_day,
            Permission.permission_date <= last_day,
            Permission.status == "Approved"
        ).all()

        used_hours = sum(
            float(permission.total_hours or 0)
            for permission in approved_permissions
        )

        if used_hours + total_hours > MONTHLY_PERMISSION_LIMIT:
            return {
                "success": False,
                "message": "Monthly permission limit exceeded",
                "used_hours": round(used_hours, 2),
                "requested_hours": round(total_hours, 2),
                "monthly_limit": MONTHLY_PERMISSION_LIMIT
            }, 400

        permission = Permission(
            employee_id=employee.employee_id,
            permission_date=permission_date,
            start_time=start_time,
            end_time=end_time,
            total_hours=round(total_hours, 2),
            reason=data["reason"],
            status="Pending"
        )

        db.session.add(permission)
        db.session.commit()

        return {
            "success": True,
            "message": "Permission request submitted successfully",
            "data": permission.to_dict()
        }, 201

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Failed to submit permission request",
            "error": str(error)
        }, 500


def get_my_permissions():
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

        permissions = Permission.query.filter_by(
            employee_id=employee.employee_id
        ).order_by(
            Permission.permission_date.desc()
        ).all()

        return {
            "success": True,
            "message": "Permissions retrieved successfully",
            "data": [
                permission.to_dict()
                for permission in permissions
            ]
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve permissions",
            "error": str(error)
        }, 500


def get_all_permissions():
    try:
        permissions = Permission.query.order_by(
            Permission.permission_date.desc()
        ).all()

        return {
            "success": True,
            "message": "All permissions retrieved successfully",
            "data": [
                permission.to_dict()
                for permission in permissions
            ]
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve permissions",
            "error": str(error)
        }, 500


def approve_permission(permission_id):
    try:
        claims = get_jwt()

        if claims.get("role") != "Admin":
            return {
                "success": False,
                "message": "Admin access required"
            }, 403

        permission = db.session.get(
            Permission,
            permission_id
        )

        if not permission:
            return {
                "success": False,
                "message": "Permission request not found"
            }, 404

        admin_user_id = int(get_jwt_identity())

        permission.status = "Approved"
        permission.approved_by = admin_user_id

        db.session.commit()

        return {
            "success": True,
            "message": "Permission approved successfully",
            "data": permission.to_dict()
        }, 200

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Failed to approve permission",
            "error": str(error)
        }, 500


def reject_permission(permission_id):
    try:
        claims = get_jwt()

        if claims.get("role") != "Admin":
            return {
                "success": False,
                "message": "Admin access required"
            }, 403

        permission = db.session.get(
            Permission,
            permission_id
        )

        if not permission:
            return {
                "success": False,
                "message": "Permission request not found"
            }, 404

        admin_user_id = int(get_jwt_identity())

        permission.status = "Rejected"
        permission.approved_by = admin_user_id

        db.session.commit()

        return {
            "success": True,
            "message": "Permission rejected successfully",
            "data": permission.to_dict()
        }, 200

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Failed to reject permission",
            "error": str(error)
        }, 500


def get_monthly_permission_summary():
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

        today = date.today()

        first_day = date(
            today.year,
            today.month,
            1
        )

        last_day_number = calendar.monthrange(
            today.year,
            today.month
        )[1]

        last_day = date(
            today.year,
            today.month,
            last_day_number
        )

        permissions = Permission.query.filter(
            Permission.employee_id == employee.employee_id,
            Permission.permission_date >= first_day,
            Permission.permission_date <= last_day
        ).all()

        approved_hours = sum(
            float(permission.total_hours or 0)
            for permission in permissions
            if permission.status == "Approved"
        )

        remaining_hours = max(
            MONTHLY_PERMISSION_LIMIT - approved_hours,
            0
        )

        return {
            "success": True,
            "message": "Monthly permission summary retrieved successfully",
            "data": {
                "month": today.month,
                "year": today.year,
                "monthly_limit": MONTHLY_PERMISSION_LIMIT,
                "used_hours": round(approved_hours, 2),
                "remaining_hours": round(remaining_hours, 2)
            }
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve monthly permission summary",
            "error": str(error)
        }, 500