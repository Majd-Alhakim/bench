# Ready to post

Everything for the 7-day waitlist sprint and the launch, final and in the order you post it. Each folder has a `POST.md`: where, when, the exact text, the media and the link. **You post by hand; nothing here was posted, sent or uploaded.** Times are Doha (UTC+3); US Eastern is 8 hours behind from 2 November. Day 1 is the Monday the site goes live.

Plan and reasons: [PLAN.md](../PLAN.md) · [WAITLIST.md](../WAITLIST.md). Regenerate these files with `python -I marketing/ready/_gen/build.py`.

## The 7-day sprint

| Day | Time | What | Folder |
|---|---|---|---|
| 0 · Sun | before | Prep: record nothing new, just check | `d0-prep` |
| 1 · Mon | 09:30 | LinkedIn | `d1-linkedin` |
| 1 · Mon | 10:00 → | 30 direct messages | `d1-dm` |
| 1 · Mon | 17:00 | X announcement + V1 | `d1-x` |
| 1 · Mon | 18:00 | Indie Hackers | `d1-indiehackers` |
| 2 · Tue | 15:00 | Dev.to article | `d2-devto` |
| 2 · Tue | 17:00 | r/ClaudeCode discussion | `d2-reddit-claudecode` |
| 2 · Tue | 17:30 | X: the article | `d2-x` |
| 3 · Wed | 17:00 | r/ClaudeAI megathread + X (V2) | `d3-reddit-claudeai`, `d3-x` |
| 3 · Wed | 18:00 | r/SideProject | `d3-reddit-sideproject` |
| 3 · Wed | 23:00 | **Checkpoint: under 40 → fallback** (WAITLIST §5) | — |
| 4 · Thu | 17:00 | X thread (V3) | `d4-x` |
| 4 · Thu | 18:00 | r/ChatGPTCoding weekly thread | `d4-reddit-chatgptcoding` |
| 4 · Thu | 19:00 | Discord | `d4-discord` |
| 5 · Fri | 09:30 / 17:00 / 18:00 | The honest count: LinkedIn, X, Indie Hackers | `d5-linkedin`, `d5-x`, `d5-indiehackers` |
| 5 · Fri | any | 3 YouTuber emails | `d5-email-youtubers` |
| 6 · Sat | 12:00 → | Shorts, TikTok, Reels (V5, V6) | `d6-shorts` |
| 6 · Sat | 16:00 / 17:00 | r/webdev Showoff Saturday, r/ClaudeCode showcase | `d6-reddit-webdev`, `d6-reddit-claudecode-showcase` |
| 7 · Sun | 09:30 / 17:00 | Last day: LinkedIn, X, DM follow-ups | `d7-linkedin`, `d7-x`, `d7-dm-followup` |
| 8 · Mon | 17:00 | The result, whatever the number | `d8-result` |

Targets: 25 / 40 / 55 / 70 / 82 / 92 / 105 sign-ups by the end of each day.

## Every evening, 22:00 Doha

1. Umami → Overview (visitors today) and Reports → UTM (by `utm_source`).
2. The sign-ups by source:

```bash
npx wrangler d1 execute eucas-waitlist --remote --command "SELECT substr(created_at,1,10) AS day, ref, count(*) AS n, sum(plan='pro') AS pro FROM waitlist GROUP BY day, ref ORDER BY day, n DESC"
```

3. Reply to your day-1 X post with "Day [d]: [N] of 100." To add the count image, from `marketing/shorts`:

```bash
npx remotion still count-wide out/day3.png --props="{\"day\":3,\"n\":47,\"goal\":100,\"line\":\"Four days left.\",\"width\":1600,\"height\":900}"
```

(`count-square` for LinkedIn, 1200×1200; `"day": 8` shows Pip **Pleased** for the result.)

## Launch kits

| Day | Time | What | Folder |
|---|---|---|---|
| L (Tue) | 16:00 | Show HN + first comment | `launch-0-hn` |
| L (Tue) | 17:00 | X thread + the first-build email | `launch-1-x`, `launch-4-email` |
| L+1 (Wed) | 09:30 / 17:00 | LinkedIn, Reddit | `launch-3-linkedin`, `launch-2-reddit` |
| L+2 (Thu) | any | Console.dev, Changelog, The Rundown | `launch-6-newsletters` |
| L+7 (Tue) | 11:01 | Product Hunt | `launch-5-producthunt` |
| L+14 | any | awesome-claude-code | `launch-7-awesome-claude-code` |

Launch media: re-record V1 and the V2–V6 cuts from the shipped app before L, in the same motion style.

## Media

### Videos (H.264 + AAC, with music and sound, at −14 LUFS; credits in `media/CREDITS.md`)

Motion graphics drawn in Remotion from the design spec (DESIGN.md §2, tokens-notch.css): the notch, Pip's eyes (only the eight faces of §2.3, checked against `eyes-sheet-d.png` with the `eye-sheet` still), the peek and the panels. Pip is titled "Pip · your Euca" the first time it appears, with original music and Eucas's own three sounds (needs you, done, stopped). The end card says "Join the waitlist · eucas.app" and "Windows · in development". Source: `marketing/shorts/src/mg`. **V2–V6 are being remade in this style after V1 is approved;** the old screenshot cuts were removed. Review stills: `stills/`.

| File | Size | Length | Used in | Pip's faces, in order |
|---|---|---|---|---|
| `videos/V1-h.mp4` | 1920×1080 (16:9) | 23.5 s | d1 X · LinkedIn · launch X · launch Reddit · YouTube | Focused → Glance → Toward you → Pleased → Calm → Focused → Concerned → Pleased → Calm; Calm on the end card |
| `videos/V1-v.mp4` | 1080×1920 (9:16) | 23.5 s | Shorts / TikTok / Reels | Focused → Glance → Toward you → Pleased → Calm → Focused → Concerned → Pleased → Calm; Calm on the end card |

`gif/V1-h.gif` (640 px, silent) is V1 for places that take a GIF but not a video.

### Images

| File | Size | Used in | Pip |
|---|---|---|---|
| `images/li-d1.png` | 1200×1200 | d1 LinkedIn | Toward you |
| `images/ih-d1.png` | 1200×630 | d1 Indie Hackers | Toward you |
| `images/devto-d2.png` | 1000×420 | d2 Dev.to cover | Concerned (no red marker) |
| `images/x-d2.png` | 1600×900 | d2 X | Concerned (no red marker) |
| `images/sideproject-d3.png` | 1600×900 | d3 r/SideProject | Toward you |
| `images/webdev-d6.png` | 1600×1000 | d6 r/webdev (the landing page) | the page's own notch |
| `images/yt-v1.png`, `images/yt-v4.png` | 1280×720 | YouTube thumbnails for V1 and V4 | none (the limits list); Calm |
| `images/ph-1.png` … `ph-6.png` | 1270×760 | Product Hunt gallery | see `launch-5-producthunt` |
| `images/ph-thumb.png` | 240×240 | Product Hunt thumbnail | Calm |
| count images | 1200×1200, 1600×900 | evening counts, d5, d7, d8 | Focused; Pleased on d8 |

The share card for links to eucas.app is the site's own `og.png` (1200×630).

**Don't post** the 51-second video in `marketing/showcase`: it shows the pre-pivot team app.
