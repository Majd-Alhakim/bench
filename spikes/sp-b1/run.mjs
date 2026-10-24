// Spike SP-B1 (throwaway): one agent drives a headed Edge through @playwright/mcp, with its own profile,
// on a local test site. canUseTool holds the run for "Take over" when the agent reaches a password field (G2-Q3).
import { query } from "@anthropic-ai/claude-agent-sdk";
import { mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { start } from "./site/server.mjs";

const CLAUDE = path.join(homedir(), ".local", "bin", process.platform === "win32" ? "claude.exe" : "claude");
const { ANTHROPIC_API_KEY: _drop, ...env } = process.env;
const ORIGIN = "http://127.0.0.1:4173";
mkdirSync("out", { recursive: true });

const server = await start(4173);
const events = [];
const ev = (kind, detail) => { const e = { t: Date.now(), kind, ...detail }; events.push(e); console.log(kind, JSON.stringify(detail).slice(0, 160)); };

// Take over: the first time the agent tries to type into a password field, pause and hand it to "the user".
let tookOver = false;
async function canUseTool(name, input) {
  const isPassword = name === "mcp__playwright__browser_type" && /password/i.test(JSON.stringify(input));
  const isFill = name === "mcp__playwright__browser_fill_form" && /password/i.test(JSON.stringify(input));
  if ((isPassword || isFill) && !tookOver) {
    tookOver = true;
    ev("TAKE_OVER", { tool: name, note: "agent paused; user would sign in here" });
    await new Promise((r) => setTimeout(r, 3000)); // the user's turn in the real app
    ev("USER_DONE", {});
    return { behavior: "deny", message: "The user took over and signed in for you. Do not type the password. Click the link \"I'm signed in, continue\" and carry on." };
  }
  return { behavior: "allow", updatedInput: input };
}

const task = `Use the browser to do this on ${ORIGIN} (a local test shop, fake data):
1. Open ${ORIGIN}/  2. Search for "lamp"  3. Open the Desk lamp page  4. Set quantity to 2  5. Add to cart
6. Open the cart and click Checkout  7. On the sign-in page, try to sign in with email test@example.com and password hunter2
8. Continue to checkout  9. Fill name "Spike Tester" and city "Riyadh"  10. Place the test order, take a screenshot, and report the confirmation text.`;

const t0 = Date.now();
let screenshots = 0, toolCalls = 0, result;
const q = query({
  prompt: task,
  options: {
    model: "claude-sonnet-5-5",
    pathToClaudeCodeExecutable: CLAUDE,
    cwd: process.cwd(),
    env,
    settingSources: [],
    strictMcpConfig: true,
    persistSession: false,
    tools: [],
    mcpServers: {
      playwright: {
        type: "stdio",
        command: process.execPath,
        args: [path.resolve("node_modules/@playwright/mcp/cli.js"), "--browser", "msedge", "--user-data-dir", path.resolve("profile/agent-a"),
          "--allowed-origins", ORIGIN, "--output-dir", path.resolve("out"), "--image-responses", "allow"],
      },
    },
    canUseTool,
    maxTurns: 40,
  },
});
for await (const m of q) {
  if (m.type === "system" && m.subtype === "init") ev("INIT", { tools: m.tools.length, mcp: m.mcp_servers });
  if (m.type === "assistant") for (const c of m.message?.content ?? []) if (c.type === "tool_use") { toolCalls++; ev("TOOL", { name: c.name.replace("mcp__playwright__", ""), input: c.input }); }
  if (m.type === "user") for (const c of m.message?.content ?? []) if (c.type === "tool_result" && Array.isArray(c.content)) screenshots += c.content.filter((x) => x.type === "image").length;
  if (m.type === "result") result = { subtype: m.subtype, num_turns: m.num_turns, cost: m.total_cost_usd, usage: m.usage, modelUsage: m.modelUsage, text: m.result?.slice(0, 400) };
}
const summary = { wall_ms: Date.now() - t0, toolCalls, imagesInStream: screenshots, tookOver, result };
writeFileSync("out/results.json", JSON.stringify({ summary, events }, null, 2));
console.log("SUMMARY", JSON.stringify(summary).slice(0, 600));
server.close();
