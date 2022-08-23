import { Item, itemDetails } from '../elements';

export type ElementPerMinute = number;

export class RecipeElement {
  constructor(public element: Item, public rate: ElementPerMinute) {}

  public toString(): string {
    return `${itemDetails[this.element].title} (${this.rate})`;
  }
}
