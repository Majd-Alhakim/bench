// First contact: does a mock-driven session fire our plugin's hooks and get a deny on `git push origin main`?
import { startMock, stopMock, session, setMode, freshRepo, firstToolResult } from "./lib.mjs";

await startMock();
freshRepo();
setMode([]);
const s = await session(
  [{ tool: "Bash", input: { command: "git push origin main", description: "push" } }, { text: "done" }],
  { args: ["--allowedTools", "Bash"] },
);
console.log({ wallMs: s.wallMs, status: s.status, timedOut: s.timedOut });
console.log("guard:", s.guard.map((g) => `${g.sub}:${g.decision}:${g.elapsed_us}us`).join(" "));
console.log("tool result:", firstToolResult(s));
console.log("hook events:", s.events.filter((e) => e.type === "system" && /hook/.test(e.subtype ?? "")).length);
console.log("stderr:", s.stderr);
console.log(
  "mock calls:",
  s.mock.map((m) => (m.other ? m.other : `${m.main ? "main" : "side"}:${m.turn.tool ?? "text"}`)),
);
stopMock();
