// The six short videos (marketing/drafts/video-scripts.md), scene by scene. Every scene is a real prototype screen;
// Pip's face is whatever that screen renders (src/boxes.json `face`), so it always follows DESIGN.md §2.3.

/** What the camera frames: an element captured with the screen, or a box in CSS px on the 1920×1080 desktop. */
export type Focus = "notch" | "peek" | "panel" | "setup" | "body" | "uac" | "hero" | "desk" | [number, number, number, number];

export type Scene = {
  route: string;
  seconds: number;
  focus: Focus;
  caption?: string;
  /** The first scene's caption, drawn larger. */
  hook?: boolean;
  /** "Step 2 · You name your Euca". */
  step?: string;
  /** Show the "Pip · your Euca" title under the notch. */
  euca?: boolean;
};

export type Video = { id: string; title: string; scenes: Scene[]; endSeconds: number };

const DESK: Focus = [700, 0, 520, 330];
const NOTCH_CLOSE: Focus = [850, 0, 220, 110];

export const VIDEOS: Video[] = [
  {
    id: "V1",
    title: "Four things always come to you",
    endSeconds: 3,
    scenes: [
      { route: "n-trip", seconds: 3, focus: NOTCH_CLOSE, caption: "A session deletes 1,240 files in 20 seconds. Then it stops.", hook: true },
      { route: "n-working", seconds: 3.5, focus: DESK, caption: "Rewind. Three sessions working, one notch watching.", euca: true },
      { route: "n-arrive", seconds: 2.5, focus: "peek", caption: "A session needs you." },
      { route: "n-peek", seconds: 3.5, focus: "peek", caption: "Hover for a peek: what it's waiting for." },
      { route: "p-needs", seconds: 4.5, focus: [760, 0, 400, 370], caption: "One panel: what each session is waiting for." },
      { route: "p-trip", seconds: 4, focus: [760, 0, 400, 270], caption: "A session that starts deleting files in bulk is stopped." },
      { route: "p-trip", seconds: 3.5, focus: [760, 226, 400, 316], caption: "You see what went, and how to get it back." },
      { route: "p-rules", seconds: 5, focus: [760, 348, 400, 262], caption: "A delete, a push to your default branch, a send or a payment always comes to you. No rule can change that." },
    ],
  },
  {
    id: "V2",
    title: "Stop saying yes to the same command",
    endSeconds: 3,
    scenes: [
      { route: "p-retro", seconds: 4, focus: [760, 0, 400, 361], caption: "You approved pnpm test 212 times this week.", hook: true, euca: true },
      { route: "p-suggest", seconds: 4.5, focus: [760, 0, 400, 370], caption: "Your Euca suggests a rule from what you approve by hand." },
      { route: "p-rules-draft", seconds: 4.5, focus: [760, 248, 400, 432], caption: "Or say it in plain words. It drafts the rule." },
      { route: "p-rules-draft", seconds: 4, focus: [760, 0, 400, 400], caption: "Scoped to one folder. Deletes, pushes, sends and payments still ask you." },
      { route: "p-learned", seconds: 3.5, focus: [760, 0, 400, 244], caption: "It tells you what it learned." },
      { route: "p-undo", seconds: 3, focus: [760, 380, 400, 300], caption: "Changed your mind? Undo." },
    ],
  },
  {
    id: "V3",
    title: "What leaves your PC, word for word",
    endSeconds: 3,
    scenes: [
      { route: "s-sent", seconds: 3.5, focus: [600, 285, 600, 250], caption: "An AI supervisor on your sessions. What does it see?", hook: true },
      { route: "p-sent", seconds: 5.5, focus: [760, 0, 400, 560], caption: "Only the waiting session's last message, trimmed, with code, paths and secrets removed.", euca: true },
      { route: "p-sent", seconds: 4.5, focus: [760, 380, 400, 190], caption: "And only when your rules can't decide. Nothing else about your work leaves this PC." },
      { route: "p-account", seconds: 4, focus: [760, 0, 400, 400], caption: "Your account holds your email, your plan and how much help you've used." },
    ],
  },
  {
    id: "V4",
    title: "Set up in a minute, step by step",
    endSeconds: 3.5,
    scenes: [
      { route: "s-welcome", seconds: 4.5, focus: [600, 285, 625, 330], step: "Step 1 · Your sessions", caption: "Setup starts with the sessions you already run.", hook: true },
      { route: "s-create", seconds: 3.5, focus: [600, 285, 710, 400], step: "Step 2 · You name your Euca", caption: "Before it's born, its eyes are closed." },
      { route: "s-create-born", seconds: 4, focus: [600, 285, 710, 400], step: "Step 2 · You name your Euca", caption: "Pick a name and a look. This one is Pip.", euca: true },
      { route: "s-retro", seconds: 4.5, focus: [955, 350, 355, 215], step: "Step 3 · Your last 7 days", caption: "What would have been stopped, and what you approve most." },
      { route: "s-lock", seconds: 4.5, focus: [600, 285, 585, 320], step: "Step 4 · Lock the four limits", caption: "A delete, a push to your default branch, a send and a payment always ask you." },
      { route: "s-uac", seconds: 3.5, focus: "uac", step: "Step 4 · Lock the four limits", caption: "One Windows prompt. v0.1 isn't signed, so it says \"Unknown publisher\"." },
      { route: "s-test", seconds: 4.5, focus: [600, 285, 560, 250], step: "Step 5 · Pip tests the guard", caption: "It tests the limits in front of you. No account needed for these." },
      { route: "s-signin", seconds: 4, focus: [600, 285, 650, 300], step: "Step 6 · Sign in", caption: "An email and a 6-digit code, for your rules and the supervisor." },
      { route: "s-rules", seconds: 4.5, focus: [600, 285, 680, 330], step: "Step 7 · Your first rules", caption: "Say what your sessions may do." },
      { route: "s-sent-sample", seconds: 4.5, focus: [610, 285, 640, 370], step: "Step 8 · What is sent", caption: "Word for word, with a message from your own sessions." },
      { route: "s-done", seconds: 3.5, focus: [630, 300, 660, 320], step: "Step 9 · Pip is watching", caption: "Done." },
      { route: "n-working", seconds: 3.5, focus: DESK, step: "Step 9 · Pip is watching", caption: "Your Euca sits at the top of your screen.", euca: true },
    ],
  },
  {
    id: "V5",
    title: "Two sessions, one file",
    endSeconds: 3,
    scenes: [
      { route: "n-working", seconds: 3.5, focus: DESK, caption: "Two sessions are about to edit src/router.ts.", hook: true, euca: true },
      { route: "n-arrive", seconds: 2.5, focus: "peek", caption: "Your Euca notices." },
      { route: "p-same", seconds: 5.5, focus: [760, 0, 400, 350], caption: "You're warned before one overwrites the other." },
    ],
  },
  {
    id: "V6",
    title: "Your limit, before the task is half done",
    endSeconds: 3,
    scenes: [
      { route: "p-usage", seconds: 4, focus: [760, 0, 400, 440], caption: "Hit your usage limit halfway through a task?", hook: true, euca: true },
      { route: "p-usage", seconds: 5, focus: [760, 200, 400, 232], caption: "You see when you'll run out, with time to spare." },
      { route: "p-usage", seconds: 4, focus: [760, 434, 400, 246], caption: "And where it went, session by session." },
    ],
  },
];

export const FPS = 30;
export const frames = (s: number) => Math.round(s * FPS);
export const durationOf = (v: Video) => v.scenes.reduce((n, s) => n + frames(s.seconds), 0) + frames(v.endSeconds);
