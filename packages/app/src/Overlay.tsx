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
import { Item, items, Recipe } from "./resources";

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
            to begin planning a factory.
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
        open={recipes && recipes.length > 0}
        onOpenChange={(open) => {
          if (!open) {
            onRecipeSelected(null);
          }
        }}
      >
        <Command className="max-h-52 h-fit">
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
                    {recipe.name}
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
