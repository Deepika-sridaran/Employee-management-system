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
            <div style={{ padding: "20px" }}>
                <h1>Departments</h1>
                <table border="1" cellPadding="10" style={{ width: "100%" }}>
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
        </MainLayout>
    );
}

export default Departments;