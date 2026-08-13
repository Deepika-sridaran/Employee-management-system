import {Link} from "react-router-dom";

function Sidebar() {
  return (
    <div
    style={{
      width: "250px",
      background: "#222",
      padding: "20px",
      minHeight: "500vh",
      color: "white",
      boxSizing: "border-box"
    }}
    >
        <h3>Menu</h3>
        <p>
        <Link to="/dashboard">Dashboard</Link>
        </p>
        <p>
        <Link to="/employee-list">Employees</Link>
        </p>
        <p>
        <Link to="/add-employee">Add Employee</Link>
        </p>
        <p>
        <Link to="/employee-list">Employee List</Link>
        </p>
        <p>
        <Link to="/profile">Profile</Link>
        </p>
        <p>
        <Link to="/">Logout</Link>
        </p>
        </div>
  );
}
export default Sidebar;
