import React, { useState, useContext } from "react";
import styles from "./CafeGame.module.css";
import { useGame } from "../context/GameContext";

const CafeGame = () => {
  const { coinCount, setCoinCount, heartCount, setHeartCount } = useGame();
  const [isFed, setIsFed] = useState(false);

  const handleFeed = () => {
    setIsFed(true);
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
            <img
              src="./src/assets/foods/Menu/pupcake.png"
              alt="Food Item"
              className={styles.speechItem}
            />
          ) : (
            <img
              src="./src/assets/gamePlay/pinkHeart.png"
              alt="Food Item"
              className={styles.speechHeart}
            />
          )}
        </div>
        <button onClick={handleFeed} className={styles.feedBtn}>feed</button>
      </div>
    </div>
  );
};

export default CafeGame;
