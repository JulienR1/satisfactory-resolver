import { Item, Machine } from '../elements';
import { Ratio, RecipeElement } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [new RecipeElement(Item.IRON_INGOT, 30)],
    outputs: [new RecipeElement(Item.IRON_PLATE, 20)],
  },
  {
    inputs: [new RecipeElement(Item.ROD, 10)],
    outputs: [new RecipeElement(Item.SCREW, 40)],
  },
  {
    inputs: [new RecipeElement(Item.IRON_INGOT, 12.5)],
    outputs: [new RecipeElement(Item.SCREW, 50)],
  },
  {
    inputs: [new RecipeElement(Item.STEEL_BEAM, 5)],
    outputs: [new RecipeElement(Item.SCREW, 260)],
  },
  {
    inputs: [new RecipeElement(Item.STEEL_INGOT, 60)],
    outputs: [new RecipeElement(Item.STEEL_BEAM, 15)],
  },
  {
    inputs: [new RecipeElement(Item.IRON_INGOT, 15)],
    outputs: [new RecipeElement(Item.ROD, 15)],
  },
  {
    inputs: [new RecipeElement(Item.STEEL_INGOT, 12)],
    outputs: [new RecipeElement(Item.ROD, 48)],
  },
];

export default addMachineToRatios(ratios, Machine.CONSTRUCTOR);
