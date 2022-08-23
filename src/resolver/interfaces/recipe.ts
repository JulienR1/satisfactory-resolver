import { Machine } from '../elements';
import { RecipeElement } from './recipe-element';

export interface Ratio {
  inputs: RecipeElement[];
  outputs: RecipeElement[];
}

export interface Recipe extends Ratio {
  machine: Machine;
}
