import { useEffect, useState } from "react";
import { getMyLeaves } from "../services/leaveServices.js";

const MONTHLY_LIMIT = 6; // must match MONTHLY_LEAVE_LIMIT in leave_controller.py

function daysBetween(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    return Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

function LeaveUsageCard() {
    const [usedDays, setUsedDays] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getMyLeaves()
            .then((leaves) => {
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth(); // 0-indexed

                const monthStart = new Date(currentYear, currentMonth, 1);
                const monthEnd = new Date(currentYear, currentMonth + 1, 0);

                let total = 0;
                leaves
                    .filter((l) => l.status === "Pending" || l.status === "Approved")
                    .forEach((l) => {
                        const start = new Date(l.start_date);
                        const end = new Date(l.end_date);
                        // Only count the overlap between this leave and the current month
                        const overlapStart = start > monthStart ? start : monthStart;
                        const overlapEnd = end < monthEnd ? end : monthEnd;
                        if (overlapStart <= overlapEnd) {
                            total += daysBetween(
                                overlapStart.toISOString().split("T")[0],
                                overlapEnd.toISOString().split("T")[0]
                            );
                        }
                    });

                setUsedDays(total);
            })
            .catch((err) => setError(err.message));
    }, []);

    if (error) return null; // fail silently — this is a helper widget, not critical
    if (usedDays === null) return null;

    const remaining = Math.max(MONTHLY_LIMIT - usedDays, 0);
    const percentUsed = Math.min((usedDays / MONTHLY_LIMIT) * 100, 100);
    const isOverLimit = usedDays >= MONTHLY_LIMIT;

    return (
        <div className="dashboard-card" style={{ marginBottom: "20px" }}>
            <div className="card-header">
                <h3>🗓️ MONTHLY LEAVE USAGE</h3>
            </div>
            <div style={{ marginBottom: "8px", fontSize: "14px", color: "var(--ems-slate)" }}>
                <strong>{usedDays}</strong> of <strong>{MONTHLY_LIMIT}</strong> days used this month
                {" — "}
                <span style={{ color: isOverLimit ? "var(--ems-red)" : "var(--ems-teal)" }}>
                    {remaining} day{remaining !== 1 ? "s" : ""} remaining
                </span>
            </div>
            <div style={{ background: "var(--ems-mist)", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
                <div
                    style={{
                        width: `${percentUsed}%`,
                        height: "100%",
                        background: isOverLimit ? "var(--ems-red)" : "var(--ems-amber)",
                        transition: "width 0.3s ease",
                    }}
                />
            </div>
            {isOverLimit && (
                <p style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--ems-red)" }}>
                    You've reached your monthly limit — new requests this month will be rejected until some free up.
                </p>
            )}
        </div>
    );
}

export default LeaveUsageCard;