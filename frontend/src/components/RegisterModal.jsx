import React from "react";
import styles from "./Modal.module.css";

const RegisterModal = ({ onClose }) => {
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
          <input type="text" className={styles.modalInput} />
        </div>
        <div className={styles.modalLabel}>
          Password:
          <input type="password" className={styles.modalInput} />
        </div>
        <button className={styles.modalSubmit}>
          <span className={styles.modalBtnLabel}>Submit</span>
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
