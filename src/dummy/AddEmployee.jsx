import {useState} from "react";

function AddEmployee() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [password, setPassword] = useState("");
    const [designation, setDesignation] = useState("");

    function handleSubmit(e) {

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
        if(password === ""){
            alert("Please enter password");
            return;
        }
        if(designation === ""){
            alert("Please select designation");
            return;
        }

        alert(
            "Employee added successfully!\n\n" +
            "Name: " + name + "\n" +
            "Email: " + email + "\n" +
            "Phone: " + phone + "\n" +
            "Department: " + department + "\n" +
            "Designation: " + designation
        );
        setName("");
        setEmail("");
        setPhone("");
        setDepartment("");
        setPassword("");
        setDesignation("");
    }
    return (
        <div>
            <h1>Add Employee</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <br/>

                    <input
                        type="text"
                        placeholder="Enter employee name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <br/>
                <input
                    type="email"
                    placeholder="Enter employee email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br/>
                <div>
                    <label>Phone</label>
                    <br/>
                    <input
                        type="text"
                        placeholder="Enter employee phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        />
                </div>
                <br/>
                <div>
                    <label>Password</label>
                    <br/>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <br/>
                <div>
                    <label>Designation</label>
                    <br/>
                    <input
                        type="text"
                        placeholder="Enter designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    />
                    </div>
                <br/>
                <div>
                    <label>Department</label>
                    <br/>
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
                <button type="submit">Add Employee</button>
            </form>
        </div>
    );
}
export default AddEmployee;
