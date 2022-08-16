import { Item, Machine } from './elements';
import { ElementPerMinute, Ratio, Recipe } from './interfaces';

export const addMachineToRatios = (
  ratios: Ratio[],
  machine: Machine,
): Recipe[] => {
  return ratios.map(ratio => ({ ...ratio, machine }));
};

export const mapItemToRate = (
  resources: Item[],
  rate: ElementPerMinute,
): Ratio[] => {
  return resources.map(resource => ({
    inputs: [],
    outputs: [{ element: resource, rate }],
  }));
};
