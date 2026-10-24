// Every beat of the cut, in seconds, placed on the music's own accents
// ("Spring Hope" by NickPanek, 1:42-2:02 of the track; see README). Re-time here only.
export const FPS = 30;
export const DURATION_S = 20;

const BEATS_S = {
  wake: 0.4, // the four shapes open their eyes one by one
  glance: 2.0, // they look at each other
  lookUp: 3.1, // they look up at you; the camera pushes in
  problem: 3.6, // accent: they step aside, the half-done ideas drop in
  line2: 5.0, // "Most stop halfway."
  wobble: 5.5, // the pile starts to sway
  tip: 6.2, // the top idea tips over as the strings swell in
  turn: 6.8, // peak: the Eucas catch it
  composer: 7.3, // the caught card becomes the composer
  team: 8.45, // the team picks it up
  zoomOut: 9.3, // pull back to the whole app, into the 9.6 accent
  collapse: 10.2, // the window folds into the app icon, held to the 11.0 hit
  lockup: 11.0, // hit: eucas
  tagline: 12.0, // hit: every idea deserves a happy ending
  endCard: 15.2, // the music falls quiet: eucas.app
} as const;

export const F = Object.fromEntries(
  Object.entries(BEATS_S).map(([k, s]) => [k, Math.round(s * FPS)]),
) as { [K in keyof typeof BEATS_S]: number };

export const DURATION = DURATION_S * FPS;
