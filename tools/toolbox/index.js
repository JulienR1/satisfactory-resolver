import { writeFileSync } from 'fs';
import { HTMLElement, parse } from 'node-html-parser';

/**
 * @typedef {string} BuildingId
 * @typedef {{id: BuildingId, name:string, url:string, img:string, power:Power | null}} Building
 * @typedef {{type: "consumer" | "generator", value: number}} Power
 */

const domain = 'https://satisfactory-calculator.com';
const source = `${domain}/en/buildings`;

/**
 * @returns {Promise<string[]>}
 */
async function findBuildingUrls() {
  const response = await fetch(source);
  const pageStr = await response.text();
  const page = parse(pageStr);

  return page
    .querySelectorAll('.card h6 a')
    .map(element => domain + element.getAttribute('href') ?? '');
}

/**
 * @param {string} url
 * @returns {Promise<Building>}
 */
async function fetchBuilding(url) {
  if (!url.includes('/id/') || !url.includes('/name/')) {
    throw new Error('invalid building url: ' + url);
  }

  const response = await fetch(url);
  const pageStr = await response.text();
  const page = parse(pageStr);

  const { id, name } = parseBuildingUrl(url);
  const img = page.querySelector('main img')?.getAttribute('src') ?? '';
  const power = findPower(page);

  return { id, name, url, img, power };
}

/**
 * @param {string} url
 * @returns {{id: BuildingId, name: string}}
 */
function parseBuildingUrl(url) {
  return {
    id: url.split(/\//).at(-3) ?? '',
    name: (url.split(/\//).at(-1) ?? '').replaceAll('+', ' '),
  };
}

/**
 * @param {HTMLElement} page
 * @returns {Power?}
 **/
function findPower(page) {
  const elements = page.querySelectorAll('main ul > li');
  for (const element of elements) {
    const textElement = element.querySelector('span:first-of-type');
    const text = (textElement?.innerText ?? '').trim().toLowerCase();

    const isConsumer = text === 'power used';
    const isGenerator = text === 'power generated';
    const type = isConsumer ? 'consumer' : 'generator';

    if (isConsumer || isGenerator) {
      const powerStr = element.querySelector('span strong')?.innerText ?? '';
      const value = parseInt(powerStr.replaceAll(/[a-zA-Z,]/g, ''));
      return { value, type };
    }
  }

  return null;
}

const buildingUrls = await findBuildingUrls();

/** @type {Building[]} */
const buildings = [];
for (const url of buildingUrls) {
  console.log(`Fetching ${parseBuildingUrl(url).name} - ${url}`);
  const building = await fetchBuilding(url);
  buildings.push(building);
}

writeFileSync('buildings.json', JSON.stringify(buildings), 'utf-8');
