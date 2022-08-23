import { Item, Machine } from '../elements';
import { Ratio, RecipeElement } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [],
    outputs: [new RecipeElement(Item.PETROLEUM_COKE, 0)],
  },
  {
    inputs: [],
    outputs: [new RecipeElement(Item.PLASTIC, 0)],
  },
];

export default addMachineToRatios(ratios, Machine.NOT_IMPLEMENTED);
