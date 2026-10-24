import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { App } from "./scenes/App";
import { End } from "./scenes/End";
import { Story } from "./scenes/Story";
import { F } from "./timeline";

/** Hook and problem (Story), the five steps in the real app (App), then the brand cards (End). */
export const Showcase: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={F.toApp + 20}>
      <Story />
    </Sequence>
    <Sequence from={F.toApp} durationInFrames={F.lockup - F.toApp}>
      <App />
    </Sequence>
    <Sequence from={F.lockup}>
      <End />
    </Sequence>
    <Audio src={staticFile("music.mp3")} />
  </AbsoluteFill>
);
