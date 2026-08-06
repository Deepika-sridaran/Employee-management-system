# ELMS — Employee Leave Management System (Python)

Full Python implementation of the ABC Technologies leave management spec:
Flask REST API (matching every route in the spec doc) + a working front-end
(login, forgot password, reset password, dashboard) served from the same app.

## 1. Best platform to write & run this

| Purpose | Recommended tool |
|---|---|
| Writing/editing code | **VS Code** (free) — install the *Python* extension. Simple, lightweight, great for Flask projects. |
| Database | **MySQL Workbench** (you already have this open) + **MySQL Server 8.0** running locally. |
| Running the app | Plain **Terminal** inside VS Code — no special IDE needed, Flask's built-in server is enough for development. |
| API testing | **Postman** or **Thunder Client** (VS Code extension) to call the `/api/...` routes directly. |

You do **not** need PyCharm Professional, Docker, or a cloud server for this stage — VS Code + MySQL Workbench covers everything.

## 2. Project structure

```
elms/
├── app.py                  # Flask app factory + page routes (/, /login, /dashboard, ...)
├── config.py                # Reads .env — DB, JWT, mail settings
├── extensions.py             # db, bcrypt, jwt, mail, cors instances
├── models.py                  # Department, Role, Employee, LeaveBalance, LeaveRequest, PasswordResetToken
├── seed.py                     # One-time script: creates roles + an admin login
├── schema.sql                   # Reference-only raw SQL (Flask builds this for you)
├── requirements.txt
├── .env.example                  # Copy to .env and fill in your values
├── routes/
│   ├── auth.py                    # /api/auth/register, /login, /me, /forgot-password, /reset-password
│   ├── employees.py                 # /api/employees...
│   ├── departments.py                 # /api/departments...
│   ├── leaves.py                        # /api/leaves...  (all 7 business rules enforced here)
│   ├── leave_balances.py                  # /api/leave-balances/{employeeId}
│   ├── roles.py                             # /api/roles, role assignment
│   └── dashboard.py                           # /api/dashboard (cached stats)
├── utils/
│   ├── decorators.py                            # @roles_required(...) RBAC guard
│   └── validators.py                              # date parsing + overlap check
├── templates/                                       # HTML pages (server-rendered by Flask)
│   ├── login.html
│   ├── forgot_password.html
│   ├── reset_password.html
│   └── dashboard.html
└── static/
    ├── css/style.css                                  # all styling (design tokens at the top)
    ├── js/{api.js, login.js, forgot_password.js, reset_password.js, dashboard.js}
    └── img/logo.svg
```

## 3. Setup (one time)

```bash
cd elms
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt

copy .env.example .env         # Windows
# cp .env.example .env         # macOS/Linux
```

Open `.env` and set `DB_PASSWORD` to your MySQL root password (the one from
the "Connect to MySQL Server" dialog in your screenshot).

In **MySQL Workbench**, run just this one line (everything else is created
automatically by Flask):

```sql
CREATE DATABASE elms_db;
```

## 4. Create tables + a working login, then run

```bash
python seed.py      # creates tables + roles + an admin account
python app.py        # starts the server
```

Open your browser at:

- **http://127.0.0.1:5000/login** — login page
- **http://127.0.0.1:5000/forgot-password**
- **http://127.0.0.1:5000/dashboard** (redirects to login if not signed in)

Test login created by `seed.py`:

```
Email:    admin@abctechnologies.com
Password: Admin@123
```

## 5. How the pieces fit together

1. `login.html` posts to `POST /api/auth/login` → gets back a JWT.
2. The JWT is stored in `localStorage` (see `static/js/api.js`) and sent as
   `Authorization: Bearer <token>` on every following request.
3. `dashboard.html` calls `GET /api/auth/me`, `GET /api/dashboard`, and
   `GET /api/leaves/pending` to populate itself.
4. "Forgot password" → `POST /api/auth/forgot-password` emails a link to
   `/reset-password?token=...` (if you haven't configured `MAIL_*` in `.env`
   yet, the API returns the link directly in the response so you can test
   without setting up SMTP).
5. `reset-password.html` reads `?token=` from the URL and posts to
   `POST /api/auth/reset-password`.

## 6. What's implemented from the spec

- All entities & relationships (§5): Employee, Department, Role, LeaveBalance, LeaveRequest.
- All 7 business validation rules (§3) enforced in `routes/leaves.py`.
- Every REST endpoint listed in §7.1–§7.5.
- Role-based access control (ROLE_EMPLOYEE / ROLE_MANAGER / ROLE_ADMIN) via `@roles_required`.
- Password hashing with bcrypt, JWT auth, cached `/dashboard` stats.

## Not built yet (tell me if you want these next)

- Employee-facing "Apply for leave" / "My leave history" screens (dashboard
  currently shows org-wide stats + the manager/admin "pending approvals" queue).
- Admin screens for managing departments/roles/employees.
- Real email delivery setup walkthrough (Gmail App Password or Mailtrap).
- Deployment (e.g., to Render/PythonAnywhere) once you're ready to host it online.
