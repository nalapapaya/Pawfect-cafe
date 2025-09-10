import React from "react";
import styles from "./CafePage.module.css"
import NavBar from "../components/NavBar";
import Menu from "../components/Menu";

const CafePage = () => {
  return (
      <div className={styles.cafePageCtn}>
        <Menu/>
      </div>
  );
};

export default CafePage;
