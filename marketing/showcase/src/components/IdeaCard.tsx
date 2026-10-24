import React from "react";
import { C, fontFamily } from "../brand";

export type Idea = { title: string; state: string; progress: number };

export const CARD = { w: 460, h: 92, r: 18 };

/** A half-built idea: a title, where it stalled, and a progress bar that stopped. */
export const IdeaCard: React.FC<{ idea: Idea; style?: React.CSSProperties }> = ({ idea, style }) => (
  <div
    style={{
      position: "absolute",
      width: CARD.w,
      height: CARD.h,
      marginLeft: -CARD.w / 2,
      marginTop: -CARD.h / 2,
      borderRadius: CARD.r,
      background: C.white,
      border: `1.5px solid ${C.line}`,
      boxShadow: "0 10px 30px rgba(21,23,29,.08)",
      padding: "18px 24px",
      boxSizing: "border-box",
      fontFamily,
      ...style,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: 26, fontWeight: 600, color: C.ink }}>{idea.title}</span>
      <span style={{ fontSize: 20, color: C.inkSoft }}>{idea.state}</span>
    </div>
    <div style={{ marginTop: 16, height: 8, borderRadius: 4, background: C.line }}>
      <div style={{ width: `${idea.progress * 100}%`, height: "100%", borderRadius: 4, background: "#b4b7bf" }} />
    </div>
  </div>
);
