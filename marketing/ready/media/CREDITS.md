# Media credits

Everything in `media/` was made for Eucas from code in this repository, except the music in V1, which is a licensed Pixabay track (below).

| Asset | What it is | Source | Licence |
|---|---|---|---|
| Music in `videos/V1-*.mp4` | "Spring Hope – Classical Piano and String Quartet Masterpiece" by NickPanek, two sections (5.0–16.4 s and 38.0–51.0 s of the showcase cut, i.e. 1:15–1:26 and 1:48–2:01 of the track), crossfaded to 23.5 s | [Pixabay](https://pixabay.com/music/modern-classical-spring-hope-classical-piano-and-string-quartet-masterpiece-323530/), the same track the 51 s showcase used | [Pixabay Content License](https://pixabay.com/service/license-summary/): free for commercial use, including social platforms; no attribution required (credited here anyway). The audio file itself may not be redistributed on its own, so it stays out of git (`public/audio` is ignored). If YouTube shows a Content ID claim, dispute it with the Pixabay licence |
| Earlier V1 bed (unused) | An original calm track in D major | `audio.py` (`music()`) | Eucas's own work |
| Needs you · Done · Stopped | Eucas's own three sounds, the same synthesis as the prototype (`docs/design/ui/companion/prototype/src/app.js`, `SFX`; BRAND §11) | `audio.py` (`needs()`, `done()`, `stopped()`) | Eucas's own work, all rights reserved |
| UI tick and whoosh | Short, quiet transition sounds | `audio.py` (`tick()`, `whoosh()`) | Eucas's own work, all rights reserved |
| Video and images | Motion graphics and stills drawn in Remotion from the design spec (DESIGN.md §2, `tokens-notch.css`) | [`marketing/shorts/src/mg`](../../shorts/src/mg) | Eucas's own work; the name Eucas, Pip, the eight faces and the visual identity are trademarks |
| Fonts | Instrument Sans and JetBrains Mono | Google Fonts | SIL Open Font License 1.1 |

**Mix:** music at 0.85, ducked 25–30 % under the needs-you and done sounds (the score swells by itself at the stop); Eucas's sounds peak-normalised and placed at 0.5–0.7; ticks and whooshes at 0.13–0.5. The final files are normalised to **−14 LUFS integrated, −1.6 dBFS peak** (measured with ffmpeg `ebur128`), with a limiter at −1.6 dBFS so nothing clips.

To regenerate: `python -I marketing/shorts/scripts/audio.py`; cut the music from the downloaded track into `marketing/shorts/public/audio/music-v1-spring.wav` (`ffmpeg -i spring-hope.mp3 -filter_complex "[0:a]atrim=75:86.4,asetpts=PTS-STARTPTS[a];[0:a]atrim=108:121,asetpts=PTS-STARTPTS[b];[a][b]acrossfade=d=0.4,atrim=0:23.5,afade=t=in:d=0.3,afade=t=out:st=22:d=1.5" -ar 48000 music-v1-spring.wav`); then render (`marketing/shorts/README.md`).
