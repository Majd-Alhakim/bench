// Values from docs/design/ui/companion/tokens-notch.css and docs/design/ui/system/tokens.css (dark). Never invent one.
import { Easing } from "remotion";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: mono } = loadMono("normal", { weights: ["400", "600"], subsets: ["latin"] });
export { fontFamily as sans } from "../brand";

export const T = {
  notchBg: "#0b0b0b",
  notchRing: "rgba(255,255,255,0.09)",
  notchText: "#ebebeb",
  notchText2: "#a8a8a8",
  notchText3: "#8a8a8a",
  notchLine: "rgba(255,255,255,0.08)",
  notchBtn: "#232323",
  eye: "#f2f2f2",
  eyeDim: "#9a9a9a",
  eyeClosed: "#6a6a6a",
  danger: "#ff8a85",
  ok: "#6fd09a",
  attn: "#e8a33a",
  attnText: "#161616",
  // Panels (dark theme)
  ground: "#161616",
  surface: "#1f1f1f",
  raised: "#282828",
  sunken: "#2f2f2f",
  text1: "#ebebeb",
  text2: "#b8b8b8",
  text3: "#989898",
  line: "rgba(235,235,235,0.11)",
  lineSubtle: "rgba(235,235,235,0.07)",
  action: "#3a64ff",
  // Pip's colour: Lavender
  euca: { base: "#8e6cf0", light: "#cbbcff", deep: "#5f3fd0" },
} as const;

export const G = {
  notchH: 32,
  notchW: 124,
  notchWMarker: 164,
  notchR: 16,
  shoulder: 8,
  eyeW: 5,
  eyeH: 13,
  eyeGap: 9,
  peekW: 372,
  peekR: 22,
} as const;

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);
