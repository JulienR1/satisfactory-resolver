import { Item, Machine } from '../elements';
import { Ratio, RecipeElement } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [
      new RecipeElement(Item.IRON_PLATE, 30),
      new RecipeElement(Item.SCREW, 60),
    ],
    outputs: [new RecipeElement(Item.REINFORCED_IRON_PLATE, 5)],
  },
  {
    inputs: [
      new RecipeElement(Item.IRON_INGOT, 50),
      new RecipeElement(Item.PLASTIC, 10),
    ],
    outputs: [new RecipeElement(Item.IRON_PLATE, 75)],
  },
  {
    inputs: [
      new RecipeElement(Item.STEEL_INGOT, 7.5),
      new RecipeElement(Item.PLASTIC, 5),
    ],
    outputs: [new RecipeElement(Item.IRON_PLATE, 45)],
  },
  {
    inputs: [
      new RecipeElement(Item.IRON_PLATE, 90),
      new RecipeElement(Item.SCREW, 250),
    ],
    outputs: [new RecipeElement(Item.REINFORCED_IRON_PLATE, 15)],
  },
  {
    inputs: [
      new RecipeElement(Item.IRON_PLATE, 18.75),
      new RecipeElement(Item.WIRE, 37.5),
    ],
    outputs: [new RecipeElement(Item.REINFORCED_IRON_PLATE, 5.625)],
  },
  {
    inputs: [
      new RecipeElement(Item.COAL, 25),
      new RecipeElement(Item.SULFUR_ORE, 25),
    ],
    outputs: [new RecipeElement(Item.COMPACTED_COAL, 25)],
  },
];

export default addMachineToRatios(ratios, Machine.ASSEMBLER);
