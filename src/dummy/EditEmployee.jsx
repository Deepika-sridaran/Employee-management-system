import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import { getAllEmployees, updateEmployee, getAllDepartments } from "../services/employeeServices.js";

function EditEmployee() {
    const navigate = useNavigate();
    const { id } = useParams();

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
        getAllDepartments().then(setDepartments).catch(console.error);
    }, []);

    useEffect(() => {
        async function loadEmployee() {
            try {
                const employees = await getAllEmployees();
                const employee = employees.find((e) => e.employee_id === Number(id));
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
                address,
            });
            alert("Employee updated successfully!");
            navigate("/employee-list");
        } catch (error) {
            alert("Failed to update: " + error.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="page-container">Loading employee…</div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="page-container">
                <div className="page-header">
                    <h1>Edit Employee</h1>
                    <p>Update this employee's details</p>
                </div>

                <div className="ui-card" style={{ maxWidth: "700px" }}>
                    <form onSubmit={handleUpdate}>
                        <div className="form-grid">
                            <div className="field-group">
                                <label>First Name</label>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="field-group">
                                <label>Last Name</label>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="field-group">
                                <label>Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="field-group">
                                <label>Phone</label>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="field-group">
                                <label>Department</label>
                                <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                                    <option value="">Select Department</option>
                                    {departments.map((d) => (
                                        <option key={d.department_id} value={d.department_id}>{d.department_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field-group">
                                <label>Designation</label>
                                <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                            </div>
                            <div className="field-group">
                                <label>Salary</label>
                                <input type="number" step="0.01" value={salary} onChange={(e) => setSalary(e.target.value)} />
                            </div>
                            <div className="field-group">
                                <label>Address</label>
                                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? "Saving…" : "Update Employee"}
                        </button>{" "}
                        <button type="button" className="btn btn-outline" onClick={() => navigate("/employee-list")}>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
export default EditEmployee;