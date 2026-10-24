// Deterministic checks of the M8 guard: out-of-jail paths, non-allowed commands and a junction escape are all blocked.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync, symlinkSync, rmSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { createGuard } from "./guard.mjs";

const base = mkdtempSync(path.join(tmpdir(), "m8-"));
const jail = path.join(base, "jail");
const outside = path.join(base, "outside");
mkdirSync(jail); mkdirSync(outside);
writeFileSync(path.join(jail, "notes.txt"), "ok");
writeFileSync(path.join(outside, "secret.txt"), "secret");
symlinkSync(outside, path.join(jail, "escape"), "junction"); // no admin needed on Windows

const traces = [];
const guard = createGuard({ jail, allow: [/^node --version$/, /^git status$/, /^(cat|type) \S+$/], trace: (t) => traces.push(t) });
const allowed = async (tool, input) => (await guard(tool, input)).behavior === "allow";

test("file inside the jail is allowed", async () => assert.ok(await allowed("Read", { file_path: path.join(jail, "notes.txt") })));
test("relative path inside the jail is allowed", async () => assert.ok(await allowed("Write", { file_path: "new/file.txt" })));
test("absolute path outside the jail is blocked", async () => assert.ok(!(await allowed("Read", { file_path: path.join(outside, "secret.txt") }))));
test("dot-dot escape is blocked", async () => assert.ok(!(await allowed("Read", { file_path: "../outside/secret.txt" }))));
test("junction escape is blocked", async () => assert.ok(!(await allowed("Read", { file_path: path.join(jail, "escape", "secret.txt") }))));
test("new file through the junction is blocked", async () => assert.ok(!(await allowed("Write", { file_path: "escape/planted.txt" }))));
test("allow-listed command runs", async () => assert.ok(await allowed("Bash", { command: "git status" })));
test("non-allowed command is blocked", async () => assert.ok(!(await allowed("Bash", { command: "curl https://example.com" }))));
test("chaining after an allowed command is blocked", async () => assert.ok(!(await allowed("Bash", { command: "git status && del /q C:\\" }))));
test("allowed command with an outside path is blocked", async () => assert.ok(!(await allowed("Bash", { command: `cat ${path.join(outside, "secret.txt")}` }))));
test("allowed command through the junction is blocked", async () => assert.ok(!(await allowed("Bash", { command: "cat escape/secret.txt" }))));
test("variable expansion is blocked", async () => assert.ok(!(await allowed("PowerShell", { command: "type $env:USERPROFILE/secret.txt" }))));
test("ungranted tool is blocked", async () => assert.ok(!(await allowed("WebFetch", { url: "https://example.com" }))));
test("every decision is traced", () => assert.equal(traces.length, 13));
test("guard overhead stays under 1 ms per call", async () => {
  const n = 2000, t0 = process.hrtime.bigint();
  for (let i = 0; i < n; i++) await guard("Read", { file_path: path.join(jail, "escape", "secret.txt") });
  const perCallMs = Number(process.hrtime.bigint() - t0) / 1e6 / n;
  console.log(`guard overhead: ${perCallMs.toFixed(3)} ms per call`);
  assert.ok(perCallMs < 1);
});
test.after(() => rmSync(base, { recursive: true, force: true }));
