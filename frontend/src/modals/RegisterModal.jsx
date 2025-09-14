import React, { useState } from "react";
import styles from "./Modal.module.css";
import useFetch from "../hooks/useFetch";

const RegisterModal = ({ onClose }) => {
  const fetchData = useFetch();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    if (password.length < 12) {
      setError("Password must be at least 12 characters");
      return;
    }
    setError("");

    const res = await fetchData("/auth/register", "PUT", {
      username,
      password,
    });

    if (res.ok) {
      setMessage(res.msg || "Registration successful! Please log in.");
      setUsername("");
      setPassword("");
    } else {
      setError(res.msg || "Error registering, please try again later.");
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
        <div className={styles.modalTitle}>Register</div>
        <div className={styles.modalLabel}>
          Username:
          <input
            type="text"
            className={styles.modalInput}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className={styles.modalLabel}>
          Password:
          <input
            type="password"
            className={styles.modalInput}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : message ? (
          <div className={styles.successMessage}>{message}</div>
        ) : (
          <>&nbsp;</>
        )}
        <button className={styles.modalSubmit} onClick={handleRegister}>
          <span className={styles.modalBtnLabel}>Submit</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
