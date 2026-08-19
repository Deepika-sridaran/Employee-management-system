from datetime import datetime, date, timedelta

from flask import request
from flask_jwt_extended import get_jwt_identity

from extensions import db
from models.employee_model import Employee
from models.leave_model import Leave


MONTHLY_LEAVE_LIMIT = 6


def _get_employee_for_current_user():
    user_id = int(get_jwt_identity())
    return Employee.query.filter_by(user_id=user_id).first()


def _calculate_leave_days(start_date, end_date):
    return (end_date - start_date).days + 1


def _get_month_leave_days(employee_id, year, month):
    leaves = Leave.query.filter(
        Leave.employee_id == employee_id,
        Leave.status.in_(["Pending", "Approved"])
    ).all()

    month_start = date(year, month, 1)

    if month == 12:
        month_end = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        month_end = date(year, month + 1, 1) - timedelta(days=1)

    total_days = 0

    for leave in leaves:
        overlap_start = max(leave.start_date, month_start)
        overlap_end = min(leave.end_date, month_end)

        if overlap_start <= overlap_end:
            total_days += _calculate_leave_days(
                overlap_start,
                overlap_end
            )

    return total_days


def apply_leave():
    try:
        employee = _get_employee_for_current_user()

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

        for field in ["leave_type", "start_date", "end_date"]:
            if not data.get(field):
                return {
                    "success": False,
                    "message": f"{field} is required"
                }, 400

        try:
            start_date = datetime.strptime(
                data["start_date"],
                "%Y-%m-%d"
            ).date()

            end_date = datetime.strptime(
                data["end_date"],
                "%Y-%m-%d"
            ).date()

        except ValueError:
            return {
                "success": False,
                "message": "Dates must be in YYYY-MM-DD format"
            }, 400

        if end_date < start_date:
            return {
                "success": False,
                "message": "End date cannot be before start date"
            }, 400

        # Monthly leave limit
        requested_days = _calculate_leave_days(
            start_date,
            end_date
        )

        existing_leave_days = _get_month_leave_days(
            employee.employee_id,
            start_date.year,
            start_date.month
        )

        if existing_leave_days + requested_days > MONTHLY_LEAVE_LIMIT:
            remaining_days = max(
                MONTHLY_LEAVE_LIMIT - existing_leave_days,
                0
            )

            return {
                "success": False,
                "message": (
                    f"Monthly leave limit exceeded. "
                    f"Maximum allowed is {MONTHLY_LEAVE_LIMIT} days. "
                    f"Remaining leave days: {remaining_days}."
                )
            }, 400

        leave = Leave(
            employee_id=employee.employee_id,
            leave_type=data["leave_type"],
            start_date=start_date,
            end_date=end_date,
            reason=data.get("reason"),
            status="Pending",
        )

        db.session.add(leave)
        db.session.commit()

        return {
            "success": True,
            "message": "Leave applied successfully",
            "data": leave.to_dict()
        }, 201

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Failed to apply leave",
            "error": str(error)
        }, 500


def get_my_leaves():
    try:
        employee = _get_employee_for_current_user()

        if not employee:
            return {
                "success": False,
                "message": "Employee profile not found"
            }, 404

        leaves = (
            Leave.query
            .filter_by(employee_id=employee.employee_id)
            .order_by(Leave.applied_at.desc())
            .all()
        )

        return {
            "success": True,
            "message": "Leaves retrieved successfully",
            "data": [l.to_dict() for l in leaves]
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve leaves",
            "error": str(error)
        }, 500


def get_all_leaves():
    try:
        leaves = (
            Leave.query
            .order_by(Leave.applied_at.desc())
            .all()
        )

        result = []

        for leave in leaves:
            item = leave.to_dict()

            employee = db.session.get(
                Employee,
                leave.employee_id
            )

            item["employee_name"] = (
                f"{employee.first_name} {employee.last_name}"
                if employee
                else "Unknown"
            )

            result.append(item)

        return {
            "success": True,
            "message": "All leaves retrieved successfully",
            "data": result
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve leaves",
            "error": str(error)
        }, 500


def _update_leave_status(leave_id, new_status):
    try:
        leave = db.session.get(Leave, leave_id)

        if not leave:
            return {
                "success": False,
                "message": "Leave request not found"
            }, 404

        if leave.status != "Pending":
            return {
                "success": False,
                "message": f"Leave is already {leave.status}"
            }, 400

        # Rejection reason is mandatory for Admin
        if new_status == "Rejected":
            data = request.get_json()

            if not data or not data.get("rejection_reason"):
                return {
                    "success": False,
                    "message": "Rejection reason is required"
                }, 400

            rejection_reason = data["rejection_reason"].strip()

            if not rejection_reason:
                return {
                    "success": False,
                    "message": "Rejection reason is required"
                }, 400

            leave.rejection_reason = rejection_reason

        leave.status = new_status

        db.session.commit()

        return {
            "success": True,
            "message": f"Leave {new_status.lower()} successfully",
            "data": leave.to_dict()
        }, 200

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Failed to update leave",
            "error": str(error)
        }, 500


def approve_leave(leave_id):
    return _update_leave_status(leave_id, "Approved")


def reject_leave(leave_id):
    return _update_leave_status(leave_id, "Rejected")