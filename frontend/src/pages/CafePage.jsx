import React from "react";
import styles from "./CafePage.module.css";
import Menu from "../components/Menu";
import CafeGame from "../components/CafeGame";

const CafePage = () => {

  return (
    <div className={styles.cafePageCtn}>
      <Menu />
      <CafeGame />
    </div>
  );
};

export default CafePage;
