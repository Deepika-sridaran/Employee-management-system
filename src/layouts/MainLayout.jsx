import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <div className="app-content">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
export default MainLayout;