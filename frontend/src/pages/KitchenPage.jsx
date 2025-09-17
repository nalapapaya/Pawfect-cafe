import React, { useState } from "react";
import styles from "./KitchenPage.module.css";
import InventoryList from "../components/InventoryList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";
import { getImage } from "../utils/getImage";

const KitchenPage = () => {
  const [ingredients, setIngredients] = useState([null, null, null]);
  const [tempInventory, setTempInventory] = useState(null); // track frontend inv adjustment
  const { accessToken, setMessage } = useGame();
  const fetchData = useFetch();
  const queryClient = useQueryClient();
  const filledSlots = ingredients.filter((slot) => slot !== null); // only slots with ingredient
  // const canCombine = filledSlots.length >= 2; //can only combine with 2 or more

  // helper fn to commit mutation
  const commitIngredients = async (slots) => {
    const payload = slots.map((item) => ({
      item_id: item.id,
      qty: -1,
    }));

    const res = await fetchData(
      "/manage/inventory",
      "POST",
      payload,
      accessToken
    );
    if (res && res.ok === false) {
      //safer to use data
      throw new Error(res.msg || "Failed to update inventory");
    }
    return res;
  };

  // mutation
  const mutation = useMutation({
    mutationFn: commitIngredients,
    onSuccess: () => {
      queryClient.invalidateQueries(["inventoryRaw"]); //refresh raw inventory
    },
    onError: (e) => {
      console.error("Inventory update failed:", e.message);
    },
  });

  const handleAddIngredient = (item) => {
    if (item.qty <= 0) return; // nothing to add if qty is 0

    const idx = ingredients.findIndex((slot) => slot === null); // find first empty slot
    if (idx >= 0) {
      //if empty slot exists
      const newSlots = [...ingredients]; //copy current
      newSlots[idx] = item; //enter item into first empty
      setIngredients(newSlots); //update with new

      // temporary frontend deduction
      setTempInventory((prev) => ({
        ...prev,
        [item.id]: (prev?.[item.id] ?? item.qty) - 1, //if item, qty-1
      }));
    }
  };

  const handleRemoveIng = (idx) => {
    const removedItem = ingredients[idx]; //object in slot
    if (!removedItem) return;

    const newSlots = [...ingredients]; //shallow copy
    newSlots[idx] = null; //reset to null when clicked remove
    setIngredients(newSlots); //update cleared slot

    // temporary frontend restore
    setTempInventory((prev) => ({
      ...prev,
      [removedItem.id]: (prev?.[removedItem.id] ?? removedItem.qty) + 1,
    }));
  };

  const handleCombine = async () => {
    if (filledSlots.length < 2)
      return setMessage("Add at least 2 ingredients to combine!"); //must have 2 ing to combine

    try {
      const payload = filledSlots.map((item) => ({
        item_id: item.id,
        qty: -1, // always deduct
      }));

      const res = await fetchData(
        "/manage/inventory/combine",
        "POST",
        payload,
        accessToken
      );

      if (res?.ok === false || res?.status === "error") {
        console.log(`Combine failed: ${res.msg}`);
        setMessage("Failed to combine, please try again later.");
        return;
      }

      // reset slots + temp inv
      setIngredients([null, null, null]);
      setTempInventory(null);

      // refresh inv
      queryClient.invalidateQueries(["inventoryRaw"]);
    } catch (e) {
      console.error("Combine error:", e);
      setMessage("Something went wrong. We can't combine items now.");
    }
  };

  return (
    <div className={styles.kitchenPageCtn}>
      <div className={styles.kitchenCtn}>
        <div className={styles.combineCtn}>
          <div className={styles.ingInputCtn}>
            {ingredients.map((slot, idx) => {
              if (!slot) {
                return (
                  <div key={idx} className={styles.ingInput}>
                    Empty
                  </div>
                );
              }
              const imageSrc = getImage(
                slot.image_url,
                slot.item_type === "raw" ? "ingredient" : "menu"
              );
              return (
                <div
                  key={idx}
                  className={styles.ingInput}
                  onClick={() => handleRemoveIng(idx)}
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={slot.name}
                      className={styles.itemImage}
                    />
                  ) : (
                    <div className={styles.itemImage}>No Img</div>
                  )}
                </div>
              );
            })}
          </div>
          <button
            // disabled={!canCombine}
            className={styles.combineBtn}
            onClick={handleCombine}
          >
            <span className={styles.combineText}>Combine</span>
          </button>
        </div>

        <div className={styles.invListCtn}>
          <div className={styles.invListTitle}>Inventory</div>
          <div className={styles.invList}>
            <InventoryList
              onSelectItem={handleAddIngredient}
              tempInventory={tempInventory} // pass temp adjustments
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;
