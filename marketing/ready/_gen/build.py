# Builds marketing/ready: every POST.md and INDEX.md.   python -I marketing/ready/_gen/build.py
import json
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import launch  # noqa: E402
import waitlist  # noqa: E402
from common import ROOT, u  # noqa: E402

SHORTS = os.path.join(ROOT, "..", "shorts")
FACE = {"": "Calm", "front": "Toward you", "focused": "Focused", "glance": "Glance", "concerned": "Concerned",
        "closed": "Closed", "pleased": "Pleased", "sleepy": "Sleepy"}
USE = {
    "V1-s": "d1 X · d3 r/ClaudeAI (as GIF) · LinkedIn", "V1-h": "launch X · launch Reddit · YouTube", "V1-v": "Shorts / TikTok / Reels",
    "V2-s": "d3 X", "V2-v": "Shorts / TikTok / Reels", "V3-h": "d4 X thread", "V3-v": "Shorts / TikTok / Reels",
    "V4-h": "Product Hunt video · YouTube", "V4-v": "YouTube Shorts", "V5-v": "d6 Shorts / TikTok / Reels",
    "V6-v": "d6 Shorts / TikTok / Reels",
}


def faces(video_id):
    if video_id == "V1":  # motion graphics: the face keys in marketing/shorts/src/mg/V1.tsx
        return "Focused → Glance → Toward you → Pleased → Calm → Focused → Concerned → Pleased → Calm; Calm on the end card"
    """Pip's faces in the order the video shows them, read from the captured screens (setup screens without Pip are skipped)."""
    src = open(os.path.join(SHORTS, "src", "videos.ts"), encoding="utf-8").read()
    boxes = json.load(open(os.path.join(SHORTS, "src", "boxes.json"), encoding="utf-8"))
    block = src.split(f'id: "{video_id}"')[1].split("endSeconds")[1].split("],\n  },")[0]
    out = []
    for route, focus in re.findall(r'route: "([a-z-]+)", seconds: [0-9.]+, focus: ([^,]+(?:, [0-9]+){0,3}\]?)', block):
        f = boxes.get(route, {}).get("face")
        top = re.match(r"\[\d+, (\d+)", focus)
        # Skip setup screens without Pip, and close-ups cropped below the notch (Pip isn't in the frame).
        if f is None or (top and int(top.group(1)) >= 32 and not route.startswith("s-")):
            continue
        name = FACE[f]
        if not out or out[-1] != name:
            out.append(name)
    return " → ".join(out + ["Calm (end card)"])


def duration(path):
    try:
        r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                           capture_output=True, text=True, check=True)
        return f"{float(r.stdout):.1f} s"
    except (OSError, subprocess.CalledProcessError, ValueError):
        return "?"


SCHEDULE = [
    ("0 · Sun", "before", "Prep: record nothing new, just check", "`d0-prep`"),
    ("1 · Mon", "09:30", "LinkedIn", "`d1-linkedin`"),
    ("1 · Mon", "10:00 →", "30 direct messages", "`d1-dm`"),
    ("1 · Mon", "17:00", "X announcement + V1", "`d1-x`"),
    ("1 · Mon", "18:00", "Indie Hackers", "`d1-indiehackers`"),
    ("2 · Tue", "15:00", "Dev.to article", "`d2-devto`"),
    ("2 · Tue", "17:00", "r/ClaudeCode discussion", "`d2-reddit-claudecode`"),
    ("2 · Tue", "17:30", "X: the article", "`d2-x`"),
    ("3 · Wed", "17:00", "r/ClaudeAI megathread + X (V2)", "`d3-reddit-claudeai`, `d3-x`"),
    ("3 · Wed", "18:00", "r/SideProject", "`d3-reddit-sideproject`"),
    ("3 · Wed", "23:00", "**Checkpoint: under 40 → fallback** (WAITLIST §5)", "—"),
    ("4 · Thu", "17:00", "X thread (V3)", "`d4-x`"),
    ("4 · Thu", "18:00", "r/ChatGPTCoding weekly thread", "`d4-reddit-chatgptcoding`"),
    ("4 · Thu", "19:00", "Discord", "`d4-discord`"),
    ("5 · Fri", "09:30 / 17:00 / 18:00", "The honest count: LinkedIn, X, Indie Hackers", "`d5-linkedin`, `d5-x`, `d5-indiehackers`"),
    ("5 · Fri", "any", "3 YouTuber emails", "`d5-email-youtubers`"),
    ("6 · Sat", "12:00 →", "Shorts, TikTok, Reels (V5, V6)", "`d6-shorts`"),
    ("6 · Sat", "16:00 / 17:00", "r/webdev Showoff Saturday, r/ClaudeCode showcase", "`d6-reddit-webdev`, `d6-reddit-claudecode-showcase`"),
    ("7 · Sun", "09:30 / 17:00", "Last day: LinkedIn, X, DM follow-ups", "`d7-linkedin`, `d7-x`, `d7-dm-followup`"),
    ("8 · Mon", "17:00", "The result, whatever the number", "`d8-result`"),
]

LAUNCH = [
    ("L (Tue)", "16:00", "Show HN + first comment", "`launch-0-hn`"),
    ("L (Tue)", "17:00", "X thread + the first-build email", "`launch-1-x`, `launch-4-email`"),
    ("L+1 (Wed)", "09:30 / 17:00", "LinkedIn, Reddit", "`launch-3-linkedin`, `launch-2-reddit`"),
    ("L+2 (Thu)", "any", "Console.dev, Changelog, The Rundown", "`launch-6-newsletters`"),
    ("L+7 (Tue)", "11:01", "Product Hunt", "`launch-5-producthunt`"),
    ("L+14", "any", "awesome-claude-code", "`launch-7-awesome-claude-code`"),
]


def prep():
    from common import head, write
    write("d0-prep", head("Day 0 · The evening before go-live", "Your desk", "Sunday evening, about 1 hour",
        "All of `../media`", "All links are in each POST.md") + f"""
- [ ] The site is live and you joined with your own email, confirmed, then left and re-joined: the form, the email and the `ref` column work.
- [ ] Umami shows your own visit in *Realtime* (ad blocker off for the check).
- [ ] Watch every video in `../media/videos` once on your phone, sound off.
- [ ] Write the 30 names for `d1-dm`.
- [ ] Reddit: check your karma. Low karma means the r/ClaudeAI main feed is closed to you; the megathread isn't.
- [ ] Read the sidebar and pinned posts of r/ClaudeCode, r/ClaudeAI, r/SideProject, r/ChatGPTCoding and r/webdev (Reddit's rules pages couldn't be read from here).
- [ ] Put `{u('x', 'social')}` in your X bio and `{u('linkedin', 'social')}` in your LinkedIn contact info.
- [ ] Don't post the old 51-second video in `marketing/showcase`: it's the pre-pivot team app.
""")


def index():
    vids = os.path.join(ROOT, "media", "videos")
    rows = []
    for f in sorted(os.listdir(vids)):
        vid = f[:-4]
        size = {"v": "1080×1920 (9:16)", "h": "1920×1080 (16:9)", "s": "1080×1080 (1:1)"}[vid[-1]]
        rows.append(f"| `videos/{f}` | {size} | {duration(os.path.join(vids, f))} | {USE.get(vid, '')} | {faces(vid[:2])} |")
    sched = "\n".join(f"| {d} | {t} | {w} | {s} |" for d, t, w, s in SCHEDULE)
    lsched = "\n".join(f"| {d} | {t} | {w} | {s} |" for d, t, w, s in LAUNCH)
    body = f"""# Ready to post

Everything for the 7-day waitlist sprint and the launch, final and in the order you post it. Each folder has a `POST.md`: where, when, the exact text, the media and the link. **You post by hand; nothing here was posted, sent or uploaded.** Times are Doha (UTC+3); US Eastern is 8 hours behind from 2 November. Day 1 is the Monday the site goes live.

Plan and reasons: [PLAN.md](../PLAN.md) · [WAITLIST.md](../WAITLIST.md). Regenerate these files with `python -I marketing/ready/_gen/build.py`.

## The 7-day sprint

| Day | Time | What | Folder |
|---|---|---|---|
{sched}

Targets: 25 / 40 / 55 / 70 / 82 / 92 / 105 sign-ups by the end of each day.

## Every evening, 22:00 Doha

1. Umami → Overview (visitors today) and Reports → UTM (by `utm_source`).
2. The sign-ups by source:

```bash
npx wrangler d1 execute eucas-waitlist --remote --command "SELECT substr(created_at,1,10) AS day, ref, count(*) AS n, sum(plan='pro') AS pro FROM waitlist GROUP BY day, ref ORDER BY day, n DESC"
```

3. Reply to your day-1 X post with "Day [d]: [N] of 100." To add the count image, from `marketing/shorts`:

```bash
npx remotion still count-wide out/day3.png --props="{{\\"day\\":3,\\"n\\":47,\\"goal\\":100,\\"line\\":\\"Four days left.\\",\\"width\\":1600,\\"height\\":900}}"
```

(`count-square` for LinkedIn, 1200×1200; `"day": 8` shows Pip **Pleased** for the result.)

## Launch kits

| Day | Time | What | Folder |
|---|---|---|---|
{lsched}

Launch media are from the prototype and say "Design preview": re-record the same shot lists from the shipped app before L.

## Media

### Videos (silent H.264; add a quiet platform-library track on Shorts, TikTok and Reels)

Motion graphics drawn in Remotion from the design spec (DESIGN.md §2, tokens-notch.css): the notch, Pip's eyes (only the eight faces of §2.3, checked against `eyes-sheet-d.png` with the `eye-sheet` still), the peek and the panels. Pip is titled "Pip · your Euca" the first time it appears, and "Design preview · Eucas is in development" stays on screen. Source: `marketing/shorts/src/mg`. **V2–V6 are being remade in this style after V1 is approved;** the old screenshot cuts were removed. Review stills: `stills/`.

| File | Size | Length | Used in | Pip's faces, in order |
|---|---|---|---|---|
{chr(10).join(rows)}

`gif/V1-s.gif` (480 px) is V1 for places that take a GIF but not a video.

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
"""
    open(os.path.join(ROOT, "INDEX.md"), "w", encoding="utf-8", newline="\n").write(body)


if __name__ == "__main__":
    prep()
    waitlist.build()
    launch.build()
    index()
    print("ok")
