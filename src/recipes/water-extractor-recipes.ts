import { Machine, Resources } from '../elements';
import { addMachineToRatios, mapResourcesToRate } from '../utils';

const ratios = mapResourcesToRate([Resources.WATER], 120);

export default addMachineToRatios(ratios, Machine.WATER_EXTRACTOR);
