import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { getAllDepartments, getAllEmployees } from "../services/employeeServices.js";

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [expandedDeptId, setExpandedDeptId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getAllDepartments(), getAllEmployees()])
            .then(([deptData, empData]) => {
                setDepartments(deptData);
                setEmployees(empData);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    function employeesInDepartment(departmentId) {
        return employees.filter((e) => e.department_id === departmentId);
    }

    function handleToggle(departmentId) {
        setExpandedDeptId(expandedDeptId === departmentId ? null : departmentId);
    }

    return (
        <MainLayout>
            <div className="page-container">
                <div className="page-header">
                    <h1>Departments</h1>
                    <p>{departments.length} department{departments.length !== 1 ? "s" : ""} — click one to see its employees</p>
                </div>

                <div className="ui-card">
                    {loading ? (
                        <div className="ui-empty">Loading…</div>
                    ) : departments.length === 0 ? (
                        <div className="ui-empty">No departments found.</div>
                    ) : (
                        <div className="ui-table-wrap">
                            <table className="ui-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Employee Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.map((d) => {
                                        const deptEmployees = employeesInDepartment(d.department_id);
                                        const isExpanded = expandedDeptId === d.department_id;
                                        return (
                                            <>
                                                <tr
                                                    key={d.department_id}
                                                    onClick={() => handleToggle(d.department_id)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <td>{d.department_id}</td>
                                                    <td style={{ color: "var(--ems-navy)", fontWeight: 600 }}>
                                                        {isExpanded ? "▾ " : "▸ "}{d.department_name}
                                                    </td>
                                                    <td>{deptEmployees.length}</td>
                                                </tr>
                                                {isExpanded && (
                                                    <tr key={`${d.department_id}-detail`}>
                                                        <td colSpan="3" style={{ background: "var(--ems-mist)", padding: "16px" }}>
                                                            {deptEmployees.length === 0 ? (
                                                                <span style={{ color: "var(--ems-slate-soft)" }}>
                                                                    No employees in this department yet.
                                                                </span>
                                                            ) : (
                                                                <table className="ui-table" style={{ minWidth: "0" }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Name</th>
                                                                            <th>Designation</th>
                                                                            <th>Email</th>
                                                                            <th>Phone</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {deptEmployees.map((e) => (
                                                                            <tr key={e.employee_id}>
                                                                                <td>{e.first_name} {e.last_name}</td>
                                                                                <td>{e.designation}</td>
                                                                                <td>{e.email}</td>
                                                                                <td>{e.phone}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
export default Departments;
