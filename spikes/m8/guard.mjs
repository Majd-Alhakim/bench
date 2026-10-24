// M8 spike: a folder jail plus command allow-patterns, enforced in canUseTool. Every decision is traced.
import { realpathSync, existsSync } from "node:fs";
import path from "node:path";

const FILE_TOOLS = { Read: "file_path", Write: "file_path", Edit: "file_path", Glob: "path", Grep: "path" };
const SHELL_TOOLS = new Set(["Bash", "PowerShell"]);
// Chaining, redirection, substitution and variable expansion can smuggle a second command or a hidden path.
const SHELL_META = /[;&|`<>]|\$\(|\$\{|\$[A-Za-z_]|%[A-Za-z_]+%/;

const norm = (p) => (process.platform === "win32" ? p.toLowerCase() : p);

/** Resolve like the OS will: follow symlinks and junctions of the deepest existing ancestor. */
function realResolve(p, base) {
  let abs = path.resolve(base, p);
  const rest = [];
  while (!existsSync(abs)) {
    const parent = path.dirname(abs);
    if (parent === abs) break;
    rest.unshift(path.basename(abs));
    abs = parent;
  }
  return path.join(realpathSync.native(abs), ...rest);
}

export function createGuard({ jail, allow = [], trace = () => {} }) {
  const root = realpathSync.native(jail);
  const inside = (p) => {
    const r = norm(realResolve(p, root));
    return r === norm(root) || r.startsWith(norm(root) + path.sep);
  };
  const decide = (tool, input, behavior, reason) => {
    trace({ tool, input, behavior, reason });
    return behavior === "allow" ? { behavior, updatedInput: input } : { behavior, message: `Blocked by the folder jail: ${reason}` };
  };

  return async function canUseTool(tool, input) {
    if (tool in FILE_TOOLS) {
      const p = input[FILE_TOOLS[tool]] ?? ".";
      return inside(p) ? decide(tool, input, "allow", "inside jail") : decide(tool, input, "deny", `path outside the agent's folder: ${p}`);
    }
    if (SHELL_TOOLS.has(tool)) {
      const cmd = String(input.command ?? "").trim();
      if (SHELL_META.test(cmd)) return decide(tool, input, "deny", "chaining, redirection or variables are not allowed");
      if (!allow.some((re) => re.test(cmd))) return decide(tool, input, "deny", `command not in the allow-list: ${cmd.split(/\s+/)[0]}`);
      const tokens = cmd.split(/\s+/).slice(1).map((t) => t.replace(/^["']|["']$/g, ""));
      const bad = tokens.find((t) => /[\\/]|^\.|^~|^[A-Za-z]:/.test(t) && !t.startsWith("-") && !inside(t.replace(/^~/, "/nonexistent-home")));
      return bad ? decide(tool, input, "deny", `argument points outside the agent's folder: ${bad}`) : decide(tool, input, "allow", "allow-listed, args inside jail");
    }
    return decide(tool, input, "deny", `tool not granted: ${tool}`);
  };
}
