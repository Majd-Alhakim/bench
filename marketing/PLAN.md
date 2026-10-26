# Eucas marketing plan: the waitlist, then the launch

**Goal now:** 100 waitlist sign-ups at eucas.app in the 7 days after it goes live (the demand test). **Then:** a launch that reaches the people who run Claude Code on Windows, with $0 first.

**The plan in one paragraph.** HN won't take a waitlist page, and you don't have an audience yet. So the waitlist week runs on your own network (one message at a time), one genuinely useful post about this autumn's Windows deletes, and the demand test itself as an honest story ("100 or I don't build it"), backed by real screens every day. Show HN, Product Hunt and the newsletters wait for a build people can run. Everything is drafted here; you post.

| File | What's in it |
|---|---|
| **[WAITLIST.md](WAITLIST.md)** | **The 7-day sprint:** daily targets, tactics, the day-3 fallback, tracking, keeping the list warm |
| [drafts/waitlist-week.md](drafts/waitlist-week.md) | Every waitlist-week post, ready to paste, plus the FAQ answers |
| [drafts/launch-week.md](drafts/launch-week.md) | Show HN, Reddit, X thread, LinkedIn, the Product Hunt kit, newsletters, awesome-claude-code |
| [drafts/video-scripts.md](drafts/video-scripts.md) | Six short videos from real prototype screens, step by step, with Pip's face per shot |
| [drafts/emails.md](drafts/emails.md) | The two emails the consent line allows: the first build, and Pro |
| [research/channels-2026-10-26.md](research/channels-2026-10-26.md) | The evidence: community sizes and rules, comparable launches, incidents, newsletters, benchmarks |

## 0. Decisions for you before go-live

| # | Decision | Why it matters | Recommendation |
|---|---|---|---|
| D1 | **The licence.** The repo's `LICENSE` is **MIT**; the page, `llms.txt` and CR-010 say **FSL** | Someone will spot the mismatch in the first hour, and "is it open source?" is the first HN question | Settle it, then make the repo and the page say the same thing |
| D2 | **Does the free guard run without an account?** Today, everything needs sign-in | HN treats a sign-up wall as a landing page; awesome-claude-code lists sign-up as a blocker | Let the four limits and the bulk-delete stop run without an account; the supervisor and rules need one |
| D3 | **Go live on a Monday** | Reddit peaks Mon–Thu; day 6 lands on Showoff Saturday | Yes |
| D4 | Three small landing changes ([WAITLIST §4](WAITLIST.md#4-turning-visitors-into-sign-ups)): the founders' line by the form, a share link after joining, a "your Claude login" FAQ | Conversion and the terms-of-service question | Make them in a landing PR before go-live |
| D5 | An optional, unticked build-notes opt-in | The consent line allows only 3 emails; no newsletter today | Not for week 1; decide after the test |
| D6 | **Don't post the 51 s showcase** (`marketing/showcase/`) for the companion | It shows the pre-pivot team app (Atlas, a bakery site), not the notch | Record V1–V6 instead |

## 1. Positioning

**For** developers who run several Claude Code sessions at once on Windows, **who** lose their day checking on them and worry about the one command they didn't read, **Eucas is** a small companion in a notch at the top of the screen **that** taps you only when a session needs you and holds the four irreversible things for your yes. **Unlike** sandboxes (strong, but most sessions don't run in one) and Anthropic's own notifications (one session at a time, no rules across sessions), **Eucas** works across all your sessions, keeps your rules outside the model, and shows you word for word what leaves your PC.

**Lead with relief, not fear.** The evidence: HN scored the safety guards 61 points or fewer, with "use a sandbox" as the top comment, while a fun notifications tool got 1,006. The page already leads right: "Stop babysitting your agents." Safety is the second message, and it's always the honest, narrow version.

### The three core messages

| # | Message (your voice) | Proof you can show | Never say |
|---|---|---|---|
| 1 | **Stop babysitting your agents.** "One glance tells you which session needs you. Your rules and the supervisor answer the safe ones, so you get asked less." | The peek (`n-peek`), the rule suggestion (`p-suggest`), "212 times" in the retro | "Fully autonomous", "never ask again" |
| 2 | **Look away without fear, honestly.** "Eucas never auto-approves a delete, a push to your default branch, a send or a payment, and no rule can change that. A session that starts deleting files in bulk is stopped." | The rules screen with the four locked rows; the tripwire page | "Never deletes", "100% safe", "can't happen", "protects you from everything" |
| 3 | **Yours, and plain about it.** "What leaves your PC, word for word. Your Claude login stays yours." | "What is sent" with a real sample; the account page | "Private by design", "no data ever leaves" |

**Voice rules:** second person ("you"); "I" only where a person stands behind it (the test, the build). Calm, numbers first, one next step, no exclamation marks. Banned: seamless, effortless, supercharge, unleash, magic, AI-powered, smart (for us), game-changer. "Claude Code" is the tool you guard; the product is **Eucas**, one agent is **a Euca**, yours is **Pip** in screens. Say "your default branch", not "main". Every screen shown before launch says **"Design preview · Eucas is in development"**. Footer line wherever there's room: "Not affiliated with Anthropic."

## 2. Audience

- **Core:** Claude Code users on Windows running 2+ sessions (terminal, desktop app or VS Code). Smaller than it sounds: the build-in-public crowd on X is about 13% Windows (Pragmatic Engineer poll, in the pre-mortem). Reddit and LinkedIn are broader.
- **Also worth signing up:** Mac and Linux users (the form's OS question decides what's next), Cursor and Codex users (the agents question).
- **Where they are:** r/ClaudeAI (1.1M), r/ClaudeCode (402K), r/ChatGPTCoding (398K), r/vibecoding (351K), r/AI_Agents (433K), r/SideProject (826K); HN; X around @bcherny, @trq212, @claudeai; YouTube (Nick Saraev, Cole Medin, WorldofAI, IndyDevDan); Console.dev's readers.

## 3. Pip's faces

Every picture of Pip in marketing (posts, social images, video shots, thumbnails, the Product Hunt kit) uses **only these eight faces**, drawn to the sheet in `docs/design/ui/companion/screens/eyes-sheet-d.png` (spec: DESIGN.md §11, "Eye grammar"). Don't invent faces, and don't draw Pip with a mouth, eyebrows, tears, hearts or any other emotion.

| Face | Means | Use it for | Prototype route |
|---|---|---|---|
| **Calm** | Protected, nothing running; blinks every 4–7 s | Rules, settings, "what is sent", the brand thumbnail, end cards | `n-rest`, `p-rules`, `s-sent` |
| **Focused** | Sessions are working; narrower eyes read along the beam. **The only face that loops** | "Three sessions working", the hero desktop shot, build-in-public clips of work in progress | `n-working` |
| **Glance** | Something arrived: one look at the marker | The first beat of any "a session needs you" moment | the arrival before `n-peek` |
| **Toward you** | Waiting for you: eyes up and front, following your pointer | A session is waiting; the peek; the needs-you panel; "join the waitlist" CTAs | `n-peek`, `p-needs` |
| **Concerned** | Not protected, or Pip stopped a session: softened, looking down. **Never alarmed** | The tripwire stop; "not protected"; the incident article's image | `n-trip`, `p-trip`, `n-off` |
| **Sleepy** | You're away and nothing runs | "Look away" messages, weekend posts, "while you were away" | `n-doze`, `p-away` |
| **Pleased** | All caught up, for 1.6 s | Day-8 thank-you, "you're all caught up", launch-day thank-you | `p-caught` |
| **Closed** | Before you make your Euca | The setup video's first shot, "before" in a before/after | `s-create` |

**Mapping rules:**
- A scene shows the face its state has in the product: a stop is Concerned, never Toward you; a waiting session is Toward you, never Pleased.
- A sequence follows the product's order: Focused → Glance → Toward you (something needs you); Focused → Concerned (a stop); Toward you → Pleased (all answered).
- Pleased lasts 1.6 s in motion; in a still, use it only for "caught up" or "thank you".
- **Only Focused loops** in GIFs and videos. Any other face holds, blinks (Calm, Toward you) or plays once.
- Reduced-motion versions keep the shape and drop the movement.
- On the website and in social images, a stop shows **Concerned eyes without the red "Stopped" marker**, as the landing page does (DESIGN §13). Screen recordings of the panel show the product as it is.

## 4. Channel playbook

Reach figures are planning ranges from the research file, not promises. Effort is your time.

| Channel | Audience | Format | Timing (Doha) | Rules to respect | Expected reach | Effort | Phase |
|---|---|---|---|---|---|---|---|
| **Your network** (DMs, WhatsApp, LinkedIn connections) | People who already trust you | A personal 4-line message with one link | Day 1, evenings | One message, one follow-up at most | 30–60 people → 20–40 sign-ups | 2 h | Waitlist |
| **Reddit: r/ClaudeCode** (402K) | Daily Claude Code users | A useful discussion post (no link in the body); the weekly showcase thread for the product | Mon–Thu, 16:00–19:00 | About 10% self-promotion or less; showcase thread for promotion (UNVERIFIED, read the sidebar); no cross-posting the same day | One good post: 5K–50K views, 400–3,000 visits | 3 h per post incl. replies | Both |
| **Reddit: r/ClaudeAI** (1.1M) | Broad Claude users | A comment in the "Built with Claude" megathread; main feed only with ~50+ karma | Mon–Thu, 16:00–19:00 | Rule 7: showcases in the megathread (UNVERIFIED wording) | 100–500 visits | 1 h | Both |
| **Reddit: r/SideProject** (826K) | Makers | The demand-test story | Day 3 | Promotion allowed (UNVERIFIED) | 100–500 visits | 1 h | Both |
| **Reddit: r/ChatGPTCoding, r/vibecoding, r/AI_Agents** | AI-coding generalists | Weekly self-promo threads; one adapted value post | Day 4 or the fallback | Read each sidebar | 50–300 visits each | 30 min each | Both |
| **Reddit: r/webdev** (1.5M) | Web developers | Showoff Saturday only, about how the page was built | Saturdays | Projects only on Saturday; ad-like posts removed | 50–300 visits | 1 h | Waitlist |
| **Avoid:** r/programming (LLM content restricted), r/opensource (FSL), r/LocalLLaMA, r/cursor (off topic) | | | | | | | |
| **Hacker News** | Senior developers, skeptics | Show HN of the **runnable** build; your first comment says what it can't do | Tue–Wed, 16:00–17:00 (8–9 am ET) | No landing pages or sign-up walls; never ask for votes; an aged account | Comparable posts: 60–250 points; front page 2K–13K visits; or nothing | 1 h + 6 h in the thread | **Launch only** |
| **X** | Builders in public, Claude Code people | Native video clips (V1–V6), short threads, the link in a reply; the evening count | Daily in waitlist week, 3×/week after | No tagging people to ask for shares | Depends on your audience: 50–400 visits in week 1 from a small account | 30 min/day | Both |
| **LinkedIn** | Your professional network, Gulf tech community | Text + one image, no link in the post; story-led | Day 1, 5, 7, 8; launch | Links cut reach (vendor estimate ~60%) | 1K–5K impressions, 30–150 visits | 30 min | Both |
| **Dev.to** (+ Hashnode cross-post with canonical URL) | Developers searching for help | The useful article | Day 2 | Tag honestly; no promo-only posts | 300–2,000 reads, long tail via search | 3 h | Both |
| **Indie Hackers** | Makers who love stakes and numbers | The demand-test story + daily numbers | Day 1, 5, 8 | Group rules | 100–400 visits | 1 h | Waitlist |
| **YouTube Shorts, TikTok, Reels** | Broad dev audience | V1, V2, V5, V6 vertical | Day 6 and weekly | Native upload; the link in the description | Low without an audience: 200–2,000 views each | 30 min each once recorded | Both |
| **YouTube long form** | Searchers ("Claude Code Windows setup") | V4 with voice-over, 3–4 min | L+3 | — | Slow, compounding search traffic | 4 h | Launch |
| **YouTube creators** | Their audiences | An early build offer, no payment | Day 5 ask; L−7 build | Business email from their About page only | 0, or one video that beats everything else | 1 h | Both |
| **Product Hunt** | Early adopters | The kit in launch-week.md | L+7, 11:01 Doha | No asking for upvotes | ccusage got 109 upvotes; 500–2,000 visits | 4 h | Launch |
| **Newsletters** (Console.dev, Changelog News, The Rundown) | Curated dev readers | One plain email or form each | L+2 | Console.dev: pre-1.0, no paid reviews; Changelog: not commercial | 0, or 1,000+ visits if picked | 1 h | Launch |
| **GitHub** (README, awesome-claude-code, Discussions) | Developers checking the source | A README that starts with the GIF and "what it can't do" | Before L; awesome-list at L+14 | awesome-list: web form only, 14-day-old repo, no sign-up blocker | Stars from every other channel; the list is long-tail | 2 h | Launch |
| **Discord** (Claude developers and others you're already in) | Active builders | One message in the showcase channel | Day 4 | Showcase channels only | 20–100 visits | 30 min | Both |

**Top five for reach, in order:** Reddit (r/ClaudeCode + r/ClaudeAI + r/SideProject), Hacker News (launch only), X with real-screen clips, your network + LinkedIn, Dev.to's useful article. Product Hunt and newsletters come next, at launch.

## 5. Content calendar

### Waitlist week (day 1 = go-live Monday)

The full table with targets is in [WAITLIST §3](WAITLIST.md#3-day-by-day). In short:

| Day | Format | Hook | Channel | Owner |
|---|---|---|---|---|
| 1 | DMs; text post; V1 clip; story post | "If 100 people don't join in 7 days, I don't build it" | DMs, LinkedIn, X, Indie Hackers | You (drafts: Claude) |
| 2 | Long article; discussion post; clip | "Four Windows users reported deletes reaching their drive root" | Dev.to, r/ClaudeCode, X | You |
| 3 | Megathread comment; story; V2 | "You approved `pnpm test` 212 times this week" | r/ClaudeAI, r/SideProject, X | You |
| 4 | Thread; V3; weekly-thread comment | "An AI supervisor on your sessions. What does it see?" | X, r/ChatGPTCoding, Discord | You |
| 5 | Progress post; creator emails | "Day 5: [N] of 100" | X, LinkedIn, Indie Hackers, email | You |
| 6 | Showoff post; Shorts | "A notch on a web page" / "Two sessions, one file" | r/webdev, r/ClaudeCode thread, Shorts, TikTok | You |
| 7 | Last call | "Last day: [N] of 100" | X, LinkedIn, DM follow-ups | You |
| 8 | Result post | "[N] people joined. Here's what happens now" | X, LinkedIn, IH, Reddit replies | You |

### Between the test and launch (about 5–6 weeks of build)

| Cadence | Format | Hook | Channel |
|---|---|---|---|
| Tue + Fri | Pip's build notes: one real screen or 10 s clip with the right face | "Built this week: [thing]" | X, LinkedIn (Fri), GitHub Discussions |
| Every 2 weeks | A hard-problem write-up | "How Windows path aliases get past a delete check" · "Hooks fail open: how Eucas fails closed" · "How the supervisor decides, with numbers" | Dev.to, r/ClaudeCode discussion |
| L−14 | Repo README ready; the 14-day clock for awesome-claude-code starts if it hasn't | — | GitHub |
| L−14 to L−7 | Private test build to 10–20 Windows users with 4+ sessions | One by one, by DM | DM |
| L−7 | Early build to 3–5 small YouTubers who said yes | — | Email |
| L−3 | Record V4 long form; prepare the HN first comment and the PH gallery | — | — |

### Launch day and the first 30 days (L = the first runnable build, a Tuesday)

| Day | Format | Hook | Channel | Owner |
|---|---|---|---|---|
| L (Tue) 16:00 | Show HN + first comment; stay 6 h | "A Windows notch that watches your Claude Code sessions" | HN | You |
| L 17:00 | X thread (8 posts), the "first build" email | "Eucas is out. Free." | X, email to the list | You |
| L+1 (Wed) | Launch post; megathread; LinkedIn | "[N] of you joined the test; it's built" | r/ClaudeCode, r/ClaudeAI, r/SideProject, LinkedIn | You |
| L+2 (Thu) | Newsletter emails | — | Console.dev, Changelog, The Rundown | You |
| L+3 | V4 long form + Shorts cut | "Set up in a minute, step by step" | YouTube | You |
| L+5 | Numbers post | "5 days of Eucas: installs, what broke, what's next" | X, IH, LinkedIn | You |
| L+7 (Tue) 11:01 | Product Hunt | the kit | PH, X, LinkedIn | You |
| L+9 | Useful post #2 | "What 5 days of real sessions told us about permission prompts" (only with real, anonymous aggregate numbers people agreed to share) | Dev.to, r/ClaudeCode | You |
| L+14 | awesome-claude-code issue form (if D2 allows) | — | GitHub | You |
| L+14 | V5/V6 refresh from the real app | — | Shorts, TikTok, X | You |
| L+21 | Release notes post for v0.1.x | "What changed because you asked" | X, GitHub release, r/ClaudeCode (if allowed) | You |
| L+28 | When Pro opens (if ready): the Pro email | "The first 200 keep $15/month for life" | Email, X, LinkedIn | You |
| L+30 | The 30-day retro, numbers and mistakes | "30 days, [N] installs, [M] weekly users. Here's the truth" | IH, X, LinkedIn, Dev.to | You |
| Weekly | 3 X posts; 1 helpful answer per day with no link; reply to every issue in 24 h | — | X, Reddit, GitHub | You |

## 6. Launch plan

1. **Ready means runnable.** The download works on Windows 10 22H2 and 11, the four limits work without an account (D2), and a stranger can install it from the README in under 2 minutes. Until then, no Show HN.
2. **Stagger the big three** so each gets its own day and you can answer every comment: HN on L, Reddit on L+1, Product Hunt on L+7.
3. **The waitlist goes first**: the "first build" email goes out the hour HN is posted, so early installs and real comments exist when strangers arrive. Don't ask the list to vote anywhere.
4. **Say what it can't do** in every launch post, before anyone else does. On HN this is the difference between "honest tool" and "another denylist".
5. **Watch the kill criteria** from the pre-mortem: under 300 installs or 50 weekly actives at L+4 weeks means stop building Pro. Post the real numbers at L+30 either way.

Drafts: [drafts/launch-week.md](drafts/launch-week.md).

## 7. Videos

Six cuts from real prototype screens, every Euca titled, Pip's face per shot: [drafts/video-scripts.md](drafts/video-scripts.md). V1 (the four limits, 30 s) is the hero for X and the PH gallery; V4 (setup step by step) is the YouTube and PH video. Before launch, every frame says "Design preview · Eucas is in development"; after launch, re-record from the real app.

## 8. Metrics

### What the page records today

- **Sign-ups by source:** the waitlist table's `ref` column keeps `?ref=` or `utm_source` (lower-cased; letters, digits, `.`, `_`, `-`; 40 characters). Also `plan` (`pro` = clicked the founding-member button), `agents`, `sessions`, `os`, `status` (confirmed or not).
- **Visits:** Cloudflare Web Analytics (enabled in the Pages project; no cookies, no banner). Referrers and pages, not who signed up.
- **Umami:** the brief mentions it, but **the page doesn't use Umami**. Cloudflare's numbers plus the `ref` column cover the test. If you want per-link visit counts later, Umami Cloud's free tier (check the current limits) needs one script tag and a CSP change in `public/_headers`: a landing PR, not this one.

### Link naming

`https://eucas.app/?utm_source=<source>&utm_medium=<medium>&utm_campaign=<campaign>`

- **campaign:** `waitlist-w1` (days 1–7), `buildnotes` (between), `launch` (L to L+30).
- **medium:** `direct`, `social`, `community`, `article`, `video`, `email`, `newsletter`, `launchsite`.
- **source** (this is what lands in `ref`, so keep it unique per place):

| Source | Medium | Where |
|---|---|---|
| `dm` | direct | DMs, WhatsApp |
| `linkedin` | social | LinkedIn (profile link or reply) |
| `x` | social | X replies and bio |
| `reddit-claudecode` · `reddit-claudeai` · `reddit-sideproject` · `reddit-chatgptcoding` · `reddit-webdev` · `reddit-vibecoding` · `reddit-aiagents` | community | one per subreddit |
| `devto` · `hashnode` | article | articles |
| `ih` | community | Indie Hackers |
| `discord` | community | Discord |
| `yt` · `tiktok` · `reels` | video | descriptions |
| `hn` | community | HN (launch; the repo README's link) |
| `producthunt` | launchsite | PH |
| `console` · `changelog` · `rundown` | newsletter | newsletters |
| `email` | email | launch and Pro emails |
| `friend` | direct | the share link after joining (D4) |

Example: `https://eucas.app/?utm_source=reddit-claudecode&utm_medium=community&utm_campaign=waitlist-w1`

### What to track

| Metric | Source | Target |
|---|---|---|
| **Sign-ups, cumulative** | D1 query in WAITLIST §6 | 25 / 40 / 55 (≥ 40 on day 3) / 70 / 82 / 92 / 105 |
| Visitors per day | Cloudflare Web Analytics | 150–300 |
| Conversion (sign-ups ÷ visitors) | both | ≥ 5% |
| Sign-ups by `ref` | D1 | Know your top 3 by day 3 |
| Founding-member clicks (`plan = pro`) | D1 | Report the share; 20%+ is a strong pay signal |
| Windows share, 4+ sessions share | D1 (step 2 answers) | The quality of the 100 |
| Step-2 answer rate | D1 (`os != ''`) | Tells you if people care enough to answer |
| Confirm rate (`confirmed` ÷ all), once Resend is on | D1 | ≥ 60% |
| Comments and objections | Your notes | The top 3 objections by day 5 |
| Post removals or warnings | Reddit | Zero |
| **After launch:** installs, weekly actives, free-to-Pro | the app's own account data | Pre-mortem kill lines: 300 installs / 50 WAU at L+4 weeks |

## 9. Budget

**$0 plan (the default).** Everything in this plan runs on free tools.

| Item | Cost |
|---|---|
| Cloudflare Pages, D1, Turnstile, Web Analytics | $0 |
| Resend (confirm emails; free tier) | $0 |
| OBS or the Xbox Game Bar for recording | $0 |
| Remotion (already in `marketing/showcase/`; free for individuals, check its licence for companies) | $0 |
| Reddit, X, LinkedIn, Dev.to, IH, PH, HN posting | $0 |

**Paid options (only if you choose; none is needed for the test):**

| Option | Cost | When it makes sense |
|---|---|---|
| **PAID** Reddit Ads test aimed at r/ClaudeCode and r/ClaudeAI with V1 | Cap at **$50** total | Only in the day-3 fallback, and only if visitors are the problem, not conversion |
| **PAID** X Premium | About $8/month (check current pricing) | Only if X becomes a top-3 source; replies from Premium accounts rank higher |
| **PAID** Umami Cloud above the free tier | Varies | Not needed for the test |
| **PAID** Newsletter sponsorship (e.g. TLDR) | About $15K per placement | No. Not at this stage |
| **PAID** Code signing certificate (removes "Unknown publisher") | ~$100–400/year | A launch-conversion lever later, not a marketing spend now |

## 10. Risks

| Risk | How it happens | Prevention | If it happens |
|---|---|---|---|
| **Reddit removal or ban** | Same link in several subreddits on one day; posting with low karma; a post that reads like an ad | One subreddit per day; the useful post has no link in the body; promotion only in showcase threads; 20 min of real answers in r/ClaudeCode before day 2; read each sidebar | Message the mods politely, ask what to change, don't repost elsewhere the same day |
| **"AI slop" backlash** | Templated text, hype words, an AI-written article, a too-perfect video | Rewrite every draft in your words; specific numbers and sources; real screens with the "design preview" label; answer comments yourself; say what it can't do | Agree with what's fair, show the human process (the pre-mortem, the 93-state prototype, the test) |
| **Overclaiming safety** | "Never deletes", "100% safe", or a demo that implies it | Only the fixed sentence; the "what it can't do" paragraph in every launch post | Correct the post in public, fast |
| **"Vaporware"** | Promoting an unbuilt app | Say "design preview" and "in development" everywhere; the demand test framing makes it honest | Point to the public repo and the design docs |
| **The licence mismatch** | MIT in the repo, FSL on the page (D1) | Settle before go-live | Fix it the same day and say so |
| **Terms-of-service question** | Anthropic's 2026 crackdown on third-party harnesses | The FAQ: your login stays yours; unmodified Claude Code; the supervisor is a separate open model | Link the FAQ; don't argue |
| **Exploiting incidents** | Fear marketing around people's lost data | Lead with help (the 7 steps work without Eucas); cite user reports as reports; never name or mock the people | Remove the line that crossed it |
| **Wrong audience** | X's build-in-public crowd is mostly Mac | Reddit and LinkedIn first; welcome Mac sign-ups as a signal | Count Mac demand; it's PM-3 in the pre-mortem |
| **HN voting-ring penalty** | Sharing the HN link in a group of friends | Never ask for votes; share the post only after it's on the front page, if at all | Repost once on another day |
| **Your time** | 2 h a day this week, plus building | The drafts are ready; skip the optional items first (Shorts, Discord) | Cut channels, keep the DMs and the useful post |
| **Trademark** | Using Claude's logo or implying endorsement | "Not affiliated with Anthropic"; never the Claude logo; never call Eucas "Claude Code" anything | Edit the asset |
