import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout.jsx";
import { getAllDepartments } from "../services/employeeServices.js";

function Departments() {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        getAllDepartments().then(setDepartments).catch(console.error);
    }, []);

    return (
        <MainLayout>
            <div className="page-container">
                <div className="page-header">
                    <h1>Departments</h1>
                    <p>{departments.length} department{departments.length !== 1 ? "s" : ""}</p>
                </div>

                <div className="ui-card">
                    {departments.length === 0 ? (
                        <div className="ui-empty">No departments found.</div>
                    ) : (
                        <div className="ui-table-wrap">
                            <table className="ui-table">
                                <thead><tr><th>ID</th><th>Name</th></tr></thead>
                                <tbody>
                                    {departments.map((d) => (
                                        <tr key={d.department_id}>
                                            <td>{d.department_id}</td>
                                            <td>{d.department_name}</td>
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

export default Departments;