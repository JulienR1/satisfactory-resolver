import { Item, Machine } from '../elements';
import { Ratio } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [{ element: Item.IRON_INGOT, rate: 30 }],
    outputs: [{ element: Item.IRON_PLATE, rate: 20 }],
  },
  {
    inputs: [{ element: Item.ROD, rate: 10 }],
    outputs: [{ element: Item.SCREW, rate: 40 }],
  },
  {
    inputs: [{ element: Item.IRON_INGOT, rate: 12.5 }],
    outputs: [{ element: Item.SCREW, rate: 50 }],
  },
  {
    inputs: [{ element: Item.STEEL_BEAM, rate: 5 }],
    outputs: [{ element: Item.SCREW, rate: 260 }],
  },
  {
    inputs: [{ element: Item.STEEL_INGOT, rate: 60 }],
    outputs: [{ element: Item.STEEL_BEAM, rate: 15 }],
  },
  {
    inputs: [{ element: Item.IRON_INGOT, rate: 15 }],
    outputs: [{ element: Item.ROD, rate: 15 }],
  },
  {
    inputs: [{ element: Item.STEEL_INGOT, rate: 12 }],
    outputs: [{ element: Item.ROD, rate: 48 }],
  },
];

export default addMachineToRatios(ratios, Machine.CONSTRUCTOR);
