import { Recipe } from "@/resources";
import { Handle, Position } from "@xyflow/react";

type RecipeNodeProps = { data: { recipe: Recipe } };

export function RecipeNode({ data: { recipe } }: RecipeNodeProps) {
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

      <div className="flex gap-2 px-4 py-2 items-center bg-white border border-black rounded">
        <img
          className="block w-8 aspect-square"
          src="https://satisfactory.wiki.gg/images/1/19/Crafting_Bench.png"
          alt={recipe.producedIn[0] ?? "crafting bench"}
        />
        <p>{recipe.name}</p>
      </div>

      {recipe.products.map((product) => (
        <Handle
          key={`${recipe.className}-out-${product.item}`}
          id={`${recipe.className}-out-${product.item}`}
          type="source"
          className="item-handle"
          position={Position.Bottom}
          isConnectable={false}
        />
      ))}
    </>
  );
}
