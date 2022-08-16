import { Element } from '../elements';

export type ElementPerMinute = number;

export interface RecipeElement {
  element: Element;
  rate: ElementPerMinute;
}
