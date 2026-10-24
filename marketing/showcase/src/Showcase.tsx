import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { End } from "./scenes/End";
import { Solution } from "./scenes/Solution";
import { Story } from "./scenes/Story";
import { F } from "./timeline";

/** Hook and problem (Story), the app (Solution), then the brand cards (End). */
export const Showcase: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={F.composer + 12}>
      <Story />
    </Sequence>
    <Sequence from={F.composer} durationInFrames={F.lockup - F.composer}>
      <Solution />
    </Sequence>
    <Sequence from={F.lockup}>
      <End />
    </Sequence>
    <Audio src={staticFile("music.mp3")} />
  </AbsoluteFill>
);
