import { loadFont } from "@remotion/google-fonts/InstrumentSans";

// Instrument Sans is the interface face (BRAND.md section 9).
export const { fontFamily } = loadFont("normal", { weights: ["400", "600"], subsets: ["latin"] });

// Colours from docs/design/ui/system/tokens.css.
export const C = {
  porcelain: "#f3f4f7",
  white: "#ffffff",
  ink: "#15171d",
  inkSoft: "#5b6070",
  line: "#e3e5eb",
  cobalt: "#2e5bff",
  cobaltWash: "#dfe6ff",
  amber: "#f2ab1d",
  green: "#1f9658",
  hue: {
    coral: "#ff5f73",
    honey: "#f2ab1d",
    pear: "#96bf2c",
    mint: "#3cc47c",
    lavender: "#8e6cf0",
    orchid: "#e05cb4",
  },
} as const;

// The refined Quartet on a 100 grid, as written by docs/design/ui/brand/logo/quartet.py.
export const QUARTET = {
  sphere: {
    d: "M4.8 25A20.2 20.2 0 1 1 45.2 25A20.2 20.2 0 1 1 4.8 25Z",
    centre: [25, 25],
    eyes: [25, 24],
    colour: C.hue.coral,
  },
  triangle: {
    d: "M78.9 8.75L95.64 37.75A4.5 4.5 0 0 1 91.74 44.5L58.26 44.5A4.5 4.5 0 0 1 54.36 37.75L71.1 8.75A4.5 4.5 0 0 1 78.9 8.75Z",
    centre: [75, 30],
    eyes: [75, 33],
    colour: C.hue.honey,
  },
  square: {
    d: "M18 57L33 57A11 11 0 0 1 44 68L44 83A11 11 0 0 1 33 94L18 94A11 11 0 0 1 7 83L7 68A11 11 0 0 1 18 57Z",
    centre: [25.5, 75.5],
    eyes: [25.5, 75],
    colour: C.hue.mint,
  },
  droplet: {
    d: "M74.5 52.81C79.35 60.57 90.99 70.27 90.99 79.97C90.99 89.18 83.72 95 74.5 95C65.28 95 58.01 89.18 58.01 79.97C58.01 70.27 69.65 60.57 74.5 52.81Z",
    centre: [74.5, 77],
    eyes: [74.5, 80],
    colour: C.hue.orchid,
  },
} as const;

export type ShapeName = keyof typeof QUARTET;
export const SHAPE_NAMES = Object.keys(QUARTET) as ShapeName[];

// Agent bodies on a 100 grid, from SHAPES in docs/design/ui/prototype/direction.html.
export const AVATAR = {
  sphere: { d: "M10 52a40 40 0 1 0 80 0a40 40 0 1 0 -80 0Z", eye: [50, 50, 13] },
  cloud: {
    d: "M26 84 C12 84 6 72 10 62 C4 54 8 40 22 40 C22 26 36 18 48 24 C56 12 76 14 80 30 C92 32 98 46 92 56 C98 66 92 84 76 84 Z",
    eye: [52, 60, 13],
  },
  square: { d: "M34 13H66A22 22 0 0 1 88 35V67A22 22 0 0 1 66 89H34A22 22 0 0 1 12 67V35A22 22 0 0 1 34 13Z", eye: [50, 50, 13] },
  pill: { d: "M30 27H70A24 24 0 0 1 70 75H30A24 24 0 0 1 30 27Z", eye: [60, 51, 11] },
  // Drawn with a 14-wide round stroke in the prototype; Avatar does the same.
  triangle: { d: "M50 16L88 82L12 82Z", eye: [50, 64, 10] },
} as const;

export type AvatarShape = keyof typeof AVATAR;

export const TEAM = [
  { name: "Atlas", role: "Main agent", shape: "sphere", hue: C.hue.lavender },
  { name: "Maya", role: "PM", shape: "cloud", hue: C.hue.mint },
  { name: "Noor", role: "Developer", shape: "pill", hue: C.hue.coral },
  { name: "Karim", role: "Tech lead", shape: "square", hue: C.hue.pear },
] as const;
