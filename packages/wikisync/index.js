import { parse } from "node-html-parser";
import { writeFileSync } from "node:fs";

const urls = {
  items:
    "https://satisfactory.wiki.gg/wiki/Template:DocsItems.json?action=edit",
  recipes:
    "https://satisfactory.wiki.gg/wiki/Template:DocsRecipes.json?action=edit",
};

const syncOption = process.argv[2];
if (syncOption in urls === false) {
  throw Error(`invalid sync option: '${syncOption}'`);
}

const response = await fetch(urls[syncOption]);
const html = await response.text();

const page = parse(html);
const textarea = page.getElementById("wpTextbox1");
const result = JSON.parse(textarea.innerText);

const filepath = process.argv[3] ?? "output.json";
writeFileSync(filepath, JSON.stringify(result));
