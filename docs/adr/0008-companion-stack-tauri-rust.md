# ADR-0008: Companion stack: Tauri 2 shell, Rust core and guard, React renderer

- **Status:** Proposed (2026-10-26). **Amends ADR-0001 for the companion only** (the team app keeps Electron + the Agent SDK). **Extends ADR-0003**: its TypeScript, pnpm, ESLint, Vitest, Playwright, lefthook and changesets rules stay; Rust tooling is added.
- **Date:** 2026-10-26

## Context
ADR-0001 chose Electron because the team app runs the Agent SDK in the main process. The companion runs **no agents**: it watches sessions the user runs, through a hook binary and local files (ADR-0007). What it needs instead:
- a **native guard executable** that Claude Code starts on every tool call (thousands a day), so it must start in milliseconds and be small, signed and boring to antivirus;
- **one rules engine** shared by that guard and the app's dry runs, suggestions and retro (two implementations of a safety rule will drift);
- Windows APIs: tray, toasts with buttons, named pipes, `ReadDirectoryChangesW`, the process tree for the tripwire, parent-PID lookup, UAC elevation, the per-user installer;
- an app that sits in the tray all day, so idle CPU and RAM are product features ("relief over wow").

## Options
Numbers are typical public figures for empty or small apps, **to be measured in spike SP-ST1** on the founder's PC before Gate 6; the decision does not hinge on any single one.

| | A. Electron + TS main + Rust guard | **B. Tauri 2 + Rust core + Rust guard** | C. Native (WinUI 3 / C#) + Rust guard |
|---|---|---|---|
| Installer | ~80–100 MB | **~5–15 MB** (WebView2 is part of Windows 11) | ~10–40 MB |
| Idle, window hidden | ~60–120 MB RAM, 2–3 processes | **~15–40 MB**, 1 process (the webview can be destroyed when hidden) | ~20–40 MB |
| Rules engine shared with the guard | Duplicate in TS or ship WASM to Node | **Same crate, linked twice** | Duplicate in C# or FFI |
| Windows APIs we need | Mostly native addons or spawning PowerShell (slow, AV-flaggy) | `windows` crate directly; tray, notifications, updater, single-instance, deep-link as official plugins | Best (first party) |
| Toasts with buttons | `toastXml` on Windows | Notification plugin; actions and background activation need **SP-ST1** | Best |
| Auto-update + signing | electron-updater (mature) | Tauri updater (Ed25519-signed manifests) + `signCommand` for Authenticode | MSIX/Velopack; own work |
| macOS / Linux later | Same everywhere (bundled Chromium) | WebKit / WebKitGTK render differently; the companion's UI is small, so acceptable | Rewrite |
| Solo velocity with Claude | Highest for UI; Windows plumbing is the slow part | High for UI (same React); Rust core is fast to write with Claude, slower to compile | Low (two UI stacks across products) |
| Reuse with the team app | `packages/shared` directly | UI tokens, components and zod contracts are reusable; core logic isn't | None |

## Decision
**B. Tauri 2 with a Rust core, the same Rust workspace building the guard, and the React renderer from ADR-0003.**

Why, in order:
1. **The guard has to be a native exe anyway** (start-up per tool call; it must work with the app closed). With Rust already in the product, Tauri makes it **one native language** for every safety-critical path (guard, rules, tripwire, heartbeat), instead of three runtimes (Node, Rust, Chromium).
2. **One rules engine.** `eucas-rules` is a crate linked into the guard and the app, so a dry run in the Rules screen is exactly what the guard will decide. No WASM boundary, no TS port.
3. **Footprint fits a tray tool**: an order of magnitude smaller download and idle RAM, which the pre-mortem flagged ("companion is a 150 MB app").
4. **The Windows plumbing is first-class in Rust**: named pipes, process trees, file notifications and elevation need native code in Electron too.

What stays from ADR-0003: pnpm workspace, strict TS flags, ESLint 9 flat config with `no-restricted-imports`, Prettier, Vitest, Playwright, lefthook, changesets, SHA-pinned Actions. Added: a Cargo workspace with `rust-toolchain.toml` pinned, `cargo fmt`, `cargo clippy -D warnings`, `cargo nextest`, `cargo deny` (licences, advisories, bans), `cargo auditable` builds.

**Contracts across the language line:** JSON Schema files in `contracts/` are the single source of truth. Rust types are generated with `typify` at build time; TS types and zod schemas are generated from the same files. A contract test round-trips every fixture through both.

## Consequences
- The renderer can't use Node; that is already the rule (sandboxed renderer, ADR-0001). It talks to Rust through Tauri commands and events only, with a capability file that allow-lists each one.
- Playwright drives the WebView2 renderer over CDP on Windows (`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port`); Linux CI uses `tauri-driver` (WebDriver) for a smaller smoke set. Spike SP-ST1 proves both.
- If SP-ST1 shows toasts with buttons and background activation can't be made reliable from Tauri, the fallback is a small Rust module calling the WinRT `ToastNotificationManager` directly (`windows` crate), not a stack change.
- The team app (Electron) and the companion share `contracts/`, `packages/ui-tokens` and the copy module, nothing else. If the team app returns, it can embed the companion's core as a sidecar.
- **Kill criterion for this ADR:** if SP-ST1 finds that the Tauri build on Windows can't meet the toast, tray or updater needs in 2 days of work, fall back to option A with the same Rust guard and rules crate (exposed to Node through napi-rs). The design keeps that door open: the core never depends on Tauri types outside `crates/eucas-app`.
