import React from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import styles from './Profile.module.css'

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
    <div className={styles.profileCtn}>
      <div className={styles.profileInfoCtn}>
        <div>Username: {username}</div>
        <div>Joined since: {joinedSince}</div>
        <div>Current heart count: {heartCount}</div>
        <div>Current coin count: {coinCount}</div>
        <div>Total earned coins: {totalCoinsEarned}</div>
        <div>Total earned hearts: {totalHeartsEarned}</div>
      </div>
      <div className={styles.btnCtn}>
        <button className={styles.logoutBtn} onClick={handleLogout}><span className={styles.logoutLabel}>Logout</span></button>
      </div>
    </div>
  );
};

export default Profile;
