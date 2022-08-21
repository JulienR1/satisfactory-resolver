import { Item, Machine } from '../elements';
import { addMachineToRatios, mapItemToRate } from '../utils';

const resources = [
  Item.IRON_ORE,
  Item.COPPER_ORE,
  Item.COAL,
  Item.BAUXITE,
  Item.CATERIUM_ORE,
  Item.LIMESTONE,
  Item.RAW_QUARTZ,
  Item.SULFUR_ORE,
  Item.URANIUM,
];

const ratiosMk1 = mapItemToRate(resources, 60);
const ratiosMk2 = mapItemToRate(resources, 120);
const ratiosMk3 = mapItemToRate(resources, 240);

const recipes = [
  ...addMachineToRatios(ratiosMk1, Machine.MINER_MK1),
  ...addMachineToRatios(ratiosMk2, Machine.MINER_MK2),
  ...addMachineToRatios(ratiosMk3, Machine.MINER_MK3),
];

export default recipes;
