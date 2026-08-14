import logo from "../assets/logo.svg";

function Navbar() {
  return (
    <div className="app-navbar">
      <img src={logo} alt="EMS logo" />
      <h2>Employee Leave Management System</h2>
    </div>
  );
}
export default Navbar;