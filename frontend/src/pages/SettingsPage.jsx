import { useState } from "react";
import styles from "./SettingsPage.module.css";
import Profile from "../components/Profile";
import Recipes from "../components/Recipes";
import { useGame } from "../context/GameContext";
import AdminPanel from "../components/AdminPanel";

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("profile");
  const { roleId } = useGame(); // for access permission

  return (
    <div className={styles.settingsCtn}>
      <div className={styles.setContentCtn}>
        <div className={styles.tabContainer}>
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tab} ${
                activeTab === "profile" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "recipes" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("recipes")}
            >
              Recipes
            </button>
            {roleId === 1 && ( // only show tab if user is admin
              <button
                className={`${styles.tab} ${
                  activeTab === "adminPanel" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("adminPanel")}
              >
                Admin
              </button>
            )}
          </div>

          <div
            className={`${styles.tabContent} ${
              activeTab === "profile" ? styles.active : ""
            }`}
          >
            <Profile />
          </div>
          <div
            className={`${styles.tabContent} ${
              activeTab === "recipes" ? styles.active : ""
            }`}
          >
            <Recipes />
          </div>
          <div
            className={`${styles.tabContent} ${
              activeTab === "adminPanel" ? styles.active : ""
            }`}
          >
            <AdminPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
