// node --test: what must never survive scrubbing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { scrub } from "./scrub.mjs";

const opts = { repo: "shop", names: ["majdj", "Majd"] };
// Key-shaped fixtures are assembled at runtime so no secret-like literal sits in the repo (gitleaks runs on PRs).
const fake = { aws: "AK" + "IA" + "ABCDEFGHIJKLMNOP", ant: ["sk", "ant", "api03", "abcdefghijklmnopqrstuv"].join("-"), gh: "gh" + "p_" + "abcdefghijklmnop1234" };
const cases = [
  ["Done in C:Usersmajdjshopsrcapp.ts now", ["majdj", "Users"]],
  ["See C:\\Users\\majdj\\x\\y.ts and /home/majd/repo/a.py", ["majdj", "/home"]],
  [`key ${fake.aws} and ${fake.ant}`, ["AKIA", "api03"]],
  ["DATABASE_URL=postgres://u:p@h/db ok", ["postgres", "u:p"]],
  ["Majd said hi to majdj in the shop repo", ["Majd", "majdj", "shop"]],
  ["```\nsecret()\n```\nplain and `const x = someVeryLongInlineCodeSnippetThatIsLong()` end", ["secret(", "someVeryLong"]],
  [`token ${fake.gh} email a.b@example.com url https://x.io/a?t=1`, ["ghp_", "example.com", "x.io"]],
];
for (const [input, banned] of cases)
  test(input.slice(0, 40), () => {
    const out = scrub(input, opts);
    for (const b of banned) assert.ok(!out.includes(b), `${JSON.stringify(b)} survived in ${JSON.stringify(out)}`);
  });
test("ordinary text survives", () => assert.equal(scrub("Time: 10:30, all 12 tests pass.", opts), "Time: 10:30, all 12 tests pass."));
test("long messages keep the start and the end", () => {
  const out = scrub("x".repeat(300) + " middle " + "z".repeat(400) + " Should I continue?", opts);
  assert.ok(out.length <= 500 && out.startsWith("xxx") && out.endsWith("Should I continue?"));
});
