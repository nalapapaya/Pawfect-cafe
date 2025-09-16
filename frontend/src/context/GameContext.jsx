import React, { createContext, useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

export const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  //children = everything in here gets passed
  const [coinCount, setCoinCount] = useState(0);
  const [heartCount, setHeartCount] = useState(0);
  const [totalHeartsEarned, setTotalHeartsEarned] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [isFed, setIsFed] = useState(false);
  // const fetchData = useFetch();

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
  //   console.log("joinedSince in GameContext:", joinedSince);

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

  // useEffect(() => {
  //   const loadScores = async () => {
  //     if (!accessToken) return; // not logged in yet
  //     try {
  //       const res = await fetchData("/api/score", "GET", null, accessToken);
  //       if (res) {
  //         setHeartCount(res.heart_score);
  //         setCoinCount(res.coin_score);
  //         setTotalHeartsEarned(res.total_hearts_earned);
  //         setTotalCoinsEarned(res.total_coins_earned);
  //       }
  //     } catch (err) {
  //       console.error("Failed to load scores:", err);
  //     }
  //   };
  //   loadScores();
  // }, [accessToken]);

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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
