// How many moments are recorded so far, by trigger and session. Reads local files only.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIR = process.env.EUCAS_SUP2_DIR ?? join(process.env.LOCALAPPDATA, "Eucas", "sup2-recordings");
const files = existsSync(DIR) ? readdirSync(DIR).filter((f) => /^moments-.*\.jsonl$/.test(f)) : [];
const moments = files.flatMap((f) => readFileSync(join(DIR, f), "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)));
const by = (k) => moments.reduce((a, m) => ((a[k(m)] = (a[k(m)] ?? 0) + 1), a), {});
console.log(`${moments.length} moments (target 200-300) from ${new Set(moments.map((m) => m.session)).size} sessions`);
console.log("by trigger:", by((m) => m.signals.trigger));
console.log("with a last message:", moments.filter((m) => m.last_message).length);
