import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { arrive, ease, inOut } from "../anim";
import { BOXES } from "../boxes";
import { AvatarShape, C, fontFamily } from "../brand";
import { Avatar } from "../components/Avatar";
import { F } from "../timeline";

type Shot = keyof typeof BOXES;
type Box = { x: number; y: number; w: number; h: number };
const box = (shot: Shot, cap: string): Box => (BOXES[shot] as Record<string, Box>)[cap];
const centre = (b: Box) => [b.x + b.w / 2, b.y + b.h / 2] as const;

// Which real screen is on at each moment (start frame, shot). Same-layout shots cut like the live app updating.
const SHOTS: [number, Shot][] = [
  [F.toApp, "talk-0"],
  [F.sent, "ask-1"],
  [F.ask, "ask-2"],
  [F.answer1, "ask-3"],
  [F.q2, "ask-4"],
  [F.answer2, "ask-5"],
  [F.plan, "ask-6"],
  [F.team, "team-1"],
  [F.progress, "team-2"],
  [F.board, "board-1"],
  [F.boardDone, "board-2"],
  [F.test, "test-1"],
  [F.startTest + 8, "test-2"],
  [F.green, "green"],
  [F.deploy, "deploy-1"],
  [F.goLive + 6, "deploy-2"],
  [F.live, "live"],
];
// A soft dissolve only where the layout changes (a new chapter or screen).
const DISSOLVE = new Set<number>([F.team, F.board, F.test, F.green, F.deploy, F.live]);

// Camera: the point of the screen in the middle of the frame, and the zoom.
type Cam = [frame: number, x: number, y: number, zoom: number];
const comp = centre(box("talk-1", "composer"));
const CAMERA: Cam[] = [
  [F.toApp, 960, 540, 1.04],
  [F.talk + 30, 960, 540, 1],
  [F.typeStart - 6, comp[0], comp[1] - 40, 1.9],
  [F.sent, comp[0], comp[1] - 40, 1.9],
  [F.sent + 14, 1100, 600, 1.55],
  [F.ask + 10, 1100, 690, 1.55],
  [F.q2 + 8, 1100, 760, 1.55],
  [F.plan + 10, 1100, 830, 1.5],
  [F.startTeam + 12, 1100, 830, 1.5],
  [F.team, 960, 540, 1],
  [F.titles - 4, 1060, 420, 1.4],
  [F.progress, 1060, 450, 1.4],
  [F.progress + 16, 1060, 720, 1.4],
  [F.board, 960, 540, 1],
  [F.board + 24, 1130, 300, 1.6],
  [F.boardDone + 40, 1150, 310, 1.65],
  [F.test, 960, 540, 1],
  [F.test + 22, 1608, 340, 1.7],
  [F.startTest + 8, 1608, 340, 1.7],
  [F.startTest + 26, 1640, 990, 2.1],
  [F.green, 960, 540, 1],
  [F.green + 18, 1100, 430, 1.6],
  [F.deploy, 960, 540, 1],
  [F.deploy + 16, 1608, 320, 1.7],
  [F.goLive + 8, 1608, 320, 1.7],
  [F.goLive + 26, 1640, 990, 2.1],
  [F.live, 960, 540, 1],
  [F.live + 20, 1100, 620, 1.7],
  [F.lockup, 1100, 625, 1.8],
];

function camera(f: number) {
  const at = CAMERA.map((c) => c[0]);
  const pick = (i: number) => interpolate(f, at, CAMERA.map((c) => c[i]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: inOut });
  const z = pick(3);
  // Keep the frame inside the screen at every zoom.
  const x = Math.min(Math.max(pick(1), 960 / z), 1920 - 960 / z);
  const y = Math.min(Math.max(pick(2), 540 / z), 1080 - 540 / z);
  return { x, y, z };
}
const project = (cam: ReturnType<typeof camera>, px: number, py: number) => [960 + (px - cam.x) * cam.z, 540 + (py - cam.y) * cam.z] as const;

// The pointer: where it goes and when it clicks (screen-space points of real buttons).
type Move = [from: number, to: number, x: number, y: number, click: boolean];
const btn = (shot: Shot, cap: string) => centre(box(shot, cap));
const CURSOR: Move[] = [
  [F.answer1 - 30, F.answer1 - 6, ...btn("ask-2", "q1-btn2"), true],
  [F.answer2 - 28, F.answer2 - 6, ...btn("ask-4", "q2-btn0"), true],
  [F.startTeam - 24, F.startTeam - 4, ...btn("ask-6", "a3-btn0"), true],
  [F.startTest - 26, F.startTest - 4, ...btn("test-1", "start"), true],
  [F.goLive - 22, F.goLive - 4, ...btn("deploy-1", "golive"), true],
];

// Every Euca, introduced by name and job where it first acts.
type Callout = { at: number; until: number; who: string; title: string; shape: AvatarShape; hue: string; shot: Shot; cap?: string; point?: [number, number] };
const CALLOUTS: Callout[] = [
  { at: F.talk + 12, until: F.typeStart - 8, who: "Atlas", title: "Your main agent", shape: "sphere", hue: C.hue.lavender, shot: "talk-0", point: [1146, 462] },
  ...(
    [
      ["maya", "Maya", "Product manager", "cloud", C.hue.mint],
      ["noor", "Noor", "Developer", "pill", C.hue.coral],
      ["jade", "Jade", "QA tester", "triangle", C.hue.orchid],
      ["karim", "Karim", "Tech lead", "square", C.hue.pear],
    ] as const
  ).map(([cap, who, title, shape, hue], i) => ({ at: F.titles + i * 9, until: F.progress - 4, who, title, shape: shape as AvatarShape, hue, shot: "team-1" as Shot, cap })),
  { at: F.green + 22, until: F.deploy - 6, who: "Noor", title: "Developer", shape: "pill", hue: C.hue.coral, shot: "green", cap: "noor" },
  { at: F.deploy + 18, until: F.goLive + 4, who: "Karim", title: "Tech lead", shape: "square", hue: C.hue.pear, shot: "deploy-1", cap: "card" },
];

// Chapter titles: a steady label top left, and one plain line at the start of each chapter.
const CHAPTERS = [
  { at: F.talk, n: 1, title: "Talk to Atlas", line: "Atlas is your main agent. Just say what you want." },
  { at: F.ask, n: 2, title: "Atlas asks", line: "A few quick questions, so the team builds the right thing." },
  { at: F.team, n: 3, title: "The team builds it", line: "Every Euca has a job. You can watch every step." },
  { at: F.test, n: 4, title: "You review and test", line: "Nothing is finished until you've tried it yourself." },
  { at: F.deploy, n: 5, title: "You say when it goes live", line: "Going live always waits for your OK." },
];

const Pointer: React.FC<{ f: number; cam: ReturnType<typeof camera> }> = ({ f, cam }) => {
  const m = CURSOR.find(([from, to]) => f >= from - 6 && f <= to + 14);
  if (!m) return null;
  const [from, to, x, y, click] = m;
  const t = ease(f, [from, to], [0, 1]);
  const [sx, sy] = project(cam, x, y);
  const px = sx + (1 - t) * 260;
  const py = sy + (1 - t) * 180;
  const press = click ? ease(f, [to, to + 3], [0, 1]) * (1 - ease(f, [to + 3, to + 8], [0, 1])) : 0;
  const ring = click ? ease(f, [to, to + 14], [0, 1]) : 0;
  const fade = ease(f, [from - 6, from], [0, 1]) * (1 - ease(f, [to + 8, to + 14], [0, 1]));
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: fade }}>
      {ring > 0 && ring < 1 && (
        <div style={{ position: "absolute", left: sx - 36 * ring, top: sy - 36 * ring, width: 72 * ring, height: 72 * ring, borderRadius: "50%", border: `3px solid rgba(255,255,255,${0.7 * (1 - ring)})` }} />
      )}
      <svg width={40} height={40} viewBox="0 0 24 24" style={{ position: "absolute", left: px - 4, top: py - 2, transform: `scale(${1 - 0.15 * press})`, filter: "drop-shadow(0 2px 4px rgba(0,0,0,.5))" }}>
        <path d="M4 2 L4 19 L8.5 14.8 L11.6 21.6 L14.4 20.4 L11.3 13.7 L17.5 13.5 Z" fill="#fff" stroke="#15171d" strokeWidth={1.3} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const CalloutPill: React.FC<{ c: Callout; f: number; cam: ReturnType<typeof camera> }> = ({ c, f, cam }) => {
  const { fps } = useVideoConfig();
  const a = arrive(f, c.at, fps, { damping: 18, stiffness: 160 }) * (1 - ease(f, [c.until - 6, c.until], [0, 1]));
  if (a <= 0.001) return null;
  const b = c.cap ? box(c.shot, c.cap) : null;
  const [px, py] = b ? [b.x, b.y + 18] : (c.point as [number, number]);
  const [sx, sy] = project(cam, px, py);
  const left = !!b; // box callouts sit to the left of the box; point callouts start at the point
  return (
    <div
      style={{
        position: "absolute",
        left: left ? undefined : sx,
        right: left ? 1920 - sx + 18 : undefined,
        top: sy - 30,
        transform: `translateY(${(1 - a) * 10}px) scale(${0.9 + 0.1 * a})`,
        transformOrigin: left ? "100% 50%" : "0% 50%",
        opacity: a,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 22px 10px 12px",
        borderRadius: 40,
        background: "rgba(243,244,247,.97)",
        boxShadow: "0 12px 30px rgba(0,0,0,.35)",
        fontFamily,
        whiteSpace: "nowrap",
      }}
    >
      <Avatar shape={c.shape} hue={c.hue} size={40} />
      <span style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{c.who}</span>
      <span style={{ fontSize: 26, color: C.inkSoft }}>{c.title}</span>
    </div>
  );
};

const Chapter: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const ch = [...CHAPTERS].reverse().find((c) => f >= c.at);
  if (!ch) return null;
  const next = CHAPTERS.find((c) => c.at > ch.at)?.at ?? F.lockup;
  const show = arrive(f, ch.at, fps) * (1 - ease(f, [next - 8, next], [0, 1]));
  const line = arrive(f, ch.at + 8, fps);
  return (
    <div
      style={{
        position: "absolute",
        left: 48,
        top: 44,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 30px 16px 16px",
        borderRadius: 26,
        background: "rgba(21,23,29,.9)",
        border: "1.5px solid rgba(255,255,255,.14)",
        boxShadow: "0 16px 40px rgba(0,0,0,.4)",
        fontFamily,
        opacity: show,
        transform: `translateY(${(1 - show) * -12}px)`,
      }}
    >
      <span style={{ width: 52, height: 52, flex: "none", borderRadius: 26, background: C.cobalt, color: C.white, display: "grid", placeItems: "center", fontSize: 28, fontWeight: 600 }}>{ch.n}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 34, fontWeight: 600, color: C.porcelain, letterSpacing: -0.5 }}>{ch.title}</span>
        <span style={{ fontSize: 24, color: "#aeb2bd", opacity: line }}>{ch.line}</span>
      </div>
    </div>
  );
};

const PROMPT_CHARS = "I want a website for my bakery, so people can order online.".length;

/** The real app, from the prototype's own screens: the five steps from a request to going live. */
export const App: React.FC = () => {
  const f = useCurrentFrame() + F.toApp;
  const cam = camera(f);
  const idx = SHOTS.reduce((last, [start], i) => (f >= start ? i : last), 0);
  const [at, shot] = SHOTS[Math.max(0, idx)];
  const prev = idx > 0 && DISSOLVE.has(at) ? SHOTS[idx - 1][1] : null;
  const mix = prev ? ease(f, [at, at + 9], [0, 1]) : 1;
  const enter = ease(f, [F.toApp, F.toApp + 12], [0, 1]);

  // Typing: the typed composer is revealed letter by letter over the empty one.
  const comp1 = box("talk-1", "composer");
  const typed = ease(f, [F.typeStart, F.typeEnd], [0, PROMPT_CHARS], (t) => t);
  const reveal = f >= F.typeEnd ? 2000 : 14 + Math.floor(typed) * 7.6;

  const layer = (s: Shot, opacity: number) => (
    <Img src={staticFile(`screens/${s}.png`)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity }} />
  );

  return (
    <AbsoluteFill style={{ background: "#0e0f12", opacity: enter }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${960 - cam.x * cam.z}px, ${540 - cam.y * cam.z}px) scale(${cam.z})` }}>
        {prev && layer(prev, 1)}
        {layer(shot, mix)}
        {shot === "talk-0" && f >= F.typeStart && (
          <div style={{ position: "absolute", left: comp1.x - 20, top: comp1.y - 14, width: Math.min(comp1.w + 80, reveal), height: comp1.h + 28, overflow: "hidden" }}>
            <Img src={staticFile("screens/talk-1.png")} style={{ position: "absolute", left: -(comp1.x - 20), top: -(comp1.y - 14), width: 1920, height: 1080 }} />
          </div>
        )}
      </div>
      {CALLOUTS.filter((c) => f >= c.at - 2 && f <= c.until).map((c) => (
        <CalloutPill key={`${c.who}-${c.at}`} c={c} f={f} cam={cam} />
      ))}
      <Pointer f={f} cam={cam} />
      <Chapter f={f} />
    </AbsoluteFill>
  );
};
