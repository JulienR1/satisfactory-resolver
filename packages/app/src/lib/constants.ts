import { ItemNode } from "@/components/ItemNode";
import { RateEdge } from "@/components/RateEdge";
import { RecipeNode } from "@/components/RecipeNode";
import { Item, Recipe } from "@/resources";
import {
  EdgeTypes,
  NodeTypes,
  Node as _Node,
  Edge as _Edge,
} from "@xyflow/react";

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
  | _Node<{ recipe: Recipe } & Production, "recipe">;
export type Edge = _Edge<Record<string, unknown>, keyof typeof EDGE_TYPES>;
