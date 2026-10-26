// Shared harness: runs the isolated Claude Code against the mock API in a throwaway repo and reports what happened.
import { spawn, spawnSync } from "node:child_process";
import { writeFileSync, readFileSync, existsSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

export const SPIKE = process.env.EUCAS_SPIKE_DIR ?? join(tmpdir(), "eucas-spikes");
export const PROFILE = join(SPIKE, "profile");
export const REPO = join(SPIKE, "repo");
export const CLI = process.env.SPIKE_CLI ?? join(SPIKE, "cc-npm", "node_modules", "@anthropic-ai", "claude-code-win32-x64", "claude.exe");
export const PORT = 47110;
const SCRIPT = join(SPIKE, "mock-script.json");
const MOCK_LOG = join(SPIKE, "mock-log.jsonl");
export const GUARD_LOG = join(SPIKE, "guard-log.jsonl");
export const MODE = join(SPIKE, "guard-mode.txt");

/** The parent session's own Claude/Anthropic variables must never leak into the spike CLI. */
export function cleanEnv(extra = {}) {
  const env = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (/^(CLAUDE|ANTHROPIC|AI_AGENT|BAGGAGE|OTEL|MCP_)/i.test(k)) continue;
    env[k] = v;
  }
  return {
    ...env,
    CLAUDE_CONFIG_DIR: PROFILE,
    ANTHROPIC_BASE_URL: `http://127.0.0.1:${PORT}`,
    ANTHROPIC_API_KEY: "sk-ant-mock-not-a-real-key",
    DISABLE_AUTOUPDATER: "1",
    CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
    EUCAS_SPIKE_DIR: SPIKE,
    ...extra,
  };
}

let mock;
export async function startMock() {
  if (mock) return;
  writeFileSync(SCRIPT, "[]");
  mock = spawn(process.execPath, [fileURLToPath(new URL("./mock-api.mjs", import.meta.url))], {
    env: { ...process.env, MOCK_SCRIPT: SCRIPT, MOCK_LOG, MOCK_PORT: String(PORT) },
    stdio: ["ignore", "pipe", "inherit"],
  });
  await new Promise((r) => mock.stdout.once("data", r));
}
export const stopMock = () => {
  mock?.kill();
  mock = undefined;
};

export function setMode(lines) {
  writeFileSync(MODE, lines.join("\n"));
}

const readJsonl = (f) =>
  existsSync(f)
    ? readFileSync(f, "utf8")
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l))
    : [];

/** One headless session: the mock plays `turns`, Claude Code runs the tools, hooks fire. */
export async function session(turns, { args = [], env = {}, cwd = current, timeoutMs = 90_000, persist = false } = {}) {
  writeFileSync(SCRIPT, JSON.stringify(turns));
  await fetch(`http://127.0.0.1:${PORT}/__reload`, { headers: { connection: "close" } });
  rmSync(MOCK_LOG, { force: true });
  rmSync(GUARD_LOG, { force: true });
  const t0 = Date.now();
  const r = spawnSync(
    CLI,
    ["-p", "spike", "--output-format", "stream-json", "--verbose", "--include-hook-events", ...(persist ? [] : ["--no-session-persistence"]), ...args],
    { cwd, env: cleanEnv(env), encoding: "utf8", timeout: timeoutMs, windowsHide: true },
  );
  const events = (r.stdout ?? "")
    .split("\n")
    .filter((l) => l.startsWith("{"))
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return {
    wallMs: Date.now() - t0,
    status: r.status,
    timedOut: r.error?.code === "ETIMEDOUT",
    stderr: (r.stderr ?? "").slice(-2000),
    events,
    mock: readJsonl(MOCK_LOG),
    guard: readJsonl(GUARD_LOG),
  };
}

/** The tool_result Claude Code sent back for the first tool call. */
export const firstToolResult = (s) => s.mock.flatMap((m) => m.toolResults ?? [])[0];

// A new folder per session: a shell left behind by a killed hook can keep the old one locked.
let current = REPO;
let seq = 0;
export const repoDir = () => current;
export function freshRepo() {
  const dir = join(SPIKE, "repos", `r${Date.now()}-${seq++}`);
  current = dir;
  mkdirSync(dir, { recursive: true });
  const git = (...a) => spawnSync("git", a, { cwd: dir });
  git("init", "-q", "-b", "main");
  writeFileSync(join(dir, "README.md"), "hi\n");
  git("add", ".");
  git("-c", "user.email=spike@example.invalid", "-c", "user.name=spike", "commit", "-qm", "init");
  return dir;
}
