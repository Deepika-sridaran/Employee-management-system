import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getAllEmployees,deleteEmployee} from "../services/employeeServices.js";

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
        loadEmployees();}, []);

    async function handleDelete(id) {
        try {
            await deleteEmployee(id);
            setEmployees((previousEmployees) =>
                previousEmployees.filter(
                    (employee) => employee.id !== id));
            alert("Employee Deleted Successfully");
        } catch (error) {
            console.error("Error deleting employee:", error);
            alert("Failed to Delete Employee");
        }
    }
    return (
        <div>
            <h1>Employee List</h1>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {employees.map((employee) => (

                        <tr key={employee.id}>

                            <td>{employee.id}</td>

                            <td>{employee.name}</td>

                            <td>{employee.email}</td>

                            <td>{employee.phone}</td>

                            <td>{employee.department}</td>

                            <td>{employee.designation}</td>

                            <td>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/edit-employee/${employee.id}`
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(employee.id)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default EmployeeList;
