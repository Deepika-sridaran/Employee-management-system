from flask import request, jsonify
from models import db
from models.permission_model import Permission


def create_permission():

    try:
        data = request.get_json()

        permission = Permission(
            employee_id=data.get("employee_id"),
            permission_date=data.get("permission_date"),
            start_time=data.get("start_time"),
            end_time=data.get("end_time"),
            total_hours=data.get("total_hours"),
            reason=data.get("reason")
        )

        db.session.add(permission)
        db.session.commit()

        return jsonify({
            "message": "Permission request created successfully",
            "permission": permission.to_dict()
        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500


def get_permissions():

    permissions = Permission.query.all()

    return jsonify([
        permission.to_dict()
        for permission in permissions
    ]), 200


def get_permissions_by_employee(employee_id):

    permissions = Permission.query.filter_by(
        employee_id=employee_id
    ).all()

    return jsonify([
        permission.to_dict()
        for permission in permissions
    ]), 200


def update_permission_status(permission_id):

    try:
        data = request.get_json()

        permission = Permission.query.get(permission_id)

        if not permission:
            return jsonify({
                "message": "Permission not found"
            }), 404

        status = data.get("status")

        if status not in ["Approved", "Rejected"]:
            return jsonify({
                "message": "Status must be Approved or Rejected"
            }), 400

        permission.status = status
        permission.approved_by = data.get("approved_by")

        db.session.commit()

        return jsonify({
            "message": f"Permission {status.lower()} successfully",
            "permission": permission.to_dict()
        }), 200

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500