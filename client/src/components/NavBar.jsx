import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
    return (
            <nav className="nav">
                <ul className="nav-links">
                    <li>
                        <NavLink 
                            to="/" 
                        >
                            Home
                        </NavLink>
                    <li>
                        <NavLink 
                            to="/map" 
                        >
                            Map
                        </NavLink>
                    </li>
                    </li>
                    <li>
                        <NavLink 
                            to="/UserPortal" 
                        >
                            User Portal
                        </NavLink>
                    </li>
                 
                </ul>
            </nav>
      
    );
}

export default NavBar;
