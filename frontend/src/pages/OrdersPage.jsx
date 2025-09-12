import React, { useState } from "react";
import styles from "./OrdersPage.module.css";

const OrdersPage = () => {
  const [cart, setCart] = useState([]);
  const [shoppingList] = useState([
    { id: 1, name: "Tomato" },
    { id: 2, name: "Cheese" },
    { id: 3, name: "Bread" },
    { id: 4, name: "Milk" },
  ]);

  const handleAddToCart = (item) => {
    setCart([...cart, item]); // copy existing items, add the new one
    // console.log("Added to cart:", item);
    // console.log("Current cart:", [...cart, item]);
  };

  const handleRemoveFromCart = (idx) => {
    const newCart = [...cart];
    // console.log("Removed from cart:", newCart[idx]);
    newCart.splice(idx, 1); // remove 1 item at position idx
    setCart(newCart);
    // console.log("Current cart:", newCart);
  };

  return (
    <div className={styles.ordersPageCtn}>
      <div className={styles.ordersCtn}>
        <div className={styles.vendorListCtn}>
          <div className={styles.vendorListTitle}>Vendor List</div>
          {shoppingList.map((item) => (
            <div key={item.id}>
              {item.name}
              <button onClick={() => handleAddToCart(item)}>Buy</button>
            </div>
          ))}
        </div>
        <div className={styles.shoppingCartCtn}>
          <div className={styles.shoppingCartTitle}>Cart</div>
          {cart.length === 0 && <p>Cart is empty</p>}
          {cart.map((item, idx) => (
            <div key={idx}>
              {item.name}
              <button onClick={() => handleRemoveFromCart(idx)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
