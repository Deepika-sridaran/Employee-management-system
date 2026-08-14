from models.department_model import Department


def get_all_departments():
    try:
        departments = Department.query.all()
        return {
            "success": True,
            "message": "Departments retrieved successfully",
            "data": [d.to_dict() for d in departments],
        }, 200
    except Exception as error:
        return {
            "success": False,
            "message": "Failed to retrieve departments",
            "error": str(error),
        }, 500