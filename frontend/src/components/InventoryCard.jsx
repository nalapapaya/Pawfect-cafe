import React from 'react';
import styles from './InventoryCard.module.css'

const InventoryCard = ({ item, onDispose }) => {
  return (
    <div>
      <h4>{item.name}</h4>
      <p>Quantity: {item.qty}</p>
      {/* <button onClick={onDispose}>Dispose</button> */}
    </div>
  );
};

export default InventoryCard;