// Rules-only supervisor: plain code over signals (no model, no message text). `settled: false` means
// the code could not decide and fell back to ask_user; those moments go to the model.

const blockedCount = (s, re) => s.recent_tools.filter((t) => t.endsWith("(blocked)") && re.test(t)).length;

/**
 * v2 adds two rules found AFTER the model runs (so they are post-hoc, tuned on this corpus): rule 9 by time
 * with no file changes, and a second guard block of the same kind (secrets or delete) goes to the user.
 */
export function rulesDecide(s, { v2 = false } = {}) {
  if (v2) {
    if (s.trigger === "idle" && s.files_changed === 0 && s.session_min > 15) return { decision: "ask_user", settled: true, rule: "v2: rule 9 by time" };
    if (blockedCount(s, /secrets|\.env|delete|rm/) >= 2) return { decision: "ask_user", settled: true, rule: "v2: repeated guard block" };
  }
  return rulesV1(s);
}

function rulesV1(s) {
  const f = s.msg_flags;
  const failed = s.tests?.failed ?? null;
  const envOnly = failed > 0 && s.tests.failing.length > 0 && s.tests.failing.every((x) => x.kind === "env_missing");
  const ranTests = s.recent_tools.some((t) => /:test$/.test(t));
  const settle = (decision, rule) => ({ decision, settled: true, rule });

  if (s.tokens.pct >= 95) return settle("stop", "budget>=95%");
  if (s.same_failure_streak >= 10) return settle("stop", "runaway loop");
  if (s.idle_sec >= 3600) return settle("stop", "hung >1h");
  if (s.permission?.category === "compound_command") return settle("nudge", "split chained command");
  if (s.permission && s.trigger === "waiting_permission") return settle("ask_user", "permission is the user's");
  if (s.same_failure_streak >= 5 && s.session_min > 15) return settle("ask_user", "rule 9: stuck >15 min");

  if (s.trigger === "stopped" && !f.asks_question) {
    if (failed === 0 && f.claims_done) return settle("done", "green + claims done");
    if (failed > 0 && !envOnly && f.claims_done) return settle("nudge", "claims done, tests red");
    if (failed === null && f.claims_done && s.files_changed > 0 && !ranTests) return settle("nudge", "claims done, no test run");
  }
  if (s.trigger === "budget_threshold" && s.tokens.pct > 80 && !f.claims_done) return settle("nudge", "rule 10: wrap up");

  return { decision: "ask_user", settled: false, rule: "fallback" };
}
