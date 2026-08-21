import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "Admin";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const linkClass = ({ isActive }) => `sidebar-link${isActive ? " active" : ""}`;

  return (
    <div className="app-sidebar">
      <h3>Menu</h3>

      <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
      <NavLink to="/apply-leave" className={linkClass}>Apply Leave</NavLink>
      <NavLink to="/my-leaves" className={linkClass}>My Leaves</NavLink>
      {isAdmin && <NavLink to="/approvals" className={linkClass}>Approvals</NavLink>}
      {isAdmin && <NavLink to="/employee-list" className={linkClass}>Employee List</NavLink>}
      {isAdmin && <NavLink to="/add-employee" className={linkClass}>Add Employee</NavLink>}
      <NavLink to="/attendance" className={linkClass}>Attendance</NavLink>
      <NavLink to="/payroll" className={linkClass}>Payroll</NavLink>
      <NavLink to="/departments" className={linkClass}>Departments</NavLink>
      <NavLink to="/profile" className={linkClass}>Profile</NavLink>

      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
export default Sidebar;
