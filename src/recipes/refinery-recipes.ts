import { Item, Machine, Resources } from '../elements';
import { Ratio } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [
  {
    inputs: [
      { element: Resources.IRON_ORE, rate: 35 },
      { element: Resources.WATER, rate: 20 },
    ],
    outputs: [{ element: Item.IRON_INGOT, rate: 65 }],
  },
];

export default addMachineToRatios(ratios, Machine.REFINERY);
