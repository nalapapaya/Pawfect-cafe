import React, { useState } from "react";
import styles from "./Modal.module.css";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";

const LoginModal = ({ onClose }) => {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const {
    setUsername,
    setJoinedSince,
    setHeartCount,
    setCoinCount,
    setTotalHeartsEarned,
    setTotalCoinsEarned,
    setAccessToken,
  } = useGame();
  const [error, setError] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!usernameInput || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      setError("");
      const res = await fetchData("/auth/login", "POST", {
        username: usernameInput,
        password,
      });

      if (res.success) {
        localStorage.setItem("access_token", res.access);
        localStorage.setItem("refresh_token", res.refresh);
        localStorage.setItem("username", res.username);
        setAccessToken(res.access);
        setUsername(res.username);
        setJoinedSince(res.joined_since);

        //fetch score after acquiring token
        const userScore = await fetchData("/api/score", "GET", null, res.access);
        if (userScore) {
          setHeartCount(userScore.heart_score);
          setCoinCount(userScore.coin_score);
          setTotalHeartsEarned(userScore.total_hearts_earned);
          setTotalCoinsEarned(userScore.total_coins_earned);
        }
        navigate("/cafe");
        onClose();
      } else {
        setError(res.msg || "Login failed");
      }
    } catch (e) {
      setError(e.message || "Network error");
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
            value={usernameInput}
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
        <button className={styles.modalSubmit} onClick={handleLogin}>
          <span className={styles.modalBtnLabel}>Submit</span>
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
