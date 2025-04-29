import "../HomePage.css";
import "../FruitType.css";
import React from "react";
// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
import HomePage from "./HomePage";
import Map from "./Map";
import FruitType from "./FruitType";
import UserLogin from "./UserLogin";



function App() {
  return (
    <div className="main-container">
      <HomePage />
      <UserLogin/>
      <Map />
      <FruitType/>
    </div>
  );
}

export default App;