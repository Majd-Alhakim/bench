# Self-review: the Eucas companion UI

> **SUPERSEDED 2026-10-26** by the notch-and-panel design ([../DESIGN.md](../DESIGN.md)), [CR-011](../../../../requirements/change-requests/CR-011.md). Never approved as a design. Kept as history; see [README.md](README.md).

| Date | Reviewer | Scope |
|---|---|---|
| 2026-10-26 | Lead UI designer (Claude), scoring its own work | [DESIGN.md](DESIGN.md), [tokens-companion.css](tokens-companion.css), [prototype/companion.html](prototype/companion.html), the 72 [screens](screens/) |

**How it was checked.**
- **Render gate (premium-craft gate 10):** every state rendered with headless Edge at 1440 × 900 (dark), the dense screens also at 1280 × 800, key states in light, the popover at 100 / 125 / 150 %. I looked at every PNG, fixed what was off and re-rendered three times (log below).
- **Interaction smoke test** (headless Edge clicking the real prototype): 21 checks, 20 pass on the final build. They include: one Cobalt on Today and in the popover; Esc closes the popover; Open session resolves the card and Undo restores it; the rule chip opens Rules with the preview; Ctrl+3 opens Protection; no "Allow anyway" anywhere; no protection switch in the tray menu; the tripwire count keeps moving; the first-run player reaches "You're protected" and closing it raises the taskbar toast; S-2 adds Allow once; D-2 (a) removes every Pro line. The one fail is the test's fault, not the UI's: its click on a log row landed on the undo toast left over from the step before.
- **Contrast:** every ratio quoted in the tokens and in DESIGN §8 was recomputed from the hex values. One was below 3:1 (the light tray badge's edge, 2.98) and was fixed: `#a86400` now gives 4.03.
- **Not checked:** a screen-reader pass with NVDA or Narrator, the real Windows tray and toast rendering, and a moderated test with the founder (see gaps).

---

## 1. Premium-craft rubric

Any axis below Senior would block hand-off. None is below Senior.

| Axis | Level | Evidence | Left to do |
|---|---|---|---|
| **Copy** | **Senior** | Second person throughout; the four fixed strings appear verbatim and are never shortened; the copy removal test cut six things (DESIGN §7.2); every error names its cause, what's safe and one step; no absolute claim about the agent; "Claude Code" only in plain text | Fit-check on real Windows toasts (font metrics differ slightly from the emulation) |
| **Visuals** | **Senior** (Staff in reach) | Emphasis only on the heartbeat and the one needs-you action; one card, one log row, one checklist reused everywhere; a visual language of its own: the shape avatars with eye-follow, the Quartet tray glyph, the heartbeat strip | Staff needs the strip and avatars to prove themselves in daily use, and a hand-hinted ICO |
| **Color** | **Senior** | One Cobalt per view, smoke-tested; amber only for needs-you and weaker states, red only for not guarded and the tripwire, green only for a proven check; usage in Ink, never red; colour never stands alone | — |
| **Type** | **Senior** | At most four sizes per view (12/13/15/20; 28 only for first-run headlines, 44 only for the tripwire count); two weights; tabular figures on every changing number; mono only for commands, paths and log times | — |
| **Structure** | **Senior** | Three depths (icon, popover, window); 6 sidebar items; spacing by relationship (8 inside a card, 10–12 between cards, 28 between sections); the hierarchy test passes per surface (popover: status → needs you → usage; Today: finding → top card → sessions) | — |
| **States and recovery** | **Senior → Staff** | Matrix for every surface (DESIGN §5.2) with a jump-menu route per drawn cell; worst moments designed first: tripwire "still deleting" before "stopped", canary not blocked, fail-closed with the only temporary off switch, limit reached with no upsell; undo after every triage action; the recovery steps make the stop a trust moment | A few matrix cells are written but not drawn (marked *(spec)* in DESIGN) |
| **Motion and emotion** | **Senior** | Spring physics from the system tokens; three pinned moments (the retro reveal, the canary block with the Done sound, the first heartbeat); every motion has a reduced-motion fallback (DESIGN §6); nothing loops but the Working arc and the live count | Tune the heartbeat ring on a real build; it must feel steady, never anxious |
| **Coherence** | **Senior** | One needs-you card in the popover, Today and the toast's landing; one heartbeat line in four places; one log row (the canary's receipt is the first Protection row); one status vocabulary (agent view's six states + four guard words); one promise string | An hour-long walk with the founder on the prototype |
| **Intelligence** | **Senior** | The suggested-rule chip appears on the card where you're working, after 10+ manual allows; every rule shows its live counter; the forecast states its basis; the retro compares weeks; rules export as plain files | — |

---

## 2. The UX handoff's 14 points

| # | Handoff point | Status | Where |
|---|---|---|---|
| 1 | The heartbeat line is the product: one component, real timestamp, distinct designs for every guard state, never green while unproven | **Done** | `HeartbeatLine`, DESIGN §4.2: 10 states, used in the sidebar, popover, first run and Protection; the seconds move only on real checks (prototype simulates checks at irregular 1.2–3.8 s intervals); plus the strip (§4.3) |
| 2 | The tray icon at 16 px in six states, light and dark taskbars, high contrast, readable without colour, tested in the overflow | **Done, with a gap** | `sheet-tray` / `tray-states-d1440.png`: 6 states × dark, light, 200 %, 400 % detail, high contrast; the overflow flyout is drawn (`data-act="overflow"`). Gap: not tested on a real Windows 11 taskbar; the ICO still needs hand hinting |
| 3 | The popover is a flyout: anchored, light-dismiss, 380 px, sections vanish when empty, at most one Cobalt; decide Acrylic vs solid and say why | **Done** | DESIGN §1.1 (solid, because Acrylic is the glass BRAND rejected) and §4.4; smoke-tested |
| 4 | One needs-you card in compact, full and toast landing; mono command, consequence line, Open session primary; both versions of Allow once | **Done** | `NeedsYouCard`; S-2 toggle in the demo bar shows both versions |
| 5 | The block receipt: toast ≤ 48/200 and its log row; no Allow anyway; Copy command visibly secondary | **Done** | `WinToast` (Blocked) → Why? → `LogRow` expanded (`protection-receipt-d1440.png`); smoke test confirms no "Allow anyway" |
| 6 | The tripwire card: live count until deletes stop, verified "stopped at 14:02:31", restore steps; design "still deleting" first | **Done** | `tripwire-live` (count moves, never says stopped), `tripwire-stopped` (folders, recovery steps) |
| 7 | The retro's four cards and the suggested-rule row with its three disabled variants; count-up reveal, off under reduced motion | **Done, one variant as a warning** | `fr-retro`, `retro`: four cards, the dry-run line, the conflict row disabled, the runner row warned and never pre-ticked. The third variant ("would touch a limit") never appears because limit commands are never suggested; DESIGN §4.9 says so |
| 8 | Meters: reuse §11.16, add freshness, the forecast sentence with one time, tokens-only and API variants; no red | **Done** | `UsageMeter` + `ForecastLine`; `usage`, `usage-tokens`, `usage-api`, `usage-limit`, `pro-usage` |
| 9 | Honest strings are fixed copy; the gap line one click from the promise | **Done** | `COPY` in components.js; DESIGN §7.1 |
| 10 | Windows-native details: native right-click menu, Focus-aware toasts, UAC framed by a sentence, a real Windows 11 tray-pinning illustration, Windows title bar | **Done (emulated)** | `menu`, `sheet-toasts`, `fr-uac` ("Windows is asking for permission. It will name Eucas Labs."), `PinHelper` in `fr-protected`, the `Caption` component. Focus behaviour is specified in DESIGN, not simulated |
| 11 | Dark first, light as an option; check the tray and toasts against both Windows themes separately | **Done** | Separate App and Windows theme switches; `popover-needs-d-oslight1440.png` shows a dark app on a light taskbar; `*-l1440.png` for light |
| 12 | Keyboard: popover by Tab and arrows, Esc closes, Enter acts; Ctrl+1…6; visible focus everywhere | **Done** | DESIGN §8; Esc and Ctrl+3 smoke-tested |
| 13 | Capture real reference screenshots first (agent view, desktop Code tab, Warp, Windows 11 tray flyout) | **Not done** | See gap 1 |
| 14 | Render and look: 1440 × 900 and 1280 × 800 for the main window, the popover at 100 / 125 / 150 % | **Done** | `screens/`: 72 PNGs including `today-d1280`, `protection-d1280`, `usage-d1280`, `popover-125`, `popover-150` |

---

## 3. Render log (what looking at the screenshots changed)

| Round | Found | Fixed |
|---|---|---|
| 1 | Two Cobalt buttons on Today and in the popover · a "Needs you" tag repeating its heading · the popover drawn over the open window (nothing opens by itself) · the sidebar heartbeat wrapping mid-phrase · the Protection strip using a third of its card · session guard words overflowing their column · the retro too tall for the 720 × 560 window | Primary only on the first card · tag cut (screen-reader text kept) · popover states close the window · a `stack` variant · `fill` strip · wider guard column · a compact retro variant for first run |
| 2 | Decisions leaking from one route to the next (Protection said "user level" after visiting the declined-admin edge) · Today saying "3 sessions are guarded" while the guard failed · organisation policy still showing "Verified… Guarded" · a banner repeating the Protection card · "Nothing needs you" twice · the tripwire turning the tray into "guard off" · bright accent buttons on Windows toasts · tokens-only usage still showing plan shares · popover at 150 % clipped at the top · canary "Blocked" glyph empty · first-run proof screens half empty | Route-local decisions · subtitles by guard state · org semantics in the card and rows · banner dropped on Protection, the card holds the action · the empty section removed · tripwire counts as needs-you · neutral toast buttons · "—" with no plan data · height capped to the work area · real glyph · the canary's receipt as a `LogRow`, the first heartbeat with its strip |
| 3 | Tray sheet's 200 % rows drawn at 16 px · Pro's supervisor line offered after a tripwire stop (a worst moment) · the light tray badge edge at 2.98:1 · the expanded receipt below the fold in its screenshot | Sizes forced inline + a 400 % detail row · Pro line only for `stopReason: "user"` · `#a86400` · the route scrolls to the receipt |

---

## 4. Gaps and risks (honest list)

1. **Real reference screenshots not captured** (handoff point 13). Capturing agent view, the desktop Code tab, Warp's notifications and a Windows 11 tray flyout means taking screenshots of the founder's own desktop, which can show private sessions and files. That needs the founder at the machine, so it wasn't done from here. The Windows chrome is built from Microsoft's documented metrics instead. **Next step:** a 15-minute capture session with the founder, then a pass to align the toast and flyout emulation.
2. **The tray icon is a vector approximation.** At 16 px the four shapes plus a badge are tight. The production ICO must be hand-hinted per size and checked in the real taskbar, the overflow flyout and Windows' high-contrast themes.
3. **Toasts and UAC are emulations.** Windows draws both; real metrics, Focus behaviour and Notification Center grouping need a check on the build. The UAC dialog in the prototype is labelled an illustration and must never be reused in marketing.
4. **No screen-reader run.** The accessibility contract (DESIGN §8) comes from the markup and the roles, not from NVDA or Narrator. The build's QA should run both.
5. **First-run window size.** At 720 × 560 the retro step scrolls to reach the rule list. Recommendation: test task 1 (onboarding-flow §4) with the founder; if the rules are missed, grow the window to 760 × 620 for that step only.
6. **Some matrix cells are written but not drawn** (marked *(spec)* in DESIGN §5.2): log empty, canary running, settings file locked, usage before a first session, status line not reporting, and "Answered in bench".
7. **The PR #52 effects are rebuilt in CSS** (eye-follow, the Working orb) to keep the file self-contained. The build can use the `thinking-orbs` package directly.
8. **Quit confirmation uses the browser's `alert()`** in the prototype; the app uses a Windows dialog with the same sentence.
9. **Popover scaling is emulated with CSS `zoom`.** Real 125 % and 150 % rendering comes from Electron's DPI handling.
10. **A web guideline deliberately not followed:** the fetched Web Interface Guidelines ask for Title Case headings; BRAND's sentence case wins.
