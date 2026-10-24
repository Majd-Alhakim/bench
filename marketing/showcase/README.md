# Eucas showcase (20 s)

A Remotion project for the 20-second Eucas teaser: **hook → problem → app → end**, 1920×1080 at 30 fps.

| Time | Scene | File |
|---|---|---|
| 0–3.6 s | The Quartet wakes up: each shape gets the Look, they glance at each other, then at you | `src/scenes/Story.tsx` |
| 3.6–6.8 s | "Every idea starts. Most stop halfway." Half-done ideas pile up and the top one tips | `src/scenes/Story.tsx` |
| 6.8–11 s | The Eucas catch it; it becomes the composer, the team finishes it, the camera pulls back to the app, which folds into the icon | `src/scenes/Solution.tsx` |
| 11–20 s | `eucas`, "Every idea deserves a happy ending.", then eucas.app | `src/scenes/End.tsx` |

Every beat lives in `src/timeline.ts`, placed on the music's accents; re-time there only. Brand colours, the Quartet paths (from `docs/design/ui/brand/logo/quartet.py`) and the agent shapes (from the prototype) are in `src/brand.ts`.

## Music (not in git)
"Spring Hope – Classical Piano and String Quartet Masterpiece" by NickPanek, [Pixabay](https://pixabay.com/music/modern-classical-spring-hope-classical-piano-and-string-quartet-masterpiece-323530/), under the Pixabay Content License. The cut uses 1:42–2:02 with a 2.4 s fade-out. The licence doesn't allow redistributing the file itself, so `public/music.mp3` is gitignored. To recreate it from the downloaded track:

```bash
ffmpeg -ss 102 -t 20 -i spring-hope.mp3 -af "afade=t=in:st=0:d=0.04,afade=t=out:st=17.6:d=2.4" -c:a libmp3lame -b:a 192k public/music.mp3
```

## Commands
```bash
npm install
npm run dev                                                        # Remotion Studio
npx remotion still EucasShowcase out/frame.png --frame=210         # one frame
npx remotion render EucasShowcase out/eucas-showcase.mp4           # the video
```
