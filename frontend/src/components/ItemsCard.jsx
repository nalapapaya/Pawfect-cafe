import React from "react";
import styles from "./ItemsCard.module.css";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";
import { getImage } from "../utils/getImage";

const ItemsCard = ({ item, onDispose, isMenu = false }) => {
  const { setIsFed, setHeartCount, setCoinCount, accessToken } = useGame();
  const fetchData = useFetch();
  const imageSrc = getImage(
    item.image_url,
    item.item_type === "raw" ? "ingredient" : "menu"
  );
  // console.log("item:", item.name, "db filename:", item.image_url, "path:", imageSrc);

  const handleFeed = async () => {
    try {
      setIsFed(true);

      //update score on frontend immediately
      setHeartCount((prev) => prev + 10);
      setCoinCount((prev) => prev + 50);

      //sync with backend
      const scoreRes = await fetchData(
        "/api/score",
        "POST",
        {
          heart_score: 10,
          coin_score: 50,
        },
        accessToken
      );
      
      if (scoreRes?.ok === false) {
        //safer if req fail
        console.error("Failed to update score:", scoreRes.msg);
        // rollback if backend fails (to match backend)
        setHeartCount((prev) => prev - 10);
        setCoinCount((prev) => prev - 50);
      } else {
        console.log("Score updated:", scoreRes.msg);
      }

      // reduce qty 1 after feeding
      if (item.qty > 0) {
        onDispose(-1);
      }

      setTimeout(() => {
        setIsFed(false);
      }, 2500);
    } catch (e) {
      console.error("Error feeding:", e);
      setIsFed(false);
    }
  };

  return (
    <div className={styles.inventoryCard}>
      <button
        onClick={isMenu ? handleFeed : undefined} //dont trigger if dont pass isMenu
        className={styles.feedBtn}
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
        <span className={styles.itemQty}>{item.qty}</span>
      </button>
    </div>
  );
};

export default ItemsCard;
