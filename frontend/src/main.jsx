import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import "./index.css";
import App from "./App.jsx";
import { GameProvider } from "./context/GameContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GameProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </GameProvider>
  </React.StrictMode>
);
