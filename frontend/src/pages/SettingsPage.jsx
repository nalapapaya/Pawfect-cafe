import { useState } from "react";
import styles from "./SettingsPage.module.css";
import MenuList from "../components/MenuList";
import Profile from "../components/Profile";

export default function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className={styles.settingsCtn}>
      <div className={styles.setContentCtn}>
        <div className={styles.tabContainer}>
          <div className={styles.tabButtons}>
            <button
              className={`${styles.tab} ${activeTab === "profile" ? styles.active : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`${styles.tab} ${activeTab === "achievements" ? styles.active : ""}`}
              onClick={() => setActiveTab("achievements")}
            >
              Achievements
            </button>
            <button
              className={`${styles.tab} ${activeTab === "inventory" ? styles.active : ""}`}
              onClick={() => setActiveTab("inventory")}
            >
              Inventory
            </button>
          </div>

          <div className={`${styles.tabContent} ${activeTab === "profile" ? styles.active : ""}`}>
            <Profile/>
          </div>
          <div className={`${styles.tabContent} ${activeTab === "achievements" ? styles.active : ""}`}>
            <p>Content 2</p>
          </div>
          <div className={`${styles.tabContent} ${activeTab === "inventory" ? styles.active : ""}`}>
            <MenuList/>
          </div>
        </div>
      </div>
    </div>
  );
}
