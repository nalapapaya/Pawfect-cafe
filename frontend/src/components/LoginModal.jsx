import React, { useState } from "react";
import styles from "./Modal.module.css";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { setUsername } = useGame();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    setUsername(inputValue); // Example username, replace with actual input value
    navigate("/cafe");
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Click outside to close */}
      <div
        className={styles.modalCtn}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Prevent closing when clicking inside */}
        <div className={styles.modalTitle}>Login</div>
        <div className={styles.modalLabel}>
          Username:
          <input
            type="text"
            className={styles.modalInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className={styles.modalLabel}>
          Password:
          <input type="password" className={styles.modalInput} />
        </div>
        <button className={styles.modalSubmit} onClick={handleSubmit}>
          <span className={styles.modalBtnLabel}>Submit</span>
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
