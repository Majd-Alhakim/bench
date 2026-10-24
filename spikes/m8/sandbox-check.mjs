// M8 follow-up: does Claude Code's built-in Bash sandbox start on native Windows? failIfUnavailable makes it say so.
import { query } from "@anthropic-ai/claude-agent-sdk";
import { homedir, tmpdir } from "node:os";
import path from "node:path";

const { ANTHROPIC_API_KEY: _drop, ...env } = process.env;
const CLAUDE = path.join(homedir(), ".local", "bin", process.platform === "win32" ? "claude.exe" : "claude");
try {
  for await (const m of query({ prompt: "Run: node --version", options: {
    model: "claude-haiku-5-5", pathToClaudeCodeExecutable: CLAUDE, cwd: tmpdir(), env, settingSources: [], strictMcpConfig: true,
    persistSession: false, maxTurns: 2, tools: ["Bash"], sandbox: { enabled: true, failIfUnavailable: true },
    stderr: (d) => process.stdout.write("stderr: " + d.slice(0, 300) + "\n") } })) {
    if (m.type === "result") console.log("result:", m.subtype, (m.result ?? "").slice(0, 200));
  }
} catch (e) { console.log("error:", String(e.message ?? e).slice(0, 400)); }
