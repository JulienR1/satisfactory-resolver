import { Item, Machine } from './elements';
import { ElementPerMinute, Ratio, Recipe, RecipeElement } from './interfaces';

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
    outputs: [new RecipeElement(resource, rate)],
  }));
};
