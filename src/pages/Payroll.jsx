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
// eslint-disable-next-line react-hooks/set-state-in-effect -- syncing form state from external localStorage store when selection changes
        if (selectedUserId) setForm(getPayroll(selectedUserId)); // fixed: was discarding the result before
    }, [selectedUserId]);

    useEffect(() => {
        if (isAdmin) {
            getAllEmployees().then(setEmployees).catch(console.error);
        }
    }, [isAdmin]);

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
            <div className="page-container page-bg-money">
                <div className="page-header">
                    <h1>Payroll</h1>
                </div>

                {isAdmin && (
                    <div className="ui-card" style={{ maxWidth: "500px" }}>
                        <div className="field-group" style={{ marginBottom: 0 }}>
                            <label>Select Employee</label>
                            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                                <option value="">Choose…</option>
                                {employees.map((emp) => (
                                    <option key={emp.employee_id} value={emp.user_id}>
                                        {emp.first_name} {emp.last_name} (User #{emp.user_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {selectedUserId && (
                    <div className="ui-card" style={{ maxWidth: "500px" }}>
                        <div className="form-grid">
                            {fields.map(([key, label]) => (
                                <div className="field-group" key={key}>
                                    <label>{label}</label>
                                    <input
                                        type="number"
                                        value={form[key]}
                                        disabled={!isAdmin}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <hr style={{ border: "none", borderTop: "1px solid var(--ems-border)", margin: "8px 0 16px" }} />
                        <p>Gross Pay: <strong>{gross.toFixed(2)}</strong></p>
                        <p>Total Deductions: <strong>{deductions.toFixed(2)}</strong></p>
                        <p style={{ fontSize: "18px" }}>Net Pay: <strong style={{ color: "var(--ems-navy)" }}>{net.toFixed(2)}</strong></p>

                        {isAdmin && <button className="btn btn-primary" onClick={handleSave}>Save Payroll</button>}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default Payroll;
