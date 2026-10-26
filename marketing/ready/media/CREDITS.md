# Media credits

Everything in `media/` was made for Eucas from code in this repository. No third-party music, samples, footage, stock images or fonts outside the brand's own were used, so there is nothing to license and no attribution to carry.

| Asset | What it is | Source | Licence |
|---|---|---|---|
| Music in `videos/V1-*.mp4` | "Eucas bed, V1": an original calm track in D major at 96 bpm (pad, soft plucks, a quiet kick and hat), 23.5 s with fade-in and fade-out | Synthesised by [`marketing/shorts/scripts/audio.py`](../../shorts/scripts/audio.py) (`music()`) | Eucas's own work, all rights reserved. Free to use on any platform, commercial use included |
| Needs you · Done · Stopped | Eucas's own three sounds, the same synthesis as the prototype (`docs/design/ui/companion/prototype/src/app.js`, `SFX`; BRAND §11) | `audio.py` (`needs()`, `done()`, `stopped()`) | Eucas's own work, all rights reserved |
| UI tick and whoosh | Short, quiet transition sounds | `audio.py` (`tick()`, `whoosh()`) | Eucas's own work, all rights reserved |
| Video and images | Motion graphics and stills drawn in Remotion from the design spec (DESIGN.md §2, `tokens-notch.css`) | [`marketing/shorts/src/mg`](../../shorts/src/mg) | Eucas's own work; the name Eucas, Pip, the eight faces and the visual identity are trademarks |
| Fonts | Instrument Sans and JetBrains Mono | Google Fonts | SIL Open Font License 1.1 |

**Mix:** music at 0.8, ducked under each Eucas sound (0.4–0.7 deeper for about half a second), sounds at 0.2–0.95. The final files are normalised to **−14 LUFS integrated, −1.6 dBFS peak** (measured with ffmpeg `ebur128`), with a limiter at −1.6 dBFS so nothing clips.

To regenerate: `python -I marketing/shorts/scripts/audio.py`, then render (`marketing/shorts/README.md`).
