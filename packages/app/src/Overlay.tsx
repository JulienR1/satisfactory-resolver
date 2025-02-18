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
import { Item, items } from "./resources";

const sortedItems = Object.values(items).sort((a, b) =>
  a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
);

type OverlayProps = { prompt?: boolean; onNewItem: (item: Item) => void };

export function Overlay({ prompt, onNewItem }: OverlayProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useKeyboard(
    "Space",
    useCallback(() => setMenuOpen(true), []),
  );
  useKeyboard(
    "Escape",
    useCallback(() => setMenuOpen(false), []),
  );

  const handleSelect = useCallback(
    function (item: Item) {
      return () => onNewItem(item);
    },
    [onNewItem],
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

      <CommandDialog open={menuOpen} onOpenChange={setMenuOpen}>
        <Command className="max-h-52 h-fit">
          <CommandInput placeholder="Add an element to the schema ..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {sortedItems.map((item) => (
                <CommandItem
                  key={item.className}
                  onSelect={handleSelect(item)}
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
    </div>
  );
}
