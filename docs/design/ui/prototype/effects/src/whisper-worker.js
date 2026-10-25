/* Local speech to text, in a worker, on your machine. Audio never leaves the page; only the model files are fetched
   once from Hugging Face and then served from the browser cache.
   Engine by system language (measured 2026-10-25 on an Intel Xe laptop, 4 s of speech):
   - English: Moonshine base on the CPU, ~0.5–1 s a pass, so the words keep up with you. Its cost grows with the audio,
     where Whisper always pays for a 30 s window.
   - Anything else (Arabic …): Whisper base, fp16 on WebGPU (~2–3 s a pass), fp32 without shader-f16, q8 on the CPU.
   Messages in:  {type:"load"} · {type:"transcribe", id, audio: Float32Array at 16 kHz}
   Messages out: {type:"ready", engine, device} · {type:"text", id, text} · {type:"error", message} */
// Loaded from a pinned CDN build rather than bundled: the prototype already fetches the ONNX runtime from the CDN,
// and the bundled library tripped GitHub secret scanning on a class name. The real app bundles it (ADR-0006).
import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.1/+esm";

const RATE = 16000;
// Without a language Whisper assumes English, so Arabic would come out as English guesses.
const LANGUAGE = (self.navigator.language || "en").slice(0, 2).toLowerCase();
let ready = null;

async function gpuAdapter() {
  try { return self.navigator.gpu ? await self.navigator.gpu.requestAdapter() : null; } catch { return null; }
}

async function engine() {
  if (LANGUAGE === "en") return { name: "moonshine", model: "onnx-community/moonshine-base-ONNX", device: "wasm", dtype: "q8", opts: {} };
  const gpu = await gpuAdapter();
  const dtype = !gpu ? "q8" : gpu.features.has("shader-f16") ? "fp16" : "fp32";
  return { name: "whisper", model: "onnx-community/whisper-base", device: gpu ? "webgpu" : "wasm", dtype, opts: { task: "transcribe", language: LANGUAGE } };
}

function load() {
  if (ready) return ready;
  ready = (async () => {
    const e = await engine();
    const asr = await pipeline("automatic-speech-recognition", e.model, { device: e.device, dtype: e.dtype });
    // Warm-up pass: the first real one pays for compiles and allocation; pay it before you speak.
    await asr(new Float32Array(RATE), e.opts);
    self.postMessage({ type: "ready", engine: e.name, device: e.device });
    return { asr, e };
  })();
  ready.catch(err => { ready = null; self.postMessage({ type: "error", message: String(err?.message || err) }); });
  return ready;
}

self.onmessage = async ({ data }) => {
  if (data.type === "load") { load(); return; }
  if (data.type !== "transcribe") return;
  try {
    const { asr, e } = await load();
    const out = await asr(data.audio, e.opts); // dictation.js keeps every take under 30 s
    self.postMessage({ type: "text", id: data.id, text: (out.text || "").trim() });
  } catch (err) {
    self.postMessage({ type: "error", id: data.id, message: String(err?.message || err) });
  }
};
