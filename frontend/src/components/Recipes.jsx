import React, { useState } from "react";
import styles from "./Recipes.module.css";
import CatalogModal from "../modals/CatalogModal";
import { getImage } from "../utils/getImage";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Recipes = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null); //track slot user clicked (add recipe)
  const { accessToken, setMessage } = useGame();
  const fetchData = useFetch();
  const queryClient = useQueryClient();
  const [newRecipe, setNewRecipe] = useState({
    ing1: null,
    ing2: null,
    ing3: null,
    combined: null,
  });

  // fetch recipes
  const {
    data: recipes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      return await fetchData("/recipes/", "GET", null, accessToken); //need the behind slash cause python strict
    },
  });

  // fetch catalog
  const { data: catalog } = useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      return await fetchData("/manage/catalog", "GET", null, accessToken);
    },
  });

  // find catalog item id
  const findItem = (id) => {
    if (!catalog) return null;
    return catalog.find((item) => item.id === id);
  };

  // handle selecting from modal
  const handleSelect = (selected) => {
    //pass id of selected item
    if (!activeSlot) return; //if slot not clicked -safer
    setNewRecipe((prev) => ({
      ...prev,
      [activeSlot]: selected.id, // set slot (ing1/ing2/ing3/combined) to chosen item id
    }));
    setModalOpen(false);
  };

  // handle save new recipe
  const handleSave = async () => {
    try {
      const res = await fetchData("/recipes/", "POST", newRecipe, accessToken);

      if (res.status === "error") {
        console.error("Save failed:", res.msg);
        setMessage("Recipe didn't get saved! Please try again later.");
        return;
      }
      console.log("Recipe saved!", res);
      queryClient.invalidateQueries(["recipes"]);
      setNewRecipe({ ing1: null, ing2: null, ing3: null, combined: null });
    } catch (err) {
      console.error("Error saving recipe:", err);
      setMessage("There's an error saving recipe.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetchData(
        `/recipes/${id}`,
        "DELETE",
        null,
        accessToken
      );
      if (res.status === "error") {
        console.error("Delete failed:", res.msg);
        return;
      }
      console.log("Recipe deleted!", id);
      queryClient.invalidateQueries(["recipes"]);
    } catch (err) {
      console.error("Error deleting recipe:", err);
      setMessage("There's an error deleting this recipe!");
    }
  };

  if (isLoading) return <p>Loading recipes...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.pageCtn}>
      {/* display existing recipes */}
      <div>
        {recipes &&
          recipes.map((recipe) => {
            //grab user recipe and send to array
            const ingredients = [recipe.ing1, recipe.ing2, recipe.ing3]; // for ing 123
            const combined = recipe.combined; // for combined food

            return (
              <div key={recipe.id} className={styles.recipesCtn}>
                {/* show ingredients */}
                {ingredients.map((ing, idx) => {
                  const item = findItem(ing); //find is in catalog
                  return (
                    <div key={idx} className={styles.itemBox}>
                      {item && ( //show from catalog info
                        <img
                          src={getImage(item.image_url, "ingredient")}
                          alt={item.name}
                          className={styles.itemImg}
                        />
                      )}
                    </div>
                  );
                })}

                <span>=</span>

                {/* show combined */}
                <div className={styles.itemBox}>
                  {combined //recipe.combined exists
                    ? (() => {
                        const item = findItem(combined); //get img from catalog
                        return item ? (
                          <img
                            src={getImage(item.image_url, "menu")}
                            alt={item.name}
                            className={styles.itemImg}
                          />
                        ) : (
                          "?" //if id not in catalog
                        );
                      })() // run function
                    : "?"}
                  {/* if recipe.combined = null - user can choose not to insert */}
                </div>

                <button onClick={() => handleDelete(recipe.id)}>delete</button>
              </div>
            );
          })}
      </div>

      {/* user add new recipe */}
      <div className={styles.newRecipeRow}>
        {["ing1", "ing2", "ing3"].map((slot, idx) => {
          //run for ing123 only
          const item = findItem(newRecipe[slot]);
          return (
            <div
              key={slot}
              className={styles.itemBox}
              onClick={() => {
                setActiveSlot(slot);
                setModalOpen(true);
              }}
            >
              {item ? (
                <img
                  src={getImage(item.image_url, "ingredient")}
                  alt={item.name}
                  className={styles.itemImg}
                />
              ) : (
                `ing ${idx + 1}` //change to empty or something
              )}
            </div>
          );
        })}

        <span>=</span>

        <div
          className={styles.itemBox}
          onClick={() => {
            setActiveSlot("combined");
            setModalOpen(true);
          }}
        >
          {newRecipe.combined
            ? (() => {
                const item = findItem(newRecipe.combined);
                return item ? (
                  <img
                    src={getImage(item.image_url, "menu")}
                    alt={item.name}
                    className={styles.itemImg}
                  />
                ) : (
                  "Combined Item" //fallback if id but not in catalog
                );
              })()
            : "combined"}
          {/* change to empty or something */}
        </div>

        <button onClick={handleSave}>save</button>
      </div>

      <CatalogModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleSelect}
        slotType={activeSlot === "combined" ? "combined" : "ingredient"} //which box user clicked = different popup
      />
    </div>
  );
};

export default Recipes;
