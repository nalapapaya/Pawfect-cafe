import React from 'react';
import InventoryCard from './InventoryCard';
import styles from './InventoryList.module.css'
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

const fetchInventory = async () => {
  return [ //change to api later
    { id: 1, name: "Fish", qty: 2 },
    { id: 2, name: "Carrot", qty: 5 },
    { id: 3, name: "Milk", qty: 1 },
  ];
};

const disposeItem = async (itemId) => {
  console.log(`Disposed item id: ${itemId}`);
  return itemId;
};

const InventoryList = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });

  const mutation = useMutation({
    mutationFn: disposeItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]); //refetch inventory list
    },
  });

  if (isLoading) return <p>Loading inventory...</p>;
  if (isError) return <p>Something went wrong.</p>;
  
    return (
        <div className={styles.invListCtn}>
      {data.map((item) => (
        <InventoryCard
          key={item.id}
          item={item}
          onDispose={() => mutation.mutate(item.id)}
        />
      ))}
    </div>
    );
};

export default InventoryList;