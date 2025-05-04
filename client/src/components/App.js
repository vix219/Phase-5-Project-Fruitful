// src/components/App.js

import "../HomePage.css";
import "../FruitType.css";
import HomePage from "./HomePage";
import FruitType from "./FruitType";
import UserLogin from "./UserLogin";
import MapComponent from "./MapComponent";
import UserPortal from "./UserPortal";
import { useUser } from './UserContext';
import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom"; // Import Outlet from react-router-dom

function App() {
  const { setUser } = useUser();

  useEffect(() => {
    fetch('/current-user', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => setUser(data))
      .catch(() => console.log('Not logged in'));
  }, [setUser]);

  return (
    <div className="main-container">
      <NavBar /> {/* Include NavBar */}
      
      {/* Render the route-specific content here */}
      <Outlet />
    </div>
  );
}

export default App;
