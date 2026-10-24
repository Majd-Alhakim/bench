// SP-B1 follow-up: with --allowed-origins set, the browser agent can't open a site outside the list.
import { query } from "@anthropic-ai/claude-agent-sdk";
import { homedir } from "node:os";
import path from "node:path";

const { ANTHROPIC_API_KEY: _drop, ...env } = process.env;
const CLAUDE = path.join(homedir(), ".local", "bin", process.platform === "win32" ? "claude.exe" : "claude");
const q = query({
  prompt: "Navigate the browser to https://example.com and tell me the page title. Report any error verbatim.",
  options: {
    model: "claude-haiku-5-5", pathToClaudeCodeExecutable: CLAUDE, cwd: process.cwd(), env,
    settingSources: [], strictMcpConfig: true, persistSession: false, tools: [], maxTurns: 4,
    allowedTools: ["mcp__playwright__browser_navigate", "mcp__playwright__browser_snapshot"],
    mcpServers: { playwright: { type: "stdio", command: process.execPath,
      args: [path.resolve("node_modules/@playwright/mcp/cli.js"), "--browser", "msedge", "--headless", "--isolated", "--allowed-origins", "http://127.0.0.1:4173"] } },
  },
});
for await (const m of q) {
  if (m.type === "user") for (const c of m.message?.content ?? []) if (c.type === "tool_result") console.log("tool_result:", JSON.stringify(c.content).slice(0, 300));
  if (m.type === "result") console.log("agent:", m.result?.slice(0, 300));
}
