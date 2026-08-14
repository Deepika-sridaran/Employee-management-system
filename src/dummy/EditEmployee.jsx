import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllEmployees, updateEmployee, getAllDepartments } 
from "../services/employeeServices.js";

function EditEmployee() {
    const navigate = useNavigate();
    const { id } = useParams(); // matches the :id in your route, e.g. /edit-employee/:id

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [designation, setDesignation] = useState("");
    const [departments, setDepartments] = useState([]);
    const [salary, setSalary] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
    getAllDepartments().then(setDepartments).catch(console.error);}, []);

    useEffect(() => {
        async function loadEmployee() {
            try {
                const employees = await getAllEmployees();
                const employee = employees.find(
                    (e) => e.employee_id === Number(id)
                );
                if (!employee) {
                    alert("Employee not found");
                    navigate("/employee-list");
                    return;
                }
                setFirstName(employee.first_name || "");
                setLastName(employee.last_name || "");
                setEmail(employee.email || "");
                setPhone(employee.phone || "");
                setDepartmentId(employee.department_id ?? "");
                setDesignation(employee.designation || "");
                setSalary(employee.salary ?? "");
                setAddress(employee.address || "");
            } catch (error) {
                alert("Failed to load employee: " + error.message);
                navigate("/employee-list");
            } finally {
                setLoading(false);
            }
        }
        loadEmployee();
    }, [id, navigate]);

    async function handleUpdate(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await updateEmployee(id, {
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                department_id: departmentId ? Number(departmentId) : null,
                designation,
                salary: salary ? Number(salary) : null,
                address,});
            alert("Employee updated successfully!");
            navigate("/employee-list");
        } catch (error) {
            alert("Failed to update: " + error.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div>Loading employee…</div>;

    return (
        <div>
            <h1>Edit Employee</h1>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <br />
                <div>
                    <label>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <br />
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <br />
                <div>
                    <label>Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <br />
                <div>
                    <label>Department</label>
                    <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>
                    {d.department_name}
                    </option>))}
                    </select>
                </div>
                <br />
                <div>
                    <label>Designation</label>
                    <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                </div>
                <br />
                <button type="submit" disabled={saving}>{saving ? "Saving…" : "Update Employee"}</button>
                <button type="button" onClick={() => navigate("/employee-list")}>Cancel</button>
            </form>
        </div>
    );
}
export default EditEmployee;