import { Item } from './elements';
import { RecipeElement } from './interfaces';
import { Node } from './node';

const root = new Node(new RecipeElement(Item.IRON_PLATE, 60));
console.log(root.getSummary());
