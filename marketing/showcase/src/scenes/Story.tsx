import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { arrive, ease, keys, mix, pop } from "../anim";
import { C, fontFamily, QUARTET, SHAPE_NAMES, ShapeName } from "../brand";
import { CARD, Idea, IdeaCard } from "../components/IdeaCard";
import { Quartet, ShapePose } from "../components/Quartet";
import { F } from "../timeline";

// The mark sits centred at 440 px; one grid unit is 4.4 px.
const SIZE = 440;
const UNIT = SIZE / 100;
const ORIGIN = [960 - SIZE / 2, 540 - SIZE / 2];

// Where each Euca stands while the ideas pile up, and where it runs to catch the falling one (screen px).
const ASIDE: Record<ShapeName, [number, number]> = {
  sphere: [480, 880],
  triangle: [610, 880],
  square: [1310, 880],
  droplet: [1440, 880],
};
const CATCH: Record<ShapeName, [number, number]> = {
  sphere: [846, 752],
  triangle: [922, 752],
  square: [998, 752],
  droplet: [1074, 752],
};

// Bottom to top; the top one is the idea that gets caught and finished.
const IDEAS: Idea[] = [
  { title: "Recipe site", state: "someday", progress: 0.1 },
  { title: "Budget app", state: "paused", progress: 0.25 },
  { title: "Pitch deck", state: "draft 3", progress: 0.6 },
  { title: "Landing page", state: "40 %", progress: 0.4 },
];
const PILE_BOTTOM = 830;
const PILE_STEP = 96;
const TILT = [-2.5, 2, -3, 1.5];
export const CAUGHT_AT: [number, number] = [960, 640];

/** Grid offset that puts a shape's centre at a screen point. */
const toGrid = (name: ShapeName, [x, y]: [number, number]) => {
  const [cx, cy] = QUARTET[name].centre;
  return [(x - ORIGIN[0]) / UNIT - cx, (y - ORIGIN[1]) / UNIT - cy];
};

const WAKE_ORDER: ShapeName[] = ["sphere", "triangle", "square", "droplet"];

function pose(name: ShapeName, f: number, fps: number): ShapePose {
  const [cx, cy] = QUARTET[name].centre;
  const wakeAt = F.wake + WAKE_ORDER.indexOf(name) * 6;
  let eyes = pop(f, wakeAt, fps);

  // Hook: each one wakes in its own way.
  let dx = 0;
  let dy = 0;
  let rotate = 0;
  let scale = 1;
  if (name === "sphere") eyes *= 1 - keys(f, [48, 51, 54], [0, 1, 0]); // a blink
  if (name === "triangle") rotate = keys(f, [30, 40, 52, 62], [0, -10, 6, 0]); // a tilt
  if (name === "droplet") dy = keys(f, [38, 45, 52, 56], [0, -7, 0.8, 0]); // a hop
  if (name === "square") dx = keys(f, [44, 49, 54, 59, 64], [0, -2.5, 2.5, -1, 0]); // a shuffle

  // They glance at each other, then look up at you.
  const toward = Math.atan2(50 - cy, 50 - cx);
  const glance = keys(f, [F.glance, F.glance + 8, F.lookUp - 4, F.lookUp + 4], [0, 1, 1, 0]);
  const up = keys(f, [F.lookUp, F.lookUp + 8], [0, 1]);
  let lookX = Math.cos(toward) * 1.6 * glance;
  let lookY = Math.sin(toward) * 1.6 * glance - 2.2 * up;

  // Problem: they step aside and watch the pile.
  const aside = arrive(f, F.problem, fps);
  const [ax, ay] = toGrid(name, ASIDE[name]);
  // The turn: they run in under the falling idea and catch it.
  const run = arrive(f, F.tip + 4, fps, { damping: 16, stiffness: 150 });
  const [rx, ry] = toGrid(name, CATCH[name]);
  const hold = keys(f, [F.turn, F.turn + 4, F.turn + 10], [0, 1, 0]); // they dip as it lands

  dx = mix(mix(dx, ax, aside), rx, run);
  dy = mix(mix(dy, ay, aside), ry + 1.5 * hold, run);
  rotate = mix(rotate, 0, aside);
  scale = mix(mix(1, 0.5, aside), 0.4, run);
  const watch = aside * (1 - run);
  const side = ASIDE[name][0] < 960 ? 1 : -1;
  lookX = mix(lookX, 1.8 * side, watch);
  lookY = mix(lookY, -1.6, aside);
  return { dx, dy, rotate, scale, eyes, lookX, lookY };
}

const Line: React.FC<{ text: string; y: number; at: number; dim?: number; out: number }> = ({ text, y, at, dim = 0, out }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = arrive(f, at, fps);
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        width: "100%",
        textAlign: "center",
        fontFamily,
        fontWeight: 600,
        fontSize: 76,
        letterSpacing: -1.5,
        color: dim > 0 ? `color-mix(in srgb, ${C.ink} ${100 - dim * 55}%, ${C.porcelain})` : C.ink,
        opacity: a * (1 - out),
        transform: `translateY(${(1 - a) * 24}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const Story: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const poses = Object.fromEntries(SHAPE_NAMES.map((n) => [n, pose(n, f, fps)]));
  const camera = keys(f, [F.lookUp, F.problem, F.problem + 16], [1, 1.1, 1]);
  const eucasOut = ease(f, [F.toApp, F.toApp + 10], [1, 0]);
  const textOut = ease(f, [F.turn, F.turn + 10], [0, 1]);

  // The pile sways more and more before the top idea tips over.
  const sway = ease(f, [F.wobble, F.tip], [0, 2.4]) * Math.sin(((f - F.wobble) / 14) * Math.PI * 2);
  const others = ease(f, [F.tip, F.turn + 4], [0, 1]); // the rest of the pile falls away as the top one tips

  // The top idea: tips off the pile, falls, and is caught.
  const tip = keys(f, [F.tip, F.turn], [0, 1]);
  const caught = arrive(f, F.turn, fps, { damping: 13, stiffness: 150 });
  const topY = PILE_BOTTOM - CARD.h / 2 - 3 * PILE_STEP;
  const tipX = 960 + 70 * tip;
  const tipY = topY + 60 * tip * tip;
  const topX = mix(tipX, CAUGHT_AT[0], caught);
  const topYNow = mix(tipY, CAUGHT_AT[1], caught);
  const topRot = mix(TILT[3] + 34 * tip * tip, 0, caught);

  return (
    <AbsoluteFill style={{ background: C.porcelain }}>

      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: `960px ${PILE_BOTTOM}px`,
          transform: `rotate(${sway}deg)`,
        }}
      >
        {IDEAS.map((idea, i) => {
          if (i === 3 && f >= F.tip) return null; // the top idea has left the pile
          const land = arrive(f, F.problem + 6 + i * 8, fps, { damping: 14, stiffness: 120 });
          return (
            <IdeaCard
              key={idea.title}
              idea={idea}
              style={{
                left: 960,
                top: PILE_BOTTOM - CARD.h / 2 - i * PILE_STEP - (1 - land) * 260 + others * 80,
                transform: `rotate(${TILT[i]}deg)`,
                opacity: Math.min(1, land * 2.5) * (1 - others),
              }}
            />
          );
        })}
      </div>
      {f >= F.tip && (
        <IdeaCard
          idea={IDEAS[3]}
          style={{
            left: topX,
            top: topYNow,
            transform: `rotate(${topRot}deg)`,
            opacity: ease(f, [F.toApp, F.toApp + 2], [1, 0]),
          }}
        />
      )}

      <div style={{ position: "absolute", inset: 0, transform: `scale(${camera})`, opacity: eucasOut }}>
        <Quartet size={SIZE} poses={poses} style={{ position: "absolute", left: ORIGIN[0], top: ORIGIN[1] }} />
      </div>
      <Line text="Every idea starts." y={150} at={F.problem + 4} dim={ease(f, [F.line2, F.line2 + 10], [0, 1])} out={textOut} />
      <Line text="Most stop halfway." y={244} at={F.line2} out={textOut} />
    </AbsoluteFill>
  );
};
