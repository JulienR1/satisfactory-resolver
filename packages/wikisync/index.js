import { parse } from "node-html-parser";
import { writeFileSync } from "node:fs";

const urls = {
  items: [
    "https://satisfactory.wiki.gg/wiki/Template:DocsItems.json?action=edit",
  ],
  recipes: [
    "https://satisfactory.wiki.gg/wiki/Template:DocsRecipes.json?action=edit",
  ],
  icons: [
    "https://satisfactory.wiki.gg/wiki/Category:Items",
    "https://satisfactory.wiki.gg/wiki/Category:Fluids",
    "https://satisfactory.wiki.gg/wiki/Category:Buildings",
  ],
};

const syncOption = process.argv[2];
if (syncOption in urls === false) {
  throw Error(`invalid sync option: '${syncOption}'`);
}

async function loadPage(url) {
  const response = await fetch(url);
  const html = await response.text();
  return parse(html);
}

let result = {};
for (const url of urls[syncOption]) {
  const page = await loadPage(url);

  if (syncOption === "icons") {
    const subcategories = page
      .querySelectorAll("#mw-subcategories a")
      .map((anchor) => anchor.getAttribute("href"))
      .map((path) => `https://satisfactory.wiki.gg${path}`);

    const pages = [page, ...(await Promise.all(subcategories.map(loadPage)))];

    const links = [
      ...new Set(
        pages.flatMap((p) =>
          p
            .querySelectorAll("#mw-pages a")
            .map((anchor) => anchor.getAttribute("href"))
            .map((path) => `https://satisfactory.wiki.gg${path}`),
        ),
      ),
    ];

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const itemPageResponse = await fetch(link);
      const itemPageHtml = await itemPageResponse.text();
      const itemPage = parse(itemPageHtml);

      const asides = itemPage.querySelectorAll("#mw-content-text aside");
      if (asides.length === 0) {
        console.error(`Could not find aside for item: '${link}'`);
        continue;
      }

      for (const aside of asides) {
        try {
          const imgSrc = aside.querySelector("img").getAttribute("src");
          const className = aside.querySelector(
            "div:last-of-type div",
          ).innerText;

          if (/\s/.test(className)) {
            throw Error("item class name contains whitespace, it is correct?");
          }

          result[className] = `https://satisfactory.wiki.gg${imgSrc}`;
          console.error(`[${i + 1}:${links.length}] ${className}: ${imgSrc}`);
        } catch (err) {
          console.error(link, err);
        }
      }
    }
  } else {
    const textarea = page.getElementById("wpTextbox1");
    result = JSON.parse(textarea.innerText);
  }
}

const filepath = process.argv[3] ?? "output.json";
writeFileSync(filepath, JSON.stringify(result));
