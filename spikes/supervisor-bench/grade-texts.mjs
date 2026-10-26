// Joins the blind grades back to the systems that would send each text (out/hybrid-texts.json).
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { DATA, OUT } from "./config.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const blind = new Map(read(join(DATA, "text-grading-blind.json")).map((i) => [i.item, i]));
const key = read(join(DATA, "text-grading-key.json"));
const grades = read(join(DATA, "text-grades.json"));

// (moment id, text) -> grade
const gradeOf = new Map();
for (const [item, { id }] of Object.entries(key)) {
  for (const c of blind.get(item).candidates) {
    const g = grades[item]?.[c.label];
    if (g) gradeOf.set(`${id}|${c.text}`, g);
  }
}

const texts = read(join(OUT, "hybrid-texts.json"));
const BASE = "gpt-oss-120b only (SP-SUP1 pick)";
const base = new Map(texts.filter((t) => t.system === BASE).map((t) => [t.id, gradeOf.get(`${t.id}|${t.text}`)]));
const rows = [];
for (const [system, ts] of Object.entries(Object.groupBy(texts, (t) => t.system))) {
  const gs = ts.map((t) => gradeOf.get(`${t.id}|${t.text}`)).filter(Boolean);
  const paired = ts.filter((t) => base.get(t.id)).map((t) => gradeOf.get(`${t.id}|${t.text}`).score - base.get(t.id).score);
  rows.push({
    system,
    texts: gs.length,
    mean_score: Math.round((gs.reduce((a, g) => a + g.score, 0) / gs.length) * 100) / 100,
    score_4_plus: `${gs.filter((g) => g.score >= 4).length}/${gs.length}`,
    unsafe: gs.filter((g) => !g.safe).length,
    cites_rule: `${gs.filter((g) => g.cites_rule).length}/${gs.length}`,
    vs_baseline_same_moment: paired.length ? { moments: paired.length, mean_diff: Math.round((paired.reduce((a, b) => a + b, 0) / paired.length) * 100) / 100 } : null,
  });
}
const unsafe = [...gradeOf].filter(([, g]) => !g.safe).map(([k, g]) => `${k.split("|")[0]}: ${g.note}`);
writeFileSync(join(OUT, "text-quality.json"), JSON.stringify({ rows, unsafe }, null, 1));
const md = [
  "| System | Texts graded | Mean score (1–5) | Score ≥ 4 | Unsafe | Cites a rule | Same moment vs gpt-oss only |",
  "|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.system} | ${r.texts} | ${r.mean_score} | ${r.score_4_plus} | ${r.unsafe} | ${r.cites_rule} | ${r.vs_baseline_same_moment ? `${r.vs_baseline_same_moment.mean_diff >= 0 ? "+" : ""}${r.vs_baseline_same_moment.mean_diff} over ${r.vs_baseline_same_moment.moments}` : "–"} |`),
].join("\n");
writeFileSync(join(OUT, "text-quality-table.md"), md + "\n");
console.log(md);
if (unsafe.length) console.log("unsafe:", unsafe);
