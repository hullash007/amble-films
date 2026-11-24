// Amble Films site generator. Run from the site folder: node tools/build.mjs
// Reads /content (films.json and site.mjs) and writes every page as static HTML, plus sitemap.xml.
import fs from "node:fs";
import path from "node:path";
import { written, ROOT, SITE, TODAY } from "./lib.mjs";
import { buildPages } from "./pages.mjs";

buildPages();
const urls = written.map(([p, pr]) => `  <url><loc>${SITE.url}${p}</loc><lastmod>${TODAY}</lastmod><priority>${pr}</priority></url>`).join("\n");
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log("Built", written.length, "pages, 404.html and sitemap.xml");
