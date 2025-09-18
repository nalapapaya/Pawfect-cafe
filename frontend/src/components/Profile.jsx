import React from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const {
    setRoleId,
    username,
    setUsername,
    setAccessToken,
    setRefreshToken,
    joinedSince,
    setJoinedSince,
    totalCoinsEarned,
    setTotalCoinsEarned,
    totalHeartsEarned,
    setTotalHeartsEarned,
    heartCount,
    coinCount,
  } = useGame();
  const nav = useNavigate();

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
    setRoleId(null);
    localStorage.removeItem("roleId");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    goToHome();
  };

  return (
    <div className={styles.profileCtn}>
      <div className={styles.profileInfoCtn}>
        <table className={styles.profileTable}>
  <tbody>
    <tr>
      <td className={styles.key}>Username:</td>
      <td className={styles.value}>
        <span className={styles.username}>{username}</span>
      </td>
    </tr>
    <tr>
      <td className={styles.key}>Joined since:</td>
      <td className={styles.value}>{joinedSince}</td>
    </tr>
    <tr>
      <td className={styles.key}>Current heart count:</td>
      <td className={styles.value}>{heartCount}</td>
    </tr>
    <tr>
      <td className={styles.key}>Current coin count:</td>
      <td className={styles.value}>{coinCount}</td>
    </tr>
    <tr>
      <td className={styles.key}>Total earned coins:</td>
      <td className={styles.value}>{totalCoinsEarned}</td>
    </tr>
    <tr>
      <td className={styles.key}>Total earned hearts:</td>
      <td className={styles.value}>{totalHeartsEarned}</td>
    </tr>
  </tbody>
</table>

      </div>
      <div className={styles.btnCtn}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span className={styles.logoutLabel}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
