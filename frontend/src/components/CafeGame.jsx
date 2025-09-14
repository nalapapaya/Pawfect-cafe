import React, { useState, useContext } from "react";
import styles from "./CafeGame.module.css";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";

const CafeGame = () => {
  const { setHeartCount, isFed, setIsFed, accessToken } = useGame();
  const fetchData = useFetch();

  const handleSkip = async () => {
    setIsFed(false);

    //update score on frontend immediately
    setHeartCount((prev) => prev - 2);

    //sync with backend
    await fetchData(
      "/api/score",
      "POST",
      {
        heart_score: -2,
      },
      accessToken
    );
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
        <button onClick={handleSkip} className={styles.skipBtn}>
          <span className={styles.skipText}>Skip</span>
        </button>
      </div>
    </div>
  );
};

export default CafeGame;
