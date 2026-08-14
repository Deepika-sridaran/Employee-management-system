import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="app-sidebar">
      <h3>Menu</h3>

      <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
        Dashboard
      </NavLink>
      <NavLink to="/employee-list" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
        Employee List
      </NavLink>
      <NavLink to="/add-employee" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
        Add Employee
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
        Profile
      </NavLink>

      <div className="sidebar-logout">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
export default Sidebar;