// Run-to-run consistency on the pilot moments: the same call made twice, compared.
// Usage: node consistency.mjs pilot.jsonl decisions-pilot.jsonl
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { OUT } from "./config.mjs";

const out = [];
for (const file of process.argv.slice(2)) {
  const rows = readFileSync(join(OUT, file), "utf8").trim().split("\n").map((l) => JSON.parse(l)).filter((r) => !r.error);
  const by = Object.groupBy(rows, (r) => `${r.model}${r.style ? ` [${r.style}]` : ""} L${r.level}`);
  for (const [variant, rs] of Object.entries(by)) {
    const r1 = new Map(rs.filter((r) => (r.run ?? 1) === 1).map((r) => [r.id, r]));
    const pairs = rs.filter((r) => r.run === 2 && r1.has(r.id)).map((r) => [r1.get(r.id), r]);
    if (!pairs.length) continue;
    const same = pairs.filter(([a, b]) => a.decision === b.decision).length;
    // For decision models, how far the probabilities moved between runs.
    const drift = pairs
      .filter(([a, b]) => a.probs && b.probs)
      .map(([a, b]) => Math.max(...Object.keys(a.probs).map((k) => Math.abs((a.probs[k] ?? 0) - (b.probs[k] ?? 0)))));
    const routed = [...new Set(pairs.flatMap(([a, b]) => [a.routed_model, b.routed_model]).filter(Boolean))];
    out.push({
      variant,
      pairs: pairs.length,
      same_decision: `${same}/${pairs.length}`,
      max_prob_drift: drift.length ? Math.round(Math.max(...drift) * 1000) / 1000 : null,
      routed_to: routed.length ? routed : undefined,
    });
  }
}
writeFileSync(join(OUT, "consistency.json"), JSON.stringify(out, null, 1));
for (const o of out) console.log(o.variant.padEnd(52), o.same_decision.padStart(6), o.max_prob_drift ?? "", o.routed_to?.join(",") ?? "");
