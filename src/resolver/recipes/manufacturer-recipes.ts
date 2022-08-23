import { Machine } from '../elements';
import { Ratio } from '../interfaces';
import { addMachineToRatios } from '../utils';

const ratios: Ratio[] = [];

export default addMachineToRatios(ratios, Machine.MANUFACTURER);
