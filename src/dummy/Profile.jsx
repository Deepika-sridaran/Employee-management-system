import { useState, useEffect } from "react";

function authHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

function Profile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [designation, setDesignation] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProfile() {
            try {
                const response = await fetch("http://127.0.0.1:5000/profile", {
                    headers: authHeaders(),
                });
                const body = await response.json();
                if (!response.ok) {
                    throw new Error(body.message || "Failed to load profile");
                }
                const employee = body.data;
                setFirstName(employee.first_name || "");
                setLastName(employee.last_name || "");
                setEmail(employee.email || "");
                setPhone(employee.phone || "");
                setAddress(employee.address || "");
                setDesignation(employee.designation || "");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    function handleEdit() {
        setIsEditing(true);
    }

    async function handleSave() {
        setSaving(true);
        setError("");
        try {
            const response = await fetch("http://127.0.0.1:5000/profile", {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    address,
                }),
            });
            const body = await response.json();
            if (!response.ok) {
                throw new Error(body.message || "Failed to update profile");
            }
            setIsEditing(false);
            alert("Profile Updated Successfully");
        } catch (err) {
            setError(err.message);
            alert("Failed to update profile: " + err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div>Loading profile…</div>;
    if (error && !isEditing) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div>
            <h1>My Profile</h1>
            <h2>Employee Details</h2>

            <div>
                <label>First Name</label><br />
                <input type="text" value={firstName} disabled={!isEditing} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <br />
            <div>
                <label>Last Name</label><br />
                <input type="text" value={lastName} disabled={!isEditing} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <br />
            <div>
                <label>Email</label><br />
                <input type="email" value={email} disabled={!isEditing} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <br />
            <div>
                <label>Phone</label><br />
                <input type="text" value={phone} disabled={!isEditing} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <br />
            <div>
                <label>Address</label><br />
                <input type="text" value={address} disabled={!isEditing} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <br />
            <div>
                <label>Designation (read-only)</label><br />
                <input type="text" value={designation} disabled />
            </div>
            <br />

            {!isEditing ? (
                <button onClick={handleEdit}>Edit Profile</button>
            ) : (
                <button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : "Save Profile"}
                </button>
            )}
        </div>
    );
}

export default Profile;