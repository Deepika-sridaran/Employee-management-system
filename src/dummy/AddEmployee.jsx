import MainLayout from "../layouts/MainLayout.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee, getAllDepartments } from "../services/employeeServices.js";

function AddEmployee() {
    const [userId, setUserId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [designation, setDesignation] = useState("");
    const [departments, setDepartments] = useState([]);
    const [salary, setSalary] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {getAllDepartments().then(setDepartments).catch(console.error);}, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!userId || !firstName || !lastName || !email) {
            alert("User ID, First Name, Last Name, and Email are required");
            return;
        }

        setLoading(true);
        try {
            await createEmployee({
            user_id: Number(userId),
            first_name: firstName,
            last_name: lastName,
            email,
            phone: phone || undefined,
            department_id: departmentId ? Number(departmentId) : undefined,
            designation: designation || undefined,
            salary: salary ? Number(salary) : undefined,
            address: address || undefined,});
            alert("Employee added successfully!");
            navigate("/employee-list");
        } catch (error) {
            alert(error.message || "Failed to add employee");
        } finally {
            setLoading(false);
        }
    }

    return (
        <MainLayout>
        <div className="page-container page-bg-people">
            <div className="page-header">
                <h1>Add Employee</h1>
                <p>Create a new employee profile</p>
            </div>

            <div className="ui-card" style={{ maxWidth: "700px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-grid"></div>
                        <div className="field-group">
                    <label>User ID (must already be registered):</label><br />
                    <input
                        type="number"
                        placeholder="e.g. 1 (check users table in Workbench)"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <label>First Name:</label><br />
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <label>Last Name:</label><br />
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <label>Phone (exactly 10 digits):</label><br />
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <label>Designation:</label><br />
                    <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    />
                </div>
                <br />
                <div>
                <label>Salary:</label><br />
                <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 45000"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                />
                </div>
                <br />
                <div>
                <label>Address:</label><br />
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                </div>
                <br />
                <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                <option value="">Select Department</option>
                    {departments.map((d) => (
                <option key={d.department_id} value={d.department_id}>
                    {d.department_name}
                </option>))}
                </select>
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Adding…" : "Add Employee"}
                </button>
            </form>
            </div>
            </div>
        </MainLayout>
    );
}

export default AddEmployee;
