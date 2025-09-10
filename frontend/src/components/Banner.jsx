import React from "react";
import styles from "./Banner.module.css";
import { useNavigate } from "react-router-dom";
import {useGame} from "../context/GameContext";

const Banner = () => {
  const nav = useNavigate();
  const {coinCount, heartCount, username} = useGame();

  const goToSettings = () => {
    nav("/settings");
  };

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
