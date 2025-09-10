import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, useLocation } from "react-router-dom";
import CafePage from "./pages/CafePage";
import KitchenPage from "./pages/KitchenPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import NavBar from "./components/NavBar";
import Banner from "./components/Banner";
import { GameContext } from "./context/GameContext";

const App = () => {
  const location = useLocation(); //gets current pathname
  // console.log(location);
  const hideNav = location.pathname === "/";
  const [heartCount, setHeartCount] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [username, setUsername] = useState("");

  return (
    <>
      <div className="appCtn">
        <GameContext.Provider value={{ coinCount, setCoinCount, heartCount, setHeartCount, username, setUsername }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cafe" element={<CafePage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
          <Route path="/order" element={<OrdersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      
      {!hideNav && (
        <>
          <NavBar />
          <Banner />
        </>
      )}
      {/* dont show on HomePage only */}
      </GameContext.Provider>
      </div>
    </>
    
  );
};

export default App;
