import { icons, Item, recipes } from "@/resources";
import { getIncomers, getOutgoers, Handle, Position, useEdges, useReactFlow } from "@xyflow/react";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";
import { CommandDialog, Command, CommandGroup, CommandList, CommandInput, CommandItem } from "@/components/ui/command";
import { ArrowBigDown, ArrowBigUp, Check, ChefHat, PenLine, Trash, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Node, Edge, Production } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { DEBUG } from "@/lib/debug";
import { useStore } from "@/lib/store";

type ItemNodeProps = {
  id: string;
  positionAbsoluteX: number;
  positionAbsoluteY: number;
  data: { item: Item } & Production;
};

const epsilon = 1e-6;

export function ItemNode({
  id,
  positionAbsoluteX: x,
  positionAbsoluteY: y,
  data: { item, production },
}: ItemNodeProps) {
  const { calculateRates } = useStore();
  const flow = useReactFlow<Node, Edge>();
  const edges = useEdges<Edge>();

  const [showRequestInput, setShowRequestInput] = useState(false);
  const [requestedAmountStr, setRequestedAmountStr] = useState(production.requested.toString());

  const isBuildable = Object.values(recipes).some((recipe) =>
    recipe.products.some((product) => product.item === item.className),
  );
  const isIngredient = Object.values(recipes).some((recipe) =>
    recipe.ingredients.some((ingredient) => ingredient.item === item.className),
  );

  const { incoming, outgoing } = edges.reduce(
    (sum, { source, target }) => {
      return {
        incoming: sum.incoming + (target === item.className ? 1 : 0),
        outgoing: sum.outgoing + (source === item.className ? 1 : 0),
      };
    },
    { incoming: 0, outgoing: 0 },
  );
  const edgeCount = incoming + outgoing;

  const removeNode = useCallback(
    () => flow.deleteElements({ nodes: [{ id: item.className }] }),
    [flow, item.className],
  );

  const handleRequestCount = useCallback(() => {
    setShowRequestInput(false);
    const requestedAmount = parseFloat(requestedAmountStr);
    flow.updateNodeData(item.className, (n) => ({
      production: { ...n.data.production, isManual: requestedAmount > 0, requested: requestedAmount },
    }));
    setTimeout(calculateRates);
  }, [flow, item.className, requestedAmountStr, calculateRates]);

  useEffect(() => {
    flow.updateNode(item.className, { deletable: edgeCount === 0 });
  }, [flow, item.className, edgeCount]);

  useEffect(() => {
    const n = flow.getNodes();
    const e = flow.getEdges();

    const incomingRecipes = getIncomers({ id }, n, e).filter((n) => n.type === "recipe");
    const outgoingRecipes = getOutgoers({ id }, n, e).filter((n) => n.type === "recipe");

    for (const recipeNode of incomingRecipes) {
      getOutgoers(recipeNode, n, e)
        .sort((a, b) => a.position.x - b.position.x)
        .map((neighbor) => `${recipeNode.id}-${neighbor.id}`)
        .forEach((edge, i) => flow.updateEdgeData(edge, { handleIndex: i }));
    }

    for (const recipeNode of outgoingRecipes) {
      getIncomers(recipeNode, n, e)
        .sort((a, b) => a.position.x - b.position.x)
        .map((neighbor) => `${neighbor.id}-${recipeNode.id}`)
        .forEach((edge, i) => flow.updateEdgeData(edge, { handleIndex: i }));
    }
  }, [id, flow, edges.length, x, y]);

  const opacity = production.requested + production.available === 0 ? "60%" : "100%";

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
          style={{ opacity }}
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
          style={{ opacity }}
        />
      )}

      <ContextMenu>
        <ContextMenuTrigger>
          <HoverCard>
            <HoverCardTrigger>
              <div
                className={cn([
                  "flex gap-2 px-4 py-2 items-center bg-white border border-black rounded",
                  production.isManual && "bg-sky-500/10 border-sky-500 border-3",
                  production.requested - production.available > epsilon && "border-rose-400 border-3",
                  production.requested - production.available < -epsilon && "border-amber-400 border-3",
                ])}
                style={{ opacity }}
              >
                <img className="block w-8 aspect-square" src={icons[item.className]} alt={item.name} />
                <p>{item.name}</p>
                {parseFloat(requestedAmountStr) > 0 && <p className="text-sm">({parseFloat(requestedAmountStr)})</p>}
                {DEBUG && <pre className="text-xs">{JSON.stringify(production, null, 2)}</pre>}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="flex gap-2 items-center">
                {Math.abs(production.available - production.requested) <= epsilon && (
                  <>
                    <Check size="20" />
                    <span>Properly balanced.</span>
                  </>
                )}
                {production.available - production.requested > epsilon && (
                  <>
                    <ArrowBigUp size="20" />
                    <span>
                      Item overflow: (+
                      {(production.available - production.requested).toFixed(3)})
                    </span>
                  </>
                )}
                {production.available - production.requested < -epsilon && (
                  <>
                    <ArrowBigDown size="20" />
                    <span>Item underflow: ({(production.available - production.requested).toFixed(3)})</span>
                  </>
                )}
              </p>
            </HoverCardContent>
          </HoverCard>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="gap-2" onSelect={removeNode} disabled={edgeCount > 0}>
            <Trash size="16" />
            <span>Remove</span>
          </ContextMenuItem>
          <ContextMenuItem className="gap-2" disabled={outgoing > 0} onSelect={() => setShowRequestInput(true)}>
            <ChefHat size="16" />
            <span>Request amount</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <CommandDialog open={showRequestInput} onOpenChange={setShowRequestInput}>
        <Command filter={() => 1}>
          <CommandInput
            value={requestedAmountStr}
            onInput={(e) => setRequestedAmountStr(e.currentTarget.value)}
            placeholder={`Enter the requested amount for '${item.name}'.`}
          />
          <CommandList>
            <CommandGroup>
              <CommandItem asChild onSelect={handleRequestCount}>
                <button className="flex w-full items-center gap-2 cursor-pointer">
                  <PenLine />
                  <span>Request</span>
                </button>
              </CommandItem>
              <CommandItem asChild onSelect={() => setShowRequestInput(false)}>
                <button className="flex w-full items-center gap-2 cursor-pointer">
                  <X />
                  <span>Cancel</span>
                </button>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
