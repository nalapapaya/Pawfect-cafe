import React, { useState } from "react";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";
import styles from "./AdminPanel.module.css";

const AdminPanel = () => {
  const { accessToken, setMessage, setCoinCount, setHeartCount } = useGame();
  const fetchData = useFetch();

  const [username, setUsername] = useState(""); // admin input for username
  const [heartPoints, setHeartPoints] = useState(0);
  const [coinPoints, setCoinPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username) {
      setMessage("Please select a user");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchData(
        "/api/admin/score",
        "POST",
        {
          username,
          heart_score: Number(heartPoints),
          coin_score: Number(coinPoints),
        },
        accessToken
      );

      if (res?.status === "error") {
        setMessage(`Error: ${res.msg}`);
      } else {
        setMessage(res.msg || "Score updated successfully!");

        //update frontend
        if (username === localStorage.getItem("username")) {
          if (coinPoints) {
            setCoinCount((prev) => prev + Number(coinPoints));
          }
          if (heartPoints) {
            setHeartCount((prev) => prev + Number(heartPoints));
          }
        }

        setHeartPoints(0);
        setCoinPoints(0);
        setUsername("");
      }
      setLoading(false);
    } catch (e) {
      setMessage("Something went wrong while updating score.");
    }
  };

  return (
    <div className={styles.adminPanel}>
      <div className={styles.title}>Add Points</div>
      <div className={styles.inlineRow}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.inputCtn}>
          <div>
            
              <img
                src="./src/assets/gamePlay/pinkHeart.png"
                alt="Hearts"
                className={styles.img}
              />
        
            <input
              type="number"
              value={heartPoints}
              onChange={(e) => setHeartPoints(e.target.value)}
            />
          </div>
          <div>
            
              <img
                src="./src/assets/gamePlay/pawCoin.png"
                alt="Coins"
                className={styles.img}
              />
           
            <input
              type="number"
              value={coinPoints}
              onChange={(e) => setCoinPoints(e.target.value)}
            />
          </div>
          <button className={styles.addBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
