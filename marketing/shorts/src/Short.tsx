import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, fontFamily } from "./brand";
import { Quartet } from "./components/Quartet";
import boxesJson from "./boxes.json";
import { Focus, Scene, Video, frames } from "./videos";

export type Format = "v" | "h" | "s";
type Box = [number, number, number, number];
type Layout = { w: number; h: number; stage: Box; caption: Box; hook: number; text: number; maxZoom: number };

const BOXES = boxesJson as unknown as Record<string, Partial<Record<"notch" | "peek" | "panel" | "setup" | "body" | "uac" | "hero", Box>>>;
const DESKTOP: Box = [0, 0, 1920, 1080];
// The notch and panel area, also captured at 4x (`<route>@top.png`) so close-ups stay sharp. Matches scripts/capture.mjs.
const TOP: Box = [560, 0, 800, 720];

// The stage is where the screen sits; captions stay out of the bottom 320 px on vertical (platform buttons).
export const LAYOUTS: Record<Format, Layout> = {
  v: { w: 1080, h: 1920, stage: [40, 210, 1000, 1060], caption: [70, 1310, 940, 290], hook: 66, text: 54, maxZoom: 4 },
  h: { w: 1920, h: 1080, stage: [0, 70, 1920, 790], caption: [200, 880, 1520, 170], hook: 54, text: 44, maxZoom: 3 },
  s: { w: 1080, h: 1080, stage: [40, 100, 1000, 700], caption: [70, 830, 940, 220], hook: 50, text: 42, maxZoom: 3.5 },
};

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const FADE = 9;

function focusBox(scene: Scene): Box {
  const f: Focus = scene.focus;
  if (Array.isArray(f)) return f;
  if (f === "desk") return DESKTOP;
  return BOXES[scene.route]?.[f] ?? DESKTOP;
}

/** Scale and offset that fit the focus box into the stage, kept inside the desktop's edges where possible. */
const PAD = 1.12;

function camera(box: Box, L: Layout, push: number) {
  const [sx, sy, sw, sh] = L.stage;
  const pad = PAD;
  const scale = Math.min(sw / (box[2] * pad), sh / (box[3] * pad), L.maxZoom) * push;
  let x = sx + sw / 2 - (box[0] + box[2] / 2) * scale;
  let y = sy + sh / 2 - (box[1] + box[3] / 2) * scale;
  const iw = 1920 * scale;
  const ih = 1080 * scale;
  // The top of the screen is a hard edge (the notch hangs from it): never leave a gap above it.
  if (y > sy) y = sy;
  if (iw >= sw) x = Math.min(sx, Math.max(sx + sw - iw, x));
  if (ih >= sh) y = Math.max(sy + sh - ih, y);
  return { scale, x, y };
}

const Label: React.FC<{ L: Layout }> = ({ L }) => (
  <div
    style={{
      position: "absolute",
      top: L.w > L.h ? 22 : 64,
      left: 0,
      right: 0,
      textAlign: "center",
      fontSize: L.w > L.h ? 22 : 28,
      color: "rgba(255,255,255,0.62)",
      letterSpacing: 0.2,
    }}
  >
    Design preview · Eucas is in development
  </div>
);

const SceneView: React.FC<{ scene: Scene; L: Layout; local: number; len: number; first: boolean; showEuca: boolean; leaving: boolean }> = ({
  scene,
  L,
  local,
  len,
  first,
  showEuca,
  leaving,
}) => {
  const push = interpolate(local, [0, len], [0.97, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const box = focusBox(scene);
  const cam = camera(box, L, push);
  // The window onto the screen: the padded focus box, so no half-cut text from around it shows.
  const [sx, sy, sw, sh] = L.stage;
  const ww = Math.min(sw, box[2] * PAD * cam.scale);
  const wh = Math.min(sh, box[3] * PAD * cam.scale);
  const wx = Math.min(sx + sw - ww, Math.max(sx, cam.x + (box[0] + box[2] / 2) * cam.scale - ww / 2));
  const wy = Math.min(sy + sh - wh, Math.max(sy, cam.y + (box[1] + box[3] / 2) * cam.scale - wh / 2));
  const fadeIn = first ? 1 : interpolate(local, [0, FADE], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const capIn = interpolate(local, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const notch = BOXES[scene.route]?.notch;
  const hero = BOXES[scene.route]?.hero;
  const eucaIn = interpolate(local, [12, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const [cx, cy, cw, ch] = L.caption;
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <AbsoluteFill style={{ background: "#0b0c11" }} />
      {/* The screen is clipped to the stage, so nothing slides under the label or the caption. */}
      <div style={{ position: "absolute", left: wx, top: wy, width: ww, height: wh, overflow: "hidden", borderRadius: 20 }}>
        <Img
          src={staticFile(`screens/${scene.route}.png`)}
          style={{ position: "absolute", left: cam.x - wx, top: cam.y - wy, width: 1920 * cam.scale, height: 1080 * cam.scale }}
        />
        {!scene.route.startsWith("s-") && (
          <Img
            src={staticFile(`screens/${scene.route}@top.png`)}
            style={{
              position: "absolute",
              left: cam.x - wx + TOP[0] * cam.scale,
              top: cam.y - wy + TOP[1] * cam.scale,
              width: TOP[2] * cam.scale,
              height: TOP[3] * cam.scale,
            }}
          />
        )}
      </div>
      {/* Soft fade from the screen into the caption band. */}
      <AbsoluteFill style={{ background: `linear-gradient(to bottom, rgba(11,12,17,0) ${((cy - 160) / L.h) * 100}%, rgba(11,12,17,0.96) ${((cy - 10) / L.h) * 100}%)` }} />
      {/* "Pip · your Euca": beside the notch (so it never covers the panel), or above the avatar in setup. */}
      {showEuca && (notch || hero) && (
        <div
          style={{
            position: "absolute",
            left: notch ? cam.x + (notch[0] + notch[2]) * cam.scale + 16 + (1 - eucaIn) * 10 : cam.x + (hero![0] + hero![2] / 2) * cam.scale,
            top: notch ? cam.y + (notch[1] + notch[3] / 2) * cam.scale : cam.y + (hero![1] + 14) * cam.scale,
            transform: notch ? "translateY(-50%)" : "translateX(-50%)",
            opacity: eucaIn,
            padding: "10px 22px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.96)",
            color: C.ink,
            fontSize: L.w > L.h ? 30 : 34,
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
          }}
        >
          Pip · <span style={{ fontWeight: 400 }}>your Euca</span>
        </div>
      )}
      {scene.step && !leaving && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy - (L.w > L.h ? 64 : 84),
            opacity: capIn,
            padding: "8px 18px",
            borderRadius: 999,
            background: C.cobalt,
            color: C.white,
            fontSize: L.w > L.h ? 26 : 32,
            fontWeight: 600,
          }}
        >
          {scene.step}
        </div>
      )}
      {scene.caption && !leaving && (
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            width: cw,
            height: ch,
            opacity: capIn,
            transform: `translateY(${(1 - capIn) * 14}px)`,
            color: C.white,
            fontSize: scene.hook ? L.hook : L.text,
            fontWeight: 600,
            lineHeight: 1.18,
            letterSpacing: -0.4,
            textWrap: "balance",
            textAlign: L.w > L.h ? "center" : "left",
          }}
        >
          {scene.caption}
        </div>
      )}
    </AbsoluteFill>
  );
};

const End: React.FC<{ L: Layout; local: number }> = ({ L, local }) => {
  const a = interpolate(local, [0, 14], [0, 1], { extrapolateRight: "clamp", easing: ease });
  const big = L.w > L.h ? 1 : 1.15;
  return (
    <AbsoluteFill style={{ background: "#0b0c11", alignItems: "center", justifyContent: "center", opacity: a }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 * big, transform: `translateY(${(1 - a) * 16}px)` }}>
        {/* The Quartet with Calm eyes: the brand's only resting face. */}
        <Quartet size={190 * big} colour poses={{ sphere: { eyes: 1 }, triangle: { eyes: 1 }, square: { eyes: 1 }, droplet: { eyes: 1 } }} />
        <div style={{ color: C.white, fontSize: 96 * big, fontWeight: 600, letterSpacing: -2 }}>eucas</div>
        <div style={{ color: C.white, fontSize: 44 * big, fontWeight: 600 }}>eucas.app</div>
        <div style={{ color: "rgba(255,255,255,0.66)", fontSize: 30 * big }}>Windows · in development · join the waitlist</div>
      </div>
    </AbsoluteFill>
  );
};

export const Short: React.FC<{ video: Video; format: Format }> = ({ video, format }) => {
  const frame = useCurrentFrame();
  const L = LAYOUTS[format];
  let start = 0;
  const firstEuca = video.scenes.findIndex((s) => s.euca);
  const layers: React.ReactNode[] = [];
  video.scenes.forEach((scene, i) => {
    const len = frames(scene.seconds);
    // Each scene stays drawn under the next one's fade-in.
    if (frame >= start && frame < start + len + FADE) {
      layers.push(
        <SceneView key={i} scene={scene} L={L} local={frame - start} len={len} first={i === 0} showEuca={i === firstEuca && frame < start + len} leaving={frame >= start + len} />,
      );
    }
    start += len;
  });
  return (
    <AbsoluteFill style={{ background: "#0b0c11", fontFamily }}>
      {layers}
      {frame >= start && <End L={L} local={frame - start} />}
      {frame < start && <Label L={L} />}
    </AbsoluteFill>
  );
};
