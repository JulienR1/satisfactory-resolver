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
  Node,
  NodeTypes,
  FinalConnectionState,
  Edge,
  Position,
} from "@xyflow/react";
import { Overlay } from "./Overlay";
import { useCallback } from "react";
import { Item, ItemDescriptor, items } from "./resources";
import { ItemNode } from "./components/ItemNode";
import { RecipeNode } from "./components/RecipeNode";
import { filterRecipes } from "./lib/recipes";

const NODE_TYPES: NodeTypes = { item: ItemNode, recipe: RecipeNode };

function App() {
  const [nodes, setNodes, handleNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, handleEdgesChange] = useEdgesState([] as Edge[]);

  const addNode = useCallback(
    (node: Node) => setNodes((n) => n.concat(node)),
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

      const recipes = filterRecipes(itemId, type);

      // TODO: chose the recipe before continuing
      const recipe = recipes[0];

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
            },
            e,
          ),
        );
      }
    },
    [nodes, addNode, setEdges],
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Overlay prompt={nodes.length === 0} onNewItem={handleNewItem} />

      <ReactFlow
        nodeTypes={NODE_TYPES}
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

export default App;
