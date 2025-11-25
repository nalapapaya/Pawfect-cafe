import React, { createContext, useContext, useState, useEffect } from "react";

export const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => { //redux
  //children = everything in here gets passed
  const [coinCount, setCoinCount] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const [isFed, setIsFed] = useState(false);
  const [message, setMessage] = useState(null); // for all messages popup
  const [roleId, setRoleId] = useState(null);

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
  const [joinedSince, setJoinedSince] = useState(
    () => localStorage.getItem("joinedSince") || ""
  );
  const [totalHeartsEarned, setTotalHeartsEarned] = useState(
    () => parseInt(localStorage.getItem("totalHeartsEarned")) || 0
  );
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(
    () => parseInt(localStorage.getItem("totalCoinsEarned")) || 0
  );

useEffect(() => {
  const storedToken = localStorage.getItem("access_token");
  const storedRefresh = localStorage.getItem("refresh_token");
  const storedRole = localStorage.getItem("roleId");

  if (storedToken) setAccessToken(storedToken);
  if (storedRefresh) setRefreshToken(storedRefresh);
  if (storedRole) setRoleId(Number(storedRole));
}, []);

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

  useEffect(() => {
    if (joinedSince) {
      localStorage.setItem("joinedSince", joinedSince); //set username in localstorage
    } else {
      localStorage.removeItem("joinedSince"); //clear after logging out
    }
  }, [joinedSince]);

  useEffect(() => {
    if (totalHeartsEarned) {
      localStorage.setItem("totalHeartsEarned", totalHeartsEarned.toString());
    } else {
      localStorage.removeItem("totalHeartsEarned");
    }
  }, [totalHeartsEarned]);

  useEffect(() => {
    if (totalCoinsEarned) {
      localStorage.setItem("totalCoinsEarned", totalHeartsEarned.toString());
    } else {
      localStorage.removeItem("totalCoinsEarned");
    }
  }, [totalCoinsEarned]);

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
        totalHeartsEarned,
        setTotalHeartsEarned,
        totalCoinsEarned,
        setTotalCoinsEarned,
        message,
        setMessage,
        roleId,
        setRoleId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
