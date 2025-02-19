import { icons, ItemDescriptor, Recipe } from "@/resources";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { RecipeShowcase } from "./RecipeShowcase";
import { useCallback, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { ListCollapse, Trash } from "lucide-react";

type RecipeNodeProps = { data: { recipe: Recipe } };

export function RecipeNode({ data: { recipe } }: RecipeNodeProps) {
  const flow = useReactFlow();

  const [showDetails, setShowDetails] = useState(false);
  const machine = recipe.producedIn[0] as ItemDescriptor;

  const removeNode = useCallback(
    () => flow.deleteElements({ nodes: [{ id: recipe.className }] }),
    [flow, recipe.className],
  );

  return (
    <>
      {recipe.ingredients.map((ingredient, i) => (
        <Handle
          key={`${recipe.className}-in-${ingredient.item}`}
          id={`${recipe.className}-in-${ingredient.item}`}
          type="target"
          className="item-handle"
          position={Position.Top}
          isConnectable={false}
          style={{
            transform: `translate(${(i - recipe.ingredients.length / 2) * 125}%, -50%)`,
          }}
        />
      ))}

      {recipe.products.map((product, i) => (
        <Handle
          key={`${recipe.className}-out-${product.item}`}
          id={`${recipe.className}-out-${product.item}`}
          type="source"
          className="item-handle"
          position={Position.Bottom}
          isConnectable={false}
          style={{
            transform: `translate(${(i - recipe.products.length / 2) * 125}%, 50%)`,
          }}
        />
      ))}

      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="flex gap-2 px-4 py-2 items-center bg-white border border-black rounded"
            onDoubleClick={() => setShowDetails(true)}
          >
            {machine && (
              <img
                className="block w-8 aspect-square"
                src={icons[machine]}
                alt={machine}
              />
            )}
            <p>{recipe.name}</p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="gap-2"
            onSelect={() => setShowDetails(true)}
          >
            <ListCollapse size="16" />
            <span>Show details</span>
          </ContextMenuItem>
          <ContextMenuItem className="gap-2" onSelect={removeNode}>
            <Trash size="16" />
            <span>Remove</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <CommandDialog open={showDetails} onOpenChange={setShowDetails}>
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>
                <RecipeShowcase {...recipe} />
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
