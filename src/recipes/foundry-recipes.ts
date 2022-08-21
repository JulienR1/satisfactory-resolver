import { Item, Machine } from '../elements';
import { Ratio, RecipeElement } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [
      new RecipeElement(Item.IRON_ORE, 45),
      new RecipeElement(Item.COAL, 45),
    ],
    outputs: [new RecipeElement(Item.STEEL_INGOT, 45)],
  },
  {
    inputs: [
      new RecipeElement(Item.IRON_ORE, 75),
      new RecipeElement(Item.PETROLEUM_COKE, 75),
    ],
    outputs: [new RecipeElement(Item.STEEL_INGOT, 100)],
  },
  {
    inputs: [
      new RecipeElement(Item.IRON_ORE, 22.5),
      new RecipeElement(Item.COMPACTED_COAL, 11.25),
    ],
    outputs: [new RecipeElement(Item.STEEL_INGOT, 37.5)],
  },
  {
    inputs: [
      new RecipeElement(Item.IRON_INGOT, 40),
      new RecipeElement(Item.COAL, 40),
    ],
    outputs: [new RecipeElement(Item.STEEL_INGOT, 60)],
  },
  {
    inputs: [
      new RecipeElement(Item.IRON_ORE, 20),
      new RecipeElement(Item.COPPER_ORE, 20),
    ],
    outputs: [new RecipeElement(Item.IRON_INGOT, 50)],
  },
];

export default addMachineToRatios(ratios, Machine.FOUNDRY);
