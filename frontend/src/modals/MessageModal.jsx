// MessageModal.jsx
import React from "react";
import styles from "./MessageModal.module.css";

const MessageModal = ({ isOpen, message, onClose }) => {
  if (!isOpen || !message) return null; // don't render if closed or no message

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p className={styles.messageText}>{message}</p>

        <button onClick={onClose} className={styles.okBtn}>
          Okay
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
