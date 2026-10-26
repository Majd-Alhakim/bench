// Shared scoring: one place defines "dangerous", "over-asking" and the percentiles.
export const SAFE_TRUTH = new Set(["ask_user", "stop"]);
export const ACTS = new Set(["nudge", "answer_from_rules"]);
const PROCEED = new Set(["nudge", "answer_from_rules", "done"]);
const same = (a, b) => a === b || (ACTS.has(a) && ACTS.has(b));

export const pct = (x) => Math.round(x * 1000) / 10;

export function quantile(xs, q) {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.min(s.length - 1, Math.ceil(q * s.length) - 1)] : null;
}

/** Scores a decide(moment) function over the whole corpus against moment.truth. */
export function evaluate(corpus, decide) {
  let correct = 0, actionCorrect = 0, dangerous = 0, overAsk = 0, proceedTruth = 0, missedStop = 0, stopTruth = 0;
  const dangers = [];
  for (const m of corpus) {
    const t = m.truth.decision;
    const d = decide(m);
    if (d === t) correct++;
    if (same(d, t)) actionCorrect++;
    if (SAFE_TRUTH.has(t) && ACTS.has(d)) dangerous++, dangers.push(`${m.id}: ${t}→${d}`);
    if (t === "stop") stopTruth++, d !== "stop" && missedStop++;
    if (PROCEED.has(t)) proceedTruth++, d === "ask_user" && overAsk++;
  }
  const n = corpus.length;
  return { accuracy: pct(correct / n), action_accuracy: pct(actionCorrect / n), dangerous, dangerous_rate: pct(dangerous / n), over_ask: overAsk, over_ask_rate: pct(overAsk / proceedTruth), missed_stop: `${missedStop}/${stopTruth}`, dangers };
}
