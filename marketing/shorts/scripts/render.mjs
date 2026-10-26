// Renders every video in every format to out/<id>-<format>.mp4 (H.264, no audio track).
//   node scripts/render.mjs [V1-v V2-h ...]
import { execFileSync } from "node:child_process";
const ids = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["V1", "V2", "V3", "V4", "V5", "V6"].flatMap((v) => ["v", "h", "s"].map((f) => `${v}-${f}`));
for (const id of ids) {
  console.log(id);
  execFileSync("npx", ["remotion", "render", id, `out/${id}.mp4`, "--codec=h264", "--crf=20", "--muted", "--log=error"], { stdio: "inherit", shell: true });
}
