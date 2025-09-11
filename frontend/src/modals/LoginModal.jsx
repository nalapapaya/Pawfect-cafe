import React, { useState } from "react";
import styles from "./Modal.module.css";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { setUsername } = useGame();
  const [error, setError] = useState("");
  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");

  const fakeLogin = ({ username, password }) => {
    if (username === "Maddy" && password === "1234") {
      return { success: true, username };
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const handleSubmit = () => {
    if (!username || !password) {
      setError("There is an empty fill");
      return;
    }
    try {
      setError("");
      const res = fakeLogin({ username, password });
      if (res.success) {
        setUsername(res.username);
        navigate("/cafe");
        onClose();
      }
    } catch (e) {
      setError(e.message);
    }
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
            value={username}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
        </div>
        <div className={styles.modalLabel}>
          Password:
          <input
            type="password"
            className={styles.modalInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <>&nbsp;</>
        )}
        <button className={styles.modalSubmit} onClick={handleSubmit}>
          <span className={styles.modalBtnLabel}>Submit</span>
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
