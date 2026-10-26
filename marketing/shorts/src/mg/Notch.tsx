import React from "react";
import { interpolate } from "remotion";
import { Eyes, FaceKey } from "./Eyes";
import { easeInOut, G, mono, s, sans, T } from "./tokens";

/** The black notch body with its concave shoulders (DESIGN §2): top flush with the screen edge, bottom corners `r`. */
const Body: React.FC<{ w: number; h: number; r: number; k: number }> = ({ w, h, r, k }) => {
  const sh = G.shoulder;
  const d = [
    `M ${-sh} 0`,
    `H ${w + sh}`,
    `Q ${w} 0 ${w} ${sh}`,
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `H ${r}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `V ${sh}`,
    `Q 0 0 ${-sh} 0`,
    "Z",
  ].join(" ");
  return (
    <svg
      width={(w + sh * 2) * k}
      height={h * k + 40 * k}
      viewBox={`${-sh} 0 ${w + sh * 2} ${h + 40}`}
      style={{ position: "absolute", left: -sh * k, top: 0, overflow: "visible" }}
    >
      <defs>
        <filter id="nshadow" x="-50%" y="-50%" width="200%" height="250%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      <path d={d} fill={T.notchBg} stroke={T.notchRing} strokeWidth={1 / k} filter="url(#nshadow)" />
    </svg>
  );
};

type Props = {
  /** Pixels per CSS px. */
  k: number;
  frame: number;
  faces: FaceKey[];
  blinks?: number[];
  /** The body size in CSS px (grows into the peek). */
  w?: number;
  h?: number;
  r?: number;
  /** 0..1: the working beam and glow under the eyes. */
  beam?: number;
  /** An amber needs-you count, shown right of the eyes (0 = none). `markerIn` 0..1 for its arrival. */
  count?: number;
  markerIn?: number;
  children?: React.ReactNode;
};

/** The notch, drawn at `k` × CSS px, centred horizontally on x = 0, hanging from y = 0. */
export const Notch: React.FC<Props> = ({ k, frame, faces, blinks, w = G.notchW, h = G.notchH, r = G.notchR, beam = 0, count = 0, markerIn = 0, children }) => {
  const sweep = s(1.7);
  const t = (frame % (sweep * 2)) / sweep;
  const p = easeInOut(t <= 1 ? t : 2 - t);
  const beamX = interpolate(p, [0, 1], [-0.27, 0.27]);
  const hasMarker = count > 0 && markerIn > 0;
  // With a marker the eyes sit left of centre and the count to their right (164 px body).
  const eyesX = hasMarker ? interpolate(markerIn, [0, 1], [0, -14]) : 0;
  return (
    <div style={{ position: "absolute", left: (-w / 2) * k, top: 0, width: w * k, height: h * k }}>
      {beam > 0 && (
        <div
          style={{
            position: "absolute",
            left: (w / 2 - 50 + beamX * 60) * k,
            top: (G.notchH + 2) * k,
            width: 100 * k,
            height: 12 * k,
            borderRadius: "50%",
            background: T.euca.base,
            opacity: 0.55 * beam,
            filter: `blur(${8 * k}px)`,
          }}
        />
      )}
      <Body w={w} h={h} r={r} k={k} />
      {beam > 0 && (
        <div style={{ position: "absolute", left: 12 * k, width: (w - 24) * k, top: (G.notchH - 5) * k, height: 2 * k, overflow: "hidden", opacity: beam }}>
          <div
            style={{
              position: "absolute",
              left: `${27 + beamX * 100}%`,
              width: "46%",
              height: "100%",
              background: `linear-gradient(90deg, transparent, ${T.euca.light}, ${T.euca.base}, transparent)`,
            }}
          />
        </div>
      )}
      <div style={{ position: "absolute", left: (w / 2 + eyesX) * k, top: (G.notchH / 2) * k }}>
        <Eyes keys={faces} frame={frame} blinks={blinks} scale={k} />
      </div>
      {hasMarker && (
        <div
          style={{
            position: "absolute",
            left: (w / 2 + 16) * k,
            top: (G.notchH / 2 - 9) * k,
            minWidth: 18 * k,
            height: 18 * k,
            padding: `0 ${5 * k}px`,
            borderRadius: 9 * k,
            background: T.attn,
            color: T.attnText,
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 11 * k,
            lineHeight: `${18 * k}px`,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
            transform: `scale(${markerIn})`,
            boxSizing: "border-box",
          }}
        >
          {count}
        </div>
      )}
      {children}
    </div>
  );
};

/** A line of notch-panel text helpers, shared by the peek and the panel. */
export const Mono: React.FC<{ children: React.ReactNode; k: number; size?: number; color?: string }> = ({ children, k, size = 12, color = T.notchText }) => (
  <span style={{ fontFamily: mono, fontSize: size * k, color }}>{children}</span>
);
