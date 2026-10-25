// Merges real + planted moments with labeller A's decisions, and writes the blind file for labeller B.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { DATA } from "./config.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const realLabels = read(join(import.meta.dirname, "rules", "real-labels-a.json"));
const real = read(join(DATA, "real.json")).map((m) => {
  if (!realLabels[m.id]) throw new Error(`no label for ${m.id}`);
  return { ...m, situation: `real_${m.signals.trigger}`, label_a: realLabels[m.id] };
});
const adjudicated = read(join(import.meta.dirname, "rules", "adjudication.json"));
const labelsB = existsSync(join(DATA, "labels-b.json")) ? read(join(DATA, "labels-b.json")) : null;
const keyOf = existsSync(join(DATA, "blind-keys.json")) ? Object.fromEntries(Object.entries(read(join(DATA, "blind-keys.json"))).map(([k, id]) => [id, k])) : {};
const corpus = [...real, ...read(join(DATA, "planted.json"))].map((m) => ({
  ...m,
  ...(labelsB ? { label_b: labelsB[keyOf[m.id]] } : {}),
  truth: adjudicated[m.id] ?? m.label_a,
}));
writeFileSync(join(DATA, "corpus.json"), JSON.stringify(corpus, null, 1));

// Shuffle deterministically so labeller B can't infer labels from order or ids.
const blind = corpus
  .map((m, i) => ({ key: `m${String(i + 1).padStart(3, "0")}`, id: m.id, signals: m.signals, last_message: m.last_message }))
  .sort((a, b) => ((a.key.charCodeAt(3) * 7919 + a.key.charCodeAt(2) * 31) % 211) - ((b.key.charCodeAt(3) * 7919 + b.key.charCodeAt(2) * 31) % 211) || a.key.localeCompare(b.key));
writeFileSync(join(DATA, "blind-keys.json"), JSON.stringify(Object.fromEntries(blind.map((b) => [b.key, b.id]))));
writeFileSync(join(DATA, "blind.json"), JSON.stringify(blind.map(({ key, signals, last_message }) => ({ key, signals, last_message })), null, 1));
console.log(corpus.length, "moments;", real.length, "real");
