import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile } from "remotion";

/** A sound at a frame. Sounds are made by scripts/audio.py: Eucas's own needs / done / stopped, plus soft ticks and whooshes. */
export type Cue = { at: number; sound: "needs" | "done" | "stopped" | "tick" | "whoosh"; volume: number };
/** Lower the music under a key beat: from `at`, by `depth` (0..1), for `hold` frames. */
export type Duck = { at: number; depth: number; hold: number };

function duckGain(f: number, ducks: Duck[]) {
  let g = 1;
  for (const d of ducks) {
    const p = interpolate(f, [d.at - 3, d.at, d.at + d.hold, d.at + d.hold + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    g = Math.min(g, 1 - d.depth * p);
  }
  return g;
}

export const Soundtrack: React.FC<{ music: string; level: number; cues: Cue[]; ducks: Duck[] }> = ({ music, level, cues, ducks }) => (
  <>
    <Audio src={staticFile(`audio/${music}.wav`)} volume={(f) => level * duckGain(f, ducks)} />
    {cues.map((c, i) => (
      <Sequence key={i} from={c.at} layout="none">
        <Audio src={staticFile(`audio/${c.sound}.wav`)} volume={c.volume} />
      </Sequence>
    ))}
  </>
);
