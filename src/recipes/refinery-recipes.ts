import { Item, Machine } from '../elements';
import { Ratio, RecipeElement } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [
      new RecipeElement(Item.IRON_ORE, 35),
      new RecipeElement(Item.WATER, 20),
    ],
    outputs: [new RecipeElement(Item.IRON_INGOT, 65)],
  },
];

export default addMachineToRatios(ratios, Machine.REFINERY);
