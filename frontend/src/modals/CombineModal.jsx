import React from "react";
import styles from "./CombineModal.module.css";
import { getImage } from "../utils/getImage";

const CombineModal = ({ isOpen, item, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Combine Success!</h2>

        <div className={styles.itemBox}>
          {getImage(item.image_url, "menu") ? (
            <img
              src={getImage(item.image_url, "menu")}
              alt={item.name}
              className={styles.itemImg}
            />
          ) : (
            <div className={styles.itemImg}>No Img</div>
          )}
          <span className={styles.qty}>x{item.qty || 1}</span>
        </div>

        <button onClick={onClose} className={styles.okBtn}>
          Okay
        </button>
      </div>
    </div>
  );
};

export default CombineModal;
