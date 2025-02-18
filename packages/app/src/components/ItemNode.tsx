import { Item, recipes } from "@/resources";
import { Handle, Position } from "@xyflow/react";

type ItemNodeProps = { data: { item: Item } };

export function ItemNode({ data: { item } }: ItemNodeProps) {
  const isBuildable = Object.values(recipes).some((recipe) =>
    recipe.products.some((product) => product.item === item.className),
  );
  const isIngredient = Object.values(recipes).some((recipe) =>
    recipe.ingredients.some((ingredient) => ingredient.item === item.className),
  );

  return (
    <>
      {isBuildable && (
        <Handle
          id="input"
          type="target"
          position={Position.Top}
          className="item-handle"
          isConnectable
          isConnectableEnd={false}
        />
      )}
      <div className="flex gap-2 px-4 py-2 items-center bg-white border border-black rounded">
        <img
          className="block w-8 aspect-square"
          src="https://satisfactory.wiki.gg/images/0/0a/Iron_Ingot.png"
          alt={item.name}
        />
        <p>{item.name}</p>
      </div>
      {isIngredient && (
        <Handle
          id="output"
          type="source"
          position={Position.Bottom}
          className="item-handle"
          isConnectableStart
          isConnectableEnd={false}
        />
      )}
    </>
  );
}
