import React, { useState } from "react";
import styles from "./Menu.module.css";
import { useGame } from "../context/GameContext";

const Menu = () => {
  const { setCoinCount, setHeartCount, setIsFed } = useGame();
  const [isOpen, setIsOpen] = useState(false);

  const handleFeed = () => {
    setIsFed(true);
    setHeartCount((prev) => prev + 10);
    setCoinCount((prev) => prev + 50);

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
