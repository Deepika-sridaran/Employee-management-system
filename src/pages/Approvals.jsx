import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { getAllLeaves, approveLeave, rejectLeave } from "../services/leaveServices.js";

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
        const reason = window.prompt("Enter a Reason for Rejecting this Leave Request: ")
        if (reason === null)
            return;
        if (!reason.trim()){
            alert("A Reason is Required to Reject a Leave Request.")
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
            <div style={{ padding: "20px" }}>
                <h1>Leave Approvals</h1>
                {loading ? (
                    <p>Loading…</p>
                ) : leaves.length === 0 ? (
                    <p>No leave requests yet.</p>
                ) : (
                    <table border="1" cellPadding="10" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th>Employee</th>
                                <th>Type</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave.leave_id}>
                                    <td>{leave.employee_name}</td>
                                    <td>{leave.leave_type}</td>
                                    <td>{leave.start_date}</td>
                                    <td>{leave.end_date}</td>
                                    <td>{leave.status}</td>
                                    <td>
                                        {leave.status === "Pending" ? (
                                            <>
                                                <button onClick={() => handleApprove(leave.leave_id)}>Approve</button>
                                                <button onClick={() => handleReject(leave.leave_id)}>Reject</button>
                                            </>
                                        ) : (
                                            "—"
                                        )}
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

export default Approvals;