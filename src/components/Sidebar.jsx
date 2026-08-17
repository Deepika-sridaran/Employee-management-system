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
      <NavLink to="/employee-list" className={linkClass}>Employee List</NavLink>
      <NavLink to="/add-employee" className={linkClass}>Add Employee</NavLink>
      <NavLink to="/profile" className={linkClass}>Profile</NavLink>

      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
export default Sidebar;