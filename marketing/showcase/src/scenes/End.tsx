import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { arrive, ease } from "../anim";
import { C, fontFamily } from "../brand";
import { Quartet } from "../components/Quartet";
import { F } from "../timeline";

const Lockup: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = arrive(f, 0, fps, { damping: 200, stiffness: 140 });
  return (
    <AbsoluteFill style={{ background: C.porcelain, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 58, opacity: a, transform: `scale(${0.94 + 0.06 * a})` }}>
        <Quartet size={160} />
        <span style={{ fontFamily, fontWeight: 600, fontSize: 168, letterSpacing: -6, color: C.ink, lineHeight: 1 }}>eucas</span>
      </div>
    </AbsoluteFill>
  );
};

const TAGLINE = "Every idea deserves a happy ending.".split(" ");

const Tagline: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.porcelain, alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily, fontWeight: 600, fontSize: 92, letterSpacing: -2.5, color: C.ink, display: "flex", gap: 24 }}>
        {TAGLINE.map((w, i) => {
          const a = arrive(f, i * 3, fps, { damping: 200, stiffness: 120 });
          return (
            <span key={w} style={{ opacity: a, transform: `translateY(${(1 - a) * 18}px)`, display: "inline-block" }}>
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Site: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.ink, alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily, fontWeight: 600, fontSize: 84, letterSpacing: -2, color: C.porcelain, opacity: ease(f, [4, 22], [0, 1]) }}>
        eucas.app
      </span>
    </AbsoluteFill>
  );
};

/** The brand cards, cut on the music's hits; local frames start at F.lockup. */
export const End: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={F.tagline - F.lockup}>
      <Lockup />
    </Sequence>
    <Sequence from={F.tagline - F.lockup} durationInFrames={F.endCard - F.tagline}>
      <Tagline />
    </Sequence>
    <Sequence from={F.endCard - F.lockup}>
      <Site />
    </Sequence>
  </AbsoluteFill>
);
