import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Sidebar from "../components/Sidebar.jsx";

function MainLayout({ children }) {
    return (
        <div>
            <Navbar />
            <div style={{ 
                display: "flex" 
                }}
            >
                <Sidebar />
                <div style={{ 
                    flex: 1, 
                    padding: "20px" 
                    }}
                >
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
}
export default MainLayout;
