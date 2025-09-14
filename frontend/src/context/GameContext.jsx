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
    () => localStorage.getItem("username") || ""
  );
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("access_token") || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem("refresh_token") || ""
  );
  const [joinedSince, setJoinedSince] = useState("")
  console.log("joinedSince in GameContext:", joinedSince);

  useEffect(() => {
    if (username) {
      localStorage.setItem("username", username); //set username in localstorage
    } else {
      localStorage.removeItem("username"); //clear after logging out
    }
  }, [username]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    } else {
      localStorage.removeItem("access_token");
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    } else {
      localStorage.removeItem("refresh_token");
    }
  }, [refreshToken]);

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
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        joinedSince,
        setJoinedSince,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
