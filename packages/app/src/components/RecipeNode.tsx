import { icons, ItemDescriptor, Recipe } from "@/resources";
import { Handle, Position } from "@xyflow/react";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { RecipeShowcase } from "./RecipeShowcase";
import { useState } from "react";

type RecipeNodeProps = { data: { recipe: Recipe } };

export function RecipeNode({ data: { recipe } }: RecipeNodeProps) {
  const [showDetails, setShowDetails] = useState(false);
  const machine = recipe.producedIn[0] as ItemDescriptor;

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
