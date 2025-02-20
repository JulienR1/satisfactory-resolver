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
import { ChefHat, PenLine, Trash, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Node, Edge, Production } from "@/lib/constants";

type ItemNodeProps = { data: { item: Item; production: Production } };

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
            {requestedAmount > 0 && (
              <p className="text-sm">({requestedAmount})</p>
            )}
            <pre className="text-xs">{JSON.stringify(production, null, 2)}</pre>
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
