import _recipes from "../../../res/recipes.json";
import _items from "../../../res/items.json";
import _icons from "../../../res/icons.json";

export type ItemDescriptor = keyof typeof _items;
export type RecipeDescriptor = keyof typeof _recipes;

export type Item = {
  abbreviation: string | null;
  alienItem: boolean;
  canBeDiscarded: boolean;
  className: ItemDescriptor;
  description: string;
  energy: number;
  experimental: boolean;
  fluidColor: string;
  form: string;
  name: string;
  radioactive: number;
  sinkPoints: number;
  stable: boolean;
  stackSize: number;
  unlockedBy: string;
};

export type RecipeItem = { amount: number; item: ItemDescriptor };

export type Recipe = {
  alternate: boolean;
  className: RecipeDescriptor;
  duration: number;
  experimental: boolean;
  inBuildGun: boolean;
  inCraftBench: boolean;
  inCustomizer: boolean;
  inWorkshop: boolean;
  ingredients: RecipeItem[];
  manualCraftingMultiplier: number;
  maxPower: number | null;
  minPower: number | null;
  name: string;
  producedIn: string[];
  products: RecipeItem[];
  seasons: Array<unknown>;
  stable: boolean;
  unlockedBy: string;
};

const recipes = {} as Record<RecipeDescriptor, Recipe>;
for (const [recipe] of Object.values(_recipes)) {
  if ((recipe as Recipe).inBuildGun === false) {
    // @ts-expect-error Cannot know which className is used to index this recipe
    recipes[recipe.className] = recipe;
  }
}

const items = {} as Record<ItemDescriptor, Item>;
for (const [item] of Object.values(_items)) {
  // @ts-expect-error Cannot know which className is used to index this item
  items[item.className] = item;
}

const icons = _icons as unknown as Record<ItemDescriptor, string>;

export { recipes, items, icons };
