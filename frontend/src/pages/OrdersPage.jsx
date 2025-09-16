import React, { useState, useEffect } from "react";
import styles from "./OrdersPage.module.css";
import useFetch from "../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import ItemsCard from "../components/ItemsCard";
import { useGame } from "../context/GameContext";
import { getImage } from "../utils/getImage";

const OrdersPage = () => {
  const [cart, setCart] = useState([]);
  const fetchData = useFetch();
  const { accessToken, coinCount, setCoinCount } = useGame();
  const getTotalCost = () =>
    cart.reduce((sum, item) => sum + getCost(item) * item.qty, 0); //add total

  const fetchShop = async () => {
    if (!accessToken) {
      throw new Error("No access token available");
    }
    const res = await fetchData("/manage/catalog", "GET", null, accessToken);

    if (!res.ok && res.msg) {
      throw new Error(res.msg);
    }

    return res.map((item) => ({
      id: item.id,
      name: item.name,
      image_url: item.image_url,
      item_type: item.item_type,
      diet_type: item.diet_type,
    }));
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["catalog"],
    queryFn: fetchShop,
  });

  // for qty change in cart (+/- buttons)
  const handleUpdateQty = (id, change) => {
    setCart(
      (prev) =>
        prev
          .map((i) =>
            i.id === id ? { ...i, qty: Math.max(0, i.qty + change) } : i //up qty if id is same
          )
          .filter((i) => i.qty > 0) // auto remove if qty= 0
    );
  };

  //for qty change when clicking item picture
  const handleAddToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i //up qty if id is same
        );
      }
      return [...prev, { ...item, qty: 1 }]; //add as new item, qty 1
    });
  };

  // setting cost of each item here
  const getCost = (item) => {
    if (item.item_type === "combined") return 40;
    if (item.diet_type === "with_meat") return 5;
    if (item.diet_type === "vegetarian") return 2;
    return 0;
  };

  const handlePurchase = async () => {
  const totalCost = getTotalCost();

  if (coinCount < totalCost) {
    console.log('Not enough coins') 
    //set msg here
    return;
  }

  // update frontend immediately
  setCoinCount((prev) => prev - totalCost);

  try {
    // update inventory
    const invRes = await fetchData(
      "/manage/inventory",
      "POST",
      cart.map((i) => ({ item_id: i.id, qty: i.qty })), //loop through cart and insert as object
      accessToken
    );

    // check inventory response
    if (invRes?.ok === false || invRes?.status === "error") {
      // rollback coins if failed
      setCoinCount((prev) => prev + totalCost);
      console.log(`Purchase failed: ${invRes.msg}`); 
      //set msg here
      return;
    }

    // deduct coins in backend
    const scoreRes = await fetchData(
      "/api/score",
      "POST",
      { coin_score: -totalCost }, //negative to deduct
      accessToken
    );

    if (scoreRes?.ok === false || scoreRes?.status === "error") {
      console.log("Coin deduction failed:", scoreRes.msg);
      //set msg here (purchase for free)
    } else {
      console.log("Score updated:", scoreRes.msg);
    }

    // clear cart after success
    setCart([]);
    console.log("Purchase successful");
    //set msg here
  } catch (e) {
    console.error("Purchase error:", e);
    // rollback coins if total failure
    setCoinCount((prev) => prev + totalCost);
    //set msg here
  }
};

  if (!accessToken) {
    return <p>Login to view your inventory.</p>;
  }

  if (isLoading) return <p>Loading inventory..</p>;

  if (isError) {
    //backend error
    return (
      <p>
        Error loading inventory: {error?.message || "Something went wrong."}
      </p>
    );
  }

  return (
    <div className={styles.ordersPageCtn}>
      <div className={styles.ordersCtn}>
        <div className={styles.vendorListCtn}>
          <div className={styles.vendorListTitle}>Vendor List</div>
          <div className={styles.vendorItems}>
            {data &&
              data.map((item) => (
                <div key={item.id} onClick={() => handleAddToCart(item)}>
                  <ItemsCard item={{ ...item }} isOrdersPage hideQty />
                </div>
              ))}
          </div>
        </div>

        <div className={styles.shoppingCartCtn}>
          <div className={styles.shoppingCartTitle}>Cart</div>
          {cart.length === 0 && <p>Cart is empty</p>}
          {cart.map((item) => {
            const imageSrc = getImage(
              item.image_url,
              item.item_type === "raw" ? "ingredient" : "menu"
            );

            return (
              <div key={item.id} className={styles.cartItem}>
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className={styles.cartImage}
                  />
                ) : (
                  <div className={styles.cartImage}>No Img</div>
                )}

                <div className={styles.cartInfo}>
                  <p>{item.name}</p>
                  <p>Cost: {getCost(item) * item.qty} coins</p>

                  <div className={styles.qtyControls}>
                    <button onClick={() => handleUpdateQty(item.id, -1)}>
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => handleUpdateQty(item.id, +1)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
         
  <div className={styles.purchaseSection}>
    <p>Total: {getTotalCost()} coins</p>
    <button onClick={handlePurchase} className={styles.purchaseBtn}>
      Purchase
    </button>
  </div>

        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
