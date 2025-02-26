import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  FinalConnectionState,
  XYPosition,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
} from "@xyflow/react";
import { Overlay } from "./Overlay";
import { useCallback, useEffect, useState } from "react";
import { Item, ItemDescriptor, items, Recipe } from "./resources";
import { filterRecipes } from "./lib/recipes";
import { calculateRates } from "./lib/rates";
import { EDGE_TYPES, NODE_TYPES, Node, Edge } from "./lib/constants";

const SOME_RANDOM_VALUE = Math.random();

type NewNode = Omit<Node, "data"> & { data: Omit<Node["data"], "production"> };

let nextNodePosition: XYPosition = { x: 0, y: 0 };

function App() {
  const flow = useReactFlow<Node, Edge>();
  const { getState } = useStoreApi();
  const [nodes, setNodes, handleNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, handleEdgesChange] = useEdgesState([] as Edge[]);

  const [recipeOptions, setRecipeOptions] = useState<Recipe[]>([]);

  const addNode = useCallback(
    (n: NewNode) => {
      const node = n as Node;
      node.data.production = { requested: 0, available: 0 };
      setNodes((n) => n.concat(node));
    },
    [setNodes],
  );

  const onConnect = useCallback((params: Connection) => setEdges((e) => addEdge(params, e)), [setEdges]);

  const handleNewItem = useCallback(
    (item: Item) => {
      const viewport = getState().domNode!.getBoundingClientRect()!;
      const position = flow.screenToFlowPosition({
        x: viewport.x + viewport.width / 2,
        y: viewport.y + viewport.height / 2,
      });
      addNode({ type: "item", id: item.className, data: { item }, position, origin: [0.5, 0] });
    },
    [addNode, flow, getState],
  );

  const handleRecipeSelected = useCallback(
    function (recipe: Recipe | null) {
      setRecipeOptions([]);
      if (!recipe) {
        return;
      }

      const position = nextNodePosition;

      addNode({
        type: "recipe",
        id: recipe.className,
        data: { recipe },
        position,
        origin: [0.5, 0],
      });

      const missingItems = recipe.ingredients
        .concat(recipe.products)
        .filter(({ item }) => !nodes.find((node) => item === node.id));

      for (const { item } of missingItems) {
        addNode({
          id: item,
          type: "item",
          data: { item: items[item] },
          position, // TODO: use a better placement to nodes are not overlapping
          origin: [0.5, 0],
        });
      }

      for (const [i, { item }] of recipe.ingredients.entries()) {
        setEdges((e) =>
          addEdge(
            {
              id: `${item}-${recipe.className}`,
              source: item,
              target: recipe.className,
              type: "rate",
              data: { handleIndex: i, rate: 0 },
            },
            e,
          ),
        );
      }

      for (const [i, { item }] of recipe.products.entries()) {
        setEdges((e) =>
          addEdge(
            {
              id: `${recipe.className}-${item}`,
              target: item,
              source: recipe.className,
              type: "rate",
              data: { handleIndex: i, rate: 0 },
            },
            e,
          ),
        );
      }
    },
    [addNode, nodes, setEdges],
  );

  const onConnectEnd = useCallback(
    (e: MouseEvent | TouchEvent, state: FinalConnectionState) => {
      if (!state.fromNode) {
        throw Error("`fromNode` is not defined on connection end");
      }
      if (!state.fromHandle) {
        throw Error("`fromHandle` is not defined on connection end");
      }

      const { clientX, clientY } = "changedTouches" in e ? e.changedTouches[0] : e;
      nextNodePosition = flow.screenToFlowPosition({ x: clientX, y: clientY });
      const itemId = state.fromNode.id as ItemDescriptor;
      const type = state.fromHandle?.type === "source" ? "input" : "output";

      setRecipeOptions(filterRecipes(itemId, type));
    },
    [flow],
  );

  const updateRates = useCallback(() => {
    const graph = {
      nodes: flow.getNodes(),
      edges: flow.getEdges(),
    };
    const rates = calculateRates(graph);
    // TODO: something with the results :)
    setNodes(rates);
  }, [flow, setNodes]);

  useEffect(() => {
    updateRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length, SOME_RANDOM_VALUE]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Overlay
        recipes={recipeOptions}
        prompt={nodes.length === 0}
        onNewItem={handleNewItem}
        onRecipeSelected={handleRecipeSelected}
      />

      <ReactFlow
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}
