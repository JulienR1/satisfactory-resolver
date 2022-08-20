import { Item, details, Machine } from './elements';
import { Recipe } from './interfaces';
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

console.log(analyzeItem(Item.IRON_PLATE, ''));

function analyzeItem(targetItem: Item, chain: string, targetRate = -1): string {
  const possibleRecipeIndices = outputsToRecipeIndex[targetItem];
  const possibleRecipes = possibleRecipeIndices?.map(
    recipeIndex => recipes[recipeIndex],
  );

  return (
    possibleRecipes?.map(recipe => {
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
      return (
        '[' +
        recipe.inputs
          .map(inputItem =>
            analyzeItem(
              inputItem.element,
              [chain, details[inputItem.element].title].join(' -> '),
              inputItem.rate * ratio,
            ),
          )
          .join(', ') +
        ']'
      );
    }) ?? []
  ).join(', ');
}

function printRecipe(recipe: Recipe) {
  console.log(
    `(${recipe.inputs
      .map(input => `${input.rate} ${details[input.element].title}`)
      .join(', ')}) -> (${recipe.outputs
      .map(output => `${output.rate} ${details[output.element].title}`)
      .join(', ')})`,
  );
}
