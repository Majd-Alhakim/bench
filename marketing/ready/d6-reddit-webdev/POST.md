# Day 6 · r/webdev Showoff Saturday

| | |
|---|---|
| **Where** | reddit.com/r/webdev → Create post, **Saturday only**, with the Showoff Saturday flair |
| **When** | Saturday 16:00 Doha |
| **Media** | `../media/images/webdev-d6.png` (the landing page's first screen, dark) |
| **Link** | `https://eucas.app/?utm_source=reddit-webdev&utm_medium=community&utm_campaign=waitlist-w1` |
| **Rules check** | Reddit's rules pages couldn't be read from this machine (blocked), so this comes from 2026 secondary sources. Read the sidebar, the rules and the pinned posts before posting. Reported: projects only on Saturday; posts that read like ads get removed even then. This post is about how the page is built. |

**Before you post:** read it once out loud and change anything that doesn't sound like you. You post by hand; nothing here is posted for you.

## Title

```text
[Showoff Saturday] A notch on a web page: the eucas.app landing page reacts to the section you're reading
```

## Body

```text
The landing page for my (unbuilt) Windows app has a live notch at the top edge. Its eyes follow your pointer and blink, its state follows the section in view, and hovering it opens a peek that melts out of the notch with an SVG goo filter.

Stack: static HTML, CSS and a little JS on Cloudflare Workers, D1 for the waitlist, Turnstile, no framework. Happy to share how the goo effect and the scroll-linked states work.

https://eucas.app/?utm_source=reddit-webdev&utm_medium=community&utm_campaign=waitlist-w1
```
