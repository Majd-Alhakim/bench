import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, fontFamily } from "./brand";
import boxesJson from "./boxes.json";

type Box = [number, number, number, number];
const BOXES = boxesJson as unknown as Record<string, Partial<Record<string, Box>>>;
const TOP: Box = [560, 0, 800, 720];

export type CardProps = {
  route: string;
  /** A named box from boxes.json, or a box in CSS px on the 1920×1080 desktop. */
  focus: string | Box;
  headline: string;
  sub?: string;
  /** Hide the "Design preview" line (only for screens from the shipped app). */
  shipped?: boolean;
};

/** A real prototype screen, cropped to its focus box and fitted into `area`. */
/** `bare` drops the card frame, for a crop that runs to the image edge like the top of a screen. */
export const Screen: React.FC<{ route: string; focus: string | Box; area: Box; maxZoom?: number; bare?: boolean }> = ({ route, focus, area, maxZoom = 3.5, bare }) => {
  const box: Box = Array.isArray(focus) ? focus : (BOXES[route]?.[focus] ?? [0, 0, 1920, 1080]);
  const [ax, ay, aw, ah] = area;
  const scale = Math.min(aw / box[2], ah / box[3], maxZoom);
  const w = box[2] * scale;
  const h = box[3] * scale;
  const left = ax + (aw - w) / 2;
  const top = ay + (ah - h) / 2;
  const img = (file: string, b: Box) => (
    <Img
      src={staticFile(`screens/${file}`)}
      style={{ position: "absolute", left: (b[0] - box[0]) * scale, top: (b[1] - box[1]) * scale, width: b[2] * scale, height: b[3] * scale }}
    />
  );
  return (
    <div style={{ position: "absolute", left, top, width: w, height: h, overflow: "hidden", borderRadius: bare ? 0 : 18, boxShadow: bare ? "none" : "0 24px 60px rgba(0,0,0,0.5)" }}>
      {img(`${route}.png`, [0, 0, 1920, 1080])}
      {!route.startsWith("s-") && img(`${route}@top.png`, TOP)}
    </div>
  );
};

const Brand: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ display: "flex", alignItems: "baseline", gap: size * 0.6 }}>
    <span style={{ color: C.white, fontSize: size * 1.4, fontWeight: 600, letterSpacing: -0.5 }}>eucas</span>
    <span style={{ color: "rgba(255,255,255,0.66)", fontSize: size }}>eucas.app</span>
  </div>
);

/** A post image: headline and a real screen, laid out for the image's shape. */
export const Card: React.FC<CardProps & { width: number; height: number }> = ({ route, focus, headline, sub, shipped, width, height }) => {
  const wide = width / height >= 1.4;
  const u = Math.min(width, height) / 100;
  const pad = u * 7;
  const area: Box = wide ? [width * 0.5, pad, width * 0.5 - pad, height - pad * 2] : [pad, height * 0.44, width - pad * 2, height * 0.56 - pad * 3.2];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 80% 0%, #1b1f2e 0%, #0b0c11 60%)", fontFamily }}>
      <Screen route={route} focus={focus} area={area} />
      <div style={{ position: "absolute", left: pad, top: pad, width: wide ? width * 0.5 - pad * 1.6 : width - pad * 2, display: "flex", flexDirection: "column", gap: u * 2.4 }}>
        <div style={{ color: C.white, fontSize: u * (wide ? 8.4 : 7.6), fontWeight: 600, lineHeight: 1.08, letterSpacing: -u * 0.12, textWrap: "balance" }}>{headline}</div>
        {sub && <div style={{ color: "rgba(255,255,255,0.72)", fontSize: u * 4, lineHeight: 1.3, textWrap: "pretty" }}>{sub}</div>}
      </div>
      <div style={{ position: "absolute", left: pad, bottom: pad * (wide ? 1 : 0.55) }}>
        <Brand size={u * 3.4} />
        {!shipped && <div style={{ color: "rgba(255,255,255,0.5)", fontSize: u * 2.5, marginTop: u * 1.2 }}>Design preview · Eucas is in development</div>}
      </div>
    </AbsoluteFill>
  );
};

export type CountProps = { day: number; n: number; goal: number; line: string };

/** The evening count for the 7-day test. Pip's face: Focused while the test runs, Pleased on the result day. */
export const Count: React.FC<CountProps & { width: number; height: number }> = ({ day, n, goal, line, width, height }) => {
  const u = Math.min(width, height) / 100;
  const pad = u * 7;
  const done = day >= 8;
  const p = Math.min(1, n / goal);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 50% 0%, #1b1f2e 0%, #0b0c11 60%)", fontFamily }}>
      {/* The top of the screen runs edge to edge, so the notch hangs from the image's top edge. */}
      <Screen route={done ? "n-pleased" : "n-working"} focus={[960 - 160, 0, 320, (320 * u * 16) / width]} area={[0, 0, width, u * 16]} maxZoom={8} bare />
      <div style={{ position: "absolute", left: pad, right: pad, top: height * 0.3, display: "flex", flexDirection: "column", gap: u * 3 }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: u * 4.4, fontWeight: 600 }}>{done ? "The demand test is over" : `Day ${day} of 7`}</div>
        <div style={{ color: C.white, fontSize: u * 17, fontWeight: 600, letterSpacing: -u * 0.4, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          {n} <span style={{ color: "rgba(255,255,255,0.45)" }}>of {goal}</span>
        </div>
        <div style={{ height: u * 1.6, borderRadius: 999, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${p * 100}%`, height: "100%", background: C.white, borderRadius: 999 }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: u * 4.4, lineHeight: 1.3 }}>{line}</div>
      </div>
      <div style={{ position: "absolute", left: pad, bottom: pad }}>
        <Brand size={u * 3.4} />
      </div>
    </AbsoluteFill>
  );
};
