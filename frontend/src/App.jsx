import React from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, useLocation } from "react-router-dom";
import CafePage from "./pages/CafePage";
import KitchenPage from "./pages/KitchenPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import NavBar from "./components/NavBar";
import Banner from "./components/Banner";

const App = () => {
  const location = useLocation(); //gets current pathname
  // console.log(location);
  const hideNav = location.pathname === "/";
  return (
    <>
      <div className="appCtn">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cafe" element={<CafePage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
          <Route path="/order" element={<OrdersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      {!hideNav && <><NavBar /> <Banner /></>}
      {/* dont show on HomePage only */}
    </>
  );
};

export default App;
