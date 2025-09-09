import React from "react";
import styles from "./NavBar.module.css";

const NavBar = () => {
  return (
    <>
      <div className={styles.navBarCtn}>
        <button className={styles.cafeBtn}>
          <img src="./src/assets/gamePlay/cafeIcon.png" alt="Cafe" />
        </button>
        <button className={styles.kitchenBtn}>
          <img src="./src/assets/gamePlay/kitchenIcon.png" alt="Kitchen" />
        </button>
        <button className={styles.orderBtn}>
          <img src="./src/assets/gamePlay/orderIcon.png" alt="Order" />
        </button>
        <button className={styles.settingsBtn}><img src="./src/assets/gamePlay/gearIcon.png" alt="Settings" /></button>
      </div>
    </>
  );
};

export default NavBar;
