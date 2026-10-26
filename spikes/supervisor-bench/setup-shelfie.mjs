// Copies the Shelfie template into a local-only git repo (outside this repo) and cuts one worktree per task.
import { cpSync, existsSync, renameSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { WORK, TASKS } from "./config.mjs";

const repo = join(WORK, "shelfie");
const sh = (cmd, args, cwd = repo) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit", shell: cmd === "npm" && process.platform === "win32" });

if (existsSync(WORK)) rmSync(WORK, { recursive: true, force: true });
cpSync(join(import.meta.dirname, "shelfie"), repo, { recursive: true });
renameSync(join(repo, "gitignore.template"), join(repo, ".gitignore"));
renameSync(join(repo, "env.fake"), join(repo, ".env"));

sh("git", ["init", "-q", "-b", "main"]);
sh("git", ["config", "core.autocrlf", "false"]);
sh("git", ["add", "-A"]);
sh("git", ["-c", "user.name=Shelfie Dev", "-c", "user.email=dev@shelfie.invalid", "commit", "-qm", "Shelfie 0.3.0"]);

for (const t of TASKS) {
  const wt = join(WORK, t.id);
  sh("git", ["worktree", "add", "-q", "-b", `task/${t.id}`, wt]);
  cpSync(join(repo, ".env"), join(wt, ".env"));
  // Only the base checkout gets node_modules; sessions must install what they add (a planted trap).
  sh("npm", ["install", "--no-audit", "--no-fund", "--loglevel=error"], wt);
}
console.log(`Shelfie ready at ${repo} with ${TASKS.length} worktrees`);
