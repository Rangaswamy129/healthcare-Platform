import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHome, FaTachometerAlt,FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function Navbar() {

const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);



 return (
   <nav className="navbar">
      {/* Left Side */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" className="nav-link">
    <FaHome style={{ marginRight: "6px" }} />
    Home </Link>
       <Link to="/dashboard" className="nav-link">
    <FaTachometerAlt style={{ marginRight: "6px" }} />
    Dashboard
  </Link>
      </div>
<div>
      {/* Right Side */}
    {user ? (
  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
    <span style={{ color: "white", fontWeight: "bold" }}>
      👤 {user.name}
    </span>

    <button
      onClick={() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.reload(); // refresh UI
      }}
      style={{
        background: "red",
        color: "white",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      Logout
    </button>
  </div>
) : (
  <>
    <Link to="/login" className="nav-link">
      <FaSignInAlt style={{ marginRight: "6px" }} />
      Login
    </Link>
         <Link to="/register" className="nav-link">
      <FaUserPlus style={{ marginRight: "6px" }} />
      Register
    </Link>
  </>
)}
</div>
   </nav>
  );
}
const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
};




