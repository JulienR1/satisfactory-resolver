import { ItemDescriptor, items, RecipeDescriptor, recipes } from "@/resources";
import { useNodes, useEdges, useReactFlow, addEdge, XYPosition } from "@xyflow/react";
import { useCallback } from "react";
import { NODE_TYPES, Node, Edge } from "./constants";

type FactoryNode = {
  id: string;
  type: keyof typeof NODE_TYPES;
  x: number;
  y: number;
  requested?: number;
};
type FactoryEdge = { source: string; target: string; midpoint?: XYPosition };
type Factory = { nodes: FactoryNode[]; edges: FactoryEdge[] };

function saveFactory(nodes: Node[], edges: Edge[], name: string) {
  const contents: Factory = {
    nodes: nodes.map(({ id, position, type = "item", data }) => ({
      id,
      type,
      x: position.x,
      y: position.y,
      ...(data.production.requested > 0 && data.production.isManual ? { requested: data.production.requested } : {}),
    })),
    edges: edges.map(({ source, target, data }) => ({
      source,
      target,
      ...(data?.midpoint ? { midpoint: data?.midpoint } : {}),
    })),
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

  const nodes = factory.nodes.map(
    ({ x, y, ...n }) =>
      ({
        ...n,
        position: { x, y },
        data: {
          ...(n.type === "item"
            ? { item: items[n.id as ItemDescriptor] }
            : { recipe: recipes[n.id as RecipeDescriptor] }),
          production: {
            requested: n.requested ?? 0,
            isManual: (n.requested ?? 0) > 0,
            available: 0,
          },
        },
      }) as Node,
  );

  let edges: Edge[] = [];
  for (const { source, target, ...e } of factory.edges) {
    const edge = {
      source,
      target,
      type: "rate",
      targetHandle: "",
      sourceHandle: "",
    };
    if (Object.keys(items).some((item) => target === item)) {
      edge.targetHandle = "input";
      edge.sourceHandle = `${source}-out-${target}`;
    } else {
      edge.targetHandle = `${target}-in-${source}`;
      edge.sourceHandle = "output";
    }

    edges = addEdge<Edge>(edge, edges);
    if (e.midpoint) {
      edges[edges.length - 1].data = { midpoint: e.midpoint };
    }
  }

  return { nodes, edges };
}

export function useSerialization() {
  const flow = useReactFlow<Node, Edge>();
  const nodes = useNodes<Node>();
  const edges = useEdges<Edge>();

  const load = useCallback(
    () =>
      loadFactory().then(({ nodes, edges }) => {
        flow.setNodes(nodes);
        setTimeout(() => flow.setEdges(edges), 100);
      }),
    [flow],
  );

  const save = useCallback((name: string) => saveFactory(nodes, edges, name), [nodes, edges]);

  return { load, save };
}
