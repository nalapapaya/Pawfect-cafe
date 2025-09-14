import React from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { username, setUsername, setAccessToken, setRefreshToken, joinedSince, setJoinedSince } = useGame();
  const nav = useNavigate();
  console.log("joinedSince in Profile:", joinedSince);

  const goToHome = () => {
    nav("/");
  };

  const handleLogout = () => {
    setUsername("");
    setAccessToken("");
    setRefreshToken("");
    setJoinedSince("");
    goToHome();
  };

  return (
    <>
      <div>
        <div>Username: {username}</div>
        <div>Joined since: {joinedSince}</div>
        <div>Total earned coins:</div>
        <div>Total earned hearts:</div>
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default Profile;
