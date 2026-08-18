import logo from "../assets/logo.svg";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const avatarUrl = user?.profile_image
    ? `http://127.0.0.1:5000/uploads/${user.profile_image}`
    : null;

  return (
    <div className="app-navbar" style={{ justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img src={logo} alt="EMS logo" />
        <h2>Employee Leave Management System</h2>
      </div>
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Profile"
          style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
        />
      )}
    </div>
  );
}
export default Navbar;