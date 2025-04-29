import "../HomePage.css";
import "../FruitType.css";
import React from "react";
// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
import HomePage from "./HomePage";
// import Map from "./Map";
import FruitType from "./FruitType";
import UserLogin from "./UserLogin";
import { LoadScript } from "@react-google-maps/api"
import MapComponent from "./MapComponent";



function App() {
  return (
    <div className="main-container">
      <HomePage />
      <UserLogin/>
      <LoadScript googleMapsApiKey="AIzaSyCfzg5rgZRzJOZ6JdhXDkukRLz0F1WEwvg">
        <MapComponent/>
      </LoadScript>
      {/* <Map /> */}
      <FruitType/>
    </div>
  );
}

export default App;