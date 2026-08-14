import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import "./Dashboard.css";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://127.0.0.1:5000/dashboard", { headers: authHeaders() })
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) throw new Error(body.message || "Failed to load dashboard data");
        return body;
      })
      .then((body) => setStats(body.data))
      .catch((err) => setError(err.message));
  }, [navigate]);

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back</p>
          </div>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="dashboard-bottom-grid">
          <div className="dashboard-card employee-summary">
            <div className="card-header"><h3>👥 EMPLOYEE SUMMARY</h3></div>
            <div className="employee-stats">
              <div>
                <span>Total Employees</span>
                <strong>{stats ? stats.total_employees : "…"}</strong>
              </div>
              <div>
                <span>Total Departments</span>
                <strong>{stats ? stats.total_departments : "…"}</strong>
              </div>
              <div>
                <span>Total Users</span>
                <strong>{stats ? stats.total_users : "…"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
