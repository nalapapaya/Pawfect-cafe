import React from 'react';
import styles from './InventoryCard.module.css'
import { useGame } from '../context/GameContext';
import useFetch from '../hooks/useFetch';

const InventoryCard = ({ item, onDispose }) => {
  const {setIsFed, setHeartCount, setCoinCount, accessToken} = useGame();
  const fetchData = useFetch();
    const handleFeed = async () => {
    setIsFed(true);

    //update score on frontend immediately
    setHeartCount((prev) => prev + 10);
    setCoinCount((prev) => prev + 50);
    // console.log("accessToken at feed:", accessToken);

    //sync with backend
    await fetchData(
      "/api/score",
      "POST",
      {
        heart_score: 10,
        coin_score: 50,
      },
      accessToken
    );

    setTimeout(() => {
      //to reset after 2.5s
      setIsFed(false);
    }, 2500);
  };
  return (
    <div>
      {/* <button onClick={onDispose}>Dispose</button> */}
       <button onClick={handleFeed} className={styles.feedBtn}>
             {item.name} {item.qty}
          </button>
    </div>
  );
};

export default InventoryCard;