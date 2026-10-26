import type { CardProps } from "./Card";

// Post images, one per channel slot (marketing/ready). Every screen is a real prototype capture; a stop shows
// Concerned eyes without the red marker (the -quiet captures), as on the website.
export type Image = CardProps & { id: string; width: number; height: number };

const PEEK = "peek";
export const IMAGES: Image[] = [
  { id: "li-d1", width: 1200, height: 1200, route: "n-peek", focus: PEEK, headline: "Stop babysitting your agents.", sub: "A notch that watches your Claude Code sessions and taps you only when one needs you." },
  { id: "ih-d1", width: 1200, height: 630, route: "n-peek", focus: PEEK, headline: "100 sign-ups in 7 days, or I don't build it.", sub: "Eucas: a Windows notch for your Claude Code sessions." },
  { id: "devto-d2", width: 1000, height: 420, route: "p-trip-quiet", focus: [760, 0, 400, 250], headline: "Claude Code deletes on Windows: what happened, and 7 things to do today" },
  { id: "x-d2", width: 1600, height: 900, route: "p-trip-quiet", focus: [760, 0, 400, 250], headline: "Claude Code deletes on Windows", sub: "Four reports, five path causes, and seven things you can set up today without any new tool." },
  { id: "sideproject-d3", width: 1600, height: 900, route: "p-needs", focus: [760, 0, 400, 370], headline: "A 7-day demand test", sub: "100 waitlist sign-ups, or I don't build it. Eucas: a Windows notch for your Claude Code sessions." },
  { id: "yt-v1", width: 1280, height: 720, route: "p-rules", focus: [760, 348, 400, 262], headline: "Four things always come to you" },
  { id: "yt-v4", width: 1280, height: 720, route: "s-create-born", focus: "hero", headline: "Set up in a minute, step by step" },
  { id: "ph-1", width: 1270, height: 760, route: "n-peek", focus: PEEK, headline: "One glance: which session needs you" },
  { id: "ph-2", width: 1270, height: 760, route: "p-needs", focus: [760, 0, 400, 500], headline: "What each session is waiting for, in one panel" },
  { id: "ph-3", width: 1270, height: 760, route: "p-rules", focus: [760, 348, 400, 262], headline: "A delete, a push, a send or a payment always comes to you" },
  { id: "ph-4", width: 1270, height: 760, route: "p-trip-quiet", focus: [760, 0, 400, 537], headline: "A session that deletes files in bulk is stopped" },
  { id: "ph-5", width: 1270, height: 760, route: "p-sent", focus: [760, 40, 400, 520], headline: "What leaves your PC, word for word" },
  { id: "ph-6", width: 1270, height: 760, route: "s-create-born", focus: "hero", headline: "Name your Euca" },
];
