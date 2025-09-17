import React from "react";
import styles from "./ItemsCard.module.css";
import { getImage } from "../utils/getImage";

const ItemsCard = ({
  item,
  handleFeed,
  isMenu = false,
  isOrdersPage = false,
  isKitchenPage = false,
}) => {
  const imageSrc = getImage(
    item.image_url,
    item.item_type === "raw" ? "ingredient" : "menu"
  );
  // console.log("item:", item.name, "db filename:", item.image_url, "path:", imageSrc);

  const handleClick = () => {
    if (isMenu && handleFeed) {
      handleFeed(item.id); // pass item.id to CafePage
    }
  };

  return (
    <div className={styles.inventoryCard}>
      <button
        onClick={isMenu ? handleClick : undefined} //dont trigger if dont pass isMenu
        className={`${styles.feedBtn} ${
          isOrdersPage ? styles.ordersCard : ""
        } ${isKitchenPage ? styles.kitchensCard : ""}`}
        disabled={item.qty === 0}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.name}
            className={`${styles.itemImage} ${
              item.qty === 0 ? styles.disabledImage : ""
            }`}
          />
        ) : (
          <div className={styles.itemImage}>No Img</div>
        )}
        {/* Overlay quantity number */}
        {!isOrdersPage && (
          <div
            className={`${styles.itemQty} ${
              isKitchenPage ? styles.invQty : ""
            }`}
          >
            {item.qty}
          </div>
        )}
      </button>
    </div>
  );
};

export default ItemsCard;
