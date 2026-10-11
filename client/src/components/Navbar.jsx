import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutService } from "../api/authService";

function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutService();
    setUser(null);
    navigate("/login");
  };

  return (
  <nav className="nav">
    <Link to="/" className="brand">EventBooking</Link>
    <div className="nav-links">
      {user ? (
        <>
          <Link to="/my-bookings">My bookings</Link>
          {user.role === "organizer" && <Link to="/create-event">Create event</Link>}
          <span className="muted">{user.name}</span>
          <button onClick={handleLogout}>Log out</button>
        </>
      ) : (
        <>
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </>
      )}
    </div>
  </nav>
);
}

export default Navbar;