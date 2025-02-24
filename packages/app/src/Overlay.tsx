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
import { icons, Item, items, Recipe } from "./resources";
import { useSerialization } from "./lib/use-serialization";
import { Eraser, FileUp, FolderPen, Save, X } from "lucide-react";
import { RecipeShowcase } from "./components/RecipeShowcase";
import { useReactFlow } from "@xyflow/react";

const sortedItems = Object.values(items).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

type OverlayProps = {
  prompt?: boolean;
  recipes?: Recipe[];
  onNewItem: (item: Item) => void;
  onRecipeSelected: (recipe: Recipe | null) => void;
};

export function Overlay({ prompt, recipes, onNewItem, onRecipeSelected }: OverlayProps) {
  const flow = useReactFlow();
  const { load, save } = useSerialization();
  const [itemSelectorOpen, setItemSelectorOpen] = useState(false);

  const [factoryNameOpen, setFactoryNameOpen] = useState(false);
  const [factoryName, setFactoryName] = useState("");

  useKeyboard(
    "Space",
    useCallback(() => setItemSelectorOpen(!factoryNameOpen), [factoryNameOpen]),
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
            Press <span className="text-base font-mono bg-slate-900 text-white p-1 px-2 rounded">&lt;space&gt;</span> to
            start planning a factory.
          </p>
        </div>
      )}

      <CommandDialog open={itemSelectorOpen} onOpenChange={setItemSelectorOpen}>
        <Command>
          <CommandInput placeholder="Add an element to the schema ..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Factory controls">
              <CommandItem
                onSelect={async () => {
                  await load();
                  setItemSelectorOpen(false);
                  setTimeout(flow.fitView, 200);
                }}
                asChild
              >
                <button className="flex w-full items-center gap-2 cursor-pointer">
                  <FileUp />
                  <span>Load existing factory</span>
                </button>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setItemSelectorOpen(false);
                  setFactoryNameOpen(true);
                }}
                disabled={prompt}
                asChild
              >
                <button disabled={prompt} className="flex w-full items-center gap-2 cursor-pointer">
                  <Save />
                  <span>Save factory</span>
                </button>
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setItemSelectorOpen(false);
                  flow.setNodes([]);
                  flow.setEdges([]);
                }}
                disabled={prompt}
                asChild
              >
                <button disabled={prompt} className="flex w-full items-center gap-2 cursor-pointer">
                  <Eraser />
                  <span>Clear factory</span>
                </button>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Available items">
              {sortedItems.map((item) => (
                <CommandItem key={item.className} onSelect={handleItemSelect(item)} asChild>
                  <button className="flex w-full cursor-pointer items-center">
                    <img className="w-6 aspect-square overflow-hidden" src={icons[item.className]} alt={item.name} />
                    <span>{item.name}</span>
                  </button>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      <CommandDialog open={factoryNameOpen} onOpenChange={setFactoryNameOpen}>
        <Command filter={() => 1}>
          <CommandInput
            icon={FolderPen}
            value={factoryName}
            onInput={(e) => setFactoryName(e.currentTarget.value)}
            placeholder="Name your factory. (default: 'unnamed')"
          />
          <CommandList>
            <CommandGroup>
              <CommandItem
                asChild
                onSelect={() => {
                  save(factoryName || "unnamed");
                  setFactoryNameOpen(false);
                }}
              >
                <button className="flex w-full items-center gap-2 cursor-pointer">
                  <Save />
                  <span>Save</span>
                </button>
              </CommandItem>
              <CommandItem asChild onSelect={() => setFactoryNameOpen(false)}>
                <button className="flex w-full items-center gap-2 cursor-pointer">
                  <X />
                  <span>Cancel</span>
                </button>
              </CommandItem>
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
                <CommandItem key={recipe.className} onSelect={handleRecipeSelect(recipe)} asChild>
                  <button className="block w-full cursor-pointer py-2">
                    <RecipeShowcase {...recipe} />
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
