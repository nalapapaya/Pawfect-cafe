import React from "react";
import styles from "./CafePage.module.css"
import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import CafeGame from "../components/CafeGame";

const CafePage = () => {
  return (
      <div className={styles.cafePageCtn}>
        <Menu/>
        <CafeGame/>
      </div>
  );
};

export default CafePage;
