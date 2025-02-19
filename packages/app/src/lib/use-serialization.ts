import { ItemDescriptor, items, RecipeDescriptor, recipes } from "@/resources";
import {
  Node,
  Edge,
  useNodes,
  useEdges,
  useReactFlow,
  addEdge,
} from "@xyflow/react";
import { useCallback } from "react";

type FactoryNode = { id: string; type: string; x: number; y: number };
type FactoryEdge = { source: string; target: string };
type Factory = { nodes: FactoryNode[]; edges: FactoryEdge[] };

function saveFactory(nodes: Node[], edges: Edge[], name: string) {
  const contents: Factory = {
    nodes: nodes.map(({ id, position, type = "item" }) => ({
      id,
      type,
      x: position.x,
      y: position.y,
    })),
    edges: edges.map(({ source, target }) => ({ source, target })),
  };

  const anchor = document.createElement("a");
  const blob = new Blob([JSON.stringify(contents)], { type: "octet/stream" });
  anchor.href = window.URL.createObjectURL(blob);
  anchor.download = `${name}.factory`;
  anchor.click();
  window.URL.revokeObjectURL(anchor.href);
}

async function loadFactory(): Promise<{
  nodes: Node[];
  edges: Edge[];
}> {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".factory";

  const factoryPromise = new Promise<Factory>((resolve, reject) => {
    input.addEventListener("change", async function () {
      const file = input.files?.[0];
      if (file) {
        resolve(JSON.parse(await file.text()));
      }
      reject();
    });
  });

  input.click();
  const factory = await factoryPromise;

  const nodes = factory.nodes.map(({ x, y, ...n }) => ({
    ...n,
    position: { x, y },
    data: {
      ...(n.type === "item"
        ? { item: items[n.id as ItemDescriptor] }
        : { recipe: recipes[n.id as RecipeDescriptor] }),
    },
  }));

  let edges: Edge[] = [];
  for (const { source, target } of factory.edges) {
    const edge = { source, target, targetHandle: "", sourceHandle: "" };
    if (Object.keys(items).some((item) => target === item)) {
      edge.targetHandle = "input";
      edge.sourceHandle = `${source}-out-${target}`;
    } else {
      edge.targetHandle = `${target}-in-${source}`;
      edge.sourceHandle = "output";
    }

    edges = addEdge(edge, edges);
  }

  return { nodes, edges };
}

export function useSerialization() {
  const flow = useReactFlow();
  const nodes = useNodes();
  const edges = useEdges();

  const load = useCallback(
    () =>
      loadFactory().then(({ nodes, edges }) => {
        flow.setNodes(nodes);
        setTimeout(() => flow.setEdges(edges), 100);
      }),
    [flow],
  );

  const save = useCallback(
    (name: string) => saveFactory(nodes, edges, name),
    [nodes, edges],
  );

  return { load, save };
}
