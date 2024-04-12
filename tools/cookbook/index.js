import { parse, HTMLElement } from 'node-html-parser';
import { writeFileSync } from 'node:fs';

/**
 * @typedef {string} ItemId
 * @typedef {{id: ItemId, name: string, url: string, img: string, recipes: Recipe[]}} Item
 *
 * @typedef {{label:string, inputs: RecipeItem[], outputs: RecipeItem[], machine: string}} Recipe
 * @typedef {{id: ItemId, rate: number}} RecipeItem
 */

const domain = 'https://satisfactory-calculator.com';
const source = `${domain}/en/items`;

/**
 * @returns {Promise<string[]>}
 */
async function findItemUrls() {
  const response = await fetch(source);
  const pageStr = await response.text();
  const page = parse(pageStr);

  return page
    .querySelectorAll('.card h6 a')
    .map(element => domain + element.getAttribute('href') ?? '');
}

/**
 * @param {string} url
 * @returns {Promise<Item>}
 */
async function fetchItem(url) {
  if (!url.includes('/id/') || !url.includes('/name/')) {
    throw new Error('invalid item url: ' + url);
  }

  const response = await fetch(url);
  const pageStr = await response.text();
  const page = parse(pageStr);

  const { id, name } = parseItemUrl(url);
  const img = page.querySelector('main img')?.getAttribute('src') ?? '';
  const recipes = findRecipes(page);

  return { id, name, url, img, recipes };
}

/**
 * @param {string} url
 * @returns {{id: ItemId, name: string}}
 */
function parseItemUrl(url) {
  return {
    id: url.split(/\//).at(-3) ?? '',
    name: (url.split(/\//).at(-1) ?? '').replaceAll('+', ' '),
  };
}

/**
 * @param {HTMLElement} page
 * @returns {Recipe[]}
 */
function findRecipes(page) {
  const keys = ['Recipes', 'Alternate recipes'];

  /** @type {HTMLElement[]} */
  const recipeElements = [];
  for (const card of page.querySelectorAll('.card')) {
    const title = card.querySelector('.card-header strong')?.innerText ?? '';
    if (keys.includes(title)) {
      recipeElements.push(...card.querySelectorAll('.card-body'));
    }
  }

  /** @type {Recipe[]} */
  const recipes = [];
  for (const recipeElement of recipeElements) {
    const label = (recipeElement.querySelector('h5')?.innerText ?? '').trim();
    const machine = (recipeElement.querySelector('em small a')?.innerText ?? '')
      .trim()
      .toLowerCase();

    const [inputsContainer, outputsContainer] = recipeElement.querySelectorAll(
      '.row:nth-of-type(2) > div',
    );

    const inputs = inputsContainer
      .querySelectorAll('div')
      .map(parseRecipeElement);
    const outputs = outputsContainer
      .querySelectorAll('div')
      .map(parseRecipeElement);

    recipes.push({ label, machine, inputs, outputs });
  }

  return recipes;
}

/**
 * @param {HTMLElement} element
 * @returns {RecipeItem}
 */
function parseRecipeElement(element) {
  const url = element.querySelector('a')?.getAttribute('href') ?? '';

  const rateStr = element.querySelector('span')?.innerText ?? '';
  const rateMatches = rateStr.match(/\d+(\.\d+)?/);
  if (rateMatches === null) {
    throw new Error('invalid recipe element: ' + element.innerHTML);
  }
  const rate = parseFloat(rateMatches[0]);

  return { id: parseItemUrl(url).id, rate };
}

const itemUrls = await findItemUrls();

/** @type {Item[]} */
const items = [];
for (const itemUrl of itemUrls) {
  console.log(`Fetching ${parseItemUrl(itemUrl).name} - ${itemUrl}`);
  const item = await fetchItem(itemUrl);
  items.push(item);
}

writeFileSync('items.json', JSON.stringify(items), 'utf-8');
