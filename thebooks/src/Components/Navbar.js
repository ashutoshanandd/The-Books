import "../index.css";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const userLoggedIn = localStorage.getItem("token");          
  const adminLoggedIn = localStorage.getItem("isAdminLoggedIn"); 
  const handleUserLogout = () => {
    localStorage.removeItem("token");
    navigate("/logging");
    window.location.reload();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
    window.location.reload();
  };

  return (
    <nav>
      <div className="navbar-container">
        <h2 className="navbar-title">The Books</h2>

        <div className="navbar-buttons">
          <div className="left-buttons">
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/books")}>Books</button>
            <button onClick={() => navigate("/about")}>About Us</button>

          

            
            {!userLoggedIn && !adminLoggedIn && (
              <button onClick={() => navigate("/admin/login")}>
                Admin Login
              </button>
            )}

            
            {adminLoggedIn && (
              <button onClick={() => navigate("/admin/dashboard")}>
                Admin Panel
              </button>
            )}

           
            {userLoggedIn && (
              <button onClick={() => navigate("/my-borrows")}>
                My Borrowed Books
              </button>
            )}
          </div>

          <div className="right-buttons">
           
            {userLoggedIn && (
              <button onClick={handleUserLogout}>Logout</button>
            )}

          
            {adminLoggedIn && (
              <button onClick={handleAdminLogout}>Admin Logout</button>
            )}

           
            {!userLoggedIn && !adminLoggedIn && (
              <button onClick={() => navigate("/logging")}>
                Login / Sign-Up
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
