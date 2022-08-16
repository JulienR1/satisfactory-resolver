import { Item, Machine } from '../elements';
import { Ratio } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [
      { element: Item.IRON_PLATE, rate: 30 },
      { element: Item.SCREW, rate: 60 },
    ],
    outputs: [{ element: Item.REINFORCED_IRON_PLATE, rate: 5 }],
  },
  {
    inputs: [
      { element: Item.IRON_PLATE, rate: 11.25 },
      { element: Item.RUBBER, rate: 3.75 },
    ],
    outputs: [{ element: Item.IRON_PLATE, rate: 3.75 }],
  },
  {
    inputs: [
      { element: Item.IRON_PLATE, rate: 90 },
      { element: Item.SCREW, rate: 250 },
    ],
    outputs: [{ element: Item.REINFORCED_IRON_PLATE, rate: 15 }],
  },
  {
    inputs: [
      { element: Item.IRON_PLATE, rate: 18.75 },
      { element: Item.WIRE, rate: 37.5 },
    ],
    outputs: [{ element: Item.REINFORCED_IRON_PLATE, rate: 5.625 }],
  },
  {
    inputs: [
      { element: Item.COAL, rate: 25 },
      { element: Item.SULFUR_ORE, rate: 25 },
    ],
    outputs: [{ element: Item.COMPACTED_COAL, rate: 25 }],
  },
];

export default addMachineToRatios(ratios, Machine.ASSEMBLER);
