import { Item, Machine, Resources } from '../elements';
import { Ratio } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [{ element: Resources.IRON_ORE, rate: 30 }],
    outputs: [{ element: Item.IRON_INGOT, rate: 30 }],
  },
];

export default addMachineToRatios(ratios, Machine.SMELTER);
