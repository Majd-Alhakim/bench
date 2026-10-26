// Stand-in for one Claude Code session: a long-lived process whose tool calls run as child shells.
// Modes: rmdir (cmd rmdir /s /q), rmrf (Git Bash rm -rf), orphan (the delete runs in a process whose parent exits at
// once, so it is outside the session's tree), slow (100 deletes, 50 ms apart), idle.
import { spawn } from "node:child_process";
import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const [, , dir, mode] = process.argv;
const SAFE = join(tmpdir(), "eucas-spikes", "tw1");
if (!dir || !dir.startsWith(SAFE + "\\") || dir.length < SAFE.length + 5) throw new Error(`refusing ${dir}`);

setTimeout(() => {
  if (mode === "rmdir") spawn("cmd.exe", ["/c", "rmdir", "/s", "/q", dir], { stdio: "ignore" });
  if (mode === "rmrf") spawn("C:/Program Files/Git/bin/bash.exe", ["-c", `rm -rf '${dir.replaceAll("\\", "/")}'`], { stdio: "ignore" });
  if (mode === "orphan")
    spawn("powershell.exe", ["-NoProfile", "-Command", `Start-Process cmd.exe -ArgumentList '/c','rmdir','/s','/q','"${dir}"' -WindowStyle Hidden`], { stdio: "ignore" });
  if (mode === "slow") {
    const files = readdirSync(join(dir, "d0")).slice(0, 100);
    let i = 0;
    const t = setInterval(() => (i < files.length ? rmSync(join(dir, "d0", files[i++])) : clearInterval(t)), 50);
  }
}, 2000);
setInterval(() => {}, 1 << 30);
