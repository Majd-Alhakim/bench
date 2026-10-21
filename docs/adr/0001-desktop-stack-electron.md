# ADR-0001: Electron + Claude Agent SDK for a cross-platform desktop app

- **Status:** Proposed (recommended). Waiting for founder confirmation.
- **Date:** 2026-10-21 (revised the same day for the cross-platform requirement)

## Context
We need a native desktop app (not a web app) that runs many agents locally, with tools, MCP, permissions and compaction.
**Requirement (founder, 2026-10-21):** Windows first, but it must also run on **macOS and Linux** later without a rewrite.
The Claude Agent SDK, the engine behind Claude Code, has a first-class TypeScript/Node SDK, and Claude Code itself runs on all three OSes.

## Options
| | Win / macOS / Linux | Runs the Agent SDK natively | Install size | Notes |
|---|---|---|---|---|
| **1. Electron** | ✅ / ✅ / ✅ (VS Code, Slack, Discord, Claude Desktop) | ✅ in the main process | ~150 MB | One language; most mature cross-platform packaging and auto-update |
| 2. Tauri 2 | ✅ / ✅ / ✅ | ❌ needs a Node sidecar | ~10 MB + sidecar | Each OS uses a different webview (WebView2 / WebKit / WebKitGTK), so the UI renders differently per OS. Needs Rust |
| 3. Headless `claude` CLI wrapper | ✅ / ✅ / ✅ | via subprocess | — | Fallback only |

## Decision
**Option 1, Electron.** It's cross-platform by default: the same code ships as an `.exe` (NSIS), `.dmg` and `.AppImage`/`.deb` from one codebase using electron-builder. Chromium is bundled, so the UI looks the same on every OS.

### Rules that keep it portable
1. **No OS-specific code outside `apps/desktop/src/main/platform/`.** Everything else uses Node `path`, `os` and Electron APIs.
2. **Secrets:** Electron `safeStorage`, which maps to DPAPI on Windows, Keychain on macOS and libsecret on Linux. No `keytar`, which is archived and native.
3. **Data location:** `app.getPath('userData')` for the DB; the workspace folder is user-chosen. Never hard-code `C:\` or `\`.
4. **Native modules:** keep them to a minimum (`better-sqlite3` only), rebuilt per OS in CI. If `node:sqlite` is stable in the Electron Node version we use, prefer it and drop the native module.
5. **Shell tools:** agents' Bash tool runs through the Agent SDK, which already handles each OS. Anything we add ourselves goes through a `platform` adapter.
6. **CI matrix from Sprint 1:** GitHub Actions on `windows-latest`, `macos-latest` and `ubuntu-latest`: lint, test and build on all three. We'll *notice* an OS break on the day it happens, not months later.
7. **Packaging:** Windows ships at v0.1. macOS (needs an Apple Developer ID for signing and notarization, $99/yr) and Linux (AppImage, no signing needed) follow once dogfooding on Windows is stable.

`packages/core` stays UI-agnostic, so a Tauri shell could still replace Electron later if install size ever matters.

## Consequences
Fastest path, one codebase, three OSes. We accept the bundle size and RAM use. macOS distribution costs an Apple developer account when we get there.
