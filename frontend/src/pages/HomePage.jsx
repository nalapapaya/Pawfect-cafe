import React, {useState} from "react";
import styles from "./HomePage.module.css"
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className={styles.homeCtn}>
      <img
        className={styles.logoImg}
        src="./src/assets/gamePlay/logo.png"
        alt="Logo"
      />
      <div className={styles.homeBtnCtn}>
        <button className={styles.authBtn}>
          <span className={styles.authLabel} onClick={() => setShowLogin(true)}>Login</span>
        </button>
        <button className={styles.authBtn}>
          <span className={styles.authLabel} onClick={() => setShowRegister(true)}>Register</span>
        </button>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
};

export default HomePage;
