import { icons, Item, recipes } from "@/resources";
import { Handle, Position, useEdges, useReactFlow } from "@xyflow/react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import {
  CommandDialog,
  Command,
  CommandGroup,
  CommandList,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  ArrowBigDown,
  ArrowBigUp,
  Check,
  ChefHat,
  PenLine,
  Trash,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Node, Edge, Production } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type ItemNodeProps = { data: { item: Item } & Production };

export function ItemNode({ data: { item, production } }: ItemNodeProps) {
  const flow = useReactFlow<Node, Edge>();
  const edges = useEdges<Edge>();

  const [showRequestInput, setShowRequestInput] = useState(false);
  const [requestedAmount, setRequestedAmount] = useState(0);

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
    flow.updateNodeData(item.className, (n) => ({
      production: { ...n.data.production, requested: requestedAmount },
    }));
    // TODO: propagate event through graph to recalculate
  }, [flow, item.className, requestedAmount]);

  useEffect(() => {
    flow.updateNode(item.className, { deletable: edgeCount === 0 });
  }, [flow, item.className, edgeCount]);

  useEffect(() => {
    const edges = flow.getEdges();
    const incoming = edges.filter((edge) => edge.target === item.className);
    const outgoing = edges.filter((edge) => edge.source === item.className);

    for (const edge of incoming) {
      flow.updateEdgeData(edge.id, { rate: production.available });
    }
    for (const edge of outgoing) {
      flow.updateEdgeData(edge.id, { rate: production.requested });
    }
  }, [flow, item, production.requested, production.available]);

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
          <HoverCard>
            <HoverCardTrigger>
              <div
                className={cn([
                  "flex gap-2 px-4 py-2 items-center bg-white border border-black rounded",
                  production.requested > production.available &&
                    "border-rose-400 border-3",
                  production.isManual &&
                    "bg-sky-500/10 border-sky-500 border-3",
                  production.requested < production.available &&
                    "border-amber-400 border-3",
                ])}
              >
                <img
                  className="block w-8 aspect-square"
                  src={icons[item.className]}
                  alt={item.name}
                />
                <p>{item.name}</p>
                {requestedAmount > 0 && (
                  <p className="text-sm">({requestedAmount})</p>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="flex gap-2 items-center">
                {production.available === production.requested && (
                  <>
                    <Check size="20" />
                    <span>Properly balanced.</span>
                  </>
                )}
                {production.available > production.requested && (
                  <>
                    <ArrowBigUp size="20" />
                    <span>
                      Item overflow: (+
                      {(production.available - production.requested).toFixed(3)}
                      )
                    </span>
                  </>
                )}
                {production.available < production.requested && (
                  <>
                    <ArrowBigDown size="20" />
                    <span>
                      Item underflow: (
                      {(production.available - production.requested).toFixed(3)}
                      )
                    </span>
                  </>
                )}
              </p>
            </HoverCardContent>
          </HoverCard>
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
          <ContextMenuItem
            className="gap-2"
            disabled={outgoing > 0}
            onSelect={() => setShowRequestInput(true)}
          >
            <ChefHat size="16" />
            <span>Request amount</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <CommandDialog open={showRequestInput} onOpenChange={setShowRequestInput}>
        <Command filter={() => 1}>
          <CommandInput
            value={(requestedAmount || undefined)?.toString()}
            onInput={(e) => setRequestedAmount(parseInt(e.currentTarget.value))}
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
