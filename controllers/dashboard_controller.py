from models.employee_model import Employee
from models.department_model import Department
from models.user import User


def get_dashboard():
    try:
        total_employees = Employee.query.count()
        total_departments = Department.query.count()
        total_users = User.query.count()

        return {
            "success": True,
            "message": "Dashboard data retrieved successfully",
            "data": {
                "total_employees": total_employees,
                "total_departments": total_departments,
                "total_users": total_users
            }
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve dashboard data",
            "error": str(error)
        }, 500