from models.employee_model import Employee
from models.department_model import Department
from models.user import User
from models.leave_model import Leave


def get_dashboard():
    try:
        total_employees = Employee.query.count()
        total_departments = Department.query.count()
        total_users = User.query.count()

        pending_leaves = Leave.query.filter_by(status="Pending").count()
        approved_leaves = Leave.query.filter_by(status="Approved").count()
        rejected_leaves = Leave.query.filter_by(status="Rejected").count()
        total_leaves = Leave.query.count()

        return {
            "success": True,
            "message": "Dashboard data retrieved successfully",
            "data": {
                "total_employees": total_employees,
                "total_departments": total_departments,
                "total_users": total_users,
                "total_leaves": total_leaves,
                "pending_leaves": pending_leaves,
                "approved_leaves": approved_leaves,
                "rejected_leaves": rejected_leaves
            }
        }, 200

    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve dashboard data",
            "error": str(error)
        }, 500