// A scripted stand-in for the Messages API on 127.0.0.1. Claude Code talks to it through ANTHROPIC_BASE_URL with a
// dummy key, so real hooks fire on real tool calls with 0 tokens and no login. Never forwards anything anywhere.
//
// Script: a JSON file (env MOCK_SCRIPT) holding an array of turns. Each turn is either
//   { "tool": "Bash", "input": { "command": "git push origin main" } }   -> one tool_use
//   { "text": "done" }                                                    -> end_turn
// Each /v1/messages call that is a main-loop turn takes the next turn; side calls (titles, summaries) get a short text.
import { createServer } from "node:http";
import { readFileSync, appendFileSync } from "node:fs";

const PORT = Number(process.env.MOCK_PORT ?? 47110);
const LOG = process.env.MOCK_LOG;
let script = [];
let cursor = 0;
let calls = 0;

const load = () => {
  script = process.env.MOCK_SCRIPT ? JSON.parse(readFileSync(process.env.MOCK_SCRIPT, "utf8")) : [{ text: "ok" }];
  cursor = 0;
};
load();

const sse = (res, events) => {
  res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache" });
  for (const [type, data] of events) res.write(`event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`);
  res.end();
};

function message(content, stop) {
  return {
    id: `msg_mock_${++calls}`,
    type: "message",
    role: "assistant",
    model: "claude-haiku-5-5",
    content,
    stop_reason: stop,
    stop_sequence: null,
    usage: { input_tokens: 0, output_tokens: 0 },
  };
}

function reply(res, body, turn) {
  const isTool = turn.tool !== undefined;
  const block = isTool
    ? { type: "tool_use", id: `toolu_mock_${calls + 1}`, name: turn.tool, input: turn.input }
    : { type: "text", text: turn.text };
  const stop = isTool ? "tool_use" : "end_turn";
  if (!body.stream) {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify(message([block], stop)));
  }
  const start = message([], null);
  const events = [["message_start", { message: start }]];
  if (isTool) {
    events.push(["content_block_start", { index: 0, content_block: { ...block, input: {} } }]);
    events.push(["content_block_delta", { index: 0, delta: { type: "input_json_delta", partial_json: JSON.stringify(turn.input) } }]);
  } else {
    events.push(["content_block_start", { index: 0, content_block: { type: "text", text: "" } }]);
    events.push(["content_block_delta", { index: 0, delta: { type: "text_delta", text: turn.text } }]);
  }
  events.push(["content_block_stop", { index: 0 }]);
  events.push(["message_delta", { delta: { stop_reason: stop, stop_sequence: null }, usage: { output_tokens: 0 } }]);
  events.push(["message_stop", {}]);
  sse(res, events);
}

// A main-loop turn carries the tool list; side calls (title, topic, summaries) usually don't.
const isMainTurn = (body) => Array.isArray(body.tools) && body.tools.length > 0;

createServer((req, res) => {
  let raw = "";
  req.on("data", (c) => (raw += c));
  req.on("end", () => {
    const url = req.url ?? "";
    if (url.startsWith("/__reload")) {
      load();
      res.writeHead(200);
      return res.end("reloaded");
    }
    if (!url.startsWith("/v1/messages")) {
      if (LOG) appendFileSync(LOG, JSON.stringify({ t: Date.now(), other: `${req.method} ${url}` }) + "\n");
      res.writeHead(url.includes("count_tokens") ? 200 : 404, { "content-type": "application/json" });
      return res.end(JSON.stringify(url.includes("count_tokens") ? { input_tokens: 0 } : { error: "mock" }));
    }
    let body = {};
    try {
      body = JSON.parse(raw || "{}");
    } catch {}
    const main = isMainTurn(body);
    const lastUser = [...(body.messages ?? [])].reverse().find((m) => m.role === "user");
    const toolResults = Array.isArray(lastUser?.content) ? lastUser.content.filter((c) => c.type === "tool_result") : [];
    const turn = main ? (script[cursor++] ?? { text: "done" }) : { text: "Spike" };
    if (LOG)
      appendFileSync(
        LOG,
        JSON.stringify({
          t: Date.now(),
          main,
          tools: main ? body.tools.map((t) => t.name).filter((n) => /^(Bash|PowerShell)$/.test(n)) : undefined,
          turn,
          toolResults: toolResults.map((r) => ({
            is_error: r.is_error ?? false,
            content: (typeof r.content === "string" ? r.content : JSON.stringify(r.content)).slice(0, 400),
          })),
        }) + "\n",
      );
    reply(res, body, turn);
  });
}).listen(PORT, "127.0.0.1", () => console.log(`mock api on 127.0.0.1:${PORT}`));

process.on("uncaughtException", (e) => console.error("mock error (kept running):", e.message));
