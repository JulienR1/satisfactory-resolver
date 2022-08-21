import { Machine, machineDetails } from './elements';
import { ElementPerMinute, RecipeElement } from './interfaces';
import recipes, { getRecipesForItem } from './recipes';

export class Node {
  private possibilities: { [key in Machine]?: Node[] };

  constructor(private recipeElement: RecipeElement) {
    const possibleRecipeIndices = getRecipesForItem(recipeElement.element);
    const possibleRecipes =
      possibleRecipeIndices?.map(recipeIndex => recipes[recipeIndex]) ?? [];

    this.possibilities = possibleRecipes.reduce(
      (allPossibilities, currentPossibility) => {
        const currentPossibilityRate = currentPossibility.outputs.find(
          outputItem => outputItem.element === recipeElement.element,
        )?.rate!;

        return {
          ...allPossibilities,
          [currentPossibility.machine]: [
            ...(allPossibilities[currentPossibility.machine] ?? []),
            ...currentPossibility.inputs.map(inputItem =>
              this.getNodeForTargetRate(inputItem, currentPossibilityRate),
            ),
          ],
        };
      },
      {} as typeof this.possibilities,
    );
  }

  private getNodeForTargetRate(
    { element, rate }: RecipeElement,
    recipeRate: ElementPerMinute,
  ) {
    const targetRate = (recipeRate * this.recipeElement.rate) / rate;
    const newElement = new RecipeElement(element, targetRate);
    return new Node(newElement);
  }

  public getSummary(): string {
    const keys = Object.keys(this.possibilities) as unknown[] as Machine[];
    return `${this.recipeElement.toString()} : [${keys
      .map(machine => {
        const nodes = this.possibilities[machine]!;
        return nodes.length === 0
          ? machineDetails[machine]
          : `[${nodes.map(node => node.getSummary()).join(', ')}] in ${
              machineDetails[machine]
            }`;
      })
      .join(', ')}]`;
  }
}
