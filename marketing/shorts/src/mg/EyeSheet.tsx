import React from "react";
import { AbsoluteFill } from "remotion";
import { Face, FACE_NAMES } from "./Eyes";
import { Notch } from "./Notch";
import { sans, T } from "./tokens";

const ORDER: Face[] = ["calm", "focused", "glance", "front", "concerned", "sleepy", "pleased", "closed"];
const NOTES: Record<Face, string> = {
  calm: "Resting: protected, nothing running. Follows your pointer, blinks every 4–7 s.",
  focused: "Sessions are working: narrower eyes read left to right with the beam.",
  glance: "Something arrived: one look at the marker.",
  front: "It waits for you: eyes up and front, following your pointer. No bobbing.",
  concerned: "Not protected, or Pip stopped a session: softened, looking down. Never alarmed.",
  sleepy: "You're away and nothing runs. Wakes with a blink.",
  pleased: "You're all caught up, for 1.6 s.",
  closed: "Before you make your Euca.",
};

/** The eight faces drawn by the Remotion component, laid out like screens/eyes-sheet-d.png for comparison. */
export const EyeSheet: React.FC = () => {
  const k = 2; // the sheet's notches are drawn at 2x
  return (
    <AbsoluteFill style={{ background: "#161616", fontFamily: sans, padding: 48 }}>
      <div style={{ color: T.text1, fontSize: 21, fontWeight: 600 }}>The eye grammar · Remotion</div>
      <div style={{ color: T.text2, fontSize: 13, marginTop: 8, maxWidth: 780 }}>Drawn from DESIGN.md §2.3 and tokens-notch.css. Compare with screens/eyes-sheet-d.png.</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 438px)", gap: 15, marginTop: 30 }}>
        {ORDER.map((f) => (
          <div key={f} style={{ borderRadius: 14, overflow: "hidden", background: T.surface, boxShadow: `0 0 0 1px ${T.lineSubtle}` }}>
            <div style={{ position: "relative", height: 96, background: "linear-gradient(180deg, #121521, #1d2235)" }}>
              <div style={{ position: "absolute", left: 219, top: 0 }}>
                <Notch k={k} frame={0} faces={[{ at: 0, face: f }]} />
              </div>
            </div>
            <div style={{ padding: "14px 14px 16px" }}>
              <div style={{ color: T.text1, fontSize: 14, fontWeight: 600 }}>{FACE_NAMES[f]}</div>
              <div style={{ color: T.text2, fontSize: 12.5, marginTop: 4, lineHeight: 1.4 }}>{NOTES[f]}</div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
