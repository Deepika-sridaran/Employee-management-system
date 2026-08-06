from functools import wraps

from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def roles_required(*allowed_roles):
    """Restricts a route to callers whose JWT contains one of the allowed roles.

    Usage:
        @roles_required("ROLE_ADMIN", "ROLE_MANAGER")
        def some_view(): ...
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            token_roles = set(claims.get("roles", []))
            if not token_roles.intersection(allowed_roles):
                return jsonify({"message": "Insufficient permissions for this action"}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator
