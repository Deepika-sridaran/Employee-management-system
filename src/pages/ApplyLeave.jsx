import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import { applyLeave } from "../services/leaveServices.js";
import LeaveUsageCard from "../components/LeaveUsageCard.jsx";

function ApplyLeave() {
    const navigate = useNavigate();
    const location = useLocation();

    const [leaveType, setLeaveType] = useState("");
    const [startDate, setStartDate] = useState(location.state?.prefillDate || "");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!leaveType || !startDate || !endDate) {
            alert("Leave type, start date, and end date are required");
            return;
        }

        setLoading(true);
        try {
            await applyLeave({
                leave_type: leaveType,
                start_date: startDate,
                end_date: endDate,
                reason,
            });
            alert("Leave applied successfully!");
            navigate("/my-leaves");
        } catch (error) {
            alert(error.message || "Failed to apply for leave");
        } finally {
            setLoading(false);
        }
    }

    return (
        <MainLayout>
            <div className="page-container page-bg-approvals">
                <div className="page-header">
                    <h1>Apply for Leave</h1>
                    <p>Submit a new leave request</p>
                </div>

                <LeaveUsageCard />

                <div className="ui-card" style={{ maxWidth: "600px" }}>
                    <form onSubmit={handleSubmit}>
                        <div className="field-group">
                            <label>Leave Type</label>
                            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                                <option value="">Select Leave Type</option>
                                <option value="Sick Leave">Sick Leave</option>
                                <option value="Casual Leave">Casual Leave</option>
                                <option value="Earned Leave">Earned Leave</option>
                            </select>
                        </div>
                        <div className="field-group">
                            <label>Start Date</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label>End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label>Reason</label>
                            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Submitting…" : "Apply for Leave"}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}

export default ApplyLeave;
