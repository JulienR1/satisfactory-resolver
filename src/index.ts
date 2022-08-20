import { Item, Machine, itemDetails, machineDetails } from './elements';
import { Recipe, RecipeElement } from './interfaces';
import recipes from './recipes';

const outputsToRecipeIndex: { [key in Item]?: number[] } = {};

recipes.forEach((recipe, recipeIndex) => {
  recipe.outputs.forEach(output => {
    outputsToRecipeIndex[output.element] = [
      ...(outputsToRecipeIndex[output.element] ?? []),
      recipeIndex,
    ];
  });
});

console.log(analyzeItem(Item.IRON_INGOT));

function analyzeItem(targetItem: Item, targetRate = -1): string {
  const possibleRecipeIndices = outputsToRecipeIndex[targetItem];
  const possibleRecipes = possibleRecipeIndices?.map(
    recipeIndex => recipes[recipeIndex],
  );

  if (!possibleRecipes) {
    return `no recipes found for ${itemToString({
      element: targetItem,
      rate: targetRate,
    })}`;
  }

  return (
    '(' +
    possibleRecipes
      .map(recipe => {
        if (recipe.machine === Machine.NOT_IMPLEMENTED) {
          return 'not implemented';
        }

        if (recipe.inputs.map(({ element }) => element).includes(targetItem)) {
          console.warn('Circular recipe: ');
          printRecipe(recipe);
          return 'circular';
        }

        const recipeOutputRate = recipe.outputs.find(
          item => item.element === targetItem,
        )?.rate!;
        const targetRateForRecipe =
          targetRate === -1 ? recipeOutputRate : targetRate;

        const ratio = recipeOutputRate / targetRateForRecipe;
        const isResourceMachine = [
          Machine.MINER_MK1,
          Machine.MINER_MK2,
          Machine.MINER_MK3,
          Machine.WATER_EXTRACTOR,
        ].includes(recipe.machine);

        if (isResourceMachine) {
          return machineDetails[recipe.machine];
        }

        const inputs = recipe.inputs.map(itemToString).join(', ');
        const outputs = recipe.inputs
          .map(inputItem =>
            analyzeItem(inputItem.element, inputItem.rate * ratio),
          )
          .join(', ');

        return `[${outputs}] -> [${inputs}]`;
      })
      .join(', ') +
    ')'
  );
}

function printRecipe(recipe: Recipe) {
  console.log(
    `(${recipe.inputs
      .map(input => `${input.rate} ${itemToString(input)}`)
      .join(', ')}) -> (${recipe.outputs
      .map(output => `${output.rate} ${itemToString(output)}`)
      .join(', ')})`,
  );
}

function itemToString({ element }: RecipeElement) {
  return itemDetails[element].title;
}
