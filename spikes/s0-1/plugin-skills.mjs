// Spike S0-1 follow-up: a local plugin with two skills; grant only one and check the agent sees only that one.
import { query } from "@anthropic-ai/claude-agent-sdk";
import { homedir, tmpdir } from "node:os";
import path from "node:path";

const { ANTHROPIC_API_KEY: _drop, ...env } = process.env;
const CLAUDE = path.join(homedir(), ".local", "bin", process.platform === "win32" ? "claude.exe" : "claude");

const q = query({
  prompt: "List the names of every skill you can invoke, comma-separated. Then invoke the hello skill and follow it.",
  options: {
    model: "claude-haiku-5-5",
    pathToClaudeCodeExecutable: CLAUDE,
    cwd: tmpdir(),
    env,
    settingSources: [],
    strictMcpConfig: true,
    plugins: [{ type: "local", path: path.resolve("fixtures/spike-plugin") }],
    tools: ["Skill"],
    skills: ["spike-plugin:hello"],
    persistSession: false,
    maxTurns: 3,
  },
});
for await (const m of q) {
  if (m.type === "system" && m.subtype === "init") console.log("init plugins:", m.plugins.map((p) => p.name).join(","), "| spike skills:", m.skills.filter((s) => s.includes("spike") || s === "hello" || s === "secret").join(","));
  if (m.type === "assistant") for (const c of m.message?.content ?? []) { if (c.type === "text" && c.text.trim()) console.log("agent:", c.text.trim().slice(0, 200)); if (c.type === "tool_use") console.log("tool_use:", c.name, JSON.stringify(c.input)); }
  if (m.type === "result") console.log("result:", m.subtype, "cost:", m.total_cost_usd);
}
