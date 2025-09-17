import React from "react";
import styles from "./CafeGame.module.css";
import { useGame } from "../context/GameContext";
import { getImage } from "../utils/getImage";

const CafeGame = ({ handleSkip, currentChar, currentFood }) => {
  const { isFed } = useGame();

  return (
    <div className={styles.cafeGameCtn}>
      <div>
        <div>
          <img
            src={currentChar}
            alt="Pet Character"
            className={styles.petChar}
          />
        </div>
        <div className={styles.speechCtn}>
          {!isFed ? (
            <>
              {currentFood && (
                <img
                  src={getImage(currentFood.image_url, "menu")} 
                  alt={currentFood.name}
                  className={styles.speechItem}
                />
              )}
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
