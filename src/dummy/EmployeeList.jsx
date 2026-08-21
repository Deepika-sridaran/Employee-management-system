import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import { getAllEmployees, deleteEmployee } from "../services/employeeServices.js";

function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEmployees() {
            try {
                const data = await getAllEmployees();
                setEmployees(data);
            } catch (err) {
                if (err.message.toLowerCase().includes("admin")) {
                    setError("You don't have permission to view the employee list. This page is available to administrators only.");
                } else {
                    setError("Failed to load employees. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        }
        loadEmployees();
    }, []);

    async function handleDelete(employeeId) {
        if (!window.confirm("Delete this employee?")) return;
        try {
            await deleteEmployee(employeeId);
            setEmployees((prev) => prev.filter((e) => e.employee_id !== employeeId));
        } catch (err) {
            alert("Failed to Delete Employee :" +err.message);
        }
    }

    if (error) {
        return (
            <MainLayout>
                <div className="page-container">
                    <div className="ui-card" style={{ textAlign: "center", padding: "48px 24px" }}>
                        <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔒</div>
                        <h2 style={{ color: "var(--ems-navy)", marginBottom: "8px" }}>Access Restricted</h2>
                        <p style={{ color: "var(--ems-slate-soft)" }}>{error}</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="page-container">
                <div className="page-header">
                    <h1>Employee List</h1>
                    <p>{employees.length} employee{employees.length !== 1 ? "s" : ""} total</p>
                </div>

                <div className="ui-card">
                    {loading ? (
                        <div className="ui-empty">Loading…</div>
                    ) : employees.length === 0 ? (
                        <div className="ui-empty">No employees found.</div>
                    ) : (
                        <div className="ui-table-wrap">
                            <table className="ui-table">
                                <thead>
                                    <tr>
                                        <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
                                        <th>Department</th><th>Designation</th><th>Address</th><th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((employee) => (
                                        <tr key={employee.employee_id}>
                                            <td>{employee.employee_id}</td>
                                            <td>{employee.first_name} {employee.last_name}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.phone}</td>
                                            <td>{employee.department_id ?? "—"}</td>
                                            <td>{employee.designation}</td>
                                            <td>{employee.address}</td>
                                            <td>
                                                <button className="btn btn-outline btn-sm" onClick={() => navigate(`/edit-employee/${employee.employee_id}`)}>Edit</button>{" "}
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(employee.employee_id)}>Delete</button>
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

export default EmployeeList;
