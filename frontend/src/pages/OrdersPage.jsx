import React, { useState } from "react";
import styles from "./OrdersPage.module.css";
import useFetch from "../hooks/useFetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ItemsCard from "../components/ItemsCard";
import { useGame } from "../context/GameContext";
import { getImage } from "../utils/getImage";
import OrderModal from "../modals/OrderModal";

const OrdersPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [cart, setCart] = useState([]);
  const queryClient = useQueryClient();
  const fetchData = useFetch();
  const { accessToken, coinCount, setCoinCount, setMessage } = useGame();
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

    return res
      .filter((item) => item.name.toLowerCase() !== "kibbles") // cant buy kibbles
      .map((item) => ({
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
          .map(
            (i) =>
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
        return prev.map(
          (i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i) //up qty if id is same
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
      setMessage("You don't have enough coins. Feed some pets to earn coins!");
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
        setMessage("Purchase failed. Please try again later.");
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
        setMessage("Something went wrong and you got the item at no cost!");
      }

      // clear cart after success
      if (cart.length > 0) {
        setPurchasedItems(cart); //keep copy for modal
        setCart([]);
        setShowModal(true);
      } else {
        setMessage("There's nothing in cart, add some goodies!");
      }
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["inventoryRaw"]);
      queryClient.invalidateQueries(["inventoryMenu"]);
    } catch (e) {
      console.error("Purchase error:", e);
      // rollback coins if total failure
      setCoinCount((prev) => prev + totalCost);
      setMessage("There's an error purchasing, please try again later.");
    }
  };

  if (!accessToken) return <div>Login to view your inventory.</div>;
  if (isLoading) return <div>Loading inventory..</div>;
  if (isError)
    return (
      <div>
        Error loading inventory: {error?.message || "Something went wrong."}
      </div>
    );

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
          <div className={styles.cartItemsWrapper}>
            {cart.length === 0 && (
              <div className={styles.font}>Cart is empty</div>
            )}
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
                    <div className={styles.font}>{item.name}</div>
                    <div className={styles.qtyControls}>
                      <div className={styles.itemCost}>
                        <span className={styles.font}>
                          {getCost(item) * item.qty}
                        </span>
                        <img
                          src="./src/assets/gamePlay/pawCoin.png"
                          alt="Coins"
                          className={styles.coin}
                        />
                      </div>
                      <button
                        className={styles.font}
                        onClick={() => handleUpdateQty(item.id, -1)}
                      >
                        -
                      </button>
                      <span className={styles.font}>{item.qty}</span>
                      <button
                        className={styles.font}
                        onClick={() => handleUpdateQty(item.id, +1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles.purchaseSection}>
            <div className={styles.totalCtn}>
              <span className={styles.totalCost}>Total: {getTotalCost()}</span>
              <img
                src="./src/assets/gamePlay/pawCoin.png"
                alt="Coins"
                className={styles.coinTotal}
              />
            </div>
            <button onClick={handlePurchase} className={styles.purchaseBtn}>
              Purchase
            </button>
          </div>
        </div>
      </div>
      <OrderModal
        isOpen={showModal}
        items={purchasedItems}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default OrdersPage;
