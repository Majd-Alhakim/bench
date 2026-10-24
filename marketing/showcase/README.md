# Eucas showcase (51 s)

A Remotion project for the Eucas showcase, 1920×1080 at 30 fps: a hook, the problem, the five steps in the real app, then the brand.

| Time | What you see | File |
|---|---|---|
| 0–4 s | The Quartet wakes up: each shape gets the Look | `src/scenes/Story.tsx` |
| 4–8.6 s | "Every idea starts. Most stop halfway." The top idea tips; the Eucas catch it | `src/scenes/Story.tsx` |
| 9–14 s | **1 · Talk to Atlas**: you type the idea to your main agent | `src/scenes/App.tsx` |
| 14–21.5 s | **2 · Atlas asks**: two questions, your answers, then he sets up the team | `src/scenes/App.tsx` |
| 21.6–31.8 s | **3 · The team builds it**: Maya (Product manager), Noor (Developer), Jade (QA tester), Karim (Tech lead), then the dashboard | `src/scenes/App.tsx` |
| 31.8–38 s | **4 · You review and test**: the order page, ready for you to try; all green | `src/scenes/App.tsx` |
| 38–43 s | **5 · You say when it goes live**: Karim asks, you press Put it live | `src/scenes/App.tsx` |
| 43–51 s | `eucas`, "Every idea deserves a happy ending.", eucas.app | `src/scenes/End.tsx` |

Every beat lives in `src/timeline.ts`, placed on the music's accents; re-time there only.

## Real screens
The app scenes are screenshots of the real prototype (`docs/design/ui/prototype`), with the story's data (a bakery website) swapped into its own data and components. `scripts/capture.mjs` drives the prototype in headless Edge, writes `public/screens/*.png` (gitignored) and `src/boxes.ts` (where buttons, messages and avatars sit, so the camera, pointer and title labels aim at real elements):

```bash
python -m http.server 4180 --directory ../../docs/design/ui/prototype   # in another terminal
node scripts/capture.mjs
```

## Music (not in git)
"Spring Hope – Classical Piano and String Quartet Masterpiece" by NickPanek, [Pixabay](https://pixabay.com/music/modern-classical-spring-hope-classical-piano-and-string-quartet-masterpiece-323530/), under the Pixabay Content License. The cut uses 1:10–2:01 with a 2.6 s fade-out. The licence doesn't allow redistributing the file itself, so `public/music.mp3` is gitignored. To recreate it from the downloaded track:

```bash
ffmpeg -ss 70 -t 51 -i spring-hope.mp3 -af "afade=t=in:st=0:d=0.3,afade=t=out:st=48.4:d=2.6" -c:a libmp3lame -b:a 192k public/music.mp3
```

## Commands
```bash
npm install
npm run dev                                                        # Remotion Studio
npx remotion still EucasShowcase out/frame.png --frame=690         # one frame
npx remotion render EucasShowcase out/eucas-showcase.mp4           # the video
```
