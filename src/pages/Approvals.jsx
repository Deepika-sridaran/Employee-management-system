import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { getAllLeaves, approveLeave, rejectLeave } from "../services/leaveServices.js";

function statusBadgeClass(status) {
    if (status === "Approved") return "active";
    if (status === "Rejected") return "danger";
    return "warning";
}

function Approvals() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    function loadLeaves() {
        getAllLeaves()
            .then(setLeaves)
            .catch((err) => alert(err.message))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadLeaves();
    }, []);

    async function handleApprove(id) {
        try {
            await approveLeave(id);
            loadLeaves();
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleReject(id) {
        const reason = window.prompt("Enter a reason for rejecting this leave request:");
        if (reason === null) return;
        if (!reason.trim()) {
            alert("A reason is required to reject a leave request.");
            return;
        }
        try {
            await rejectLeave(id, reason.trim());
            loadLeaves();
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <MainLayout>
            <div className="page-container">
                <div className="page-header">
                    <h1>Leave Approvals</h1>
                    <p>Review and act on pending leave requests</p>
                </div>

                <div className="ui-card">
                    {loading ? (
                        <div className="ui-empty">Loading…</div>
                    ) : leaves.length === 0 ? (
                        <div className="ui-empty">No leave requests yet.</div>
                    ) : (
                        <div className="ui-table-wrap">
                            <table className="ui-table">
                                <thead>
                                    <tr>
                                        <th>Employee</th><th>Type</th><th>Start Date</th>
                                        <th>End Date</th><th>Status</th><th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.map((leave) => (
                                        <tr key={leave.leave_id}>
                                            <td>{leave.employee_name} 
                                                <span style={{ color: "var(--ems-slate-soft)", fontSize: "12px" }}>
                                                    (ID: {leave.employee_id})</span></td>
                                            <td>{leave.leave_type}</td>
                                            <td>{leave.start_date}</td>
                                            <td>{leave.end_date}</td>
                                            <td><span className={`ui-badge ${statusBadgeClass(leave.status)}`}>{leave.status}</span></td>
                                            <td>
                                                {leave.status === "Pending" ? (
                                                    <>
                                                        <button className="btn btn-primary btn-sm" onClick={() => handleApprove(leave.leave_id)}>Approve</button>{" "}
                                                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(leave.leave_id)}>Reject</button>
                                                    </>
                                                ) : (
                                                    "—"
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default Approvals;
