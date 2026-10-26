# Eucas short videos and post images

## Motion graphics (current, `src/mg`)

The videos are drawn in Remotion from the design spec, not screenshots. `mg/Eyes.tsx` is Pip's eyes from DESIGN.md §2.3 and `tokens-notch.css`: eight faces only (Calm, Focused, Glance, Toward you, Concerned, Sleepy, Pleased, Closed), with their shapes, the 150 ms blink (Calm and Toward you only), the pointer follow and Focused's 2.4 s reading loop. Shapes morph between faces in about 260 ms, as in the prototype. `mg/Notch.tsx` draws the notch with its shoulders, beam, glow and marker. `mg/V1.tsx` is the first video. Everything animates with `useCurrentFrame`, `interpolate` and springs, never CSS animation.

```bash
npx remotion still eye-sheet out/eye-sheet.png      # compare with docs/design/ui/companion/screens/eyes-sheet-d.png
npx remotion render MG-V1-v out/MG-V1-v.mp4          # also MG-V1-h (16:9) and MG-V1-s (1:1)
```

## Screenshot pipeline (post images only)

A Remotion project that turns **real screens of the notch prototype** (`docs/design/ui/companion/prototype/notch.html`) into the six short videos and the post images in [`marketing/ready`](../ready/INDEX.md). Nothing is drawn by hand: every frame is a capture, cropped and captioned, so Pip's faces are the prototype's own and follow the eye grammar (DESIGN.md §2.3).

| File | What |
|---|---|
| `scripts/capture.mjs` | Headless Edge captures each route at 2× (`public/screens/<route>.png`) and the notch-and-panel area at 4× (`<route>@top.png`), renames the sample project `bench` → `web-app`, and writes `src/boxes.json` (where the notch, peek, panel and setup sit, plus the face). `-quiet` routes hide the red "Stopped" marker for social images (DESIGN §13) |
| `src/videos.ts` | The six videos, scene by scene: route, length, focus box, caption, step title, the "Pip · your Euca" title |
| `src/Short.tsx` | One scene renderer for three formats: `-v` 1080×1920, `-h` 1920×1080, `-s` 1080×1080. Captions stay out of the bottom 320 px on vertical |
| `src/images.ts`, `src/Card.tsx` | Post images per channel, the evening count (`count-square`, `count-wide`) and the Product Hunt thumbnail |
| `scripts/render.mjs` | Renders `out/<id>.mp4` (H.264, silent) |
| `scripts/sheet.sh` | Contact sheet of stills, for checking frames |

## Run

```bash
npm install                                     # or link node_modules from marketing/showcase (same versions)
PUPPETEER_CORE=<path to puppeteer-core> npm run capture
npm run render                                  # every video in every format, or: node scripts/render.mjs V1-v V3-h
npx remotion still li-d1 out/li-d1.png          # one post image
npx remotion still count-wide out/day3.png --props='{"day":3,"n":47,"goal":100,"line":"Four days left.","width":1600,"height":900}'
```

The files in `marketing/ready/media/videos` are these renders recompressed for posting (`ffmpeg -c:v libx264 -preset slow -crf 27 -movflags +faststart`). After launch, capture the shipped app instead of the prototype and drop the "Design preview" line.
