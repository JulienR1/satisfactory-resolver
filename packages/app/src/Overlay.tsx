import { useCallback, useState } from "react";
import { useKeyboard } from "./lib/use-keyboard";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  CommandDialog,
} from "@/components/ui/command";
import { icons, Item, items, Recipe, RecipeItem } from "./resources";

const sortedItems = Object.values(items).sort((a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
);

type OverlayProps = {
  prompt?: boolean;
  recipes?: Recipe[];
  onNewItem: (item: Item) => void;
  onRecipeSelected: (recipe: Recipe | null) => void;
};

export function Overlay({
  prompt,
  recipes,
  onNewItem,
  onRecipeSelected,
}: OverlayProps) {
  const [itemSelectorOpen, setItemSelectorOpen] = useState(false);

  useKeyboard(
    "Space",
    useCallback(() => setItemSelectorOpen(true), []),
  );
  useKeyboard(
    "Escape",
    useCallback(() => setItemSelectorOpen(false), []),
  );

  const handleItemSelect = useCallback(
    function (item: Item) {
      return () => {
        onNewItem(item);
        setItemSelectorOpen(false);
      };
    },
    [onNewItem],
  );

  const handleRecipeSelect = useCallback(
    function (recipe: Recipe) {
      return () => onRecipeSelected(recipe);
    },
    [onRecipeSelected],
  );

  return (
    <div className="fixed w-full h-full z-20 pointer-events-none">
      {prompt && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <p className="font-semibold text-lg opacity-75 text-slate-900">
            Press{" "}
            <span className="text-base font-mono bg-slate-900 text-white p-1 px-2 rounded">
              &lt;space&gt;
            </span>{" "}
            to start planning a factory.
          </p>
        </div>
      )}

      <CommandDialog open={itemSelectorOpen} onOpenChange={setItemSelectorOpen}>
        <Command className="max-h-52 h-fit">
          <CommandInput placeholder="Add an element to the schema ..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {sortedItems.map((item) => (
                <CommandItem
                  key={item.className}
                  onSelect={handleItemSelect(item)}
                  asChild
                >
                  <button className="block w-full cursor-pointer">
                    {item.name}
                  </button>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      <CommandDialog
        className="sm:max-w-2xl"
        open={recipes && recipes.length > 0}
        onOpenChange={(open) => {
          if (!open) {
            onRecipeSelected(null);
          }
        }}
      >
        <Command className="h-fit">
          <CommandInput placeholder="Select a recipe ..." />
          <CommandList>
            <CommandEmpty>No recipes found.</CommandEmpty>
            <CommandGroup>
              {(recipes ?? []).map((recipe) => (
                <CommandItem
                  key={recipe.className}
                  onSelect={handleRecipeSelect(recipe)}
                  asChild
                >
                  <button className="block w-full cursor-pointer">
                    <div className="flex flex-col justify-center w-full border rounded">
                      <p className="flex font-semibold border-b p-2 items-center justify-center gap-2">
                        <span className="block">{recipe.name}</span>
                        {recipe.alternate && (
                          <span
                            className="block px-2 py-0.5 text-purple-600 border-2 border-purple-600 font-bold text-xs rounded-sm"
                            style={{ fontVariant: "small-caps" }}
                          >
                            alternate
                          </span>
                        )}
                      </p>
                      <div className="flex justify-evenly items-center relative">
                        <ul>
                          {recipe.ingredients.map((ingredient) => (
                            <RecipeListItem
                              key={ingredient.item}
                              {...ingredient}
                            />
                          ))}
                        </ul>
                        <div className="bg-border w-[1px] h-full absolute"></div>
                        <ul>
                          {recipe.products.map((product) => (
                            <RecipeListItem key={product.item} {...product} />
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

function RecipeListItem({ item, amount }: RecipeItem) {
  return (
    <li className="flex gap-2 items-center p-1">
      <img className="block w-6 aspect-square" src={icons[item]} alt={item} />
      <p>
        <span>{items[item].name}</span>
        <span className="text-muted-foreground px-1">({amount}/min)</span>
      </p>
    </li>
  );
}
