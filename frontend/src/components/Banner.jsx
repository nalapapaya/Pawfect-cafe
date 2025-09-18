import React, { useEffect } from "react";
import styles from "./Banner.module.css";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";

const Banner = () => {
  const nav = useNavigate();
  const {
    coinCount,
    setCoinCount,
    heartCount,
    setHeartCount,
    accessToken,
    username,
  } = useGame();
  const fetchData = useFetch();

  const goToSettings = () => {
    nav("/settings");
  };

  const loadScores = async () => {
    if (!accessToken) return;
    try {
      const res = await fetchData("/api/score", "GET", null, accessToken);
      if (res) {
        setHeartCount(res.heart_score);
        setCoinCount(res.coin_score);
      }
    } catch (e) {
      console.error("Failed to load scores:", e);
    }
  };

  useEffect(() => {
    loadScores();
  }, [accessToken]);

  return (
    <div className={styles.bannerCtn}>
      <button className={styles.userDisplayCtn} onClick={goToSettings}>
        <span className={styles.usernameLabel}>{username}</span>
      </button>
      <div className={styles.meterCtn}>
        <div className={styles.heartCtn}>
          <img
            src="./src/assets/gamePlay/pinkHeart.png"
            alt="Hearts"
            className={styles.meterImg}
          />
          <span className={styles.meterCount}>{heartCount}</span>
        </div>
        <div className={styles.coinCtn}>
          <img
            src="./src/assets/gamePlay/pawCoin.png"
            alt="Coins"
            className={styles.meterImg}
          />
          <span className={styles.meterCount}>{coinCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
