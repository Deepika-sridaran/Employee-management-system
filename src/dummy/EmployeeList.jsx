import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import { getAllEmployees, deleteEmployee } from "../services/employeeServices.js";

function EmployeeList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        async function loadEmployees() {
            try {
                const data = await getAllEmployees();
                setEmployees(data);
            } catch (error) {
                console.error("Error loading employees:", error);
                alert("Failed to Load Employees");
            }
        }
        loadEmployees();
    }, []);

    async function handleDelete(employeeId) {
        try {
            await deleteEmployee(employeeId);
            setEmployees((previous) =>
                previous.filter((employee) => employee.employee_id !== employeeId)
            );
            alert("Employee Deleted Successfully");
        } catch (error) {
            console.error("Error deleting employee:", error);
            alert("Failed to Delete Employee");
        }
    }

    return (
        <MainLayout>
            <div style={{ padding: "20px"}}>
    <div style={{ padding: "20px" }}>
        <h1>Employee List</h1>
        <div style={{ overflowX: "auto" }}>
            <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Address</th>
                        <th>Actions</th>
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
                                <button onClick={() => navigate(`/edit-employee/${employee.employee_id}`)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(employee.employee_id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    </div>
        </MainLayout>
  );
}
export default EmployeeList;
