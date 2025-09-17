import React, { useState, useEffect } from "react";
import styles from "./CafeGame.module.css";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";
import { getRandomPetImage } from "../utils/getRandomImage";
import { getRandomMenuImage } from "../utils/getImage";

const CafeGame = () => {
  const { setHeartCount, isFed, setIsFed, accessToken } = useGame();
  const fetchData = useFetch();

  //random image at spawn
  const [currentChar, setCurrentChar] = useState(getRandomPetImage());
  const [currentFood, setCurrentFood] = useState(getRandomMenuImage());

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
    setCurrentChar(getRandomPetImage());
    setCurrentFood(getRandomMenuImage());
  };

  useEffect(() => {
    if (!isFed) {
      //new character when animation is done
      setCurrentChar(getRandomPetImage());
      setCurrentFood(getRandomMenuImage());
    }
  }, [isFed]);

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
              <img
                src={currentFood}
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
