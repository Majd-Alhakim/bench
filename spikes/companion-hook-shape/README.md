# companion-hook-shape (throwaway proof, 2026-10-26)

**Why this exists under `spikes/`:** the companion architecture ([docs/architecture/companion/](../../docs/architecture/companion/)) rests on one config shape: a user-scope plugin whose hooks call a native guard in **exec form** (`command` + `args`, no shell) with `onFailure: "block"` and a short `timeout`. Before writing the whole design around it, this checks that the shape parses with the real CLI. It is not product code and runs nothing.

**What it is:** `fixture-plugin/` is a plugin manifest, `hooks/hooks.json` for every event the companion uses, and a plugin `settings.json` carrying a `statusLine` (open question F31: can a plugin ship the main status line?).

**Command:** `claude plugin validate --strict fixture-plugin` on Claude Code **2.1.303** (the version installed on the founder's PC).

| Check | Result |
|---|---|
| Exec form with `args` and `${CLAUDE_PLUGIN_ROOT}` in `command`, `timeout` on every event, `onFailure: "block"` on PreToolUse and PermissionRequest only (observational hooks such as ConfigChange must not fail closed, or a broken guard could stop you disabling the plugin), a `matcher` regex on PostToolUse | ✅ Passes `--strict` with no warnings |
| The same hooks in **shell form** (`"${CLAUDE_PLUGIN_ROOT}/bin/eucas-guard.exe stop"`) | ⚠️ Warns on every entry: an unquoted placeholder splits on a space in the path. Exec form is the only form the design uses |
| An unknown field on a hook (`bogusField`) and `onFailure` on `Stop` (documented as having no effect) | ⚠️ **Not flagged**, even with `--strict`. The validator doesn't check hook fields, so CI needs our own JSON Schema for `hooks.json` plus a live contract test (see TESTING.md §3) |
| A `statusLine` in the plugin's `settings.json` | Not reported either way. The validator doesn't read it, so F31 stays open: **spike SP-H1 tests it live** |

**Not proven here:** that the hooks fire, that `onFailure: "block"` blocks on Windows with and without Git Bash, latency, or the file-watcher pickup. Those are spike SP-H1 in [BUILD-PLAN.md](../../docs/architecture/companion/BUILD-PLAN.md).
