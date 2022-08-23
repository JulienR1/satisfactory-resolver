import { Item, Machine } from '../elements';
import { addMachineToRatios, mapItemToRate } from '../utils';

const ratios = mapItemToRate([Item.WATER], 120);

export default addMachineToRatios(ratios, Machine.WATER_EXTRACTOR);
