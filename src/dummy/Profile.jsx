import { useState } from "react";

function Profile(){
    const [name, setName] = useState("Pradeep Kumar S");
    const [email, setEmail] = useState("Pradeepkumar@gmail.com");
    const [phone, setPhone] = useState("9092940997");
    const [designation, setDesignation] = useState("Senior Software Engineer");
    const [isEditing, setIsEditing] = useState(false);

    function handleEdit(){
        setIsEditing(true);
    }
    function handleSave(){
        setIsEditing(false);
        alert("Profile Updated Successfully");
    }
    return(
        <div>
            <h1>My Profile</h1>
            <h2>Employee Details</h2>
            <div>

                <label>Name</label>
                <br/>
                <input
                type="text"
                value={name}
                disabled={!isEditing}
                onChange={(e) => setName(e.target.value)}
                />
            </div>
            <br/>
            <div>
                <label>Email</label>
                <br/>

                <input
                type="email"
                value={email}
                disabled={!isEditing}
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <br/>
            <div>
                <label>Phone</label>
                <br/>

                <input
                type="text"
                value={phone}
                disabled={!isEditing}
                onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <br/>
            <div>
                <label>Designation</label>
                <br/>

                <input
                type="text"
                value={designation}
                disabled={!isEditing}
                onChange={(e) => setDesignation(e.target.value)}
                />
            </div>
            <br/>
            {!isEditing ? (
                <button onClick={handleEdit}>Edit Profile</button>): 
                (<button onClick={handleSave}>Save Profile</button>)}
        </div>
    );
}
export default Profile;
