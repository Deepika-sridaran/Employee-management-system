import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { getMyLeaves } from "../services/leaveServices.js";

function statusStyle(status) {
    if (status === "Approved") return { background: "#E4F5EF", color: "#1E7A61" };
    if (status === "Rejected") return { background: "#FBE7E7", color: "#A32E2E" };
    return { background: "#FDF1DE", color: "#D48A1F" };
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
            <div style={{ padding: "20px" }}>
                <h1>My Leave Requests</h1>
                {loading ? (
                    <p>Loading…</p>
                ) : leaves.length === 0 ? (
                    <p>You haven't applied for any leave yet.</p>
                ) : (
                    <table border="1" cellPadding="10" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave.leave_id}>
                                    <td>{leave.leave_type}</td>
                                    <td>{leave.start_date}</td>
                                    <td>{leave.end_date}</td>
                                    <td>{leave.reason || "—"}</td>
                                    <td>
                                        <span style={{ ...statusStyle(leave.status), padding: "3px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 600 }}>
                                            {leave.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </MainLayout>
    );
}

export default MyLeaves;