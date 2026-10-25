/* Local dictation (engines in whisper-worker.js). Taps the live mic stream, keeps the current take as 16 kHz PCM, and
   re-transcribes it back to back while you talk (about a second a pass in English), so the words grow in the box as
   you say them. A take is settled at short pauses so each pass stays small. */
const RATE = 16000;
const PAUSE_CUT_S = 3;
const SEGMENT_S = 15;
const GAP_MS = 120; // breathing room between passes
const SILENCE_RMS = 0.008; // below this a take is silence; Whisper would invent "Thank you." for it

let worker = null;
const pending = new Map();
let seq = 0;
let onStatus = () => {};

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL("whisper-worker.js", document.baseURI), { type: "module" });
  worker.onmessage = ({ data }) => {
    if (data.type === "ready") onStatus(data);
    else if (data.type === "text" || data.type === "error") {
      const p = pending.get(data.id);
      if (p) { pending.delete(data.id); data.type === "text" ? p.resolve(data.text) : p.reject(new Error(data.message)); }
      else if (data.type === "error") onStatus(data);
    }
  };
  worker.postMessage({ type: "load" });
  return worker;
}
function transcribe(audio) {
  const id = ++seq;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ type: "transcribe", id, audio }, [audio.buffer]);
  });
}

/** Status of the model: {type:"ready", device} once it can transcribe, {type:"error", message} if it can't. */
export function onWhisperStatus(fn) { onStatus = fn; }
export function preloadWhisper() { getWorker(); }

// Collects mic frames off the audio thread.
const TAP = `registerProcessor("tap",class extends AudioWorkletProcessor{process(i){const c=i[0]&&i[0][0];if(c)this.port.postMessage(c.slice(0));return true}})`;
let tapUrl = null;

const concat = parts => {
  const out = new Float32Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
};
const rms = a => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * a[i]; return Math.sqrt(s / (a.length || 1)); };
const clean = t => t.replace(/\[[^\]]*\]|\([^)]*\)/g, "").replace(/\s+/g, " ").trim(); // drops [BLANK_AUDIO], (music) …

function downsample(input, from) {
  if (from === RATE) return input;
  const ratio = from / RATE, out = new Float32Array(Math.floor(input.length / ratio));
  for (let i = 0; i < out.length; i++) {
    const a = Math.floor(i * ratio), b = Math.min(input.length, Math.floor((i + 1) * ratio));
    let s = 0;
    for (let j = a; j < b; j++) s += input[j];
    out[i] = s / Math.max(1, b - a);
  }
  return out;
}

/** Starts dictating `stream` into `textarea`. Returns stop(), which resolves once the last words are written. */
export async function startDictation(stream, textarea) {
  getWorker();
  const ctx = new AudioContext();
  tapUrl ||= URL.createObjectURL(new Blob([TAP], { type: "text/javascript" }));
  await ctx.audioWorklet.addModule(tapUrl);
  const src = ctx.createMediaStreamSource(stream);
  const node = new AudioWorkletNode(ctx, "tap");
  src.connect(node);

  const base = textarea.value && !/\s$/.test(textarea.value) ? textarea.value + " " : textarea.value;
  let committed = "", live = "", parts = [], busy = false, stopped = false, dropped = false;
  const write = () => {
    if (dropped) return;
    textarea.value = base + [committed, live].filter(Boolean).join(" ");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  };
  node.port.onmessage = ({ data }) => { if (!stopped) parts.push(downsample(data, ctx.sampleRate)); };

  async function pass(final) {
    if (busy && !final) return;
    const audio = concat(parts);
    if (audio.length < RATE * 0.4 || rms(audio) < SILENCE_RMS) { if (final) { live = ""; write(); } return; }
    // Settle a segment at the first pause after PAUSE_CUT_S (or hard at SEGMENT_S), so live passes stay short.
    const pause = audio.length >= RATE * PAUSE_CUT_S && rms(audio.subarray(audio.length - RATE * 0.4)) < SILENCE_RMS * 1.5;
    const cut = final || pause || audio.length >= RATE * SEGMENT_S;
    if (cut) parts = [];
    busy = true;
    try {
      let text = clean(await transcribe(audio));
      // A word cut off mid-take can stutter ("bug bug bug"); the next pass fixes it, so only the live text is tidied.
      if (!cut) text = text.replace(/\b(\S+)(?:\s+\1\b){2,}/gi, "$1");
      if (cut) { committed = [committed, text].filter(Boolean).join(" "); live = ""; } else if (!stopped) live = text;
      write();
    } catch (e) { console.warn("[dictation] pass failed; the next one retries:", e); }
    busy = false;
  }
  (async () => {
    while (!stopped) {
      await pass(false);
      await new Promise(r => setTimeout(r, GAP_MS));
    }
  })();

  /* stop(true) writes the last words; stop(false) drops them (the message was just sent and the box cleared). */
  return async function stop(flush = true) {
    stopped = true;
    if (!flush) dropped = true;
    src.disconnect();
    node.port.onmessage = null;
    ctx.close();
    while (busy) await new Promise(r => setTimeout(r, 50));
    if (flush) await pass(true);
  };
}
