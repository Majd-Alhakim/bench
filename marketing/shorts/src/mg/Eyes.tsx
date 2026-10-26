import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { easeInOut, easeOut, G, s, T } from "./tokens";

/** The eye grammar (DESIGN.md §2.3): eight faces and no others. "front" is Toward you; "calm" is the default. */
export type Face = "calm" | "focused" | "glance" | "front" | "concerned" | "sleepy" | "pleased" | "closed";

type Shape = { w: number; h: number; rTop: number; rBot: number; rotL: number; rotR: number; dx: number; dy: number; color: string };

// CSS px at 100 % scale, from notch.css `.eyes[data-x]` and tokens-notch.css. Radii are what the browser draws
// (CSS scales oversized radii down: Pleased's 9 9 3 3 on a 9 × 5 box becomes 3.75 / 1.25).
const SHAPES: Record<Face, Shape> = {
  calm: { w: G.eyeW, h: G.eyeH, rTop: 2.5, rBot: 2.5, rotL: -12, rotR: -12, dx: 0, dy: 0, color: T.eye },
  focused: { w: 6, h: 9, rTop: 3, rBot: 3, rotL: 0, rotR: 0, dx: 0, dy: 0, color: T.eye },
  glance: { w: G.eyeW, h: G.eyeH, rTop: 2.5, rBot: 2.5, rotL: -12, rotR: -12, dx: 3, dy: 1, color: T.eye },
  front: { w: G.eyeW, h: G.eyeH, rTop: 2.5, rBot: 2.5, rotL: -12, rotR: -12, dx: 0, dy: -1.5, color: T.eye },
  concerned: { w: G.eyeW, h: G.eyeH, rTop: 2.5, rBot: 2.5, rotL: 16, rotR: -16, dx: 0, dy: 1.5, color: T.eye },
  sleepy: { w: 9, h: 2.6, rTop: 1.3, rBot: 1.3, rotL: 0, rotR: 0, dx: 0, dy: 3, color: T.eyeDim },
  pleased: { w: 9, h: 5, rTop: 3.75, rBot: 1.25, rotL: 0, rotR: 0, dx: 0, dy: -1, color: T.eye },
  closed: { w: 8, h: 2.4, rTop: 1.2, rBot: 1.2, rotL: 0, rotR: 0, dx: 0, dy: 2, color: T.eyeClosed },
};

/** A face change: from `from` to `to`, starting at frame `at` (in the caller's timeline). */
export type FaceKey = { at: number; face: Face };

const MORPH = 8; // frames (~260 ms), the prototype's shape transition

const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** The face at `frame` from a list of keys (sorted by `at`), with the shape morph between them. */
export function faceAt(keys: FaceKey[], frame: number): { shape: Shape; face: Face; since: number } {
  let i = 0;
  while (i + 1 < keys.length && keys[i + 1].at <= frame) i++;
  const cur = keys[i];
  const prev = keys[i - 1];
  const to = SHAPES[cur.face];
  if (!prev || frame >= cur.at + MORPH) return { shape: to, face: cur.face, since: cur.at };
  const p = interpolate(frame, [cur.at, cur.at + MORPH], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });
  const from = SHAPES[prev.face];
  const shape: Shape = {
    w: mix(from.w, to.w, p),
    h: mix(from.h, to.h, p),
    rTop: mix(from.rTop, to.rTop, p),
    rBot: mix(from.rBot, to.rBot, p),
    rotL: mix(from.rotL, to.rotL, p),
    rotR: mix(from.rotR, to.rotR, p),
    dx: mix(from.dx, to.dx, p),
    dy: mix(from.dy, to.dy, p),
    color: interpolateColors(p, [0, 1], [from.color, to.color]),
  };
  return { shape, face: cur.face, since: cur.at };
}

/** Blink: scaleY to 0.08 and back in 150 ms, only for Calm and Toward you. `blinks` are frames in the caller's timeline. */
function blinkScale(frame: number, blinks: number[]) {
  for (const b of blinks) {
    if (frame >= b && frame <= b + 5) return interpolate(frame, [b, b + 2.25, b + 4.5], [1, 0.08, 1], { extrapolateRight: "clamp", easing: easeInOut });
  }
  return 1;
}

type Props = {
  keys: FaceKey[];
  /** The frame in the same timeline as `keys` (default: the current frame). */
  frame?: number;
  blinks?: number[];
  /** Pointer follow for Calm and Toward you: -1..1 in x and y (≤ 2.5 px, ≤ 1.5 px). */
  look?: [number, number];
  /** Pixels per CSS px. */
  scale?: number;
};

/** Pip's eyes, centred on (0, 0) of their box: two shapes, 9 px apart, always the same count and colour family. */
export const Eyes: React.FC<Props> = ({ keys, frame: f, blinks = [], look = [0, 0], scale = 1 }) => {
  const current = useCurrentFrame();
  const frame = f ?? current;
  const { shape, face } = faceAt(keys, frame);
  const follows = face === "calm" || face === "front";
  const bl = follows ? blinkScale(frame, blinks) : 1;
  // Focused reads left to right: ±2 px, 2.4 s ease-in-out, alternate. The only loop.
  const scan =
    face === "focused"
      ? (() => {
          const period = s(2.4);
          const t = (frame % (period * 2)) / period;
          const p = t <= 1 ? t : 2 - t;
          return interpolate(easeInOut(p), [0, 1], [-2, 2]);
        })()
      : 0;
  const lx = follows ? look[0] * 2.5 : 0;
  const ly = follows ? look[1] * 1.5 : 0;
  const half = G.eyeGap / 2 + shape.w / 2;
  const eye = (side: -1 | 1) => (
    <div
      key={side}
      style={{
        position: "absolute",
        left: (side * half - shape.w / 2 + shape.dx + scan + lx) * scale,
        top: (-shape.h / 2 + shape.dy + ly) * scale,
        width: shape.w * scale,
        height: shape.h * scale,
        background: shape.color,
        borderRadius: `${shape.rTop * scale}px ${shape.rTop * scale}px ${shape.rBot * scale}px ${shape.rBot * scale}px`,
        transform: `rotate(${side < 0 ? shape.rotL : shape.rotR}deg) scaleY(${bl})`,
      }}
    />
  );
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0 }}>
      {eye(-1)}
      {eye(1)}
    </div>
  );
};

export const FACE_NAMES: Record<Face, string> = {
  calm: "Calm",
  focused: "Focused",
  glance: "Glance",
  front: "Toward you",
  concerned: "Concerned",
  sleepy: "Sleepy",
  pleased: "Pleased",
  closed: "Closed",
};
