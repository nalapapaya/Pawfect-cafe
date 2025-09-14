import React, { useState } from "react";
import styles from "./Menu.module.css";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";

const Menu = () => {
  const { setCoinCount, setHeartCount, setIsFed, accessToken } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const fetchData = useFetch();

  const handleFeed = async () => {
    setIsFed(true);
    //update score on frontend immediately
    setHeartCount((prev) => prev + 10);
    setCoinCount((prev) => prev + 50);
    // console.log("accessToken at feed:", accessToken);

    //sync with backend
    await fetchData(
      "/api/score",
      "POST",
      {
        heart_score: 10,
        coin_score: 50,
      },
      accessToken
    );

    setTimeout(() => {
      //to reset after 2s
      setIsFed(false);
    }, 2000);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.menuCtn} ${isOpen ? styles.open : ""}`}>
      <div className={styles.handle} onClick={toggleMenu}>
        menu
      </div>

      <div className={styles.menuContent}>
        <ul>
          <li>item</li>
          <li>item</li>
          <li>item</li>
          <button onClick={handleFeed} className={styles.feedBtn}>
            feed
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
