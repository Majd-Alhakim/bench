import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Quartet } from "../components/Quartet";
import { FaceKey } from "./Eyes";
import { Notch } from "./Notch";
import { Cue, Duck, Soundtrack } from "./Soundtrack";
import { Caption, Card, LimitRow, Pill, prog, sp, Terminal } from "./ui";
import { easeInOut, G, mono, sans, T } from "./tokens";

export type Fmt = "h" | "v" | "s";
type Box = [number, number, number, number]; // centre x, centre y, width, height (world px = CSS px)

const LAYOUT: Record<Fmt, { W: number; H: number; top: number; sx: number; stage: [number, number]; cap: { x: number; y: number; w: number; size: number; align: "left" | "center" } }> = {
  // Landscape: the story on the left, the words on the right.
  h: { W: 1920, H: 1080, top: 0, sx: 0, stage: [1200, 1000], cap: { x: 1230, y: 420, w: 610, size: 72, align: "left" } },
  v: { W: 1080, H: 1920, top: 250, sx: 0, stage: [1080, 960], cap: { x: 84, y: 1270, w: 912, size: 82, align: "left" } },
  s: { W: 1080, H: 1080, top: 0, sx: 0, stage: [1080, 760], cap: { x: 70, y: 800, w: 940, size: 58, align: "center" } },
};

const NOTCH: Box = [0, 26, 250, 115];
// Camera: [frame, box]. Between keys the camera eases; the top of the screen never leaves the top of the frame.
const CAM: [number, Box][] = [
  [0, NOTCH],
  [56, NOTCH],
  [74, [0, 92, 430, 200]],
  [140, [0, 92, 430, 200]],
  [160, [0, 205, 450, 350]],
  [270, [0, 205, 450, 350]],
  [292, [0, 150, 470, 270]],
  [340, [0, 150, 470, 270]],
  [356, [0, 120, 400, 230]],
  [396, [0, 120, 400, 230]],
  [420, [0, 200, 450, 320]],
  [456, [0, 200, 450, 320]],
  [476, [0, 400, 450, 320]],
  [516, [0, 400, 450, 320]],
  [540, NOTCH],
];

const FACES: FaceKey[] = [
  { at: 0, face: "focused" },
  { at: 24, face: "glance" },
  { at: 51, face: "front" },
  { at: 132, face: "pleased" },
  { at: 180, face: "calm" },
  { at: 285, face: "focused" },
  { at: 348, face: "concerned" },
  { at: 532, face: "pleased" },
  { at: 580, face: "calm" },
];
const BLINKS = [72, 108, 206, 252, 596];
export const V1_FRAMES = 705;

// Sound, synced to the motion. Eucas's own sounds carry the story beats; ticks and whooshes stay quiet.
const CUES: Cue[] = [
  { at: 24, sound: "needs", volume: 0.9 },
  { at: 58, sound: "whoosh", volume: 0.21 },
  { at: 118, sound: "tick", volume: 0.5 },
  { at: 132, sound: "done", volume: 0.85 },
  { at: 154, sound: "whoosh", volume: 0.18 },
  ...[166, 178, 190, 202].map((at) => ({ at, sound: "tick" as const, volume: 0.22 })),
  { at: 283, sound: "whoosh", volume: 0.18 },
  { at: 346, sound: "stopped", volume: 0.95 },
  { at: 402, sound: "whoosh", volume: 0.21 },
  { at: 470, sound: "tick", volume: 0.4 },
  { at: 520, sound: "whoosh", volume: 0.15 },
  { at: 532, sound: "done", volume: 0.8 },
  { at: 598, sound: "whoosh", volume: 0.24 },
];
const DUCKS: Duck[] = [
  { at: 24, depth: 0.45, hold: 12 },
  { at: 132, depth: 0.4, hold: 14 },
  { at: 346, depth: 0.7, hold: 22 },
  { at: 532, depth: 0.4, hold: 14 },
];
const END = 600;

function camera(f: number, fmt: Fmt) {
  const L = LAYOUT[fmt];
  let i = 0;
  while (i + 1 < CAM.length && CAM[i + 1][0] <= f) i++;
  const [fa, a] = CAM[i];
  const [fb, b] = CAM[Math.min(i + 1, CAM.length - 1)];
  const p = fb === fa ? 1 : interpolate(f, [fa, fb], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeInOut });
  const fit = (bx: Box) => Math.min(L.stage[0] / bx[2], L.stage[1] / bx[3]);
  const S = Math.exp(interpolate(p, [0, 1], [Math.log(fit(a)), Math.log(fit(b))]));
  const cx = interpolate(p, [0, 1], [a[0], b[0]]);
  const cy = interpolate(p, [0, 1], [a[1], b[1]]);
  const tx = L.sx + L.stage[0] / 2 - cx * S;
  const ty = Math.min(L.top, L.top + L.stage[1] / 2 - cy * S);
  return { S, tx, ty };
}

const Peek: React.FC<{ f: number }> = ({ f }) => {
  const open = prog(f, 60, 72) * (1 - prog(f, 138, 150));
  if (open <= 0) return null;
  const press = f >= 118 && f < 124 ? 0.95 : 1;
  const gone = prog(f, 124, 132);
  return (
    <div style={{ position: "absolute", left: -G.peekW / 2, top: G.notchH, width: G.peekW, padding: "8px 12px 0", opacity: prog(f, 66, 76) * (1 - prog(f, 134, 142)), fontFamily: sans }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", opacity: 1 - gone, transform: `translateX(${gone * -12}px)` }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: "rgba(255,138,133,0.16)", color: T.danger, fontSize: 12, fontWeight: 600, display: "grid", placeItems: "center" }}>!</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: T.notchText, fontSize: 13, fontWeight: 600, lineHeight: "18px" }}>notes wants to delete 1,240 files</div>
          <div style={{ color: T.notchText2, fontSize: 12, lineHeight: "16px" }}>
            <span style={{ fontFamily: mono, color: T.notchText }}>rm -rf notes/drafts/</span>
          </div>
        </div>
        <div style={{ height: 28, padding: "0 12px", borderRadius: 14, background: "#f2f2f2", color: "#161616", fontSize: 12, fontWeight: 600, display: "grid", placeItems: "center", transform: `scale(${press})` }}>Review</div>
      </div>
      <div style={{ height: 1, background: T.notchLine, margin: "6px 0 0" }} />
      <div style={{ display: "flex", alignItems: "center", padding: "10px 4px 12px", fontSize: 12, color: T.notchText2 }}>
        <span style={{ width: 7, height: 7, borderRadius: 4, background: T.ok, marginRight: 7 }} />
        <span style={{ flex: 1 }}>Protected · 3 sessions</span>
        <span style={{ color: T.notchText, fontWeight: 600 }}>Open panel ›</span>
      </div>
    </div>
  );
};

const Limits: React.FC<{ f: number }> = ({ f }) => {
  const inP = prog(f, 156, 172) * (1 - prog(f, 272, 284));
  if (inP <= 0) return null;
  const rows: [string, string][] = [
    ["Never auto-approve a delete", "rm, del, Remove-Item, git clean"],
    ["Never auto-approve a push to your default branch", "git push to the branch your repo builds from"],
    ["Never auto-approve a send", "mail, messages, posts"],
    ["Never auto-approve a payment", "payment and checkout tools"],
  ];
  return (
    <div style={{ position: "absolute", left: -200, top: 44, opacity: inP, transform: `translateY(${(1 - inP) * 16}px)` }}>
      <Card>
        <div style={{ display: "flex", padding: "14px 14px 6px", fontSize: 12.5 }}>
          <span style={{ flex: 1, color: T.text1, fontWeight: 600 }}>Limits</span>
          <span style={{ color: T.text3 }}>always on</span>
        </div>
        {rows.map(([t, sub], i) => (
          <LimitRow key={t} title={t} sub={sub} inP={sp(f, 166 + i * 12)} last={i === rows.length - 1} />
        ))}
      </Card>
    </div>
  );
};

const Session: React.FC<{ f: number }> = ({ f }) => {
  const inP = prog(f, 282, 298) * (1 - prog(f, 396, 410));
  if (inP <= 0) return null;
  const n = Math.round(interpolate(f, [300, 346], [0, 1240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const stopped = f >= 346;
  const lines: React.ReactNode[] = [
    <span key="a" style={{ color: "#8fa8ff" }}>PS C:\dev\notes&gt; claude</span>,
    <span key="b">● Cleaning up old drafts</span>,
    <span key="c">● Ran <span style={{ color: "#f2f2f2" }}>rm -rf notes/drafts/</span></span>,
    stopped ? (
      <span key="d" style={{ color: T.danger }}>■ Stopped by Pip · {n.toLocaleString("en-US")} files in 20 s</span>
    ) : (
      <span key="d" style={{ color: T.text2 }}>  deleting… {n.toLocaleString("en-US")} files</span>
    ),
  ];
  return (
    <div style={{ position: "absolute", left: -200, top: 66, opacity: inP, transform: `translateY(${(1 - inP) * 18}px)` }}>
      <Terminal title="notes — PowerShell" lines={lines} w={400} />
    </div>
  );
};

const Recovery: React.FC<{ f: number }> = ({ f }) => {
  const inP = prog(f, 404, 422) * (1 - prog(f, 520, 532));
  if (inP <= 0) return null;
  const hl = prog(f, 470, 482);
  const files: [string, string][] = [
    ["notes/drafts/", "912 files"],
    ["notes/archive/2025/", "301 files"],
    ["notes/.obsidian/", "27 files"],
  ];
  return (
    <div style={{ position: "absolute", left: -200, top: 44, opacity: inP, transform: `translateY(${(1 - inP) * 20}px)` }}>
      <Card>
        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ color: T.text1, fontSize: 15, fontWeight: 600 }}>Tripwire stop</div>
          <div style={{ color: T.text1, fontSize: 20, fontWeight: 600, lineHeight: "26px", marginTop: 10, letterSpacing: -0.2 }}>Pip stopped the notes session at 14:02:31</div>
          <div style={{ color: T.text2, fontSize: 13, lineHeight: "19px", marginTop: 6 }}>
            It deleted 1,240 files in 20 seconds, starting with <span style={{ fontFamily: mono, color: T.text1 }}>notes/drafts/</span>. Pip stopped the session and checked it isn't running.
          </div>
          <div style={{ color: T.text1, fontSize: 13, fontWeight: 600, marginTop: 14 }}>What was deleted</div>
          <div style={{ marginTop: 8, borderRadius: 12, background: T.ground, boxShadow: `0 0 0 1px ${T.lineSubtle}`, padding: "6px 12px" }}>
            {files.map(([p, n]) => (
              <div key={p} style={{ display: "flex", fontFamily: mono, fontSize: 12, lineHeight: "22px", color: T.text2 }}>
                <span style={{ flex: 1 }}>{p}</span>
                <span>{n}</span>
              </div>
            ))}
          </div>
          <div style={{ color: T.text1, fontSize: 13, fontWeight: 600, marginTop: 14 }}>How to get them back</div>
          <div style={{ color: T.text2, fontSize: 13, lineHeight: "20px", marginTop: 6 }}>
            1. notes is a git repo: run{" "}
            <span style={{ fontFamily: mono, color: T.text1, background: `rgba(58,100,255,${0.35 * hl})`, borderRadius: 5, padding: "1px 5px", boxShadow: hl > 0 ? `0 0 0 1px rgba(143,168,255,${0.6 * hl})` : "none" }}>git restore .</span> in it
            <br />
            2. File History is on: open the folder, then Home › History.
          </div>
        </div>
      </Card>
    </div>
  );
};

const EndCard: React.FC<{ f: number; fmt: Fmt }> = ({ f, fmt }) => {
  const L = LAYOUT[fmt];
  const a = prog(f, END, END + 14);
  if (a <= 0) return null;
  const k = fmt === "h" ? 4.2 : 4.6;
  const u = (n: number) => n * (fmt === "h" ? 1 : 1.05);
  const rise = (at: number) => ({ opacity: prog(f, at, at + 12), transform: `translateY(${(1 - prog(f, at, at + 14)) * 24}px)` });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(90% 70% at 50% 0%, #1d2133 0%, #0b0c11 65%)", opacity: a }}>
      <div style={{ position: "absolute", left: L.W / 2, top: 0 }}>
        <Notch k={k} frame={f} faces={[{ at: 0, face: "calm" }]} blinks={[END + 40, END + 82]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: fmt === "v" ? 620 : fmt === "s" ? 330 : 330, display: "flex", flexDirection: "column", alignItems: "center", gap: u(26), fontFamily: sans }}>
        <div style={{ display: "flex", alignItems: "center", gap: u(22), ...rise(END + 8) }}>
          {/* The mark as on eucas.app: one colour, no eyes (only Pip has eyes). */}
          <Quartet size={u(104)} fill="#eceef3" />
          <span style={{ color: "#f4f4f6", fontSize: u(150), fontWeight: 600, letterSpacing: -5 }}>eucas</span>
        </div>
        <div style={{ color: "#c9cbd3", fontSize: u(48), ...rise(END + 16) }}>Stop babysitting your agents.</div>
        <div style={{ ...rise(END + 24), marginTop: u(14) }}>
          <Pill size={u(42)} style={{ padding: `${u(20)}px ${u(44)}px` }}>
            Join the waitlist · eucas.app
          </Pill>
        </div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: u(24), ...rise(END + 32), marginTop: u(8) }}>Windows · in development</div>
      </div>
    </AbsoluteFill>
  );
};

/** V1 · "Four things always come to you": motion graphics drawn from the design spec, not screenshots. */
export const V1: React.FC<{ fmt: Fmt }> = ({ fmt }) => {
  const f = useCurrentFrame();
  const L = LAYOUT[fmt];
  const cam = camera(f, fmt);
  const markerIn = sp(f, 24, 11, 190) * (1 - prog(f, 124, 132));
  const peekOpen = prog(f, 60, 72, easeInOut) * (1 - prog(f, 138, 150, easeInOut));
  const w = interpolate(peekOpen, [0, 1], [interpolate(markerIn, [0, 1], [G.notchW, G.notchWMarker]), G.peekW]);
  const h = interpolate(peekOpen, [0, 1], [G.notchH, 142]);
  const r = interpolate(peekOpen, [0, 1], [G.notchR, G.peekR]);
  const beam = Math.max(prog(f, 0, 1) * (1 - prog(f, 22, 30)), prog(f, 285, 295) * (1 - prog(f, 346, 352)));
  const C = L.cap;
  const caption = (text: string, at: number, out: number) => <Caption key={at} text={text} f={f} at={at} out={out} size={C.size} width={C.w} align={C.align} />;
  const eucaTitle = prog(f, 10, 22) * (1 - prog(f, 52, 60));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(110% 80% at 50% -10%, #1b2033 0%, #10121a 45%, #0b0c11 80%)", fontFamily: sans, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${cam.tx}px, ${cam.ty}px) scale(${cam.S})` }}>
        {/* The bezel above the screen's top edge: it moves with the camera, so the notch always hangs from it. */}
        <div style={{ position: "absolute", left: -4000, width: 8000, top: -3000, height: 3000, background: "#060608", boxShadow: "0 1px 0 rgba(255,255,255,0.06)" }} />
        <Limits f={f} />
        <Session f={f} />
        <Recovery f={f} />
        <Notch k={1} frame={f} faces={FACES} blinks={BLINKS} w={w} h={h} r={r} beam={beam} count={f < 132 ? 1 : 0} markerIn={peekOpen > 0.05 ? 0 : markerIn}>
          <div style={{ position: "absolute", left: w / 2, top: 0 }}>
            <Peek f={f} />
          </div>
        </Notch>
      </div>
      {eucaTitle > 0 && (
        <div
          style={{
            position: "absolute",
            left: fmt === "v" ? L.W / 2 : cam.tx + (w / 2 + 14) * cam.S,
            top: fmt === "v" ? cam.ty + (G.notchH + 14) * cam.S : cam.ty + (G.notchH / 2) * cam.S,
            transform: fmt === "v" ? `translate(-50%, ${(1 - eucaTitle) * 16}px)` : `translateY(-50%) translateX(${(1 - eucaTitle) * 16}px)`,
            opacity: eucaTitle,
          }}
        >
          <Pill size={fmt === "h" ? 34 : 38}>
            Pip <span style={{ fontWeight: 400 }}>· your Euca</span>
          </Pill>
        </div>
      )}
      <div style={{ position: "absolute", left: C.x, top: C.y }}>
        {caption("Your agent is about to delete 1,240 files.", 4, 58)}
        {caption("It comes to you first. A delete always does.", 70, 148)}
        {caption("So do a push to your default branch, a send and a payment.", 160, 226)}
        {caption("No rule can change that.", 234, 274)}
        {caption("If a session starts deleting files in bulk anyway…", 288, 344)}
        {caption("…it's stopped.", 352, 398)}
        {caption("You see what went, and how to get it back.", 410, 520)}
        {caption("Stop babysitting your agents.", 536, END - 4)}
      </div>
      <EndCard f={f} fmt={fmt} />
      <Soundtrack music="music-v1" level={0.8} cues={CUES} ducks={DUCKS} />
    </AbsoluteFill>
  );
};
