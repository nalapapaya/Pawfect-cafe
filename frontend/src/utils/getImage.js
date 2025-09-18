const ingredientImages = import.meta.glob("../assets/foods/Ingredients/*", {
  //glob = collect all files that matches this - linux command
  eager: true, //load immediately
});
const menuImages = import.meta.glob("../assets/foods/Menu/*", { eager: true });

export const getImage = (filename, type) => {
  //filename = string in db
  let key; //exact file path to lookup

  if (type === "ingredient") {
    // for raw ingredients in inv
    key = `../assets/foods/Ingredients/${filename}`;
    return ingredientImages[key]?.default || null; //have to take value out of default from glob
  }

  else if (type === "menu") {
    // for combined food in menu
    key = `../assets/foods/Menu/${filename}`;
    return menuImages[key]?.default || null;
  }

  return null; //no match fallback
};

export const getRandomMenuImage = () => {
  const files = Object.values(menuImages).map((m) => m.default); //returns default: path
  return files[Math.floor(Math.random() * files.length)]; // pick random
};