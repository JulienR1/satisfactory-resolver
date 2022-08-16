import { Item } from './elements';
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

console.log(outputsToRecipeIndex[Item.REINFORCED_IRON_PLATE]);
