from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request


def admin_required():
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()

            claims = get_jwt()

            if claims.get("role") != "Admin":
                return jsonify({
                    "success": False,
                    "message": "Admin access required"
                }), 403

            return function(*args, **kwargs)

        return wrapper

    return decorator