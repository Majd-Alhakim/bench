# Feasibility: Claude artifacts and computer control (input to CR-004)

**Date:** 2026-10-22 · **Author:** Tech Lead · **Status:** Research for the PM. It changes no baselined document. Request: [interview note](../requirements/interviews/2026-10-22-artifacts-computer-use.md).

> *"utilizing Claude artifacts like Claude docs, slides, designs, dashboards … with the ability for it to control things on the computer as grok or dots"*

**Evidence tags:** [V] verified on a primary source this session (code.claude.com, platform.claude.com, support.claude.com, github.com/anthropics, learn.microsoft.com, electronjs.org, npm registry) · [S] secondary source · [O] observed in this machine or session · [I] Tech Lead inference · [U] unknown, needs a spike.
**Effort scale (agent-days, one developer agent):** S ≤ 1 · M 2–3 · L 4–6 · XL > 6.

---

## A. Claude artifacts from Bench agents

### A1. What "Claude artifacts" are in October 2026
| Fact | Tag |
|---|---|
| On claude.ai, an artifact is "anything Claude makes for you that you'd put in front of someone". Templates: **Docs, Slides, Design** on all plans; **Dashboards** (beta, Pro/Max/Team/Enterprise) and **Motion** (beta, Team/Enterprise). Dashboards are built from data platforms or connected apps, and each chart shows its query and refresh time ([support 17153992](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them)) | [V] |
| Exports: Docs → Word/PDF/Markdown/Google Docs; Slides → PowerPoint/PDF/Google Slides; Design → zip/PDF/PowerPoint/HTML; Motion → MP4. Chat artifacts made before 2026-09-16 are "legacy" | [V] |
| Surfaces: web and Claude Desktop create, edit and share; iOS/Android view and edit only. Artifacts are also in **Claude Code** | [V] |
| **Claude Code's `Artifact` tool** publishes one local `.html`/`.md` file as a live page at `claude.ai/code/artifact/<id>`. It's private by default and can be shared with the org (Team/Enterprise) or by public link. Republishing updates the page in place, with versions, comments and connector-backed live data. Limits: single page, no backend, strict CSP (CDN allowlist only), 16 MiB ([code.claude.com/docs/en/artifacts](https://code.claude.com/docs/en/artifacts)) | [V] |
| Claude Code's `/slides` and `/design` commands start from the claude.ai Slides and Design templates (beta, CLI v2.1.265+). **Claude Docs** reaches Claude Code as an Anthropic-provided claude.ai connector, `claude.ai Claude Docs`, not as a command | [V] |
| **Publishing is tied to a claude.ai login.** Availability requires a Pro/Max/Team/Enterprise plan, a session "backed by a claude.ai account: sign in with `/login`", and the Anthropic API as provider. "Sessions using an API key, gateway token, or cloud-provider credential cannot publish." Content is stored on Anthropic infrastructure | [V] |
| On this machine, the Claude desktop app session hands its agents a Claude Docs MCP and an "Artifact tool" (the desktop app registers connectors as in-process servers, which the MCP docs confirm) | [O] + [V] |

### A2. Can a Bench agent (Agent SDK / `claude -p`) use it?
| Question | Answer | Tag |
|---|---|---|
| Is the `Artifact` tool available in SDK sessions? | **Off by default.** The artifacts availability table says: "Off by default in the Agent SDK, the GitHub Action, and MCP-server contexts, when you run Claude Code with `-p` from your own terminal or scripts". The SDK TypeScript reference says: "The types are exported, but the tool is off by default in Agent SDK sessions." | [V] |
| Is there a documented switch to turn it on in the SDK? | **None found.** `enableArtifact` can only turn it *off* ("`true`: the same as leaving the key unset"), and no `CLAUDE_CODE_ENABLE_ARTIFACT` exists. Passing `tools: [..., 'Artifact']` might expose it, but this is undocumented | [V] none documented · [U] whether `tools` enables it |
| Would it need the claude.ai login that Bench inherits? | Yes. Bench's model (ADR-0002: inherit `claude login`, strip `ANTHROPIC_API_KEY`) meets the auth condition. The API-key backend can never publish | [V] |
| Can a Bench agent use **Claude Docs** instead? | Probably yes. claude.ai connectors, including the Anthropic-provided `claude.ai Claude Docs`, load in "Agent SDK sessions" when the session uses a claude.ai login. **But Bench sets `strictMcpConfig: true`, which removes all claude.ai connectors.** Allowing Docs and nothing else means turning strict mode off for that agent and denying every other connector (`deniedMcpServers` via the SDK `settings` option, or `disallowedTools` patterns). The isolation consequences are untested | [V] connectors load in SDK · [U] selective include |
| Terms for a third-party app publishing on the user's behalf | Nothing forbids an end user's own unmodified binary from publishing under their own login. Anthropic forbids offering claude.ai login, intermediating tokens, and routing other users through a plan (legal page). Disabling the tool by default in the SDK signals that Anthropic intends artifacts for interactive first-party use. Turning it on through an undocumented path would breach the spirit of ADR-0002's "don't fight the platform" rule | [V] terms text · [I] reading |
| Privacy fit | Artifacts and Docs are **hosted on claude.ai**. That conflicts with Bench's local-first principles ("files are the source of truth", nothing leaves the device except model calls) unless the client opts in per artifact | [I] |

**Verdict A2:** we can't rely on the Artifact tool in Bench agents ([V] off by default; [U] can it be enabled). Claude Docs through its connector is a plausible **opt-in** later, after a spike.

### A3. Alternatives
| Option | What it is | Fit | Effort |
|---|---|---|---|
| **(a) Local equivalents rendered in the workspace pane** | Agents write files into their folder; Bench renders them in a sandboxed pane. **Docs:** Markdown (marked, MIT) / HTML, sanitized with DOMPurify (MPL-2.0 OR Apache-2.0). **Slides:** a Markdown deck shown with reveal.js 6.0.2 (MIT), with export to `.pptx` via pptxgenjs 4.0.1 (MIT) or the user's own `pptx` skill. **Designs:** single-file HTML/CSS shown at device sizes. **Dashboards:** HTML + Chart.js 4.5.1 (MIT) or ECharts 6.1.0 (Apache-2.0), with data from files or connectors captured at build time. Mermaid 12.2.0 (MIT) for diagrams | Local-first, works with the API-key backend too, versioned like any file, glass box. Reuses the planned workspace pane (UI DIRECTION §5) and the UC-26 dashboard | **M** (2–3) for the renderer + 4 kinds; +S for pptx/pdf export |
| (b) Connectors (Google Docs/Slides MCP, Figma MCP) | Per-agent connectors from the user's inventory | Already possible through the connector feature (UC-22). Output lives in a third-party cloud. Good for "deliver to the client's Drive" | S each (config only), but every write is an **outward action** → approval gate |
| (c) Hand off to claude.ai | A "Continue in Claude" button opens claude.ai with the content | Deep-link prefill (`claude.ai/new?q=`) is **undocumented** and reported broken at times [S]; long content won't fit a URL. Copy to clipboard + open claude.ai works [I] | S, low value |
| (d) Claude Docs connector, opt-in per agent | See A2 | Native Claude Docs quality and sharing; depends on a spike and a strict-mode exception | S–M after spike SP-A2 |

**Document skills:** `docx`, `pdf`, `pptx` and `xlsx` in anthropics/skills are **"source-available, not open source"** [V]. Bench must not bundle or copy them (O4 licence check). It can pass them to an agent when the client has installed them in their own Claude Code inventory (CLAUDE.md: skills come from the user's inventory) [I].

**Recommendation A: (a) local rendering in the workspace pane, effort M.** Keep (b) as ordinary per-agent connectors (no new work). Treat (d) as a v1 "Publish to Claude Docs" button if SP-A2 passes and the client accepts claude.ai hosting. Drop (c).

---

## B. Computer control like Grok Bot / Dots

### B1. What Anthropic offers
| Offering | Facts | Subscription? | Windows? | From Agent SDK? |
|---|---|---|---|---|
| **API computer-use tool** | `computer_toolset_20260801`, **GA** on the Claude API and Google Cloud, with no beta header; Bedrock/Foundry are beta. Claude 5.5 models accept only the toolset. 17 actions (screenshot, zoom, clicks, type, key …). About 4,500 tokens of toolset overhead; screenshots cost about 1,000–1,800 tokens each. It's client-side: your app executes the actions. The reference implementation is a Docker Linux desktop (anthropics/claude-quickstarts `computer-use-demo`) [V] | **No.** It's a Messages API tool, and calling the API with subscription credentials is forbidden (ADR-0002 rule 3). It works only in Bench's API-key mode [V]/[I] | Yes: you supply the environment [V] | Not as a built-in tool. The Anthropic *client* SDKs have a beta toolset class, but that's the API path again [V] |
| **API browser-use tool** | `browser_toolset_20260801`, GA, client-side, 27 + 4 optional actions [V] | No (API only) | You supply the browser | No |
| **Claude Code computer use (CLI)** | Built-in `computer-use` MCP; research preview; **macOS only**; Pro/Max only; "not available in non-interactive mode with the `-p` flag" [V] | Yes | **No** | **No** (`-p`/SDK excluded) |
| **Claude Desktop computer use** | Research preview on **macOS and Windows**, Pro/Max; "The Claude Desktop app must be running"; per-app approval, view-only tier for browsers, a one-session lock [V]. This session shows it as an MCP injected by the desktop app [O] | Yes | Yes | **No.** It's delivered to the desktop app's own sessions only [I] |
| **Claude in Chrome** (extension) | Works with Chrome, Edge and other Chromium browsers; any direct plan; needs `/login` (off with an API key); **shares the browser's real login state**; Windows supported (not WSL). Enabled with `--chrome`, `/chrome` or `CLAUDE_CODE_ENABLE_CFC=1` [V] | Yes | Yes | Undocumented for the SDK. `CLAUDE_CODE_ENABLE_CFC=1` in the agent `env` might work [U] |
| **Desktop app Browser pane** | A clean browser profile without your logins, inside Claude Desktop [V] | Yes | Yes | No (desktop-app feature) |

**Implication:** Anthropic's first-party computer control isn't available to a Bench agent on a subscription. Bench has to bring the **environment and the tools itself as an MCP server**. Screenshots and accessibility snapshots then reach the model as ordinary MCP tool results through the official binary, which ADR-0002 allows [I, grounded in the SDK MCP docs].

### B2. Execution-environment options
The client's machine is **Windows 11 Home** [O]. Windows Sandbox is "not supported on Windows Home edition" and Hyper-V is Pro/Enterprise only [V, learn.microsoft.com]. Docker Desktop runs Linux containers on Home through WSL 2 [S, docs.docker.com].

| Option | Safety | Windows (Home) | Effort | UX |
|---|---|---|---|---|
| **(i-a) `@playwright/mcp` per agent, headed, own profile** (0.0.83, Apache-2.0 [V]) | Separate Chromium profile per agent (`--user-data-dir` outside the agent's `cwd`, or `--isolated` + `--storage-state`). Uses accessibility snapshots by default, with vision opt-in (`--caps vision`). Its own README says it is **"not a security boundary"**; `--allowed-origins` is not a boundary; `browser_run_code_unsafe` is "RCE-equivalent", so it must be in `disallowedTools` [V] | Yes: Windows profile path documented [V] | **S–M** (1–2) | A separate Chromium window. Take over = the client clicks in that window while Bench holds the agent's next tool call. The pane shows the latest screenshot or snapshot from tool results. Not embedded |
| **(i-b) Bench-native agent browser**: an Electron `WebContentsView` per agent, driven over CDP via `webContents.debugger` [V], tools served by the in-process `bench-mcp` | Bench owns every tool, so it can enforce a domain allowlist, refuse typing into password fields, and pause on Take over in code. Per-agent session partition [I]. Must follow Electron's guidance for remote content: sandbox, no Node, permission handler, navigation and window limits [V]. **No remote-debugging port**: never point Playwright `--cdp-endpoint` at Bench itself, which would expose the privileged UI | Yes | **L** (4–6) | Exactly the Grok pattern: inline card → right pane → full screen, live view, **Take over / I'm done, continue**, "You" cursor |
| (ii) Full control of the client's real Windows desktop | Worst. One shared desktop, the client's own logins and files, no per-agent isolation. Anthropic itself caps browsers at view-only and warns about sensitive apps [V]. A home-made input-injection MCP has no sentinel or Esc-abort safeguards | Technically yes | L, plus high risk | Takes the client's mouse and keyboard away. Conflicts with "client can stop anything" |
| **(iii) Sandboxed desktop per agent**: Docker Linux desktop (Xvfb + VNC, like `computer-use-demo`) streamed via noVNC 1.7.0 (MPL-2.0 [V]) into the pane, with an xdotool/screenshot MCP | Strong isolation (container, its own filesystem, network allowlist possible). Matches Anthropic's recommended environment [V] | Docker Desktop + WSL 2 needed (install, ~8 GB RAM advice). Windows Sandbox/Hyper-V: **not on Home** [V] | **L–XL** (5–8) | Same Take over UX as (i-b), for desktop apps too (LibreOffice, etc.). Linux apps only; no Windows-native apps |
| (iv) Cloud VM | Out of scope (local-first) | — | — | — |

### B3. Safety model (applies to every option)
1. **Per-agent opt-in** with a consent screen naming the risks: prompt injection, sites seen by the model, token cost. Anthropic tells developers to "inform end users of relevant risks and obtain their consent" [V]. Off by default; not allowed for routines/unattended runs in the MVP [I].
2. **Isolated profile, separate logins:** one browser profile per agent, stored under `<bench-home>/browser-profiles/<agent>/`, **outside the agent's `cwd`**. Bench denies the agent's Read/Glob/Bash access there, so the agent can't read its own cookies [I]. Never the client's personal Chrome profile, so Claude in Chrome (real login state [V]) is excluded.
3. **Credentials only by the client during Take over** (ADR-0002, security baseline). The agent calls `request_takeover(reason)` (a bench-mcp tool) on any login, 2FA or CAPTCHA screen. While control is handed over, no screenshots or snapshots go to the model. On "I'm done, continue", the agent gets a fresh snapshot. In (i-b) Bench refuses `type` into `input[type=password]` in code. In (i-a) this is a prompt rule plus a `canUseTool` heuristic, which is **weaker** [I].
4. **Outward actions still gated** (O3b, zero unapproved outward actions): read-only tools (snapshot, screenshot, navigate within the allowlist) run freely. Mutating tools (click, type, select, file upload, navigation to a new origin) go through `canUseTool` → approval card with the URL and target element, unless the client grants a standing rule per agent + domain. Buying, paying and accepting terms are always the client's (BR-57; Anthropic's guidance [V]).
5. **Screenshots stay local:** stored under the agent's run folder in Bench home, with a retention setting and a "delete run media" action. They are still sent to Anthropic as model input, which is unavoidable and should be stated in the consent text [I]. Never in logs or telemetry.
6. **Prompt injection from pages:** page content is data, not instructions (security baseline). Anthropic notes Claude "follows commands found in content" in some cases [V]. Mitigations: the domain allowlist enforced by Bench (not by Playwright's flags), the approval gate on mutating actions, no connector or file-write tools in the same agent unless the client opts in ("browser agent" as a narrow role), and the trace shows every action.
7. **Usage:** screenshots cost about 1–1.8k tokens each [V]; browser runs can drain the weekly limit (O3a ≥ 30 % headroom). Use snapshots first and vision only on demand; set a per-run step and budget cap [I].
8. **Third-party site terms:** some sites ban automation (e.g. LinkedIn) [I]. This is the client's call per site.

### B4. Recommendation
| Stage | Choice | Effort | Depends on |
|---|---|---|---|
| **MVP** | **(i-a) `@playwright/mcp`**, headed, one per opted-in agent, per-agent profile outside `cwd`, `browser_run_code_unsafe` denied. Approval gate on mutating tools; `request_takeover` + Take over / I'm done; latest screenshot shown in the pane; local screenshot store | **M** (≈ 3 agent-days incl. tests) | Runner + `canUseTool` (S1), approval inbox + autonomy (S2, UC-23/29), per-agent connectors (UC-22), the workspace pane shell, spike **SP-B1** |
| **v1** | **(i-b) Bench-native embedded browser**, with code-enforced allowlist and password-field guard, live view, full-screen take-over. Optional (d) Publish to Claude Docs | **L** (4–6) | MVP proven in dogfooding; spike SP-B2 |
| **v1+ (only if desktop apps are needed)** | **(iii) Docker Linux desktop + noVNC** per agent | **L–XL** | Client installs Docker Desktop + WSL 2; spike SP-B3. Windows Sandbox/Hyper-V impossible on Home unless the client upgrades to Pro |
| Not recommended | (ii) real-desktop control; enabling the `Artifact` tool through undocumented SDK paths; Claude in Chrome on the client's own profile | — | — |

### B5. Spikes (run on `spike/*` branches only, Sprint 1 day 1 alongside S0-1..3 or when CR-004 is approved)
| ID | Risk | Cheapest test | Time |
|---|---|---|---|
| SP-A1 | Can the Artifact tool be enabled in the SDK? (For the record only; we don't plan to use it) | `query()` with `tools: ['Read','Artifact']`, `settingSources: []`; check the `system/init` tools list and a publish attempt | 0.5 h |
| SP-A2 | Can one agent get **only** `claude.ai Claude Docs`? | `strictMcpConfig: false` + `settings: { deniedMcpServers: [...] }` or `disallowedTools` patterns; assert from `system/init` that no other connector tool loads (isolation test) | 0.5 d |
| SP-B1 | `@playwright/mcp` under the SDK on Windows 11 Home with the subscription: headed window, per-agent profile, image results surfaced in stream messages, `canUseTool` pausing as Take over, tokens per step | One agent, 10-step task on a test site; record tokens and wall time | 0.5–1 d |
| SP-B2 | Embedded `WebContentsView` driven by `webContents.debugger` from `createSdkMcpServer`, returning image content; no debugging port | Prototype 3 tools (navigate, snapshot, click) + Take over | 1 d |
| SP-B3 | Docker Linux desktop + noVNC on Home: RAM, start time, streaming in the pane | Run a desktop container, embed noVNC, drive with xdotool via MCP | 1 d |

### B6. Draft task split for the MVP (each ≤ 1 agent-day; sequenced to avoid file overlap)
| # | Task | Files / packages | Tests | Depends on |
|---|---|---|---|---|
| T1 | Workspace pane renderer: sandboxed view for `.md`/`.html` from the agent folder, CSP, no Node | `apps/desktop/src/renderer/workspace/*`, `src/main/workspace-view.ts` | Unit: path stays inside the agent folder; e2e: renders a doc | Pane shell (UI) |
| T2 | Deck + dashboard + design kinds (reveal.js, Chart.js/ECharts, device frames) + agent instructions | `renderer/workspace/kinds/*`, `templates/` skill text | Unit per kind; snapshot | T1 |
| T3 | Export: pptx (pptxgenjs) and PDF (`printToPDF`) | `src/main/export/*` | Unit: file produced, opens | T2 |
| T4 | Browser agent wiring: per-agent `@playwright/mcp` config, profile dir outside `cwd`, `disallowedTools` | `packages/core/runner/browser-config.ts`, `packages/shared/schemas/agent.ts` | Isolation: agent A can't read B's or its own profile dir | SP-B1, UC-22 |
| T5 | Approval rules for browser tools + per-agent domain allowlist | `packages/core/approval/browser-rules.ts` | Unit: mutating tool on a new origin → ask; read-only → allow | T4, approval gate |
| T6 | `request_takeover` tool + Take over / I'm done state machine; no model screenshots during take-over | `packages/bench-mcp/tools/takeover.ts`, `renderer/workspace/computer-card/*` | Unit: state machine; e2e: pause/resume | T4, T5 |
| T7 | Local screenshot store + retention + trace events | `packages/core/media-store.ts` | Unit: retention, redaction in logs | T4 |

---

## Impact on the 14-day plan
- The PRD plan has no slack: 46 Must use cases, client decision D1 "no scope cut", and a re-plan checkpoint at day 6. The workspace pane itself is UI-direction work, with its diff/terminal content in v1 (CR-003 M10).
- **Artifacts MVP (M + S export ≈ 3–4 agent-days)** fits as **one extra lane in Sprint 4** next to the UC-26 dashboard, which shares the renderer. It's a tight but plausible fit if the day-6 checkpoint shows headroom [I].
- **Browser MVP (M ≈ 3 agent-days)** depends on Sprint 2's approval gate and connectors. It fits Sprint 4 or 5 only by adding a lane, and lane count is capped by the subscription's weekly headroom (PRD §10 risk #1). Expect **+1–2 days to day 14** if it's forced in [I].
- **v1 items (embedded browser, Docker desktop, Claude Docs publish)** go after v0.1.

## Recommended CR-004 scope
- **MVP (in the 14 days, subject to the day-6 checkpoint):** A(a) local docs/slides/designs/dashboards in the workspace pane, with pptx/PDF export. **Optionally, if the client accepts the schedule risk:** B (i-a) one opted-in "browser agent" using `@playwright/mcp` in its own profile, with gated actions, Take over / I'm done and local screenshots.
- **v1 (after v0.1):** the Bench-native embedded browser with live view and full-screen take-over (i-b). A "Publish to Claude Docs" opt-in (after SP-A2). A Docker Linux desktop per agent for desktop apps (iii), only if the client needs it.
- **Out:** controlling the client's real desktop; the Artifact tool through undocumented SDK paths; Claude in Chrome on the personal profile; cloud VMs.

## Top risks
1. **Prompt injection** from web pages leads to unwanted actions or data leaks. Mitigation: approval gate on mutating tools, domain allowlist, narrow browser-agent role. Residual risk stays medium.
2. **Usage drain**: screenshots and long browser runs cut into the ≥ 30 % weekly headroom (O3a). Mitigation: snapshot-first, step and budget caps.
3. **Schedule**: CR-004 adds about 6–7 agent-days to a plan with no slack.
4. **Platform drift**: artifacts and computer use are fast-moving previews. Anthropic may later enable or forbid them in the SDK. Re-check docs each release (as ADR-0002 already requires).
5. **The `@playwright/mcp` MVP is "not a security boundary"**, and its password-field guard is only heuristic until v1.
6. **Third-party site terms** for automated browsing.

## Decisions the client must make
1. Artifacts: **local files in Bench** (recommended) vs. **published on claude.ai** (Claude Docs/Artifacts, hosted by Anthropic, shareable)?
2. Computer control in the **MVP** (accept about +1–2 days of risk to day 14) or **v1**?
3. Is **browser-only** enough, or are **desktop apps** needed? If desktop apps are needed: install Docker Desktop + WSL 2, or upgrade to Windows 11 Pro for Windows Sandbox?
4. Default autonomy for browser agents: **ask on every mutating action** (recommended) vs. standing rules per domain?
5. Which sites may agents sign in to (you type the credentials yourself during Take over)? How long should screenshots be kept?

## Sources
- Claude Code: [artifacts](https://code.claude.com/docs/en/artifacts) · [tools reference](https://code.claude.com/docs/en/tools-reference) · [settings reference `enableArtifact`](https://code.claude.com/docs/en/settings-reference) · [env vars](https://code.claude.com/docs/en/env-vars) · [errors: "Artifacts need a claude.ai login"](https://code.claude.com/docs/en/errors) · [Agent SDK TypeScript (Artifact tool, `strictMcpConfig`, `settings`)](https://code.claude.com/docs/en/agent-sdk/typescript) · [SDK: Claude Code features](https://code.claude.com/docs/en/agent-sdk/claude-code-features) · [MCP: claude.ai connectors](https://code.claude.com/docs/en/mcp) · [computer use (CLI)](https://code.claude.com/docs/en/computer-use) · [desktop](https://code.claude.com/docs/en/desktop) · [Chrome](https://code.claude.com/docs/en/chrome) · [legal and compliance](https://code.claude.com/docs/en/legal-and-compliance) · [changelog](https://code.claude.com/docs/en/changelog)
- Claude Help Center: [What are artifacts](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them) · [Get started with Claude Docs](https://support.claude.com/en/articles/16923645-get-started-with-claude-docs) · [Computer use safety](https://support.claude.com/en/articles/14128542)
- Claude Platform: [computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) · [browser use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool)
- Repos: [anthropics/skills](https://github.com/anthropics/skills) · [anthropics/claude-quickstarts computer-use-demo](https://github.com/anthropics/claude-quickstarts/tree/main/computer-use-demo) · [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
- Platform: [Windows Sandbox](https://learn.microsoft.com/en-us/windows/security/application-security/application-isolation/windows-sandbox/) · [Hyper-V requirements](https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/reference/hyper-v-requirements) · [Docker Desktop on Windows](https://docs.docker.com/desktop/install/windows-install/) [S] · [Electron debugger](https://www.electronjs.org/docs/latest/api/debugger) · [Electron WebContentsView](https://www.electronjs.org/docs/latest/api/web-contents-view) · [Electron security](https://www.electronjs.org/docs/latest/tutorial/security)
- Secondary, for deep-link prefill only: [claude-code issue #8827](https://github.com/anthropics/claude-code/issues/8827) [S]
