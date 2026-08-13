import {useState} from "react";
import { useNavigate } from "react-router-dom";

function EmployeeList() {
    const navigate = useNavigate();
    function deleteEmployee(id) {
        const updatedEmployees = employees.filter((employee) => employee.id !== id);
        setEmployees(updatedEmployees);
    }
    
    const [employees, setEmployees] = useState([
            {
            id: 1,
            name: "Pradeep Kumar",
            email: "pradeep@gmail.com",
            phone: "9876543210",
            department: "IT",
            designation: "Software Engineer"
        },
        {
            id: 2,
            name: "Monisha",
            email: "monisha@gmail.com",
            phone: "9876543211",
            department: "HR",
            designation: "HR Executive"
        },
        {
            id: 3,
            name: "Priya",
            email: "priya@gmail.com",
            phone: "9876543212",
            department: "Finance",
            designation: "Accountant"
        }
    ]);
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
                                onClick={() => navigate(`/edit-employee/${employee.id}`)}>Edit</button>
                                <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default EmployeeList;
