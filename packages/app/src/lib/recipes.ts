import { ItemDescriptor, recipes } from "../resources";

export function filterRecipes(target: ItemDescriptor, as: "input" | "output") {
  return Object.values(recipes)
    .filter((recipe) => {
      const position = as === "input" ? "ingredients" : "products";
      return recipe[position].some(({ item }) => item === target);
    })
    .sort((a, b) =>
      a.alternate !== b.alternate
        ? a.alternate
          ? 1
          : -1
        : a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );
}
