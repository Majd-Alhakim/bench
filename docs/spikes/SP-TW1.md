# Spike SP-TW1: the mass-delete tripwire on Windows

**Date:** 2026-10-26 · **Branch:** `spike/SP-TW1` · **Code:** [`spikes/SP-TW1/`](../../spikes/SP-TW1/) (throwaway): `tripwire/` (Rust), `session-sim.mjs` (a stand-in session), `run.mjs` (one trial)
**Setup:** Windows 11 Home, NTFS SSD, Defender on. Every file created and deleted lived under `%TEMP%\eucas-spikes\tw1\run-*`; both the session stand-ins and the cleanup refuse any other path. Each trial runs three "sessions" (long-lived processes whose tool calls are child shells), one folder each:
- **A** mass-deletes 50,000 files.
- **B** is idle.
- **C** deletes 100 files slowly (below the threshold).

Threshold: **1,000 deletions within 10 s** per session folder.

**Verdict: GO.** Every bar is met with a wide margin. One gap found and fixed in the spike (orphaned deleters); the design needs the fix.

## Results against the GO bar

| GO bar | Result |
|---|---|
| Stop ≤ 1 s after the threshold | ✅ The kill is issued **16–49 ms** after the threshold delete is seen: 8 tripping trials across `cmd rmdir /s /q`, Git Bash `rm -rf` and an orphaned deleter, with 64 KB, 4 KB and 1 MB buffers and with a deliberately slow reader. |
| Tree gone ≤ 3 s | ✅ **16–25 ms** until every process in the tree has exited (`WaitForSingleObject`). |
| No missed overflow | ✅ On overflow (`ReadDirectoryChangesW` returns 0 bytes) the watcher **recounts each session folder** and charges the difference. With the reader stalled 50 ms and 200 ms per read on a 4 KB buffer: **96 and 29 real overflows, and the count was still exactly 50,000 of 50,000.** Without overflow: 50,000 of 50,000. |
| Path attribution with 3 sessions | ✅ Only A ever tripped (0 wrong trips in 14 trials). B and C kept every file and stayed alive; C's 100 slow deletes never tripped. |
| Delete continuing after the kill | Found and fixed. **Before the fix:** with a deleter started through `Start-Process` (its parent exits at once, so it's outside the live tree), the session tree was killed in 20 ms but **24,752 more files were deleted** over the next 8 s. **Fix:** a 200 ms process poll remembers every parent link, so an orphan whose parent already exited still traces back to the session. Also a second kill if deletes are still landing 300 ms after the first. **After the fix:** 4 processes killed, **81** in-flight deletes after the kill, 48,919 of 50,000 files saved. |

## Numbers

| Deleter | Buffer | Deletes counted when it tripped | Kill after threshold | Tree gone | Deletes after the kill | Files saved |
|---|---|---|---|---|---|---|
| `cmd rmdir /s /q` | 64 KB | 1,000 | 25 ms | 25 ms | 54 | 48,946 |
| `cmd rmdir /s /q` | 4 KB | 1,000 | 25 ms | 25 ms | 53 | 48,947 |
| `cmd rmdir /s /q` | 1 MB | 1,000 | 16 ms | 16 ms | 67 | 48,933 |
| Git Bash `rm -rf` (3 trials) | 64 KB | 1,000 | 16–21 ms | 16–21 ms | 60–85 | 48,915–48,940 |
| orphan via `Start-Process` (after the fix) | 64 KB | 1,000 | 18 ms | 18 ms | 81 | 48,919 |
| `rmdir`, reader stalled 200 ms (3 trials) | 4 KB | **1,282–1,409** (overshoot) | 37–49 ms | 16–25 ms | 59–83 | 48,529–48,635 |

"Deletes after the kill" are deletions already in flight, all in the same millisecond window as the kill.

## Findings for the design (T-1)
1. **Keep a parent-link registry** (pid → parent, keyed by pid + creation time to survive PID reuse) fed by a 200 ms process poll, and kill the remembered tree, not just the live one. A deleter whose intermediate parent lived less than about 200 ms can still escape; for those, the "still deleting after the kill" signal is what lets the card say so. ETW (v0.2) closes it fully.
2. **Overflow = recount**, never "assume fine": a slow app (GC pause, busy UI thread) overflows a 4 KB buffer at about 1,000 deletes a second. Use a 64 KB buffer on a dedicated thread, and keep the recount fallback anyway.
3. With overflows, the trip lands a few hundred deletes late (1,282–1,409 instead of 1,000). The card should report the measured count, not the threshold.
4. One folder per session is the easy case. Shared folders (two sessions in one repo) weren't tested here; SYSTEM-DESIGN's rule stands (stop every session in that folder that has a tool call in flight).
5. The watcher costs nothing at idle (it blocks in the kernel). The registry poll is one process snapshot every 200 ms.

## Reproduce
```bash
cd spikes/SP-TW1/tripwire && cargo build --release
cd .. && node run.mjs rmdir 64 50000                  # mode, buffer KB, files, [threshold]
node run.mjs orphan 64 50000
TW_SLOW_MS=200 node run.mjs rmdir 4 50000             # forces real overflows while tripping
TW_TOTAL_EVERY=1 TW_SLOW_MS=50 node run.mjs rmdir 4 50000 999999   # count-only: counted vs actual
```
