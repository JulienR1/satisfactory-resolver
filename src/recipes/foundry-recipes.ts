import { Item,Machine } from '../elements';
import { Ratio } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [
      { element: Item.IRON_ORE, rate: 45 },
      { element: Item.COAL, rate: 45 },
    ],
    outputs: [{ element: Item.STEEL_INGOT, rate: 45 }],
  },
  {
    inputs: [
      { element: Item.IRON_ORE, rate: 75 },
      { element: Item.PETROLEUM_COKE, rate: 75 },
    ],
    outputs: [{ element: Item.STEEL_INGOT, rate: 100 }],
  },
  {
    inputs: [
      { element: Item.IRON_ORE, rate: 22.5 },
      { element: Item.COMPACTED_COAL, rate: 11.25 },
    ],
    outputs: [{ element: Item.STEEL_INGOT, rate: 37.5 }],
  },
  {
    inputs: [
      { element: Item.IRON_INGOT, rate: 40 },
      { element: Item.COAL, rate: 40 },
    ],
    outputs: [{ element: Item.STEEL_INGOT, rate: 60 }],
  },
  {
    inputs: [
      { element: Item.IRON_ORE, rate: 20 },
      { element: Item.COPPER_ORE, rate: 20 },
    ],
    outputs: [{ element: Item.IRON_INGOT, rate: 50 }],
  },
];

export default addMachineToRatios(ratios, Machine.FOUNDRY);