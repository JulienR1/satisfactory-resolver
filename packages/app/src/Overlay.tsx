import { useCallback, useState } from "react"
import { useKeyboard } from "./lib/use-keyboard"
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup, CommandDialog } from "@/components/ui/command"
import { Item, items, } from "./resources"

export function Overlay() {
    const [menuOpen, setMenuOpen] = useState(false)

    useKeyboard("Space", useCallback(() => setMenuOpen(true), []))
    useKeyboard("Escape", useCallback(() => setMenuOpen(false), []))

    const handleSelect = useCallback(function(item: Item) {
        return function() {
            console.log('selected:', item)
        }
    }, [])

    return <div className="fixed w-full h-full z-20">
        <CommandDialog open={menuOpen} onOpenChange={setMenuOpen}>
            <Command className="max-h-52 h-fit">
                <CommandInput placeholder="Add an element to the schema ..."
                />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                        {Object.values(items).map(item =>
                            <CommandItem key={item.className} onSelect={handleSelect(item)} asChild>
                                <button className="block w-full cursor-pointer">
                                    {item.name}
                                </button>
                            </CommandItem>
                        )}
                    </CommandGroup>
                </CommandList>
            </Command>
        </CommandDialog>
    </div >
}
