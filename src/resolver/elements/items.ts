export enum Item {
  IRON_ORE,
  COPPER_ORE,
  CATERIUM_ORE,
  COAL,
  LIMESTONE,
  RAW_QUARTZ,
  URANIUM,
  BAUXITE,
  SULFUR_ORE,
  WATER,
  OIL,
  REINFORCED_IRON_PLATE,
  IRON_INGOT,
  IRON_PLATE,
  SCREW,
  RUBBER,
  PLASTIC,
  WIRE,
  STEEL_INGOT,
  COMPACTED_COAL,
  PETROLEUM_COKE,
  ROD,
  STEEL_BEAM,
}

export const ItemKeys: Item[] = Object.keys(Item).filter(
  key => !isNaN(Number(key)),
) as unknown[] as Item[];
