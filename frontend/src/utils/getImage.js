const ingredientImages = import.meta.glob("../assets/foods/Ingredients/*", {
  //glob = collect all files that matches this
  eager: true, //load immediately
});
const menuImages = import.meta.glob("../assets/foods/Menu/*", { eager: true });

export const getImage = (filename, type) => {
  //filename = string in db
  let key; //exact file path to lookup
  //   console.log("search:", filename, "in", type);
  //   console.log("ingredientImages:", Object.keys(ingredientImages)); //print all ingredients found
  //   console.log("menuImages:", Object.keys(menuImages)); //print all menu found
  // console.log("glob returns:", ingredientImages["../assets/foods/Ingredients/broccoli.png"]); // {default: "/src/assets/foods/Ingredients/broccoli.png"}

  if (type === "ingredient") {
    // for raw ingredients in inv
    key = `../assets/foods/Ingredients/${filename}`;
    return ingredientImages[key]?.default || null; //have to take value out of default from glob
  }

  if (type === "menu") {
    // for combined food in menu
    key = `../assets/foods/Menu/${filename}`;
    return menuImages[key]?.default || null;
  }

  return null; //no match fallback
};
