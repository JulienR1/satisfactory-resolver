import { parse } from "node-html-parser";

const url =
  "https://satisfactory.wiki.gg/wiki/Template:DocsItems.json?action=edit";

const response = await fetch(url);
const html = await response.text();

const page = parse(html);
const textarea = page.getElementById("wpTextbox1");
const recipes = JSON.parse(textarea.innerText);

process.stdout.write(JSON.stringify(recipes));
