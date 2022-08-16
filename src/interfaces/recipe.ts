import { Machine } from '../elements';
import { RecipeElement } from './recipe-element';

export interface Recipe {
  machine: Machine;
  inputs: RecipeElement[];
  outputs: RecipeElement[];
}
