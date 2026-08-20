import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { getMyLeaves } from "../services/leaveServices.js";

function statusBadgeClass(status) {
    if (status === "Approved") return "active";
    if (status === "Rejected") return "danger";
    return "warning";
}

function MyLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyLeaves()
            .then(setLeaves)
            .catch((err) => alert(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <MainLayout>
            <div className="page-container">
                <div className="page-header">
                    <h1>My Leave Requests</h1>
                    <p>Track the status of everything you've applied for</p>
                </div>

                <div className="ui-card">
                    {loading ? (
                        <div className="ui-empty">Loading…</div>
                    ) : leaves.length === 0 ? (
                        <div className="ui-empty">You haven't applied for any leave yet.</div>
                    ) : (
                        <div className="ui-table-wrap">
                            <table className="ui-table">
                                <thead>
                                    <tr>
                                        <th>Type</th><th>Start Date</th><th>End Date</th>
                                        <th>Reason</th><th>Status</th><th>Admin Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.map((leave) => (
                                        <tr key={leave.leave_id}>
                                            <td>{leave.leave_type}</td>
                                            <td>{leave.start_date}</td>
                                            <td>{leave.end_date}</td>
                                            <td>{leave.reason || "—"}</td>
                                            <td><span className={`ui-badge ${statusBadgeClass(leave.status)}`}>{leave.status}</span></td>
                                            <td>{leave.status === "Rejected" ? leave.rejection_reason : "—"}</td>
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

export default MyLeaves;
