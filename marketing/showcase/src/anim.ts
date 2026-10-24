import { Easing, interpolate, spring, SpringConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Calm ease-out: things arrive and settle, they never bounce (BRAND.md section 10). */
export const settle = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);

export const ease = (f: number, from: [number, number], to: [number, number], easing = settle) =>
  interpolate(f, from, to, { ...clamp, easing });

/** Piecewise keyframes, eased in and out between each pair. */
export const keys = (f: number, at: number[], values: number[]) => interpolate(f, at, values, { ...clamp, easing: inOut });

/** A critically damped arrival starting at frame `at`, 0 -> 1. */
export const arrive = (f: number, at: number, fps: number, config: Partial<SpringConfig> = {}) =>
  spring({ frame: f - at, fps, config: { damping: 200, ...config } });

/** A small, lively pop (eyes opening, a character hopping), 0 -> 1. */
export const pop = (f: number, at: number, fps: number) =>
  spring({ frame: f - at, fps, config: { damping: 12, stiffness: 160, mass: 0.7 } });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
