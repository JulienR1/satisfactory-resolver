import { icons, Item, recipes } from "@/resources";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { Trash } from "lucide-react";
import { useCallback, useEffect } from "react";

type ItemNodeProps = { data: { item: Item } };

export function ItemNode({ data: { item } }: ItemNodeProps) {
  const flow = useReactFlow();

  const isBuildable = Object.values(recipes).some((recipe) =>
    recipe.products.some((product) => product.item === item.className),
  );
  const isIngredient = Object.values(recipes).some((recipe) =>
    recipe.ingredients.some((ingredient) => ingredient.item === item.className),
  );

  const edgeCount = flow.getEdges().reduce((sum, { source, target }) => {
    const linked = source === item.className || target === item.className;
    return linked ? sum + 1 : sum;
  }, 0);

  const removeNode = useCallback(
    () => flow.deleteElements({ nodes: [{ id: item.className }] }),
    [flow, item.className],
  );

  useEffect(() => {
    flow.updateNode(item.className, { deletable: edgeCount === 0 });
  }, [flow, item.className, edgeCount]);

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

      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex gap-2 px-4 py-2 items-center bg-white border border-black rounded">
            <img
              className="block w-8 aspect-square"
              src={icons[item.className]}
              alt={item.name}
            />
            <p>{item.name}</p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="gap-2"
            onSelect={removeNode}
            disabled={edgeCount > 0}
          >
            <Trash size="16" />
            <span>Remove</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
