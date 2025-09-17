import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CafePage from "./pages/CafePage";
import KitchenPage from "./pages/KitchenPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import NavBar from "./components/NavBar";
import Banner from "./components/Banner";
import { useGame } from "./context/GameContext";
import MessageModal from "./modals/MessageModal";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation(); //gets current pathname
  // console.log(location);
  const hideNav = location.pathname === "/";
  const { message, setMessage } = useGame();
  

  return (
    <>
      <div className="appCtn">
        <QueryClientProvider client={queryClient}>
          
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
            <MessageModal
        isOpen={!!message}
        message={message}
        onClose={() => setMessage(null)}
      />
        </QueryClientProvider>
      </div>
    </>
  );
};

export default App;
