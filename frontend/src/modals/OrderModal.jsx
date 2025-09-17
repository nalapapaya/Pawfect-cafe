import React from "react";
import styles from "./OrderModal.module.css";
import { getImage } from "../utils/getImage";

const OrderModal = ({ isOpen, items, onClose }) => {
  if (!isOpen) return null; // do not render if closed

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Purchase Successful</h2>

        <div className={styles.itemsGrid}>
          {items.map((item) => {
            const imageSrc = getImage(
              item.image_url,
              item.item_type === "raw" ? "ingredient" : "menu"
            );

            return (
              <div key={item.id} className={styles.itemBox}>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className={styles.itemImg}
                  />
                ) : (
                  <div className={styles.itemImg}>No Img</div>
                )}
                <span className={styles.qty}>x{item.qty}</span>
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className={styles.okBtn}>
          Okay
        </button>
      </div>
    </div>
  );
};

export default OrderModal;
