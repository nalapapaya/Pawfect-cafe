import React from "react";
import styles from "./CatalogModal.module.css";
import { useQuery } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import ItemsCard from "../components/ItemsCard";
import { useGame } from "../context/GameContext";

const CatalogModal = ({ isOpen, onClose, onSelect, slotType }) => {
  const { accessToken } = useGame();
  const fetchData = useFetch();

  const fetchCatalog = async () => {
    const res = await fetchData("/manage/catalog", "GET", null, accessToken);
    if (!res.ok && res.msg) throw new Error(res.msg);
    return res;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["catalog"],
    queryFn: fetchCatalog,
    enabled: isOpen, // only fetch when modal is open
  });

  if (!isOpen) return null;

  // filter based with slottype (box that user clicked)
  const filtered =
    data?.filter(
      (item) =>
        slotType === "ingredient"
          ? item.item_type === "raw" //show raw items only
          : item.item_type === "combined" //show combined items only
    ) || []; //fall back return emtpy

  if (isLoading) return <p>Loading catalog..</p>;
  if (isError) return <p>Error loading catalog.</p>;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalTitle}>
          Select {slotType === "ingredient" ? "Ingredient" : "Combined Food"}
        </div>
        <div className={styles.itemsGrid}>
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelect({ id: item.id, image_url: item.image_url });
                onClose();
              }}
            >
              <ItemsCard item={{ ...item }} isOrdersPage hideQty />
            </div>
          ))}
        </div>
        <button onClick={onClose} className={styles.closeBtn}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CatalogModal;
