// Builds companion.html from src/: inlines the base tokens, the companion tokens, the CSS and the scripts,
// so the prototype is one self-contained file (fonts still load from Google Fonts, like direction.html).
//   node docs/design/ui/companion/prototype/build.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, "src");
const html = fs.readFileSync(path.join(src, "index.html"), "utf8").replace(/\/\*@include (.+?)\*\//g, (_, rel) => {
  const file = path.resolve(src, rel.trim());
  return `/* ---- ${path.relative(here, file).replaceAll("\\", "/")} ---- */\n` + fs.readFileSync(file, "utf8");
});
fs.writeFileSync(path.join(here, "companion.html"), html);
console.log(`companion.html · ${(html.length / 1024).toFixed(0)} KB`);
