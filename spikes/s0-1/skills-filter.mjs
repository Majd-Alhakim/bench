// Spike S0-1 follow-up: with the Skill tool on, does `skills: [...]` limit what the agent can see and invoke?
import { query } from "@anthropic-ai/claude-agent-sdk";
import { homedir, tmpdir } from "node:os";
import path from "node:path";

const { ANTHROPIC_API_KEY: _drop, ...env } = process.env;
const CLAUDE = path.join(homedir(), ".local", "bin", process.platform === "win32" ? "claude.exe" : "claude");

const q = query({
  prompt: "List the exact names of the skills you can invoke with the Skill tool, comma-separated, nothing else.",
  options: {
    model: "claude-haiku-5-5",
    pathToClaudeCodeExecutable: CLAUDE,
    cwd: tmpdir(),
    env,
    settingSources: [],
    strictMcpConfig: true,
    tools: ["Skill"],
    skills: ["debug"],
    persistSession: false,
    maxTurns: 1,
  },
});
for await (const m of q) {
  if (m.type === "system" && m.subtype === "init") console.log("init skills:", m.skills.length, m.skills.join(","), "| tools:", m.tools.join(","));
  if (m.type === "assistant") console.log("agent says:", (m.message?.content ?? []).filter((c) => c.type === "text").map((c) => c.text).join(""));
  if (m.type === "result") console.log("cost:", m.total_cost_usd);
}
