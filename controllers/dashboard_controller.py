from models.employee_model import Employee
from models.department_model import Department
from models.user import User
from models.leave_model import Leave
from models.permission_model import Permission
from models.payroll_model import Payroll


def get_dashboard():

    try:

        # Employee counts
        total_employees = Employee.query.count()

        active_employees = Employee.query.filter_by(
            employee_status="Active"
        ).count()

        resigned_employees = Employee.query.filter_by(
            employee_status="Resigned"
        ).count()

        terminated_employees = Employee.query.filter_by(
            employee_status="Terminated"
        ).count()


        # Department and user counts
        total_departments = Department.query.count()
        total_users = User.query.count()


        # Leave counts
        total_leaves = Leave.query.count()

        pending_leaves = Leave.query.filter_by(
            status="Pending"
        ).count()

        approved_leaves = Leave.query.filter_by(
            status="Approved"
        ).count()

        rejected_leaves = Leave.query.filter_by(
            status="Rejected"
        ).count()


        # Permission counts
        total_permissions = Permission.query.count()

        pending_permissions = Permission.query.filter_by(
            status="Pending"
        ).count()

        approved_permissions = Permission.query.filter_by(
            status="Approved"
        ).count()

        rejected_permissions = Permission.query.filter_by(
            status="Rejected"
        ).count()


        # Payroll counts
        total_payrolls = Payroll.query.count()


        return {
            "success": True,
            "message": "Dashboard data retrieved successfully",

            "data": {

                "employees": {
                    "total": total_employees,
                    "active": active_employees,
                    "resigned": resigned_employees,
                    "terminated": terminated_employees
                },

                "departments": {
                    "total": total_departments
                },

                "users": {
                    "total": total_users
                },

                "leaves": {
                    "total": total_leaves,
                    "pending": pending_leaves,
                    "approved": approved_leaves,
                    "rejected": rejected_leaves
                },

                "permissions": {
                    "total": total_permissions,
                    "pending": pending_permissions,
                    "approved": approved_permissions,
                    "rejected": rejected_permissions
                },

                "payroll": {
                    "total": total_payrolls
                }
            }
        }, 200


    except Exception as error:

        return {
            "success": False,
            "message": "Failed to retrieve dashboard data",
            "error": str(error)
        }, 500