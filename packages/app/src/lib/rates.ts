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
    node.data.production = {
      available: 0,
      isManual: node.data.production.isManual,
      requested: node.data.production.isManual ? node.data.production.requested : 0,
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
      if (adjacencyList[node.id].length > 0) {
        for (const successor of successors(node.id)) {
          assert(successor.type === "recipe", `item ('${node.id}') successor is not a recipe ('${successor.id}')`);

          const ingredient = successor.data.recipe.ingredients.find((ingredient) => ingredient.item === node.id);
          assert(ingredient !== undefined, `ingredient (${successor.id}) could not be found in recipe ('${node.id}') `);

          node.data.production.requested +=
            ((successor.data.production.requested * ingredient.amount) / successor.data.recipe.duration) * 60;
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
        multiplier = Math.max(
          ((Math.max(0, requested - available) / product.amount) * node.data.recipe.duration) / 60,
          multiplier,
        );
      }

      node.data.production.requested += multiplier;

      // TODO: This is ugly, find a better way to propagate the factor applied to the recipe to the successors.
      for (const successor of successors(node.id)) {
        const product = node.data.recipe.products.find(
          (p) => successor.type === "item" && p.item === successor.data.item.className,
        )!;
        successor.data.production.available +=
          ((node.data.production.requested * product.amount) / node.data.recipe.duration) * 60;
      }
    } else {
      throw Error("unknown node type: '" + node.type + "'.");
    }
  }

  const overflowedNodes = graph.edges
    .filter((e) => e.data?.consumeOverflow)
    .map((e) => ({ source: nodes[e.source], target: nodes[e.target] }))
    .filter(({ source }) => source.data.production.available > source.data.production.requested);

  for (const { source, target } of overflowedNodes) {
    source.data.production.requested = source.data.production.available;

    const overflowQueue = [target];
    while (overflowQueue.length > 0) {
      const node = overflowQueue.shift()!;

      if (node.type === "item") {
        if (node.id === source.id) {
          continue;
        }

        // TODO: finish this feature at some point, it is not working for many layers at this point
      } else if (node.type === "recipe") {
        // should probably not be nested loops
        let drivingItem: Node | undefined = undefined;
        const items = node.data.recipe.ingredients.concat(node.data.recipe.products);

        for (const item of items) {
          const currentItemAmount = item.amount * node.data.production.requested;
          drivingItem = predecessors(node.id).find(
            (p) => p.data.production.requested !== currentItemAmount && p.id === item.item,
          );
          if (drivingItem) {
            const rateInUse = successors(drivingItem.id).reduce((rate, recipe) => {
              assert(recipe.type === "recipe", "item successor is not a recipe");
              const ingredient = recipe.data.recipe.ingredients.find((i) => i.item === drivingItem!.id)!;
              return rate + ((recipe.data.production.requested * ingredient.amount) / recipe.data.recipe.duration) * 60;
            }, 0);

            const missingFromOverflow = drivingItem.data.production.requested - rateInUse;
            node.data.production.requested += ((missingFromOverflow / item.amount) * node.data.recipe.duration) / 60;

            break;
          }
        }

        if (drivingItem) {
          for (const item of items) {
            if (item.item === drivingItem.id) {
              continue;
            }

            const key = node.data.recipe.ingredients.includes(item) ? "requested" : "available";
            nodes[item.item].data.production[key] +=
              ((item.amount * node.data.production.requested) / node.data.recipe.duration) * 60;
          }
        }
      }
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
