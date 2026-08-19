import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import { getMyLeaves, getAllLeaves } from "../services/leaveServices.js";
import "./Dashboard.css";
import CalendarCard from "../components/CalendarCard.jsx";

function authHeaders() {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
}

function statusClass(status) {
    if (status === "Approved") return "approved-status";
    if (status === "Rejected") return "rejected-status";
    return "pending-status";
}

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        // Org-wide stats are Admin-only on the backend — only fetch for admins.
        if (isAdmin) {
            fetch("http://127.0.0.1:5000/dashboard", { headers: authHeaders() })
                .then(async (res) => {
                    const body = await res.json();
                    if (!res.ok) throw new Error(body.message || "Failed to load dashboard data");
                    return body;
                })
                .then((body) => setStats(body.data))
                .catch((err) => setError(err.message));
        }

        const loadLeaves = isAdmin ? getAllLeaves : getMyLeaves;
        loadLeaves()
            .then((leaves) => setRecentLeaves(leaves.slice(0, 5)))
            .catch((err) => console.error(err));
    }, [navigate, isAdmin]);

    return (
        <MainLayout>
            <div className="dashboard">
                <div className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back{user ? `, ${user.full_name}` : ""}</p>
                    </div>
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <CalendarCard/>
                {/* {!isAdmin && <LeaveUsageCard />} */}
                    {isAdmin &&(
                    <div className="dashboard-bottom-grid">
                        <div className="dashboard-card employee-summary">
                            <div className="card-header"><h3>👥 EMPLOYEE SUMMARY</h3></div>
                            <div className="employee-stats">
                                <div><span>Total Employees</span><strong>{stats ? stats.total_employees : "…"}</strong></div>
                                <div><span>Total Departments</span><strong>{stats ? stats.total_departments : "…"}</strong></div>
                                <div><span>Total Users</span><strong>{stats ? stats.total_users : "…"}</strong></div>
                            </div>
                        </div>

                        <div className="dashboard-card leave-summary">
                            <div className="card-header"><h3>📊 LEAVE SUMMARY</h3></div>
                            <div className="summary-container">
                                <div className="summary-box">
                                    <span>Total</span>
                                    <strong>{stats ? stats.total_leaves : "…"}</strong>
                                </div>
                                <div className="summary-box pending">
                                    <span>Pending</span>
                                    <strong>{stats ? stats.pending_leaves : "…"}</strong>
                                </div>
                                <div className="summary-box approved">
                                    <span>Approved</span>
                                    <strong>{stats ? stats.approved_leaves : "…"}</strong>
                                </div>
                                <div className="summary-box rejected">
                                    <span>Rejected</span>
                                    <strong>{stats ? stats.rejected_leaves : "…"}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="dashboard-card recent-leaves">
                    <div className="card-header">
                        <h3>📋 {isAdmin ? "RECENT LEAVE REQUESTS" : "MY RECENT LEAVES"}</h3>
                    </div>

                    {recentLeaves.length === 0 ? (
                        <p style={{ color: "var(--ems-slate-soft)" }}>No leave requests yet.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    {isAdmin && <th>Employee</th>}
                                    <th>Leave Type</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentLeaves.map((leave) => (
                                    <tr key={leave.leave_id}>
                                        {isAdmin && <td>{leave.employee_name}</td>}
                                        <td>{leave.leave_type}</td>
                                        <td>{leave.start_date}</td>
                                        <td>{leave.end_date}</td>
                                        <td>
                                            <span className={`status ${statusClass(leave.status)}`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default Dashboard;