const petImages = import.meta.glob("../assets/pets/*", { eager: true });

// flatten to an array of paths
export const getRandomPetImage = () => {
  const files = Object.values(petImages).map((m) => m.default); // returns { default: "/src/assets/pets/cat.png" },
  return files[Math.floor(Math.random() * files.length)]; //pick random
};
