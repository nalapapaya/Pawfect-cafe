import React, { useState } from "react";
import styles from "./Menu.module.css";

const Menu = () => {
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
        <ul>
            <li>item</li>
            <li>item</li>
            <li>item</li>
        </ul>
      </div>
    </div>
  );
};


export default Menu;
