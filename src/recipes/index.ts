import { Recipe } from '../interfaces';
import assemblerRecipes from './assembler-recipes';
import blenderRecipes from './blender-recipes';
import constructorRecipes from './constructor-recipes';
import foundryRecipes from './foundry-recipes';
import manufacturerRecipes from './manufacturer-recipes';
import minerRecipes from './miner-recipes';
import notImplementedRecipes from './not-implemented-recipes';
import refineryRecipes from './refinery-recipes';
import smelterRecipes from './smelter-recipes';
import waterExtractorRecipes from './water-extractor-recipes';

const recipes: Recipe[] = [
  ...minerRecipes,
  ...smelterRecipes,
  ...waterExtractorRecipes,
  ...constructorRecipes,
  ...assemblerRecipes,
  ...foundryRecipes,
  ...manufacturerRecipes,
  ...refineryRecipes,
  ...blenderRecipes,
  ...notImplementedRecipes,
];

export default recipes;
