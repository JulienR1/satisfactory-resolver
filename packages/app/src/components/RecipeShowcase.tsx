import { icons, items, Recipe, RecipeItem } from "@/resources";

export function RecipeShowcase(recipe: Recipe) {
  return (
    <div className="flex flex-col justify-center w-full border rounded">
      <p className="flex font-semibold border-b p-2 items-center justify-center gap-2">
        <span className="block">{recipe.name}</span>
        {recipe.alternate && (
          <span
            className="block px-2 py-0.5 text-purple-600 border-2 border-purple-600 font-bold text-xs rounded-sm"
            style={{ fontVariant: "small-caps" }}
          >
            alternate
          </span>
        )}
      </p>
      <div className="grid grid-cols-[1fr_1px_1fr] items-center relative py-2">
        <ul>
          {recipe.ingredients.map((ingredient) => (
            <RecipeListItem key={ingredient.item} {...ingredient} />
          ))}
        </ul>
        <div className="bg-border w-[1px] h-full"></div>
        <ul>
          {recipe.products.map((product) => (
            <RecipeListItem key={product.item} {...product} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function RecipeListItem({ item, amount }: RecipeItem) {
  return (
    <li className="flex gap-2 items-center justify-center p-1">
      <img className="block w-6 aspect-square" src={icons[item]} alt={item} />
      <p>
        <span>{items[item].name}</span>
        <span className="text-muted-foreground px-1">({amount}/min)</span>
      </p>
    </li>
  );
}
