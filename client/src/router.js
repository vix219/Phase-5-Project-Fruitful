// src/router.js

import { createBrowserRouter } from "react-router-dom";
import App from "./components/App";
import HomePage from "./components/HomePage";
import UserLogin from "./components/UserLogin";
import UserPortal from "./components/UserPortal";
import MapComponent from "./components/MapComponent.jsx";
import FruitType from "./components/FruitType.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapComponent /> },
      { path: 'login', element: <UserLogin /> },
      { path: 'portal', element: <UserPortal /> },
      { path: 'fruit-type', element: <FruitType /> },
    ],
  }
]);

export default router;
