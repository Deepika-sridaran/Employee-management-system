import {useState} from "react";
import {useNavigate} from "react-router-dom";

function EditEmployee() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");

    function handleUpdate(e) {
        e.preventDefault();

        if(name === ""){
            alert("Please enter employee name");
            return;
        }
        if(email === ""){
            alert("Please enter employee email");
            return;
        }
        if(phone === ""){
            alert("Please enter employee phone");
            return;
        }
        if(department === ""){
            alert("Please select department");
            return;
        }
        if(designation === ""){
            alert("Please select designation");
            return;
        }
        alert(
            "Employee updated successfully!\n\n" +
            "Name: " + name + "\n" +
            "Email: " + email + "\n" +
            "Phone: " + phone + "\n" +
            "Department: " + department + "\n" +
            "Designation: " + designation
        );
        navigate("/employee-list");
    }
    return (
        <div>
            <h1>Edit Employee</h1>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <br/>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <br/>
                <div>
                    <label>Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <br/>
                <div>
                    <label>Department</label>
                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    >
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Testing">Testing</option>
                    </select>
                </div>
                <br/>
                <div>
                    <label>Designation</label>
                    <br/>
                    <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    />
                </div>
                <br/>
                <button type="submit">Update Employee</button>
                <button type="button" onClick={() => navigate("/employee-list")}>
                    cancel
                </button>
            </form>
        </div>
    );
}
export default EditEmployee;
