import { ItemNode } from "@/components/ItemNode";
import { RateEdge } from "@/components/RateEdge";
import { RecipeNode } from "@/components/RecipeNode";
import { Item, Recipe } from "@/resources";
import { EdgeTypes, NodeTypes, Node as _Node, Edge as _Edge, XYPosition } from "@xyflow/react";

export const NODE_TYPES = {
  item: ItemNode,
  recipe: RecipeNode,
} satisfies NodeTypes;

export const EDGE_TYPES = { rate: RateEdge } satisfies EdgeTypes;

export type Production = {
  production: { available: number; requested: number; isManual?: boolean };
};

export type Node =
  | _Node<{ item: Item } & Production, "item">
  | _Node<{ recipe: Recipe; priority?: boolean } & Production, "recipe">;

export type Edge = _Edge<
  { midpoint?: XYPosition; handleIndex?: number; consumeOverflow?: boolean; rate: number },
  keyof typeof EDGE_TYPES
>;
