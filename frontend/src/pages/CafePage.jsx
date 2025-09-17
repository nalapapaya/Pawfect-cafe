import React, { useState, useEffect } from "react";
import styles from "./CafePage.module.css";
import Menu from "../components/Menu";
import CafeGame from "../components/CafeGame";
import { getRandomPetImage } from "../utils/getRandomImage";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const CafePage = () => {
  const {
    setHeartCount,
    setIsFed,
    accessToken,
    isFed,
    setCoinCount,
    setTotalHeartsEarned,
    setTotalCoinsEarned,
  } = useGame();
  //random image at spawn
  const [currentChar, setCurrentChar] = useState(getRandomPetImage());
  const [currentFood, setCurrentFood] = useState(null);
  const fetchData = useFetch();

  const queryClient = useQueryClient();
  const fetchCatalog = async () => {
    const res = await fetchData("/manage/catalog", "GET", null, accessToken);
    if (!res.ok && res.msg) throw new Error(res.msg);
    return res;
  };

  // fetch catalog
  const { data: catalog } = useQuery({
    queryKey: ["catalog"],
    queryFn: fetchCatalog,
  });

  // picking random food from catalog (menu)
  const getRandomMenuItem = (catalog) => {
    if (!catalog) return null; // safer when return undefined
    const combined = catalog.filter(
      (item) =>
        item.item_type === "combined" && item.name.toLowerCase() !== "kibbles"
    ); // only want combined items, exclude kibbles
    return combined[Math.floor(Math.random() * combined.length)]; //send random food
  };

  useEffect(() => {
    if (catalog) {
      setCurrentFood(getRandomMenuItem(catalog));
    }
  }, [catalog]);

  const handleFeed = async (fedItemId) => {
    try {
      if (!currentFood) return;
      setIsFed(true);

      // check if feed id match displayed id (w/ penalty)
      const isCorrect = fedItemId === currentFood.id;
      const heartPoints = isCorrect ? 10 : 5;
      const coinPoints = isCorrect ? 50 : 20;

      //update score on frontend immediately
      setHeartCount((prev) => prev + heartPoints);
      setCoinCount((prev) => prev + coinPoints);
      setTotalHeartsEarned((prev) => prev + heartPoints);
      setTotalCoinsEarned((prev) => prev + coinPoints);

      //sync with backend scores
      const scoreRes = await fetchData(
        "/api/score",
        "POST",
        { heart_score: heartPoints, coin_score: coinPoints },
        accessToken
      );

      //sync with inventory (deduct)
      await fetchData(
        "/manage/inventory",
        "POST",
        [{ item_id: fedItemId, qty: -1 }],
        accessToken
      );

      queryClient.invalidateQueries(["inventory"]); //refresh inventory
      queryClient.invalidateQueries(["inventoryMenu"]); //refresh menu

      if (scoreRes?.ok === false) {
        //safer if req fail
        console.error("Failed to update score:", scoreRes.msg);
        // rollback if backend fails (to match backend)
        setHeartCount((prev) => prev - heartPoints);
        setCoinCount((prev) => prev - coinPoints);
      } else {
        console.log("Score updated:", scoreRes.msg);
      }

      // reset after feeding animation
      setTimeout(() => {
        setIsFed(false);
        setCurrentChar(getRandomPetImage());
        setCurrentFood(getRandomMenuItem(catalog));
      }, 2500);
    } catch (e) {
      console.error("Error feeding:", e);
      setIsFed(false);
    }
  };

  const handleSkip = async () => {
    setIsFed(false);

    //update score on frontend immediately
    setHeartCount((prev) => Math.max(0, prev - 2)); //cannot be less than 0

    //sync with backend
    await fetchData("/api/score", "POST", { heart_score: -2 }, accessToken);

    setCurrentChar(getRandomPetImage());
    setCurrentFood(getRandomMenuItem(catalog));
  };

  useEffect(() => {
    if (!isFed) {
      //new character when animation is done
      setCurrentChar(getRandomPetImage());
      setCurrentFood(getRandomMenuItem(catalog));
    }
  }, [isFed]);

  return (
    <div className={styles.cafePageCtn}>
      <Menu handleFeed={handleFeed} />
      <CafeGame
        handleSkip={handleSkip}
        currentChar={currentChar}
        currentFood={currentFood}
      />
    </div>
  );
};

export default CafePage;
