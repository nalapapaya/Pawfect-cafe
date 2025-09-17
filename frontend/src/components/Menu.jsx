import React, { useState } from "react";
import styles from "./Menu.module.css";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";
import MenuList from "./MenuList";

const Menu = ({handleFeed}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.menuCtn} ${isOpen ? styles.open : ""}`}>
      <div className={styles.handle} onClick={toggleMenu}>
        menu
      </div>

      <div className={styles.menuContent}>
       <MenuList handleFeed={handleFeed}/>
      </div>
    </div>
  );
};

export default Menu;
