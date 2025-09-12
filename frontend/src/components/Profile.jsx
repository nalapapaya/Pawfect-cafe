import React from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { username, setUsername } = useGame();
  const nav = useNavigate();

  const goToHome = () => {
    nav("/");
  };

  const handleLogout = () => {
    setUsername("");
    goToHome();
  };

  return (
    <>
      <div>
        <div>Username: {username}</div>
        <div>Joined since: </div>
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
