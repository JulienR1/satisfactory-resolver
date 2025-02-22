import { describe, expect, test } from "vitest";
import { calculateRates } from "./rates";
import { Node } from "./constants";

function asNodes(
  partials: Array<{
    id: string;
    type: "recipe" | "item";
    requested?: number;
    data?: {
      ingredients: Array<{ item: string; amount: number }>;
      products: Array<{ item: string; amount: number }>;
    };
  }>,
) {
  return partials.map((node) => ({
    ...node,
    position: { x: 0, y: 0 },
    data: {
      [node.type]: { ...(node.data ?? {}), className: node.id },
      production: { requested: node.requested ?? 0, available: 0 },
    },
  }));
}

function asEdges(partials: Array<{ source: string; target: string }>) {
  return partials.map((edge, id) => ({ ...edge, id: id.toString() }));
}

function production<N extends Array<{ id: string }>>(rates: Node[], id: N[number]["id"]) {
  return rates.find((n) => n.id === id)!.data.production;
}

describe("rates", function () {
  test("default cable line", function () {
    const nodes = asNodes([
      {
        id: "Recipe_Wire_C",
        type: "recipe",
        data: {
          ingredients: [{ item: "Desc_CopperIngot_C", amount: 1 }],
          products: [{ item: "Desc_Wire_C", amount: 2 }],
        },
      },
      {
        id: "Recipe_Cable_C",
        type: "recipe",
        data: {
          ingredients: [{ item: "Desc_Wire_C", amount: 2 }],
          products: [{ item: "Desc_Cable_C", amount: 1 }],
        },
      },
      { id: "Desc_CopperIngot_C", type: "item" },
      { id: "Desc_Wire_C", type: "item" },
      { id: "Desc_Cable_C", type: "item", requested: 100 },
    ]);

    const edges = asEdges([
      { source: "Desc_Wire_C", target: "Recipe_Cable_C" },
      { source: "Recipe_Cable_C", target: "Desc_Cable_C" },
      { source: "Desc_CopperIngot_C", target: "Recipe_Wire_C" },
      { source: "Recipe_Wire_C", target: "Desc_Wire_C" },
    ]);

    const rates = calculateRates({ nodes: nodes as Node[], edges });

    const p = production<typeof nodes>;
    expect(p(rates, "Desc_CopperIngot_C")).toMatchObject({ requested: 100, available: 0 });
    expect(p(rates, "Recipe_Wire_C")).toMatchObject({ requested: 100, available: 0 });
    expect(p(rates, "Desc_Wire_C")).toMatchObject({ requested: 200, available: 200 });
    expect(p(rates, "Recipe_Cable_C")).toMatchObject({ requested: 100, available: 0 });
    expect(p(rates, "Desc_Cable_C")).toMatchObject({ requested: 100, available: 100, isManual: true });
  });

  test("wire split into 2 branches", function () {
    const nodes = asNodes([
      {
        id: "Recipe_Wire_C",
        type: "recipe",
        data: {
          ingredients: [{ item: "Desc_CopperIngot_C", amount: 1 }],
          products: [{ item: "Desc_Wire_C", amount: 2 }],
        },
      },
      {
        id: "Recipe_Cable_C",
        type: "recipe",
        data: { ingredients: [{ item: "Desc_Wire_C", amount: 2 }], products: [{ item: "Desc_Cable_C", amount: 1 }] },
      },
      {
        id: "Recipe_Stator_C",
        type: "recipe",
        data: {
          ingredients: [
            { item: "Desc_Wire_C", amount: 8 },
            { item: "Desc_SteelPipe_C", amount: 3 },
          ],
          products: [{ item: "Desc_Stator_C", amount: 1 }],
        },
      },
      { id: "Desc_CopperIngot_C", type: "item" },
      { id: "Desc_Wire_C", type: "item" },
      { id: "Desc_Cable_C", type: "item", requested: 100 },
      { id: "Desc_SteelPipe_C", type: "item" },
      { id: "Desc_Stator_C", type: "item", requested: 5 },
    ]);

    const edges = asEdges([
      { source: "Desc_Wire_C", target: "Recipe_Cable_C" },
      { source: "Recipe_Cable_C", target: "Desc_Cable_C" },
      { source: "Desc_CopperIngot_C", target: "Recipe_Wire_C" },
      { source: "Recipe_Wire_C", target: "Desc_Wire_C" },
      { source: "Desc_SteelPipe_C", target: "Recipe_Stator_C" },
      { source: "Desc_Wire_C", target: "Recipe_Stator_C" },
      { source: "Recipe_Stator_C", target: "Desc_Stator_C" },
    ]);

    const rates = calculateRates({ nodes: nodes as Node[], edges });

    const p = production<typeof nodes>;
    expect(p(rates, "Desc_CopperIngot_C")).toMatchObject({ requested: 120, available: 0 });
    expect(p(rates, "Recipe_Wire_C")).toMatchObject({ requested: 120, available: 0 });
    expect(p(rates, "Desc_Wire_C")).toMatchObject({ requested: 240, available: 240 });
    expect(p(rates, "Desc_SteelPipe_C")).toMatchObject({ requested: 15, available: 0 });
    expect(p(rates, "Recipe_Stator_C")).toMatchObject({ requested: 5, available: 0 });
    expect(p(rates, "Recipe_Cable_C")).toMatchObject({ requested: 100, available: 0 });
    expect(p(rates, "Desc_Stator_C")).toMatchObject({ requested: 5, available: 5, isManual: true });
    expect(p(rates, "Desc_Cable_C")).toMatchObject({ requested: 100, available: 100, isManual: true });
  });

  test("silica water loop", function () {
    const nodes = asNodes([
      {
        id: "Recipe_Alternate_Silica_Distilled_C",
        type: "recipe",
        data: {
          ingredients: [
            { item: "Desc_DissolvedSilica_C", amount: 12 },
            { item: "Desc_Stone_C", amount: 5 },
            { item: "Desc_Water_C", amount: 10 },
          ],
          products: [
            { item: "Desc_Silica_C", amount: 27 },
            { item: "Desc_Water_C", amount: 8 },
          ],
        },
      },
      { id: "Desc_Silica_C", type: "item", requested: 297 },
      { id: "Desc_DissolvedSilica_C", type: "item" },
      { id: "Desc_Stone_C", type: "item" },
      { id: "Desc_Water_C", type: "item" },
    ]);

    const edges = asEdges([
      { source: "Desc_DissolvedSilica_C", target: "Recipe_Alternate_Silica_Distilled_C" },
      { source: "Desc_Stone_C", target: "Recipe_Alternate_Silica_Distilled_C" },
      { source: "Desc_Water_C", target: "Recipe_Alternate_Silica_Distilled_C" },
      { source: "Recipe_Alternate_Silica_Distilled_C", target: "Desc_Silica_C" },
      { source: "Recipe_Alternate_Silica_Distilled_C", target: "Desc_Water_C" },
    ]);

    const rates = calculateRates({ nodes: nodes as Node[], edges });

    const p = production<typeof nodes>;
    expect(p(rates, "Desc_DissolvedSilica_C")).toContainEqual({ requested: 60, available: 0 });
    expect(p(rates, "Desc_Stone_C")).toContainEqual({ requested: 55, available: 0 });
    expect(p(rates, "Recipe_Alternate_Silica_Distilled_C")).toContainEqual({ requested: 11, available: 0 });
    expect(p(rates, "Desc_Water_C")).toContainEqual({ requested: 110, available: 88 });
    expect(p(rates, "Desc_Silica_C")).toContainEqual({ requested: 297, available: 297, isManual: true });
  });
});
