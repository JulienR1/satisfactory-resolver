import { Item, Machine } from '../elements';
import { Ratio } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [],
    outputs: [{ element: Item.PETROLEUM_COKE, rate: 0 }],
  },
];

export default addMachineToRatios(ratios, Machine.NOT_IMPLEMENTED);
