import React from "react";
import styles from "./Banner.module.css";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const nav = useNavigate();

  const goToSettings = () => {
    nav("/settings");
  };

  return (
    <div className={styles.bannerCtn}>
      <button className={styles.userDisplayCtn} onClick={goToSettings}>
        <span className={styles.usernameLabel}>Maddy</span>
      </button>
      <div className={styles.meterCtn}>
        <div className={styles.heartCtn}>
          <img
            src="./src/assets/gamePlay/pinkHeart.png"
            alt="Hearts"
            className={styles.meterImg}
          />
          <span className={styles.meterCount}>999999</span>
        </div>
        <div className={styles.coinCtn}>
          <img
            src="./src/assets/gamePlay/pawCoin.png"
            alt="Coins"
            className={styles.meterImg}
          />
          <span className={styles.meterCount}>999999</span>
        </div>
      </div>
    </div>
  );
};

export default Banner;
