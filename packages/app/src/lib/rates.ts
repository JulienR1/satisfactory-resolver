import { Node, Edge } from "./constants.ts";
import { assert } from "./utils.ts";

type Graph = {
  nodes: Node[];
  edges: Edge[];
};

type AdjacencyList = Record<Node["id"], { id: string; target: Node["id"] }[]>;

export function calculateRates(graph: Graph): Node[] {
  const nodes = getNodes(graph);
  const adjacencyList = getAdjacencyList(graph);
  const reverseAdjacencyList = getAdjacencyList(graph, "backward");

  const successors = (nodeId: string) => adjacencyList[nodeId].map(({ target }) => nodes[target]);
  const predecessors = (nodeId: string) => reverseAdjacencyList[nodeId].map(({ target }) => nodes[target]);

  const orders: Record<Node["id"], number> = Object.keys(nodes).reduce(
    (orders, nodeId) => ({ ...orders, [nodeId]: adjacencyList[nodeId].length }),
    {},
  );

  for (const node of Object.values(nodes)) {
    const isManual = orders[node.id] === 0;
    node.data.production = {
      isManual,
      available: 0,
      requested: isManual ? node.data.production.requested : 0,
    };
  }

  const queue = Object.entries(orders)
    .filter(([nodeId, order]) => order === 0 && nodes[nodeId].type === "item")
    .map(([nodeId]) => nodeId);

  while (queue.length > 0) {
    queue.sort((a, b) =>
      nodes[a].type !== nodes[b].type ? 0 : nodes[a].type === "recipe" && nodes[a].data.priority ? -1 : 0,
    );
    const node = nodes[queue.shift()!];

    for (const predecessor of predecessors(node.id).sort((a) => (a.type === "recipe" && a.data.priority ? -1 : 0))) {
      orders[predecessor.id]--;
      if (orders[predecessor.id] === 0) {
        queue.push(predecessor.id);
      }
    }

    if (node.type === "item") {
      if (!node.data.production.isManual) {
        for (const successsor of successors(node.id)) {
          assert(successsor.type === "recipe", `item ('${node.id}') successor is not a recipe ('${successsor.id}')`);

          const ingredient = successsor.data.recipe.ingredients.find((ingredient) => ingredient.item === node.id);
          assert(
            ingredient !== undefined,
            `ingredient (${successsor.id}) could not be found in recipe ('${node.id}') `,
          );

          node.data.production.requested += successsor.data.production.requested * ingredient.amount;
        }
      }

      for (const predecessor of predecessors(node.id).sort((a) => (a.type === "recipe" && a.data.priority ? -1 : 0))) {
        for (const neighbor of successors(predecessor.id)) {
          if (neighbor.id !== node.id && node.data.production.requested > 0 && adjacencyList[neighbor.id].length > 0) {
            orders[predecessor.id]--;
            if (orders[predecessor.id] === 0) {
              queue.push(predecessor.id);
            }
          }
        }
      }
    } else if (node.type === "recipe") {
      let multiplier = 0;
      for (const successor of successors(node.id)) {
        assert(successor.type === "item", `recipe has an invalid successor node (type: '${successor.type}')`);

        const product = node.data.recipe.products.find((p) => p.item === successor.data.item.className);
        assert(
          product !== undefined,
          `could not find successor (${successor.id}) in recipe (${node.className}) product list.`,
        );

        const { requested, available } = successor.data.production;
        multiplier = Math.max(Math.max(0, requested - available) / product.amount, multiplier);
      }

      node.data.production.requested += multiplier;

      // TODO: This is ugly, find a better way to propagate the factor applied to the recipe to the successors.
      for (const successor of successors(node.id)) {
        const product = node.data.recipe.products.find(
          (p) => successor.type === "item" && p.item === successor.data.item.className,
        )!;
        successor.data.production.available += node.data.production.requested * product.amount;
      }
    } else {
      throw Error("unknown node type: '" + node.type + "'.");
    }
  }

  return Object.values(nodes);
}

function getNodes({ nodes }: Graph) {
  return nodes.reduce((nodes, n) => ({ ...nodes, [n.id]: n }), {} as Record<Node["id"], Node>);
}

function getAdjacencyList({ nodes, edges }: Graph, direction: "forward" | "backward" = "forward"): AdjacencyList {
  const source = direction === "forward" ? "source" : "target";
  const target = direction === "forward" ? "target" : "source";

  const emptyList: AdjacencyList = Object.values(nodes).reduce((acc, { id }) => ({ ...acc, [id]: [] }), {});
  return edges.reduce(
    (list, edge) => ({
      ...list,
      [edge[source]]: [...(list[edge[source]] ?? []), { id: edge.id, target: edge[target] }],
    }),
    emptyList,
  );
}
