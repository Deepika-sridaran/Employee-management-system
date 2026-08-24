import { useState } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import {
    getTodayRecord, checkIn, checkOut, getAllRecordsForUser,
    getAllRecordsForToday, getMonthlyTotals, requestPermission,
    getUsedPermissionHours, PERMISSION_LIMIT,
} from "../data/attendanceStore.js";

function Attendance() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    const [cycleType, setCycleType] = useState("calendar");
    const [today, setToday] = useState(() => getTodayRecord(user.user_id));
    const [myRecords, setMyRecords] = useState(() => getAllRecordsForUser(user.user_id));
    const [allToday, setAllToday] = useState(() => isAdmin ? getAllRecordsForToday() : []);
    const [monthly, setMonthly] = useState(() => getMonthlyTotals(user.user_id, "calendar"));
    const [permHours, setPermHours] = useState("");
    const [permDate, setPermDate] = useState("");
    const [permReason, setPermReason] = useState("");
    const [usedPermHours, setUsedPermHours] = useState(() => getUsedPermissionHours(user.user_id));

    function refresh() {
        setToday(getTodayRecord(user.user_id));
        setMyRecords(getAllRecordsForUser(user.user_id));
        setMonthly(getMonthlyTotals(user.user_id, cycleType));
        setUsedPermHours(getUsedPermissionHours(user.user_id));

        if (isAdmin) {
            setAllToday(getAllRecordsForToday());
        }
    }

    function handleCheckIn() {
        checkIn(user.user_id, user.full_name);
        refresh();
    }

    function handleCheckOut() {
        checkOut(user.user_id);
        refresh();
    }

    function handlePermissionRequest(e) {
        e.preventDefault();
        if (!permDate || !permHours) {
            alert("Date and hours are required");
            return;
        }
        if (usedPermHours + Number(permHours) > PERMISSION_LIMIT) {
            alert(`This would exceed your monthly permission limit of ${PERMISSION_LIMIT} hours.`);
            return;
        }
        requestPermission(user.user_id, permDate, permHours, permReason);
        setPermDate(""); setPermHours(""); setPermReason("");
        refresh();
    }

    const rows = isAdmin ? allToday : myRecords;

    return (
        <MainLayout>
            <div className="page-container page-bg-time">
                <div className="page-header">
                    <h1>Attendance</h1>
                </div>

                {!isAdmin && (
                    <div className="ui-card">
                        <h3 style={{ marginTop: 0, color: "var(--ems-navy)" }}>Today — {new Date().toDateString()}</h3>
                        {today ? (
                            <div>
                                <p>Check-in: <strong>{today.checkIn}</strong> {today.isLate && <span className="ui-badge danger">Late</span>}</p>
                                <p>Check-out: <strong>{today.checkOut || "Not checked out yet"}</strong> {today.isEarlyLogout && <span className="ui-badge warning">Early</span>}</p>
                                {today.totalHours && <p>Total hours: <strong>{today.totalHours}</strong></p>}
                                {!today.checkOut && <button className="btn btn-primary" onClick={handleCheckOut}>Check Out</button>}
                            </div>
                        ) : (
                            <button className="btn btn-amber" onClick={handleCheckIn}>Check In</button>
                        )}
                    </div>
                )}

                <div className="ui-card">
                    <h3 style={{ marginTop: 0, color: "var(--ems-navy)" }}>Monthly Summary</h3>
                    <div className="field-group" style={{ maxWidth: "280px" }}>
                        <label>Attendance Cycle</label>
                        <select
                        value={cycleType}
                        onChange={(e) => {
                        const newCycleType = e.target.value;
                        setCycleType(newCycleType);
                        setMonthly(
                        getMonthlyTotals(user.user_id, newCycleType)
                        );
                    }}
                        >
                        <option value="calendar">1st – End of Month</option>
                        <option value="custom">21st – 20th</option>
                    </select>
                    </div>
                    {monthly && (
                        <div className="form-grid" style={{ marginTop: "8px" }}>
                            <p>Days present: <strong>{monthly.daysPresent}</strong></p>
                            <p>Total hours: <strong>{monthly.totalHours}</strong></p>
                            <p>Late arrivals: <strong>{monthly.lateCount}</strong></p>
                            <p>Early logouts: <strong>{monthly.earlyLogoutCount}</strong></p>
                        </div>
                    )}
                </div>

                <div className="ui-card">
                    <h3 style={{ marginTop: 0, color: "var(--ems-navy)" }}>Permission Management</h3>
                    <p>Used this month: <strong>{usedPermHours}</strong> / {PERMISSION_LIMIT} hours</p>
                    <form onSubmit={handlePermissionRequest} className="form-grid">
                        <div className="field-group">
                            <label>Date</label>
                            <input type="date" value={permDate} onChange={(e) => setPermDate(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label>Hours</label>
                            <input type="number" step="0.5" value={permHours} onChange={(e) => setPermHours(e.target.value)} />
                        </div>
                        <div className="field-group">
                            <label>Reason</label>
                            <input type="text" value={permReason} onChange={(e) => setPermReason(e.target.value)} />
                        </div>
                        <div style={{ alignSelf: "end", marginBottom: "16px" }}>
                            <button type="submit" className="btn btn-primary">Request</button>
                        </div>
                    </form>
                </div>

                <div className="ui-card">
                    <h3 style={{ marginTop: 0, color: "var(--ems-navy)" }}>
                        {isAdmin ? "Today — All Employees" : "My Attendance History"}
                    </h3>
                    {rows.length === 0 ? (
                        <div className="ui-empty">No attendance records yet.</div>
                    ) : (
                        <div className="ui-table-wrap">
                            <table className="ui-table">
                                <thead>
                                    <tr>
                                        {isAdmin && <th>Employee</th>}
                                        <th>Date</th><th>Check-in</th><th>Check-out</th><th>Hours</th><th>Flags</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((r, i) => (
                                        <tr key={i}>
                                            {isAdmin && <td>{r.userName}</td>}
                                            <td>{r.date}</td>
                                            <td>{r.checkIn}</td>
                                            <td>{r.checkOut || "—"}</td>
                                            <td>{r.totalHours || "—"}</td>
                                            <td>
                                                {r.isLate && <span className="ui-badge danger">Late</span>}{" "}
                                                {r.isEarlyLogout && <span className="ui-badge warning">Early</span>}
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

export default Attendance;
