import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { arrive, ease, mix, pop } from "../anim";
import { C, fontFamily, TEAM } from "../brand";
import { AppIcon } from "../components/AppIcon";
import { Avatar } from "../components/Avatar";
import { Eyes } from "../components/Eyes";
import { CARD } from "../components/IdeaCard";
import { Quartet } from "../components/Quartet";
import { F } from "../timeline";
import { CAUGHT_AT } from "./Story";

// Local frames: this scene starts at F.composer.
const L = (beat: number) => beat - F.composer;
const PROMPT = "Finish my landing page and test it.";
const TYPE_AT = 10;
const TYPE_RATE = 1.6; // characters per frame
const SENT_AT = TYPE_AT + Math.ceil(PROMPT.length / TYPE_RATE) + 3;

// The app window in world px. At zoom 1 its main area is exactly the screen; the sidebar and
// title bar sit just off screen and come into view as the camera pulls back.
const WIN = { x: -380, y: -64, w: 2300, h: 1144 };
const ZOOMED = 0.7;

const COMPOSER = { x: 960, y: 900, w: 1000, h: 128 };
const TEAM_Y = 360;
const TEAM_X = [636, 852, 1068, 1284];
const STATUS = ["planning", "planning", "drafting", "testing"];

const Chip: React.FC<{ done: number; label: string }> = ({ done, label }) => (
  <div
    style={{
      height: 40,
      padding: "0 18px",
      borderRadius: 20,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: 22,
      fontWeight: 600,
      background: done > 0.5 ? "#e5f7ec" : "#e8edff",
      color: done > 0.5 ? C.green : C.cobalt,
    }}
  >
    {done > 0.5 ? "✓ done" : label}
  </div>
);

const Sidebar: React.FC = () => {
  const row = (label: string, extra?: React.ReactNode, bold = false) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, height: 56, fontSize: 24, fontWeight: bold ? 600 : 400, color: C.ink }}>
      {extra}
      {label}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: WIN.x,
        top: 0,
        width: -WIN.x,
        height: WIN.y + WIN.h,
        background: C.white,
        borderRight: `1.5px solid ${C.line}`,
        padding: "34px 32px",
        boxSizing: "border-box",
        fontFamily,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34 }}>
        <Quartet size={40} />
        <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>eucas</span>
      </div>
      <div style={{ height: 52, borderRadius: 14, border: `1.5px solid ${C.line}`, color: C.inkSoft, fontSize: 22, display: "flex", alignItems: "center", padding: "0 18px", marginBottom: 28 }}>
        Search your team
      </div>
      {row("Atlas", <Avatar shape="sphere" hue={C.hue.lavender} size={40} />, true)}
      <div style={{ marginTop: 26, fontSize: 20, color: C.inkSoft }}>Projects</div>
      {row("Eucas app", undefined, true)}
      {row("Dashboard")}
      {row("Team chat")}
      {TEAM.slice(1).map((m) => row(m.name, <Avatar key={m.name} shape={m.shape} hue={m.hue} size={36} />))}
    </div>
  );
};

export const Solution: React.FC = () => {
  const l = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The caught card grows into the composer.
  // It types where the card was caught, then moves down to make room for the team.
  const grow = arrive(l, 0, fps, { damping: 200, stiffness: 120 });
  const slide = arrive(l, L(F.team) - 2, fps, { damping: 200, stiffness: 110 });
  const box = {
    x: mix(CAUGHT_AT[0], COMPOSER.x, grow),
    y: mix(CAUGHT_AT[1], COMPOSER.y, slide),
    w: mix(CARD.w, COMPOSER.w, grow),
    h: mix(CARD.h, COMPOSER.h, grow),
  };
  const typed = l < SENT_AT ? PROMPT.slice(0, Math.max(0, Math.floor((l - TYPE_AT) * TYPE_RATE))) : "";
  const caret = l >= TYPE_AT && l < SENT_AT && Math.floor(l / 8) % 2 === 0;
  const sendPulse = ease(l, [SENT_AT - 3, SENT_AT], [0, 1]) * (1 - ease(l, [SENT_AT, SENT_AT + 8], [0, 1]));

  // The camera pulls back to the whole window, then the window folds into the app icon.
  const zoom = arrive(l, L(F.zoomOut), fps, { damping: 200, stiffness: 60 });
  const fold = ease(l, [L(F.collapse), L(F.collapse) + 9], [0, 1]);
  const s = mix(1, ZOOMED, zoom) * mix(1, 0.25, fold);
  const cx = mix(960, WIN.x + WIN.w / 2, zoom);
  const cy = mix(540, WIN.y + WIN.h / 2, zoom);
  const icon = pop(l, L(F.collapse) + 4, fps);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #f3f4f7 0%, ${C.cobaltWash} 45%, #8fa6ff 80%, ${C.cobalt} 115%)`,
        fontFamily,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "0 0",
          transform: `translate(${960 - s * cx}px, ${560 - s * cy + (1 - zoom) * -20}px) scale(${s})`,
          opacity: 1 - ease(l, [L(F.collapse) + 4, L(F.collapse) + 10], [0, 1]),
        }}
      >
        {/* window frame */}
        <div
          style={{
            position: "absolute",
            left: WIN.x,
            top: WIN.y,
            width: WIN.w,
            height: WIN.h,
            borderRadius: 34,
            background: C.porcelain,
            boxShadow: `0 40px 120px rgba(21,23,29,${0.25 * zoom})`,
            overflow: "hidden",
          }}
        >
          <div style={{ height: -WIN.y, background: C.white, borderBottom: `1.5px solid ${C.line}` }} />
        </div>
        <Sidebar />

        {/* the team */}
        {TEAM.map((m, i) => {
          const up = pop(l, L(F.team) + i * 3, fps);
          const done = ease(l, [L(F.team) + 14 + i * 2, L(F.team) + 16 + i * 2], [0, 1]);
          const lookDown = ease(l, [L(F.team) + 18 + i * 2, L(F.team) + 24 + i * 2], [0, 1]);
          return (
            <div
              key={m.name}
              style={{
                position: "absolute",
                left: TEAM_X[i] - 100,
                top: TEAM_Y - 60,
                width: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                opacity: up,
                transform: `translateY(${(1 - up) * 40}px)`,
              }}
            >
              <Avatar shape={m.shape} hue={m.hue} size={112} lookY={3 * lookDown} />
              <div style={{ fontSize: 28, fontWeight: 600, color: C.ink }}>{m.name}</div>
              <Chip done={done} label={STATUS[i]} />
            </div>
          );
        })}

        {/* the finished idea, ready for you */}
        {(() => {
          const t = arrive(l, L(F.team) + 18, fps, { damping: 18, stiffness: 140 });
          return (
            <div
              style={{
                position: "absolute",
                left: 960 - 380,
                top: 610,
                width: 760,
                height: 104,
                borderRadius: 22,
                background: C.white,
                border: `1.5px solid ${C.line}`,
                boxShadow: "0 12px 34px rgba(21,23,29,.08)",
                display: "flex",
                alignItems: "center",
                padding: "0 30px",
                boxSizing: "border-box",
                gap: 20,
                opacity: t,
                transform: `translateY(${(1 - t) * 30}px) scale(${0.96 + 0.04 * t})`,
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 22, background: C.green, color: C.white, fontSize: 26, display: "grid", placeItems: "center" }}>✓</div>
              <div style={{ fontSize: 30, fontWeight: 600, color: C.ink }}>Landing page</div>
              <div style={{ fontSize: 28, color: C.inkSoft }}>ready for you</div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, fontSize: 24, color: C.cobalt, fontWeight: 600 }}>
                <svg viewBox="0 0 14 14" width={26} height={26}>
                  <Eyes x={7} y={7} gap={2.2} w={2.6} open={1} fill={C.cobalt} />
                </svg>
                Look inside
              </div>
            </div>
          );
        })()}

        {/* the composer, grown from the caught card */}
        <div
          style={{
            position: "absolute",
            left: box.x - box.w / 2,
            top: box.y - box.h / 2,
            width: box.w,
            height: box.h,
            borderRadius: mix(CARD.r, 30, grow),
            background: C.white,
            border: `1.5px solid ${C.line}`,
            boxShadow: "0 14px 40px rgba(21,23,29,.10)",
            display: "flex",
            alignItems: "center",
            padding: "0 26px 0 36px",
            boxSizing: "border-box",
            fontSize: 32,
          }}
        >
          <span style={{ color: typed ? C.ink : C.inkSoft, opacity: grow }}>
            {typed || "Message Atlas"}
            <span style={{ opacity: caret ? 1 : 0, color: C.cobalt }}>|</span>
          </span>
          <div
            style={{
              marginLeft: "auto",
              width: 64,
              height: 64,
              borderRadius: 32,
              background: C.cobalt,
              color: C.white,
              display: "grid",
              placeItems: "center",
              fontSize: 32,
              opacity: grow,
              transform: `scale(${1 + 0.18 * sendPulse})`,
            }}
          >
            ↑
          </div>
        </div>
      </div>

      {/* the app icon */}
      {l >= L(F.collapse) && (
        <div style={{ position: "absolute", left: 960 - 150, top: 540 - 150, transform: `scale(${0.4 + 0.6 * icon})`, opacity: Math.min(1, icon * 1.5) }}>
          <AppIcon size={300} />
        </div>
      )}
    </AbsoluteFill>
  );
};
