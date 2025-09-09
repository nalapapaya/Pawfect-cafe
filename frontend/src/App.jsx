import React from "react";
import HomePage from "./pages/HomePage";
import {Routes, Route} from "react-router-dom";
import CafePage from "./pages/CafePage";

const App = () => {
  return (
    <>
      <div className="appCtn">
        <Routes>
           <Route path="/" element={<HomePage />} />
          <Route path="/cafe" element={<CafePage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
