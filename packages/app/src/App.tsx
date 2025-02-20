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
} from "@xyflow/react";
import { Overlay } from "./Overlay";
import { useCallback, useEffect, useState } from "react";
import { Item, ItemDescriptor, items, Recipe } from "./resources";
import { filterRecipes } from "./lib/recipes";
import { calculateRates } from "./lib/rates";
import { EDGE_TYPES, NODE_TYPES, Node, Edge } from "./lib/constants";

const SOME_RANDOM_VALUE = Math.random();

type NewNode = Omit<Node, "data"> & { data: Omit<Node["data"], "production"> };

function App() {
  const flow = useReactFlow<Node, Edge>();
  const [nodes, setNodes, handleNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, handleEdgesChange] = useEdgesState([] as Edge[]);

  const [recipeOptions, setRecipeOptions] = useState<Recipe[]>([]);
  const [nextNodePosition, setNextNodePosition] = useState<XYPosition>({
    x: 0,
    y: 0,
  });

  const addNode = useCallback(
    (n: NewNode) => {
      const node = n as Node;
      node.data.production = { requested: 0, available: 0 };
      setNodes((n) => n.concat(node));
    },
    [setNodes],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((e) => addEdge(params, e)),
    [setEdges],
  );

  const handleNewItem = useCallback(
    (item: Item, position = { x: 0, y: 0 }) => {
      addNode({ type: "item", id: item.className, data: { item }, position });
    },
    [addNode],
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
        });
      }

      for (const { item } of recipe.ingredients) {
        setEdges((e) =>
          addEdge(
            {
              source: item,
              target: recipe.className,
              sourceHandle: "output",
              targetHandle: `${recipe.className}-in-${item}`,
              type: "rate",
            },
            e,
          ),
        );
      }

      for (const { item } of recipe.products) {
        setEdges((e) =>
          addEdge(
            {
              target: item,
              source: recipe.className,
              sourceHandle: `${recipe.className}-out-${item}`,
              targetHandle: "input",
              type: "rate",
            },
            e,
          ),
        );
      }
    },
    [addNode, nextNodePosition, nodes, setEdges],
  );

  const onConnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, state: FinalConnectionState) => {
      if (!state.fromNode) {
        throw Error("`fromNode` is not defined on connection end");
      }
      if (!state.fromHandle) {
        throw Error("`fromHandle` is not defined on connection end");
      }

      const position = state.to ?? { x: 0, y: 0 };
      const itemId = state.fromNode.id as ItemDescriptor;
      const type = state.fromHandle?.type === "source" ? "input" : "output";

      setNextNodePosition(position);
      setRecipeOptions(filterRecipes(itemId, type));
    },
    [],
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
