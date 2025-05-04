// src/router.js

import { createBrowserRouter } from "react-router-dom";
import App from "./components/App";
import HomePage from "./components/HomePage";
import UserLogin from "./components/UserLogin";
import UserPortal from "./components/UserPortal";
import MapComponent from "./components/MapComponent.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App will render children components via <Outlet />
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapComponent /> },
      { path: 'login', element: <UserLogin /> },
      { path: 'portal', element: <UserPortal /> },
    ],
  }
]);

export default router;
