import { Item, Machine } from '../elements';
import { Ratio, RecipeElement } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [new RecipeElement(Item.IRON_ORE, 30)],
    outputs: [new RecipeElement(Item.IRON_INGOT, 30)],
  },
];

export default addMachineToRatios(ratios, Machine.SMELTER);
