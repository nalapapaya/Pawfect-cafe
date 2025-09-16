import React, { useState } from "react";
import ItemsCard from "./ItemsCard";
import styles from "./MenuList.module.css";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useGame } from "../context/GameContext";
import useFetch from "../hooks/useFetch";

const MenuList = () => {
  const { accessToken } = useGame();
  const fetchData = useFetch();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const itemsPerPage = 9;

  // Fetch inventory from backend
  const fetchInventory = async () => {
    if (!accessToken) {
      throw new Error("No access token available"); //set isError
    }

    const res = await fetchData(
      "/manage/inventory/menu",
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
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });

  const mutation = useMutation({
    mutationFn: disposeItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]); // refetch inventory list
    },
    onError: (e) => {
      console.error("Failed to dispose item:", e.message);
    },
  });

  if (!accessToken) {
    return <p>Login to view the menu.</p>;
  }

  if (isLoading) return <p>Loading menu..</p>;

  if (isError) {
    //backend error
    return (
      <p>
        Error loading inventory: {error?.message || "Something went wrong."}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return <p>There's nothing in your menu, make some food in the kitchen!</p>;
  }

  const slicedData = data.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div className={styles.invListCtn}>
      <div className={styles.invItemsCtn}>
        {slicedData.map((item) => (
          <ItemsCard
            key={item.id}
            item={item}
            onDispose={(qtyChange = -1) =>
              mutation.mutate({
                itemId: item.id,
                qtyChange,
              })
            }
            isMenu
          />
        ))}
      </div>
      <div className={styles.pageBtnCtn}>
        {/* only show if not on first page */}
        {page > 0 && (
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className={styles.pageBtn}
          >
            {/* graphisc tech */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="currentColor"
            >
              <path d="M15 18l-6-6 6-6" />
              {/* M = move to point, l = draw line at point */}
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

export default MenuList;
