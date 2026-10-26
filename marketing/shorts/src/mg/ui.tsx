import React from "react";
import { interpolate, spring } from "remotion";
import { easeOut, FPS, mono, sans, T } from "./tokens";

/** 0..1 eased progress between two frames. */
export const prog = (f: number, a: number, b: number, ease = easeOut) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** A spring that starts at `at` (the prototype's --spring-smooth: no overshoot by default). */
export const sp = (f: number, at: number, damping = 200, stiffness = 170) =>
  spring({ frame: f - at, fps: FPS, config: { damping, stiffness, mass: 1 } });

const Lock: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="7" width="9" height="6.5" rx="1.6" />
    <path d="M5.5 7V5.4a2.5 2.5 0 0 1 5 0V7" />
  </svg>
);

/** A row of the Limits list (panel › Rules), at 1 CSS px = 1 world px. */
export const LimitRow: React.FC<{ title: string; sub: string; inP: number; last?: boolean }> = ({ title, sub, inP, last }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "11px 14px",
      borderBottom: last ? "none" : `1px solid ${T.lineSubtle}`,
      opacity: inP,
      transform: `translateY(${(1 - inP) * 8}px)`,
    }}
  >
    <div style={{ flex: 1 }}>
      <div style={{ color: T.text1, fontSize: 13, fontWeight: 600, lineHeight: "18px" }}>{title}</div>
      <div style={{ color: T.text3, fontSize: 12, lineHeight: "16px", marginTop: 1 }}>{sub}</div>
    </div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        height: 24,
        padding: "0 9px",
        borderRadius: 12,
        background: T.sunken,
        color: T.text2,
        fontSize: 12,
        fontWeight: 600,
        transform: `scale(${interpolate(inP, [0.4, 1], [0.6, 1], { extrapolateLeft: "clamp" })})`,
      }}
    >
      <Lock size={12} color={T.text2} />
      Locked
    </div>
  </div>
);

/** A panel card (Eucas dark theme): 400 px wide, 18 px corners, --elev-4. */
export const Card: React.FC<{ children: React.ReactNode; w?: number; style?: React.CSSProperties }> = ({ children, w = 400, style }) => (
  <div
    style={{
      width: w,
      borderRadius: 18,
      background: T.surface,
      boxShadow: "0 0 0 1px rgba(235,235,235,0.1), 0 24px 64px rgba(0,0,0,0.55)",
      fontFamily: sans,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A Windows terminal window with a session in it. */
export const Terminal: React.FC<{ title: string; lines: React.ReactNode[]; w?: number }> = ({ title, lines, w = 380 }) => (
  <div style={{ width: w, borderRadius: 8, background: "#1b1b1b", boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 18px 48px rgba(0,0,0,0.5)", overflow: "hidden" }}>
    <div style={{ height: 30, display: "flex", alignItems: "center", padding: "0 10px", background: "#202020", color: "#c8c8c8", fontFamily: sans, fontSize: 11.5 }}>
      <span style={{ flex: 1 }}>{title}</span>
      <span style={{ display: "flex", gap: 18, color: "#9a9a9a", fontSize: 12 }}>
        <span>–</span>
        <span>▢</span>
        <span>✕</span>
      </span>
    </div>
    <div style={{ padding: "12px 14px 14px", fontFamily: mono, fontSize: 12.5, lineHeight: "20px", color: "#d4d4d4" }}>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  </div>
);

/** Kinetic caption: words rise in one after another, then the line leaves upward. */
export const Caption: React.FC<{ text: string; f: number; at: number; out?: number; size: number; width: number; align?: "left" | "center"; color?: string }> = ({
  text,
  f,
  at,
  out,
  size,
  width,
  align = "left",
  color = "#f4f4f6",
}) => {
  if (f < at || (out !== undefined && f > out + 10)) return null;
  const words = text.split(" ");
  const leave = out === undefined ? 0 : prog(f, out, out + 8);
  return (
    <div
      style={{
        width,
        fontFamily: sans,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: -size * 0.022,
        color,
        textAlign: align,
        textWrap: "balance",
        opacity: 1 - leave,
        transform: `translateY(${-leave * size * 0.4}px)`,
      }}
    >
      {words.map((w, i) => {
        const p = sp(f, at + i * 2.2, 26, 180);
        return (
          <span key={i} style={{ display: "inline-block", opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * size * 0.5}px)`, marginRight: size * 0.24 }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; size: number; style?: React.CSSProperties }> = ({ children, size, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.3,
      padding: `${size * 0.32}px ${size * 0.75}px`,
      borderRadius: 999,
      background: "rgba(255,255,255,0.96)",
      color: "#15171d",
      fontFamily: sans,
      fontSize: size,
      fontWeight: 600,
      whiteSpace: "nowrap",
      boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    {children}
  </div>
);
