import React, { createContext, useContext, useState, useEffect } from "react";

export const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  //children = everything in here gets passed
  const [coinCount, setCoinCount] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const [isFed, setIsFed] = useState(false);

  // use username from localstorage
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || "Guest"
  );

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username); //set username in localstorage
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  return (
    <GameContext.Provider
      value={{
        coinCount,
        setCoinCount,
        heartCount,
        setHeartCount,
        username,
        setUsername,
        isFed,
        setIsFed,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
