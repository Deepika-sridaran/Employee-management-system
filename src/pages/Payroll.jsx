import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { getPayroll, savePayroll, calculateNetPay } from "../data/payrollStore.js";
import { getAllEmployees } from "../services/employeeServices.js";

function Payroll() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    const [employees, setEmployees] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(isAdmin ? "" : user.user_id);
    const [form, setForm] = useState(getPayroll(selectedUserId || user.user_id));

    useEffect(() => {
        if (isAdmin) {
            getAllEmployees().then(setEmployees).catch(console.error);
        }
    }, [isAdmin]);

    useEffect(() => {
        if (selectedUserId) (getPayroll(selectedUserId));
    }, [selectedUserId]);

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSave() {
        savePayroll(selectedUserId, form);
        alert("Payroll saved!");
    }

    const { gross, deductions, net } = calculateNetPay(form);
    const fields = [
        ["basicSalary", "Basic Salary"], ["hra", "HRA"], ["da", "DA"],
        ["bonus", "Bonus"], ["overtime", "Overtime"], ["pf", "PF"], ["tax", "Tax"],
    ];

    return (
        <MainLayout>
            <div style={{ padding: "20px" }}>
                <h1>Payroll</h1>
                <p style={{ color: "#888", fontSize: "13px" }}>
                    ⚠️ Demo data stored locally in your browser — will connect to the real backend once it's ready.
                </p>

                {isAdmin && (
                    <div style={{ marginBottom: "16px" }}>
                        <label>Select Employee (by User ID): </label>
                        <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                            <option value="">Choose…</option>
                            {employees.map((emp) => (
                                <option key={emp.employee_id} value={emp.user_id}>
                                    {emp.first_name} {emp.last_name} (User #{emp.user_id})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedUserId && (
                    <div className="dashboard-card">
                        {fields.map(([key, label]) => (
                            <div key={key} style={{ marginBottom: "10px" }}>
                                <label style={{ display: "inline-block", width: "120px" }}>{label}</label>
                                <input
                                    type="number"
                                    value={form[key]}
                                    disabled={!isAdmin}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                />
                            </div>
                        ))}

                        <hr />
                        <p>Gross Pay: <strong>{gross.toFixed(2)}</strong></p>
                        <p>Total Deductions: <strong>{deductions.toFixed(2)}</strong></p>
                        <p style={{ fontSize: "18px" }}>Net Pay: <strong>{net.toFixed(2)}</strong></p>

                        {isAdmin && <button onClick={handleSave}>Save Payroll</button>}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default Payroll;
