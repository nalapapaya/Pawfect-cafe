import React, { useState } from "react";
import styles from "./Menu.module.css";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";
import InventoryList from "./InventoryList";

const Menu = () => {
  const { setCoinCount, setHeartCount, setIsFed, accessToken } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const fetchData = useFetch();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.menuCtn} ${isOpen ? styles.open : ""}`}>
      <div className={styles.handle} onClick={toggleMenu}>
        menu
      </div>

      <div className={styles.menuContent}>
       <InventoryList/>
      </div>
    </div>
  );
};

export default Menu;
