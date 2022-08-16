import { Item } from '../elements';

export type ElementPerMinute = number;

export interface RecipeElement {
  element: Item;
  rate: ElementPerMinute;
}
