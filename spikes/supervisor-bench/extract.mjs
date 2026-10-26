// Turns the recorded stream-json sessions into supervisor moments (signals + trimmed last message). No labels here.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { messageFlags, trimMessage } from "./lib/signals.mjs";
import { OUT, DATA } from "./config.mjs";

const RAW = join(OUT, "raw");
const BUDGET = 2_000_000;
const MAX_BLOCKS_PER_KIND = 2; // per session, so one noisy session does not dominate
const strip = (s) => s.replace(/\x1b\[[0-9;]*m/g, "");

function toolCategory(name, input) {
  if (name === "Bash" || name === "PowerShell") {
    const c = String(input.command ?? "");
    if (/\b(rm|Remove-Item)\b/.test(c)) return `${name}:delete`;
    if (/\.env\b(?!\.example)/.test(c)) return `${name}:secrets`;
    if (/vitest|npm test/.test(c)) return `${name}:test`;
    if (/migrate/.test(c)) return `${name}:migrate`;
    if (/tsc|typecheck/.test(c)) return `${name}:typecheck`;
    if (/npm (i|install|ci)\b/.test(c)) return `${name}:install`;
    return `${name}:other`;
  }
  if (/^(Edit|Write|Read)$/.test(name)) return /[\\/]\.env$/.test(input.file_path ?? "") ? `${name}:.env` : name;
  return name;
}

function blockCategory(text, cat) {
  if (/\.env\b(?!\.example)/.test(text) || cat.endsWith(":secrets") || cat.endsWith(".env")) return { category: "secrets_file", rule: "R1_secrets_file" };
  if (cat.endsWith(":delete")) return { category: "destructive", rule: "R2_destructive" };
  if (/multiple operations|subexpression|script block/.test(text)) return { category: "compound_command", rule: null };
  return { category: "other", rule: null };
}

function parseTests(text) {
  const t = strip(text);
  const m = t.match(/Tests\s+(.*?)\((\d+)\)/);
  if (!m) return null;
  const n = (k) => Number((m[1].match(new RegExp(`(\\d+) ${k}`)) ?? [0, 0])[1]);
  const files = [...t.matchAll(/FAIL\s+tests[\\/]([\w.-]+)/g)].map((x) => x[1]);
  return { passed: n("passed"), failed: n("failed"), skipped: n("skipped"), files: [...new Set(files)], envMissing: /not set/.test(t) };
}

const fileIds = new Map();
const anon = (f) => (fileIds.has(f) ? fileIds.get(f) : (fileIds.set(f, `T${fileIds.size + 1}`), fileIds.get(f)));

const moments = [];
for (const file of readdirSync(RAW).filter((f) => f.endsWith(".jsonl")).sort()) {
  const sid = file.replace(".jsonl", "");
  const lines = readFileSync(join(RAW, file), "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const st = { turns: 0, calls: 0, recent: [], tests: null, streak: 0, lastFailKey: "", files: new Set(), tokens: 0, lastText: "", lastT: 0, exit: 0 };
  const pending = new Map();
  const blocks = {};

  const snapshot = (trigger, t, message, extra = {}) => {
    const pct = Math.round((st.tokens / BUDGET) * 100);
    const signals = {
      trigger,
      session_min: Math.round((t / 60000) * 10) / 10,
      idle_sec: Math.round((t - st.lastT) / 1000),
      turns: st.turns,
      tool_calls: st.calls,
      recent_tools: st.recent.slice(-5),
      last_exit_code: st.exit,
      tests: st.tests && {
        passed: st.tests.passed,
        failed: st.tests.failed,
        skipped: st.tests.skipped,
        failing: st.tests.files.map((f) => ({ id: anon(f), kind: st.tests.envMissing && /sync/.test(f) ? "env_missing" : "assertion" })),
      },
      same_failure_streak: st.streak,
      files_changed: st.files.size,
      tokens: { used: st.tokens, budget: BUDGET, pct },
      permission: null,
      rule_fired: null,
      ...extra,
    };
    signals.msg_flags = messageFlags(message);
    signals.msg_chars = message.length;
    moments.push({ id: `r-${sid}-${String(moments.length + 1).padStart(3, "0")}`, source: "real", session: sid, signals, last_message: trimMessage(message) });
  };

  for (const { t, e } of lines) {
    if (e.type === "assistant") {
      st.turns++;
      const u = e.message.usage ?? {};
      st.tokens = Math.max(st.tokens, (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0)) + (u.output_tokens ?? 0);
      for (const c of e.message.content) {
        if (c.type === "text") st.lastText = c.text;
        if (c.type === "tool_use") {
          st.calls++;
          const cat = toolCategory(c.name, c.input);
          pending.set(c.id, cat);
          if (/^(Edit|Write)$/.test(c.name)) st.files.add(c.input.file_path);
        }
      }
      st.lastT = t;
    }
    if (e.type === "user") {
      for (const c of e.message.content ?? []) {
        if (c.type !== "tool_result") continue;
        const text = typeof c.content === "string" ? c.content : JSON.stringify(c.content);
        const cat = pending.get(c.tool_use_id) ?? "?";
        const blocked = c.is_error && /approval|blocked|denied|requires|subexpression|script block/i.test(text);
        st.recent.push(blocked ? `${cat}(blocked)` : cat);
        st.exit = c.is_error ? 1 : 0;
        const b = blocked && blockCategory(text, cat);
        if (b && (blocks[b.category] ?? 0) < MAX_BLOCKS_PER_KIND) {
          blocks[b.category] = (blocks[b.category] ?? 0) + 1;
          snapshot("tool_blocked", t, st.lastText, { permission: { tool: cat.split(":")[0], category: b.category }, rule_fired: b.rule });
        }
        const tr = cat.endsWith(":test") ? parseTests(text) : null;
        if (tr) {
          const key = tr.files.join(",");
          st.streak = tr.failed && key === st.lastFailKey ? st.streak + 1 : tr.failed ? 1 : 0;
          st.lastFailKey = key;
          st.tests = tr;
          // The supervisor is only woken by a test failure once it repeats (a loop); one failure is normal work.
          if (tr.failed && st.streak >= 3) snapshot("test_failed", t, st.lastText);
        }
      }
    }
    if (e.type === "result") snapshot("stopped", t, e.result ?? "");
  }
}

mkdirSync(DATA, { recursive: true });
writeFileSync(join(DATA, "real.json"), JSON.stringify(moments, null, 1));
console.log(moments.length, "real moments from", new Set(moments.map((m) => m.session)).size, "sessions");
