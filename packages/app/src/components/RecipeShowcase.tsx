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
            <RecipeListItem key={ingredient.item} {...ingredient} duration={recipe.duration} />
          ))}
        </ul>
        <div className="bg-border w-[1px] h-full">
          <span className="block absolute -translate-x-1/2 top-1/2 -translate-y-1/2 font-normal p-1 border rounded bg-white group-data-[selected=true]/cmd-item:bg-accent">
            {recipe.duration} s
          </span>
        </div>
        <ul>
          {recipe.products.map((product) => (
            <RecipeListItem key={product.item} {...product} duration={recipe.duration} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function RecipeListItem({ item, amount, duration }: RecipeItem & { duration: number }) {
  const rate = Math.round((amount / duration) * 60 * 1000) / 1000;
  return (
    <li className="flex gap-2 items-center justify-center p-1">
      <img className="block w-6 aspect-square" src={icons[item]} alt={item} />
      <p>
        <span>{items[item].name}</span>
        <span className="text-muted-foreground px-1">({rate}/min)</span>
      </p>
    </li>
  );
}
