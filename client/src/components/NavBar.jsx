// src/components/NavBar.js
import "./NavBar.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="nav">
        <div className="nav-title">
      <ul className="nav ul">
        <li className="nav li"><Link to="/">Home</Link></li>
        <li className="nav li">< Link to="/fruit-type">Fruit Types</Link></li>
        <li className="nav li"><Link to="/map">Map</Link></li>
        <li className="nav li"><Link to="/login">Login</Link></li>
        <li className="nav li"><Link to="/portal">User Portal</Link></li>
      </ul>
      </div>
    </nav>
  );
}

export default NavBar;
