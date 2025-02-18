import "@xyflow/react/dist/style.css";

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
} from "@xyflow/react";
import { Overlay } from "./Overlay";
import { useCallback } from "react";
import { Item } from "./resources";
import { ItemNode } from "./components/ItemNode";

const NODE_TYPES: NodeTypes = { item: ItemNode };

function App() {
  const [nodes, setNodes, handleNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, handleEdgesChange] = useEdgesState([]);

  const addNode = useCallback(
    (node: Node) => setNodes((n) => n.concat(node)),
    [setNodes],
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((e) => addEdge(params, e)),
    [setEdges],
  );

  const handleNewItem = useCallback(
    (item: Item) => {
      addNode({
        type: "item",
        id: item.className,
        position: { x: 0, y: 0 },
        data: { item },
      });
    },
    [addNode],
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Overlay prompt={nodes.length === 0} onNewItem={handleNewItem} />

      <ReactFlow
        nodeTypes={NODE_TYPES}
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
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
