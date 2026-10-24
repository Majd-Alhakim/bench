// Every beat of the cut, in seconds, placed on the music's own accents
// ("Spring Hope" by NickPanek, 1:10-2:01 of the track; see README). Re-time here only.
export const FPS = 30;
export const DURATION_S = 51;

const BEATS_S = {
  // Hook: the Quartet wakes up.
  wake: 0.4,
  glance: 1.8,
  lookUp: 3.2,
  // Problem: half-done ideas pile up; the top one tips and the Eucas catch it as the music rises.
  problem: 4.0,
  line2: 5.4,
  wobble: 6.0,
  tip: 7.2,
  turn: 8.0,
  toApp: 8.6, // the caught idea becomes a real conversation in the app
  // 1 · Talk to Atlas.
  talk: 9.0,
  typeStart: 10.6,
  typeEnd: 12.4,
  sent: 12.8,
  // 2 · Atlas asks.
  ask: 14.0,
  answer1: 16.0,
  q2: 17.2,
  answer2: 18.8,
  plan: 19.8,
  startTeam: 21.0,
  // 3 · The team builds it.
  team: 21.6,
  titles: 22.2,
  progress: 24.8,
  board: 26.0,
  boardDone: 28.6,
  // 4 · You review and test (the quiet passage).
  test: 31.8,
  startTest: 34.0,
  green: 35.2,
  // 5 · You say when it goes live (on the big swell).
  deploy: 38.0,
  goLive: 38.9,
  live: 40.5,
  // End.
  lockup: 43.2,
  tagline: 44.8,
  endCard: 47.0,
} as const;

export const F = Object.fromEntries(
  Object.entries(BEATS_S).map(([k, s]) => [k, Math.round(s * FPS)]),
) as { [K in keyof typeof BEATS_S]: number };

export const DURATION = DURATION_S * FPS;
