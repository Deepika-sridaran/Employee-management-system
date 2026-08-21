from datetime import date, datetime, time
import calendar

from flask_jwt_extended import get_jwt_identity

from extensions import db
from models.attendance_model import Attendance
from models.employee_model import Employee


def check_in():
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

        existing_attendance = Attendance.query.filter_by(
            employee_id=employee.employee_id,
            attendance_date=today
        ).first()

        if existing_attendance:
            return {
                "success": False,
                "message": "Already checked in today"
            }, 409

        current_time = datetime.now().time()
        office_start_time = time(9, 0)

        attendance = Attendance(
            employee_id=employee.employee_id,
            attendance_date=today,
            check_in=current_time,
            status="Present",
            late_arrival=current_time > office_start_time,
            early_logout=False
        )

        db.session.add(attendance)
        db.session.commit()

        return {
            "success": True,
            "message": "Check-in successful",
            "data": attendance.to_dict()
        }, 201

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Check-in failed",
            "error": str(error)
        }, 500


def check_out():
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

        attendance = Attendance.query.filter_by(
            employee_id=employee.employee_id,
            attendance_date=today
        ).first()

        if not attendance:
            return {
                "success": False,
                "message": "Please check in first"
            }, 404

        if attendance.check_out:
            return {
                "success": False,
                "message": "Already checked out today"
            }, 409

        current_time = datetime.now().time()
        attendance.check_out = current_time

        check_in_datetime = datetime.combine(
            today,
            attendance.check_in
        )

        check_out_datetime = datetime.combine(
            today,
            current_time
        )

        worked_hours = (
            check_out_datetime - check_in_datetime
        ).total_seconds() / 3600

        attendance.total_working_hours = round(
            worked_hours,
            2
        )

        office_end_time = time(18, 0)

        attendance.early_logout = (
            current_time < office_end_time
        )

        attendance.status = (
            "Half Day"
            if worked_hours < 4
            else "Present"
        )

        db.session.commit()

        return {
            "success": True,
            "message": "Check-out successful",
            "data": attendance.to_dict()
        }, 200

    except Exception as error:
        db.session.rollback()

        return {
            "success": False,
            "message": "Check-out failed",
            "error": str(error)
        }, 500


def get_my_attendance():
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

        records = Attendance.query.filter_by(
            employee_id=employee.employee_id
        ).order_by(
            Attendance.attendance_date.desc()
        ).all()

        return {
            "success": True,
            "message": "Attendance retrieved successfully",
            "data": [
                record.to_dict()
                for record in records
            ]
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve attendance",
            "error": str(error)
        }, 500


def get_all_attendance():
    try:
        records = Attendance.query.order_by(
            Attendance.attendance_date.desc()
        ).all()

        return {
            "success": True,
            "message": "All attendance retrieved successfully",
            "data": [
                record.to_dict()
                for record in records
            ]
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve attendance",
            "error": str(error)
        }, 500


def get_monthly_attendance():
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
        year = today.year
        month = today.month

        first_day = date(
            year,
            month,
            1
        )

        last_day_number = calendar.monthrange(
            year,
            month
        )[1]

        last_day = date(
            year,
            month,
            last_day_number
        )

        records = Attendance.query.filter(
            Attendance.employee_id == employee.employee_id,
            Attendance.attendance_date >= first_day,
            Attendance.attendance_date <= last_day
        ).all()

        present_days = 0
        half_days = 0
        absent_days = 0
        leave_days = 0
        late_count = 0
        early_logout_count = 0
        total_working_hours = 0.0

        for record in records:
            if record.status == "Present":
                present_days += 1
            elif record.status == "Half Day":
                half_days += 1
            elif record.status == "Absent":
                absent_days += 1
            elif record.status == "Leave":
                leave_days += 1

            if record.late_arrival:
                late_count += 1

            if record.early_logout:
                early_logout_count += 1

            if record.total_working_hours:
                total_working_hours += float(
                    record.total_working_hours
                )

        return {
            "success": True,
            "message": "Monthly attendance summary retrieved successfully",
            "data": {
                "year": year,
                "month": month,
                "present_days": present_days,
                "half_days": half_days,
                "absent_days": absent_days,
                "leave_days": leave_days,
                "late_arrivals": late_count,
                "early_logouts": early_logout_count,
                "total_working_hours": round(
                    total_working_hours,
                    2
                )
            }
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve monthly attendance summary",
            "error": str(error)
        }, 500