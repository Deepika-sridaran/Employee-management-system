import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CalendarPlus, ListChecks, ClipboardCheck,
  Users, UserPlus, Clock, Wallet, Building2, UserCircle, LogOut,
} from "lucide-react";

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

      <NavLink to="/dashboard" className={linkClass}>
        <LayoutDashboard size={17} /> Dashboard
      </NavLink>
      <NavLink to="/apply-leave" className={linkClass}>
        <CalendarPlus size={17} /> Apply Leave
      </NavLink>
      <NavLink to="/my-leaves" className={linkClass}>
        <ListChecks size={17} /> My Leaves
      </NavLink>
      {isAdmin && (
        <NavLink to="/approvals" className={linkClass}>
          <ClipboardCheck size={17} /> Approvals
        </NavLink>
      )}
      {isAdmin && (
        <NavLink to="/employee-list" className={linkClass}>
          <Users size={17} /> Employee List
        </NavLink>
      )}
      {isAdmin && (
        <NavLink to="/add-employee" className={linkClass}>
          <UserPlus size={17} /> Add Employee
        </NavLink>
      )}
      <NavLink to="/attendance" className={linkClass}>
        <Clock size={17} /> Attendance
      </NavLink>
      <NavLink to="/payroll" className={linkClass}>
        <Wallet size={17} /> Payroll
      </NavLink>
      <NavLink to="/departments" className={linkClass}>
        <Building2 size={17} /> Departments
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        <UserCircle size={17} /> Profile
      </NavLink>

      <div className="sidebar-logout">
        <button onClick={handleLogout}>
          <LogOut size={16} style={{ marginRight: "6px", verticalAlign: "-3px" }} />
          Logout
        </button>
      </div>
    </div>
  );
}
export default Sidebar;