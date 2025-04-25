import "../HomePage.css";
import "../FruitType.css";
import React from "react";
// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
import HomePage from "./HomePage";
import Map from "./Map";
import FruitType from "./FruitType";



function App() {
  return (
    <div className="main-container">
      <HomePage />
      <Map />
      <FruitType/>
    </div>
  );
}

export default App;