import { useState, useEffect } from "react";
import { getProfileExtras, saveProfileExtras } from "../data/profileExtras.js";

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
    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfJoining, setDateOfJoining] = useState("");
    const [employeeStatus, setEmployeeStatus] = useState("Active");
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
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const extras = getProfileExtras(user.user_id);
                const employee = body.data;
                setFirstName(employee.first_name || "");
                setLastName(employee.last_name || "");
                setEmail(employee.email || "");
                setPhone(employee.phone || "");
                setAddress(employee.address || "");
                setDesignation(employee.designation || "");
                setDateOfBirth(extras.dateOfBirth);
                setGender(extras.gender);
                setDateOfJoining(extras.dateOfJoining);
                setEmployeeStatus(extras.employeeStatus);
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

    function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    }

    async function handleSave() {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        saveProfileExtras(user.user_id, { dateOfBirth, gender, dateOfJoining, employeeStatus });
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

    async function handlePhotoUpload() {
    if (!photoFile) {
        alert("Choose a photo first");
        return;
    }
    setUploadingPhoto(true);
    try {
        const formData = new FormData();
        formData.append("photo", photoFile);

        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:5000/profile/photo", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const body = await response.json();
        if (!response.ok) {
            throw new Error(body.message || "Failed to upload photo");
        }

        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        storedUser.profile_image = body.profile_image;
        localStorage.setItem("user", JSON.stringify(storedUser));

        alert("Profile photo updated!");
        setPhotoFile(null);
    } catch (error) {
        alert(error.message);
    } finally {
        setUploadingPhoto(false);
    }
    }

    if (loading) return <div>Loading profile…</div>;
    if (error && !isEditing) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div>
            <h1>My Profile</h1>
            <h2>Employee Details</h2>

            <div style={{ marginBottom: "20px" }}>
    <img
        src={
            photoPreview ||
            (JSON.parse(localStorage.getItem("user") || "{}").profile_image
                ? `http://127.0.0.1:5000/uploads/${JSON.parse(localStorage.getItem("user")).profile_image}`
                : "https://via.placeholder.com/120?text=No+Photo")
        }
        alt="Profile"
        style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", display: "block", marginBottom: "10px" }}
    />
    <input type="file" accept="image/png, image/jpeg" onChange={handlePhotoChange} />
    <button onClick={handlePhotoUpload} disabled={uploadingPhoto || !photoFile} style={{ marginLeft: "10px" }}>
        {uploadingPhoto ? "Uploading…" : "Upload Photo"}
    </button>
    </div>
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
                <label>Date of Birth</label><br />
                <input type="date" value={dateOfBirth} disabled={!isEditing} onChange={(e) => setDateOfBirth(e.target.value)} />
            </div>
            <br />
            <div>
                <label>Gender</label><br />
                <select value={gender} disabled={!isEditing} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                </select>
            </div>
            <br />
            <div>
                <label>Date of Joining</label><br />
                <input type="date" value={dateOfJoining} disabled={!isEditing} onChange={(e) => setDateOfJoining(e.target.value)} />
            </div>
            <br />
            <div>
                <label>Employee Status</label><br />
                <select value={employeeStatus} disabled={!isEditing} onChange={(e) => setEmployeeStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Resigned">Resigned</option>
                <option value="Terminated">Terminated</option>
            </select>
            </div>
            <br />
                {/* TODO: once backend adds these columns to users/employees, replace
                    getProfileExtras/saveProfileExtras with real GET/PUT /profile fields */}
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
