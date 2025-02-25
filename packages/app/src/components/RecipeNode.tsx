import { icons, ItemDescriptor, Recipe } from "@/resources";
import { getIncomers, getOutgoers, Handle, Position, useNodes, useReactFlow } from "@xyflow/react";
import { Command, CommandDialog, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { RecipeShowcase } from "./RecipeShowcase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import { ListCollapse, Star, Trash } from "lucide-react";
import { Production } from "@/lib/constants";
import { DEBUG } from "@/lib/debug";

type RecipeNodeProps = { id: string; data: { recipe: Recipe; priority?: boolean } & Production };

export function RecipeNode({ id, data: { recipe, production, priority } }: RecipeNodeProps) {
  const flow = useReactFlow();
  const nodes = useNodes();

  const [showDetails, setShowDetails] = useState(false);
  const machine = recipe.producedIn[0] as ItemDescriptor;

  const removeNode = useCallback(
    () => flow.deleteElements({ nodes: [{ id: recipe.className }] }),
    [flow, recipe.className],
  );

  useEffect(() => {
    const edges = flow.getEdges();
    const ingredients = edges.filter((edge) => edge.target === recipe.className);
    const products = edges.filter((edge) => edge.source === recipe.className);

    for (const edge of ingredients) {
      const ingredient = recipe.ingredients.find((ingredient) => ingredient.item === edge.source)!;
      flow.updateEdgeData(edge.id, { rate: production.requested * ingredient.amount });
    }
    for (const edge of products) {
      const product = recipe.products.find((product) => product.item === edge.target)!;
      flow.updateEdgeData(edge.id, { rate: production.requested * product.amount });
    }
  }, [flow, recipe, production.requested, production.available]);

  const canBePrioritized = useMemo(() => {
    const edges = flow.getEdges();
    const products = getOutgoers({ id }, nodes, edges);
    return products.some((product) => getIncomers(product, nodes, edges).length > 1);
  }, [id, flow, nodes]);

  const markAsPriority = useCallback(() => {
    const edges = flow.getEdges();
    const products = getOutgoers({ id }, nodes, edges);
    const recipeIds = new Set(products.flatMap((p) => getIncomers(p, nodes, edges).map(({ id }) => id)));
    recipeIds.forEach((recipeId) => flow.updateNodeData(recipeId, { priority: recipeId === id }));
  }, [id, flow, nodes]);

  return (
    <>
      {recipe.ingredients.map((_, i) => (
        <Handle
          key={`handle-${i}`}
          id={`handle-${i}`}
          type="target"
          className="item-handle"
          position={Position.Top}
          isConnectable={false}
          style={{
            transform: `translate(${(i - recipe.ingredients.length / 2) * 125}%, -50%)`,
          }}
        />
      ))}

      {recipe.products.map((_, i) => (
        <Handle
          key={`handle-${i}`}
          id={`handle-${i}`}
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
            {machine && <img className="block w-8 aspect-square" src={icons[machine]} alt={machine} />}
            <p className="flex items-center gap-2">
              <span>{recipe.name}</span>
              <span className="text-sm">({Math.round(1000 * production.requested) / 1000})</span>
            </p>
            {DEBUG && <pre className="text-xs">{JSON.stringify(production, null, 2)}</pre>}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="gap-2" onSelect={() => setShowDetails(true)}>
            <ListCollapse size="16" />
            <span>Show details</span>
          </ContextMenuItem>
          <ContextMenuItem className="gap-2" onSelect={removeNode}>
            <Trash size="16" />
            <span>Remove</span>
          </ContextMenuItem>
          {
            <ContextMenuItem className="gap-2" onSelect={markAsPriority} disabled={!canBePrioritized || priority}>
              <Star size="16" />
              <span>{priority ? "Marked as priority" : "Mark as priority"}</span>
            </ContextMenuItem>
          }
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
