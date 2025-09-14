import React from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { username, setUsername, setAccessToken, setRefreshToken, joinedSince, setJoinedSince, totalCoinsEarned, setTotalCoinsEarned, totalHeartsEarned, setTotalHeartsEarned, heartCount, coinCount } = useGame();
  const nav = useNavigate();
  // console.log("joinedSince in Profile:", joinedSince);
  // console.log(totalHeartsEarned)
  // console.log("Profile scores:", heartCount, coinCount, totalHeartsEarned, totalCoinsEarned);

  const goToHome = () => {
    nav("/");
  };

  const handleLogout = () => {
    setUsername("");
    setAccessToken("");
    setRefreshToken("");
    setJoinedSince("");
    setTotalCoinsEarned("");
    setTotalHeartsEarned("");
    goToHome();
  };

  return (
    <>
      <div>
        <div>Username: {username}</div>
        <div>Joined since: {joinedSince}</div>
        <div>Current heart count: {heartCount}</div>
        <div>Current coin count: {coinCount}</div>
        <div>Total earned coins: {totalCoinsEarned}</div>
        <div>Total earned hearts: {totalHeartsEarned}</div>
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default Profile;
