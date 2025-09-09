import React from "react";
import styles from "./Modal.module.css";

const RegisterModal = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Login</h2>
        <form>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="submit">Submit</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RegisterModal;
