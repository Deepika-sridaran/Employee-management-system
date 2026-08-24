import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { getAllDepartments, getAllEmployees } from "../services/employeeServices.js";

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [expandedDeptId, setExpandedDeptId] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin = user?.role === "Admin";

    useEffect(() => {
        getAllDepartments()
            .then(setDepartments)
            .catch(console.error);

        // Employee-level detail (counts, expandable rows) is admin-only data —
        // employees just see the plain department list.
        if (isAdmin) {
            getAllEmployees()
                .then(setEmployees)
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- no second fetch needed for non-admins, safe to resolve loading immediately
            setLoading(false);
        }
    }, [isAdmin]);

    function employeesInDepartment(departmentId) {
        return employees.filter((e) => e.department_id === departmentId);
    }

    function handleToggle(departmentId) {
        if (!isAdmin) return;
        setExpandedDeptId(expandedDeptId === departmentId ? null : departmentId);
    }

    return (
        <MainLayout>
            <div className="page-container page-bg-people">
                <div className="page-header">
                    <h1>Departments</h1>
                    <p>
                        {departments.length} department{departments.length !== 1 ? "s" : ""}
                        {isAdmin ? " — click one to see its employees" : ""}
                    </p>
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
                                        {isAdmin && <th>Employee Count</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.map((d) => {
                                        const deptEmployees = isAdmin ? employeesInDepartment(d.department_id) : [];
                                        const isExpanded = expandedDeptId === d.department_id;
                                        return (
                                            <>
                                                <tr
                                                    key={d.department_id}
                                                    onClick={() => handleToggle(d.department_id)}
                                                    style={{ cursor: isAdmin ? "pointer" : "default" }}
                                                >
                                                    <td>{d.department_id}</td>
                                                    <td style={{ color: "var(--ems-navy)", fontWeight: 600 }}>
                                                        {isAdmin ? (isExpanded ? "▾ " : "▸ ") : ""}{d.department_name}
                                                    </td>
                                                    {isAdmin && <td>{deptEmployees.length}</td>}
                                                </tr>
                                                {isAdmin && isExpanded && (
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
