// src/components/NavBar.js
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function NavBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    navigate("/"); // redirect to home after logout
  };

  return (
    <nav className="nav">
      <div className="nav-title">
        <ul className="nav ul">
          <li className="nav li"><Link to="/">Home</Link></li>
          <li className="nav li"><Link to="/fruit-type">Fruit Types</Link></li>
          <li className="nav li"><Link to="/map">Map</Link></li>

          {!user && (
            <li className="nav li"><Link to="/login">Login</Link></li>
          )}

          {user && (
            <>
              <li className="nav li"><Link to="/portal">User Portal</Link></li>
              <li className="nav li">
                <button onClick={handleLogout} className="nav logout-button">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
