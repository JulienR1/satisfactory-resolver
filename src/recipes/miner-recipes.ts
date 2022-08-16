import { Machine, Resources } from '../elements';
import { addMachineToRatios, mapResourcesToRate } from '../utils';

const resources = [Resources.IRON_ORE, Resources.COPPER_ORE];

const ratiosMk1 = mapResourcesToRate(resources, 60);
const ratiosMk2 = mapResourcesToRate(resources, 120);
const ratiosMk3 = mapResourcesToRate(resources, 240);

const recipes = [
  ...addMachineToRatios(ratiosMk1, Machine.MINER_MK1),
  ...addMachineToRatios(ratiosMk2, Machine.MINER_MK2),
  ...addMachineToRatios(ratiosMk3, Machine.MINER_MK3),
];

export default recipes;
