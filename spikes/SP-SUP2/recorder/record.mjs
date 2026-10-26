// SP-SUP2 recorder: an observational Claude Code hook (Stop, Notification), registered with `async: true`, so Claude
// Code never waits for it. It reads the session transcript the hook input points to, rebuilds the SP-SUP1 signals,
// scrubs the last assistant message on this PC, and appends supervisor moments to
// %LOCALAPPDATA%\Eucas\sup2-recordings\moments-<date>.jsonl. It never blocks, never prints, and always exits 0.
// No network calls. No labels, no models.
import { readFileSync, appendFileSync, mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename, join } from "node:path";
import { userInfo } from "node:os";
import { scrub, messageFlags } from "./scrub.mjs";

const OUT = process.env.EUCAS_SUP2_DIR ?? join(process.env.LOCALAPPDATA ?? ".", "Eucas", "sup2-recordings");
const BUDGET = 2_000_000; // same token budget as the SP-SUP1 corpus, so pct is comparable
const MAX_BLOCKS_PER_KIND = 2;
const MAX_TRANSCRIPT_BYTES = 30 * 1024 * 1024;

function main() {
  let input = {};
  try {
    input = JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return;
  }
  const event = input.hook_event_name;
  if (event !== "Stop" && event !== "Notification" && event !== "SubagentStop") return;
  mkdirSync(join(OUT, "state"), { recursive: true });

  const sid = createHash("sha256").update(String(input.session_id ?? "")).digest("hex").slice(0, 10);
  const statePath = join(OUT, "state", `${sid}.json`);
  const saved = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : { cursor: 0, blocks: {}, streakRecorded: false, n: 0 };
  const repo = input.cwd ? basename(input.cwd) : "";
  const names = [userInfo().username, ...String(process.env.EUCAS_SUP2_NAMES ?? "").split(",")].filter(Boolean);
  const clean = (t) => scrub(t, { repo, names });

  const lines = readTranscript(input.transcript_path);
  const st = { first: 0, turns: 0, calls: 0, recent: [], tests: null, streak: 0, lastFailKey: "", files: new Set(), tokens: 0, lastText: "", lastT: 0, exit: 0 };
  const pending = new Map();
  const moments = [];
  const fileIds = new Map();
  const anon = (f) => (fileIds.has(f) ? fileIds.get(f) : (fileIds.set(f, `T${fileIds.size + 1}`), fileIds.get(f)));

  const snapshot = (trigger, now, message, extra = {}) => {
    const signals = {
      trigger,
      session_min: Math.round(((now - st.first) / 60000) * 10) / 10,
      idle_sec: Math.max(0, Math.round((now - st.lastT) / 1000)),
      turns: st.turns,
      tool_calls: st.calls,
      recent_tools: st.recent.slice(-5),
      last_exit_code: st.exit,
      tests: st.tests && { passed: st.tests.passed, failed: st.tests.failed, skipped: st.tests.skipped, failing: st.tests.files.map((f) => ({ id: anon(f), kind: st.tests.envMissing ? "env_missing" : "assertion" })) },
      same_failure_streak: st.streak,
      files_changed: st.files.size,
      tokens: { used: st.tokens, budget: BUDGET, pct: Math.round((st.tokens / BUDGET) * 100) },
      permission: null,
      rule_fired: null,
      ...extra,
    };
    signals.msg_flags = messageFlags(message);
    signals.msg_chars = message.length;
    saved.n++;
    moments.push({ id: `s2-${sid}-${String(saved.n).padStart(4, "0")}`, source: "real", session: sid, recorded_at: new Date().toISOString(), event, signals, last_message: clean(message), label: null });
  };

  lines.forEach((line, i) => {
    const t = Date.parse(line.timestamp ?? "") || 0;
    if (!st.first && t) st.first = t;
    const fresh = i >= saved.cursor;
    if (line.type === "assistant") {
      st.turns++;
      const u = line.message?.usage ?? {};
      st.tokens = Math.max(st.tokens, (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0)) + (u.output_tokens ?? 0);
      for (const c of line.message?.content ?? []) {
        if (c.type === "text" && c.text) st.lastText = c.text;
        if (c.type === "tool_use") {
          st.calls++;
          pending.set(c.id, toolCategory(c.name, c.input ?? {}));
          if (/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(c.name) && c.input?.file_path) st.files.add(c.input.file_path);
        }
      }
      if (t) st.lastT = t;
    }
    if (line.type === "user" && Array.isArray(line.message?.content)) {
      for (const c of line.message.content) {
        if (c.type !== "tool_result") continue;
        const text = typeof c.content === "string" ? c.content : JSON.stringify(c.content ?? "");
        const cat = pending.get(c.tool_use_id) ?? "?";
        const blocked = c.is_error && /hook error|blocked|denied|requires approval|not allowed|permission|doesn't want to proceed|subexpression|script block/i.test(text);
        st.recent.push(blocked ? `${cat}(blocked)` : cat);
        st.exit = c.is_error ? 1 : 0;
        const b = blocked && blockCategory(text, cat);
        if (b && fresh && (saved.blocks[b.category] ?? 0) < MAX_BLOCKS_PER_KIND) {
          saved.blocks[b.category] = (saved.blocks[b.category] ?? 0) + 1;
          snapshot("tool_blocked", t, st.lastText, { permission: { tool: cat.split(":")[0], category: b.category }, rule_fired: b.rule });
        }
        const tr = cat.endsWith(":test") ? parseTests(text) : null;
        if (tr) {
          const key = tr.files.join(",");
          st.streak = tr.failed && key === st.lastFailKey ? st.streak + 1 : tr.failed ? 1 : 0;
          st.lastFailKey = key;
          st.tests = tr;
          if (st.streak === 0) saved.streakRecorded = false;
          // A failure only wakes the supervisor once it repeats (a loop); one failure is normal work.
          if (tr.failed && st.streak >= 3 && fresh && !saved.streakRecorded) {
            saved.streakRecorded = true;
            snapshot("test_failed", t, st.lastText);
          }
        }
      }
    }
  });

  const now = Date.now();
  if (event === "Notification") {
    const type = String(input.notification_type ?? "");
    const msg = String(input.message ?? "");
    const trigger = /permission/i.test(type + msg) ? "waiting_permission" : /idle|waiting for your input/i.test(type + msg) ? "idle" : "notification";
    const last = st.recent.at(-1) ?? "";
    snapshot(trigger, now, st.lastText, trigger === "waiting_permission" ? { permission: { tool: last.split(":")[0] || "?", category: "approval" } } : {});
  } else {
    snapshot(event === "SubagentStop" ? "subagent_stopped" : "stopped", now, String(input.last_assistant_message ?? st.lastText ?? ""));
  }

  saved.cursor = lines.length;
  const day = new Date().toISOString().slice(0, 10);
  for (const m of moments) appendFileSync(join(OUT, `moments-${day}.jsonl`), JSON.stringify(m) + "\n");
  writeFileSync(statePath, JSON.stringify(saved));
}

function readTranscript(path) {
  try {
    if (!path || !existsSync(path)) return [];
    const size = statSync(path).size;
    let text = readFileSync(path, "utf8");
    if (size > MAX_TRANSCRIPT_BYTES) text = text.slice(-MAX_TRANSCRIPT_BYTES);
    return text
      .split("\n")
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function toolCategory(name, input) {
  if (name === "Bash" || name === "PowerShell") {
    const c = String(input.command ?? "");
    if (/\b(rm|rmdir|Remove-Item|del|rd)\b/i.test(c)) return `${name}:delete`;
    if (/\.env\b(?!\.example)/.test(c)) return `${name}:secrets`;
    if (/\bgit push\b/.test(c)) return `${name}:push`;
    if (/\b(vitest|jest|pytest|mocha|go test|cargo test|dotnet test|(npm|pnpm|yarn|bun) (run )?test)\b/.test(c)) return `${name}:test`;
    if (/migrat/.test(c)) return `${name}:migrate`;
    if (/\b(tsc|typecheck|mypy)\b/.test(c)) return `${name}:typecheck`;
    if (/\b(npm|pnpm|yarn|bun) (i|install|add|ci)\b|pip install/.test(c)) return `${name}:install`;
    return `${name}:other`;
  }
  if (/^(Edit|Write|Read|MultiEdit)$/.test(name)) return /[\\/]\.env$/.test(input.file_path ?? "") ? `${name}:.env` : name;
  return name.startsWith("mcp__") ? "mcp" : name;
}

function blockCategory(text, cat) {
  if (/\.env\b(?!\.example)/.test(text) || cat.endsWith(":secrets") || cat.endsWith(".env")) return { category: "secrets_file", rule: "R1_secrets_file" };
  if (cat.endsWith(":delete")) return { category: "destructive", rule: "R2_destructive" };
  if (cat.endsWith(":push")) return { category: "push", rule: null };
  if (/multiple operations|subexpression|script block/.test(text)) return { category: "compound_command", rule: null };
  if (/doesn't want to proceed|rejected/i.test(text)) return { category: "user_declined", rule: null };
  if (/hook error/i.test(text)) return { category: "hook", rule: null };
  return { category: "other", rule: null };
}

function parseTests(text) {
  const t = text.replace(/\x1b\[[0-9;]*m/g, "");
  const num = (re) => Number((t.match(re) ?? [0, 0])[1]);
  const passed = num(/(\d+) passed/);
  const failed = num(/(\d+) failed/);
  const skipped = num(/(\d+) skipped/);
  if (!passed && !failed && !/Tests?:?\s/.test(t)) return null;
  const files = [...t.matchAll(/(?:FAIL|FAILED)\s+([\w./\\-]+)/g)].map((x) => basename(x[1].split("::")[0]));
  return { passed, failed, skipped, files: [...new Set(files)], envMissing: /not set|missing env|environment variable/i.test(t) };
}

try {
  main();
} catch (e) {
  try {
    mkdirSync(OUT, { recursive: true });
    appendFileSync(join(OUT, "recorder-errors.log"), `${new Date().toISOString()} ${String(e?.name ?? "error")}\n`);
  } catch {}
}
process.exit(0);
