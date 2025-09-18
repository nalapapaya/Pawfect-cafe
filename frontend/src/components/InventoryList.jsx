import React, { useState, useEffect } from "react";
import ItemsCard from "./ItemsCard";
import styles from "./InventoryList.module.css";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";

const InventoryList = ({ onSelectItem, tempInventory }) => {
  const { accessToken } = useGame();
  const fetchData = useFetch();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0); // current page 0
  const itemsPerPage = 16; //max items before spilling next page
  const [slicedData, setSlicedData] = useState([]); //part of data after dividing into pages

  // Fetch inventory from backend
  const fetchInventory = async () => {
    if (!accessToken) {
      throw new Error("No access token available"); //set isError
    }

    const res = await fetchData(
      "/manage/inventory/raw",
      "GET",
      null,
      accessToken
    );

    if (!res.ok && res.msg) {
      throw new Error(res.msg);
    }

    // transform data to match structure
    return res.map((item) => ({
      id: item.id,
      name: item.name,
      qty: item.quantity,
      description: item.description,
      image_url: item.image_url,
      item_type: item.item_type,
      diet_type: item.diet_type,
    }));
  };

  // dispose/update inventory item
  const disposeItem = async ({ itemId, qtyChange }) => {
    if (!accessToken) {
      throw new Error("No access token available");
    }

    const res = await fetchData(
      "/manage/inventory",
      "POST",
      [
        {
          item_id: itemId,
          qty: qtyChange, // negative to deduct
        },
      ],
      accessToken
    );

    if (res && res.ok === false) {
      //safer if return data only
      throw new Error(res.msg || "Failed to update inventory");
    }
    return res;
  };

  //load inv
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inventoryRaw"],
    queryFn: fetchInventory,
  });

  const mutation = useMutation({
    mutationFn: disposeItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["inventoryRaw"]); // refetch inventory list
    },
    onError: (e) => {
      console.error("Failed to dispose item:", e.message);
    },
  });

  const handleDispose = (itemId, qtyChange = -1) => {
    //user only can use 1 item each time
    mutation.mutate({ itemId, qtyChange });
  };

  useEffect(() => {
    if (data) {
      //if data res is true
      setSlicedData(
        data
          .sort((a, b) => a.id - b.id) //sort by id so inv doesnt keep jumping
          .slice(page * itemsPerPage, (page + 1) * itemsPerPage) //slice this data into different pages
      );
    }
  }, [page, itemsPerPage, data]); //render everytime page or itemsPerPage changes

  if (!accessToken) {
    //why put here
    return <p>Login to view your inventory.</p>;
  }
  if (isLoading) return <p>Loading inventory..</p>;
  if (isError) {
    //backend error
    return (
      <p>
        Error loading inventory: {error?.message || "Something went wrong."}
      </p>
    );
  }
  if (!data || data.length === 0) {
    return <p>Your inventory is empty.</p>;
  }

  return (
    <div className={styles.invListCtn}>
      <div className={styles.invItemsCtn}>
        {slicedData.map((item) => {
          const adjustedQty =
            tempInventory && tempInventory[item.id] !== undefined //if temp has this item
              ? tempInventory[item.id] //adjust with frontend qty
              : item.qty; //else use backend qty

          return (
            <div
              key={item.id}
              onClick={() => adjustedQty > 0 && onSelectItem(item)} //allow select only if user has >=1
            >
              <ItemsCard
                item={{ ...item, qty: adjustedQty }} // show adjusted qty
                onDispose={(qtyChange) => handleDispose(item.id, qtyChange)}
                isKitchenPage
              />
            </div>
          );
        })}
      </div>
      <div className={styles.pageBtnCtn}>
        {/* only show if not on first page */}
        {page > 0 && (
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className={styles.pageBtn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="currentColor"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {/* only show if more than 1 pages */}
        {(page + 1) * itemsPerPage < data.length && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className={styles.pageBtn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="currentColor"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
