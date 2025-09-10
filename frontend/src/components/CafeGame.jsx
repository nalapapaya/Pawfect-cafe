import React, { useState, useContext } from "react";
import styles from "./CafeGame.module.css";
import { useGame } from "../context/GameContext";

const CafeGame = () => {
  const { coinCount, setCoinCount, heartCount, setHeartCount } = useGame();
  const [isFed, setIsFed] = useState(false);

  const handleFeed = () => {
    setIsFed(true);
    setHeartCount((prev) => prev + 10);
    setCoinCount((prev) => prev + 50);

    setTimeout(() => { //to reset after 2s
    setIsFed(false);
  }, 2000);
  };

  const handleSkip = () => {
    setIsFed(false);
    setHeartCount((prev) => prev - 2);
  };

  return (
    <div className={styles.cafeGameCtn}>
      <div>
        <div>
          <img
            src="./src/assets/pets/alpaca.png"
            alt="Pet Character"
            className={styles.petChar}
          />
        </div>
        <div className={styles.speechCtn}>
          {!isFed ? (
            <>
              <img
                src="./src/assets/foods/Menu/pupcake.png"
                alt="Food Item"
                className={styles.speechItem}
              />
              <img
                src="./src/assets/gamePlay/pandaBowlEmpty.png"
                alt="Empty Bowl"
                className={styles.bowl}
              />
            </>
          ) : (
            <>
              <img
                src="./src/assets/gamePlay/pinkHeart.png"
                alt="Food Item"
                className={styles.speechHeart}
              />
              <img
                src="./src/assets/gamePlay/pandaBowlFull.png"
                alt="Filled Bowl"
                className={styles.bowl}
              />
            </>
          )}
        </div>
        <button onClick={handleFeed} className={styles.feedBtn}>
          feed
        </button>
        <button onClick={handleSkip} className={styles.skipBtn}>
          <span className={styles.skipText}>Skip</span>
        </button>
      </div>
    </div>
  );
};

export default CafeGame;
