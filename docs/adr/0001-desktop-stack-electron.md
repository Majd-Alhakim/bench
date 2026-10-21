# ADR-0001: Electron + Claude Agent SDK for the desktop app

- **Status:** Proposed (needs founder sign-off)
- **Date:** 2026-10-21

## Context
We need a native Windows app (not a web app) that runs many agents locally, with tools, MCP, permissions and compaction. The Claude Agent SDK provides all of this and is the engine behind Claude Code. Its first-class SDK is TypeScript/Node.

## Options
1. **Electron + Agent SDK in the main process.** One language, no sidecar, mature on Windows. Cost: about 150 MB installer, higher RAM.
2. **Tauri 2 (Rust) + Node sidecar for the SDK.** Small binary. Cost: two runtimes, sidecar packaging, Rust isn't installed on this machine, and slower iteration.
3. **Wrap the `claude` CLI headless (`claude -p --output-format stream-json`).** Quickest spike. Cost: process-per-agent overhead and less control over the in-process MCP.

## Decision
Option 1 for the MVP. We keep the orchestrator in `packages/core` (pure TS, UI-agnostic), so moving to Tauri later only means replacing the shell.
Option 3 stays the **fallback** if SDK subscription auth turns out to be restricted (see ADR-0002).

## Consequences
Faster delivery. We accept the bundle size. We have to keep Electron security hardening strict (see ARCHITECTURE §5).
