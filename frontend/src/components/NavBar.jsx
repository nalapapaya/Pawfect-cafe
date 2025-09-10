import React from "react";
import styles from "./NavBar.module.css";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const nav = useNavigate();

  const goToCafe = () => {
    nav("/cafe");
  };

  const goToKitchen = () => {
    nav("/kitchen");
  };

  const goToOrders = () => {
    nav("/order");
  };

  const goToSettings = () => {
    nav("/settings");
  };

  return (
    <>
      <div className={styles.navBarCtn}>
        <button className={styles.cafeBtn} onClick={goToCafe}>
          <img src="./src/assets/gamePlay/cafeIcon.png" alt="Cafe" />
        </button>
        <button className={styles.kitchenBtn} onClick={goToKitchen}>
          <img src="./src/assets/gamePlay/kitchenIcon.png" alt="Kitchen" />
        </button>
        <button className={styles.orderBtn} onClick={goToOrders}>
          <img src="./src/assets/gamePlay/orderIcon.png" alt="Order" />
        </button>
        <button className={styles.settingsBtn} onClick={goToSettings}>
          <img src="./src/assets/gamePlay/gearIcon.png" alt="Settings" />
        </button>
      </div>
    </>
  );
};

export default NavBar;
