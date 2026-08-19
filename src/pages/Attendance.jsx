import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import {
    getTodayRecord, checkIn, checkOut, getAllRecordsForUser,
    getAllRecordsForToday, getMonthlyTotals, requestPermission,
    getUsedPermissionHours, PERMISSION_LIMIT,
} from "../data/attendanceStore.js";

function Attendance() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    const [today, setToday] = useState(null);
    const [myRecords, setMyRecords] = useState([]);
    const [allToday, setAllToday] = useState([]);
    const [cycleType, setCycleType] = useState("calendar");
    const [monthly, setMonthly] = useState(null);
    const [permHours, setPermHours] = useState("");
    const [permDate, setPermDate] = useState("");
    const [permReason, setPermReason] = useState("");
    const [usedPermHours, setUsedPermHours] = useState(0);

     useEffect(refresh, [cycleType]);

    function refresh() {
        setToday(getTodayRecord(user.user_id));
        setMyRecords(getAllRecordsForUser(user.user_id));
        setMonthly(getMonthlyTotals(user.user_id, cycleType));
        setUsedPermHours(getUsedPermissionHours(user.user_id));
        if (isAdmin) setAllToday(getAllRecordsForToday());
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

    return (
        <MainLayout>
            <div style={{ padding: "20px" }}>
                <h1>Attendance</h1>
                <p style={{ color: "#888", fontSize: "13px" }}>
                    ⚠️ Demo data stored locally in your browser — will connect to the real backend once it's ready.
                </p>

                {!isAdmin && (
                    <div className="dashboard-card" style={{ marginBottom: "20px" }}>
                        <h3>Today — {new Date().toDateString()}</h3>
                        {today ? (
                            <div>
                                <p>Check-in: <strong>{today.checkIn}</strong> {today.isLate && <span style={{ color: "red" }}>(Late)</span>}</p>
                                <p>Check-out: <strong>{today.checkOut || "Not checked out yet"}</strong> {today.isEarlyLogout && <span style={{ color: "orange" }}>(Early)</span>}</p>
                                {today.totalHours && <p>Total hours: <strong>{today.totalHours}</strong></p>}
                                {!today.checkOut && <button onClick={handleCheckOut}>Check Out</button>}
                            </div>
                        ) : (
                            <button onClick={handleCheckIn}>Check In</button>
                        )}
                    </div>
                )}

                <div className="dashboard-card" style={{ marginBottom: "20px" }}>
                    <h3>Monthly Summary</h3>
                    <label>Attendance Cycle: </label>
                    <select value={cycleType} onChange={(e) => setCycleType(e.target.value)}>
                        <option value="calendar">1st – End of Month</option>
                        <option value="custom">21st – 20th</option>
                    </select>
                    {monthly && (
                        <div style={{ marginTop: "12px" }}>
                            <p>Days present: <strong>{monthly.daysPresent}</strong></p>
                            <p>Total hours: <strong>{monthly.totalHours}</strong></p>
                            <p>Late arrivals: <strong>{monthly.lateCount}</strong></p>
                            <p>Early logouts: <strong>{monthly.earlyLogoutCount}</strong></p>
                        </div>
                    )}
                </div>

                <div className="dashboard-card" style={{ marginBottom: "20px" }}>
                    <h3>Permission Management</h3>
                    <p>Used this month: <strong>{usedPermHours}</strong> / {PERMISSION_LIMIT} hours</p>
                    <form onSubmit={handlePermissionRequest}>
                        <input type="date" value={permDate} onChange={(e) => setPermDate(e.target.value)} />
                        <input type="number" step="0.5" placeholder="Hours" value={permHours} onChange={(e) => setPermHours(e.target.value)} style={{ width: "80px", marginLeft: "8px" }} />
                        <input type="text" placeholder="Reason" value={permReason} onChange={(e) => setPermReason(e.target.value)} style={{ marginLeft: "8px" }} />
                        <button type="submit" style={{ marginLeft: "8px" }}>Request</button>
                    </form>
                </div>

                <div className="dashboard-card">
                    <h3>{isAdmin ? "Today — All Employees" : "My Attendance History"}</h3>
                    <table border="1" cellPadding="8" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                {isAdmin && <th>Employee</th>}
                                <th>Date</th><th>Check-in</th><th>Check-out</th><th>Hours</th><th>Flags</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(isAdmin ? allToday : myRecords).map((r, i) => (
                                <tr key={i}>
                                    {isAdmin && <td>{r.userName}</td>}
                                    <td>{r.date}</td>
                                    <td>{r.checkIn}</td>
                                    <td>{r.checkOut || "—"}</td>
                                    <td>{r.totalHours || "—"}</td>
                                    <td>
                                        {r.isLate && <span style={{ color: "red" }}>Late </span>}
                                        {r.isEarlyLogout && <span style={{ color: "orange" }}>Early</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}

export default Attendance;
