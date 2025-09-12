import React, { useState, useEffect } from "react";
import styles from "./KitchenPage.module.css";

const KitchenPage = () => {
  const [ingredients, setIngredients] = useState([null, null, null]);

  const handleAddIngredient = (item) => {
    const idx = ingredients.findIndex((slot) => slot === null); //find index of first null, no slot empty = -1
    if (idx >= 0) {
      const newSlots = [...ingredients]; //shallow copy
      newSlots[idx] = item; //enter ing into first empty slot
      setIngredients(newSlots);
      //   console.log("Added ingredient:", item);
      //   console.log("Updated slots:", newSlots);
    }
  };

  const handleRemoveIng = (idx) => {
    const newSlots = [...ingredients]; //shallow copy
    // console.log("Removed ingredient:", newSlots[idx]);
    newSlots[idx] = null; //set back to empty
    setIngredients(newSlots);
    // console.log("Updated slots:", newSlots);
  };

  const filledSlots = ingredients.filter((slot) => slot !== null); //find slots not null
  const filledCount = filledSlots.length; //count slots that are not = null
  const canCombine = filledCount >= 2; //only can combine for 2 or more ing

//   useEffect(() => {
//     console.log("Current slots:", ingredients);
//   }, [ingredients]);

const handleCombine = () => {
    setIngredients([null, null, null]);
}

  return (
    <div className={styles.kitchenPageCtn}>
      <div className={styles.kitchenCtn}>
        <div className={styles.combineCtn}>
          <div className={styles.ingInputCtn}>
            {ingredients.map((slot, idx) => (
              <div
                key={idx}
                className={styles.ingInput}
                onClick={() => slot && handleRemoveIng(idx)} //remove if slot not null
              >
                {slot ? slot.name : "add ingredient"}
              </div>
            ))}
          </div>
          <button disabled={!canCombine} className={styles.combineBtn} onClick={handleCombine}>
            <span className={styles.combineText}>Combine</span>
          </button>
        </div>
        <div className={styles.invListCtn}>
          <div className={styles.invListTitle}>Inventory</div>
          <div className={styles.invList}>
            <div onClick={() => handleAddIngredient({ name: "Tomato" })}>
              Tomato
            </div>
            <div onClick={() => handleAddIngredient({ name: "Cheese" })}>
              Cheese
            </div>
            <div onClick={() => handleAddIngredient({ name: "Bread" })}>
              Bread
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;
