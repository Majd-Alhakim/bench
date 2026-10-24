import React from "react";
import { Quartet } from "./Quartet";

const SQUIRCLE =
  "M50 0C77 0 89 0 94.5 5.5C100 11 100 23 100 50C100 77 100 89 94.5 94.5C89 100 77 100 50 100C23 100 11 100 5.5 94.5C0 89 0 77 0 50C0 23 0 11 5.5 5.5C11 0 23 0 50 0Z";

/** The app icon: the colour Quartet at 56 % on an Ink glass squircle (logo/app-icon-macos.svg). */
export const AppIcon: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ position: "relative", width: size, height: size, filter: "drop-shadow(0 24px 40px rgba(21,23,29,.28))" }}>
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="icon-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c2f38" />
          <stop offset="1" stopColor="#15171d" />
        </linearGradient>
        <linearGradient id="icon-hl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.13} />
          <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={SQUIRCLE} fill="url(#icon-bg)" />
      <path d={SQUIRCLE} fill="url(#icon-hl)" />
      <path d={SQUIRCLE} fill="none" stroke="#fff" strokeOpacity={0.12} strokeWidth={1.4} />
    </svg>
    <Quartet size={size * 0.56} colour style={{ position: "absolute", left: size * 0.22, top: size * 0.22 }} />
  </div>
);
