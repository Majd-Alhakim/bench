/* Prototype effects: React islands mounted into the vanilla prototype.
   - Thinking orb (thinking-orbs) replaces every "Thinking" dot row.
   - Voice (voice-glow) wraps every composer: a mic button, dictation, and a glow that follows your voice
     and sweeps as a beam while the agent is thinking.
   - Gooey (liquid-gooey) turns the composer's + into a liquid fan of round buttons.
   The prototype renders with innerHTML, so one MutationObserver finds new hosts and unmounts dead ones. */
import { createRoot } from "react-dom/client";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ThinkingOrb } from "thinking-orbs";
import { Liquid } from "liquid-gooey";
import { VoiceBeam, useMicrophone } from "voice-glow";
import { onWhisperStatus, preloadWhisper, startDictation } from "./dictation.js";

const html = document.documentElement;
const isReduced = () => html.classList.contains("rm") || matchMedia("(prefers-reduced-motion: reduce)").matches;
const themeNow = () => (html.getAttribute("data-theme") === "light" ? "light" : "dark");
const icon = (name, size) => (typeof window.ic === "function" ? window.ic(name, size) : "");
const say = msg => typeof window.toast === "function" && window.toast(msg, { icon: "info" });
const sound = key => typeof window.sfx === "function" && window.sfx(key); // the prototype's sounds: follow its Sound switch

/* ---------- tiny stores ---------- */
function store(init) {
  let v = init;
  const subs = new Set();
  return {
    get: () => v,
    set(patch) {
      const next = { ...v, ...patch };
      if (Object.keys(next).every(k => next[k] === v[k])) return;
      v = next;
      subs.forEach(f => f());
    },
    sub: f => (subs.add(f), () => subs.delete(f)),
  };
}
const UI = store({ theme: themeNow(), reduced: isReduced() });
const MIC = store({ state: "idle", stream: null, form: null });
const BUSY = store({ forms: new Set() });
const useStore = s => useSyncExternalStore(s.sub, s.get);

/* ---------- islands ---------- */
const islands = new Set();
function mount(host, node) {
  const r = createRoot(host);
  r.render(node);
  islands.add({ host, r });
}
function sweep() {
  for (const i of islands) if (!i.host.isConnected) { i.r.unmount(); islands.delete(i); }
  const f = MIC.get().form;
  if (f && !f.isConnected) micStop();
}

/* ---------- thinking orb ---------- */
const ORB_STATES = [
  [/draft|writ/, "composing"],
  [/read|search|look/, "searching"],
  [/longer than usual/, "breathing"],
  [/test|fix|debug/, "solving"],
];
const orbState = text => (ORB_STATES.find(([re]) => re.test(text)) || [, "working"])[1];
/* The orb takes #rgb or rgb() only; the agent ink can be any CSS colour, so let a 1px canvas resolve it. */
function inkOf(el) {
  const cs = getComputedStyle(el);
  const c = cs.getPropertyValue("--agent-ink").trim() || cs.color;
  const x = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  x.fillStyle = c;
  x.fillRect(0, 0, 1, 1);
  const [r, g, b] = x.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}
function Orb({ host, state }) {
  const { theme, reduced } = useStore(UI);
  const color = useMemo(() => inkOf(host), [host, theme]);
  return <ThinkingOrb state={state} size={20} theme={theme} color={color} paused={reduced} />;
}
function enhanceDots(span) {
  span.dataset.efx = "orb";
  const state = orbState((span.parentElement?.textContent || "").toLowerCase());
  span.textContent = "";
  span.classList.add("efx-orb");
  mount(span, <Orb host={span} state={state} />);
}

/* ---------- microphone + dictation ---------- */
let micApi = null;
function MicHost() {
  const mic = useMicrophone();
  micApi = mic;
  useEffect(() => {
    MIC.set({ state: mic.state, stream: mic.stream });
    if (mic.state === "denied") say("Microphone blocked. Allow it in the browser's site settings to talk.");
    if (mic.state === "unsupported") say("This browser has no microphone access here (it needs https or localhost).");
  }, [mic.state, mic.stream]);
  return null;
}
/* Dictation runs on local speech models (dictation.js, whisper-worker.js). While the model loads, the mic button wears a turning ring;
   only a failure gets a notice. */
let dict = null; // {form, stop: Promise<stop()>}
const MODEL = { loading: false, ready: false };
onWhisperStatus(s => {
  if (s.type === "ready") { MODEL.ready = true; MODEL.loading = false; paintMics(); }
  else if (s.type === "error") { MODEL.loading = false; paintMics(); say("Speech to text couldn't start here. The glow still follows your voice."); }
});
function dictate(form, stream) {
  const ta = form.querySelector("textarea");
  if (!ta || dict) return;
  dict = { form, stop: startDictation(stream, ta).catch(() => null) };
}
async function endDictation(flush = true) {
  if (!dict) return;
  const d = dict;
  dict = null;
  const stop = await d.stop;
  if (stop) await stop(flush);
}
// The stream arrives a moment after start(); begin dictating once it does.
MIC.sub(() => {
  const { state, stream, form } = MIC.get();
  if (state === "live" && stream && form && !dict) dictate(form, stream);
});
function warmWhisper() {
  if (MODEL.ready) return;
  const go = () => preloadWhisper();
  window.requestIdleCallback ? requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 300);
}
function micStart(form) {
  if (!micApi) return;
  preloadWhisper();
  if (!MODEL.ready) MODEL.loading = true;
  sound("recStart");
  if (dict && dict.form !== form) endDictation();
  MIC.set({ form });
  if (MIC.get().state !== "live") micApi.start();
  else if (MIC.get().stream && !dict) dictate(form, MIC.get().stream);
}
function micStop(flush = true) {
  if (MIC.get().form) sound("recStop");
  endDictation(flush);
  MIC.set({ form: null });
  if (micApi && MIC.get().state === "live") micApi.stop();
}
const micIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>';
const stopIcon = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6.5" y="6.5" width="11" height="11" rx="3" fill="currentColor"/></svg>';
function paintMics() {
  const { state, form } = MIC.get();
  document.querySelectorAll(".efx-mic").forEach(b => {
    const on = state === "live" && b.closest("form") === form;
    const loading = on && MODEL.loading;
    if (b.getAttribute("aria-pressed") !== String(on)) b.innerHTML = on ? stopIcon : micIcon;
    b.setAttribute("aria-pressed", on);
    b.toggleAttribute("data-loading", loading);
    b.setAttribute("aria-busy", loading);
    b.setAttribute("aria-label", loading ? "Listening · getting speech to text ready" : on ? "Stop listening" : "Talk instead of typing");
    b.title = b.getAttribute("aria-label");
  });
}
MIC.sub(paintMics);

/* ---------- voice glow ---------- */
function Glow({ form, radius }) {
  const { theme, reduced } = useStore(UI);
  const { state, stream, form: micForm } = useStore(MIC);
  const busy = useStore(BUSY).forms.has(form);
  const live = state === "live" && micForm === form;
  const busyRef = useRef(busy);
  busyRef.current = busy && !live;
  const g = useRef({ gather: 0, t0: performance.now() });
  // The free build has no `processing` prop; this is the same idea on `motion`: gather the lobes into one beam and sweep it.
  const motion = useCallback(() => {
    const m = g.current;
    m.gather += ((busyRef.current ? 1 : 0) - m.gather) * 0.08;
    if (m.gather < 0.01) return null;
    const t = (performance.now() - m.t0) / 1000;
    return { gather: m.gather, offset: Math.sin(t * 1.7) * 0.85, stretch: Math.abs(Math.cos(t * 1.7)) * 0.35, heldLevel: 0.55 };
  }, []);
  return (
    <VoiceBeam
      className="efx-voice-beam"
      stream={live ? stream : undefined}
      level={live ? undefined : 0}
      active={live || busy}
      motion={motion}
      theme={theme}
      colorVariant="colorful"
      borderRadius={radius}
      paused={reduced && !live}
      idle={0.18}
    >
      <div className="efx-voice-face" />
    </VoiceBeam>
  );
}
/* A composer is "processing" while its own chat shows a Thinking row. Walk up until the scope holds that row,
   and stop at the first ancestor that also holds another composer (split view). */
function composerBusy(form) {
  let el = form.parentElement;
  for (let i = 0; el && i < 8; i++, el = el.parentElement) {
    if (el.querySelectorAll("form.composer").length > 1) return false;
    if (el.querySelector(".thinking")) return true;
  }
  return false;
}

/* ---------- gooey plus ---------- */
const FAN = [["doc", "Attach a file"], ["folder", "Share a folder"], ["monitor", "Share your screen"]];
function PlusFan({ label }) {
  const [open, setOpen] = useState(false);
  const { reduced } = useStore(UI);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const away = e => { if (!ref.current.contains(e.target)) setOpen(false); };
    const esc = e => { if (e.key === "Escape") { setOpen(false); ref.current.querySelector(".efx-plus").focus(); } };
    document.addEventListener("pointerdown", away, true);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away, true); document.removeEventListener("keydown", esc); };
  }, [open]);
  const tr = reduced ? { duration: 0 } : "bouncy";
  return (
    <div className="efx-fan" ref={ref} data-open={open}>
      {/* filterPadding: the buttons travel ~150px above the group box, and the goo is only drawn inside the filter region */}
      <Liquid blur={6} contrast={18} fill="var(--bg-raised)" shadow="0 6px 16px rgb(0 0 0 / .22)" filterPadding={170}>
        {FAN.map(([ic, lab], i) => (
          <Liquid.Item key={ic} x={0} y={open ? -(i + 1) * 50 - 4 : 0} transition={tr} delay={open ? i * 45 : (FAN.length - 1 - i) * 30}>
            <button
              type="button"
              className="btn icon efx-sat"
              data-act="stub"
              aria-label={lab}
              title={lab}
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
              onClick={() => setOpen(false)}
              dangerouslySetInnerHTML={{ __html: icon(ic, 18) }}
            />
          </Liquid.Item>
        ))}
        <Liquid.Item>
          <button
            type="button"
            className="btn icon efx-plus"
            aria-label={label}
            aria-expanded={open}
            title={open ? "Close" : label}
            onClick={() => setOpen(o => !o)}
            dangerouslySetInnerHTML={{ __html: icon("plus") }}
          />
        </Liquid.Item>
      </Liquid>
    </div>
  );
}

/* ---------- composers ---------- */
function enhanceComposer(form) {
  form.dataset.efx = "1";
  if (!form.querySelector("textarea")) return;
  const radius = parseFloat(getComputedStyle(form).borderTopLeftRadius) || 16;
  const glow = document.createElement("div");
  glow.className = "efx-voice";
  glow.setAttribute("aria-hidden", "true");
  form.prepend(glow);
  mount(glow, <Glow form={form} radius={radius} />);

  const plus = form.querySelector('.btn.icon[aria-label="Attach a file"]');
  if (plus) {
    plus.hidden = true; // kept in the DOM: the prototype still writes to #nAttach
    const host = document.createElement("span");
    host.className = "efx-fan-host";
    plus.after(host);
    mount(host, <PlusFan label="Add a file, folder or screen" />);
  }

  const send = form.querySelector('button[type="submit"]');
  const mic = document.createElement("button");
  mic.type = "button";
  mic.className = "btn icon efx-mic";
  mic.innerHTML = micIcon;
  mic.addEventListener("click", () => {
    const { state, form: f } = MIC.get();
    if (state === "live" && f === form) micStop(); else micStart(form);
  });
  if (send) send.before(mic); else form.append(mic);
  // Get the model loaded and warm while you're still typing or reaching for the mic.
  form.addEventListener("focusin", warmWhisper, { once: true });
  mic.addEventListener("pointerenter", warmWhisper, { once: true });
  paintMics();
}
// Sending ends the take.
document.addEventListener("submit", e => { if (e.target === MIC.get().form) micStop(false); }, true);

/* ---------- wiring ---------- */
let queued = false;
function scan() {
  queued = false;
  document.querySelectorAll(".think-dots:not([data-efx]), .tdots:not([data-efx])").forEach(enhanceDots);
  document.querySelectorAll("form.composer:not([data-efx])").forEach(enhanceComposer);
  const forms = new Set([...document.querySelectorAll("form.composer[data-efx]")].filter(composerBusy));
  const prev = BUSY.get().forms;
  if (forms.size !== prev.size || [...forms].some(f => !prev.has(f))) BUSY.set({ forms });
  sweep();
}
const queue = () => { if (!queued) { queued = true; requestAnimationFrame(scan); } };

const micHost = document.createElement("div");
micHost.hidden = true;
document.body.append(micHost);
mount(micHost, <MicHost />);

new MutationObserver(queue).observe(document.body, { childList: true, subtree: true });
new MutationObserver(() => UI.set({ theme: themeNow(), reduced: isReduced() })).observe(html, { attributes: true, attributeFilter: ["data-theme", "class"] });
matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => UI.set({ reduced: isReduced() }));
scan();
