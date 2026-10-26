// eucas.app: the theme switch, the live tray panel, the screens row, the rule switches, questions and the waitlist.
(() => {
  const root = document.documentElement;
  root.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  };

  // Theme: dark by default, light as the option. Screens swap to the matching capture.
  const toggle = $("[data-theme-toggle]");
  function applyTheme(t) {
    root.dataset.theme = t;
    toggle.setAttribute("aria-pressed", String(t === "light"));
    $(".sr", toggle).textContent = t === "light" ? "Dark theme" : "Light theme";
    $('meta[name="theme-color"]').content = t === "light" ? "#f3f4f7" : "#161616";
    $$("img[data-dark]").forEach(img => { img.src = img.dataset[t]; });
  }
  applyTheme(root.dataset.theme === "light" ? "light" : "dark");
  toggle.addEventListener("click", () => {
    const t = root.dataset.theme === "light" ? "dark" : "light";
    applyTheme(t);
    store.set("theme", t);
  });

  // Entrances: heading, then text, then picture, once per section.
  const rise = $$("[data-rise]");
  if (reduce || !("IntersectionObserver" in window)) rise.forEach(el => el.classList.add("in"));
  else {
    const groups = new Map();
    rise.forEach(el => {
      const sec = el.closest("section, footer") || document.body;
      const i = groups.get(sec) ?? 0;
      el.style.setProperty("--d", `${Math.min(i, 6) * 80}ms`);
      groups.set(sec, i + 1);
    });
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    rise.forEach(el => io.observe(el));
  }

  // The tray panel: the heartbeat ticks only when a "check" lands, and the needs-you card changes slowly.
  const strip = $("[data-strip]");
  const ago = $("[data-ago]");
  const dot = $(".hb-dot");
  const BARS = 44;
  const heights = Array.from({ length: BARS }, (_, i) => (i % 7 === 3 ? 0 : 20 + ((i * 37) % 70)));
  strip.innerHTML = heights.map(() => "<i></i>").join("");
  const bars = $$("i", strip);
  const draw = () => bars.forEach((b, i) => {
    b.style.setProperty("--h", heights[i] ? `${heights[i]}%` : "2px");
    b.classList.toggle("now", i === BARS - 1);
  });
  draw();
  let since = 2;
  const cards = $$("[data-cards] .fl-card");
  const logText = $("[data-log-text]");
  const LOG = [
    "Allowed by your rule: <code>pnpm test</code> in bench/",
    "Allowed by your rule: <code>git diff</code> in api-docs/",
    "Allowed by your rule: <code>Read src/router.ts</code>",
    "Allowed by your rule: <code>git status</code> in notes/",
  ];
  let card = 0, log = 0, t = 0;
  if (!reduce) {
    setInterval(() => {
      if (document.hidden) return;
      t++;
      if (t % 3 === 0) {
        since = 0;
        heights.shift();
        heights.push(30 + Math.round(Math.random() * 60));
        draw();
        dot.classList.remove("beat"); void dot.offsetWidth; dot.classList.add("beat");
      } else since++;
      ago.textContent = String(since);
      if (t % 6 === 0) {
        log = (log + 1) % LOG.length;
        logText.innerHTML = LOG[log];
      }
      if (t % 7 === 0) {
        cards[card].classList.remove("is-on");
        card = (card + 1) % cards.length;
        cards[card].classList.add("is-on");
      }
    }, 1000);
  }

  // The screens row: the panel nearest the centre is lit and names itself underneath.
  const row = $("[data-row]");
  const panels = $$(".panel", row);
  const pName = $("[data-panel-name]");
  const pText = $("[data-panel-text]");
  let lit = -1;
  function light() {
    const mid = row.scrollLeft + row.clientWidth / 2;
    let best = 0, dist = Infinity;
    panels.forEach((p, i) => {
      const d = Math.abs(p.offsetLeft + p.offsetWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    if (best === lit) return;
    lit = best;
    panels.forEach((p, i) => p.classList.toggle("is-lit", i === best));
    pName.textContent = panels[best].dataset.name;
    pText.textContent = panels[best].dataset.text;
  }
  const go = dir => {
    const i = Math.max(0, Math.min(panels.length - 1, lit + dir));
    const p = panels[i];
    row.scrollTo({ left: p.offsetLeft + p.offsetWidth / 2 - row.clientWidth / 2, behavior: reduce ? "auto" : "smooth" });
  };
  row.addEventListener("scroll", () => requestAnimationFrame(light), { passive: true });
  $("[data-prev]").addEventListener("click", () => go(-1));
  $("[data-next]").addEventListener("click", () => go(1));
  row.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  });
  panels.forEach((p, i) => p.addEventListener("click", () => { if (i !== lit) go(i - lit); }));
  // Drag to scroll with a mouse; touch scrolls natively.
  let drag = null;
  row.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") drag = { x: e.clientX, left: row.scrollLeft, moved: false }; });
  addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 4) { drag.moved = true; row.style.scrollSnapType = "none"; }
    row.scrollLeft = drag.left - dx;
  });
  addEventListener("pointerup", () => {
    if (!drag) return;
    row.style.scrollSnapType = "";
    if (drag.moved) go(0);
    drag = null;
  });
  requestAnimationFrame(() => { go(0); light(); });
  addEventListener("resize", () => { lit = -1; light(); });

  // Rule switches. The last one is the promise: it doesn't move.
  $$(".band").forEach(band => {
    const sw = $(".switch", band);
    const sync = () => band.classList.toggle("is-on", sw.getAttribute("aria-checked") === "true");
    sync();
    sw.addEventListener("click", () => {
      if (sw.hasAttribute("data-locked")) {
        sw.classList.remove("nope"); void sw.offsetWidth; sw.classList.add("nope");
        $("[data-locked-text]", band).textContent = "This one stays on. Eucas asks you every time, whatever your rules say.";
        return;
      }
      sw.setAttribute("aria-checked", String(sw.getAttribute("aria-checked") !== "true"));
      sync();
    });
  });

  // Questions: one answer at a time. Wide screens show it in the pane; phones open it under the question.
  const faq = $("[data-faq]");
  const pane = $("[data-faq-pane]");
  const qs = $$("button", faq);
  function pick(btn) {
    qs.forEach(b => {
      const on = b === btn;
      b.setAttribute("aria-expanded", String(on));
      $("#" + b.getAttribute("aria-controls")).hidden = !on;
    });
    const html = $("#" + btn.getAttribute("aria-controls")).innerHTML;
    if (pane.innerHTML !== html) {
      pane.style.opacity = "0";
      setTimeout(() => { pane.innerHTML = html; pane.style.opacity = "1"; }, reduce ? 0 : 150);
    }
  }
  qs.forEach(b => {
    b.addEventListener("click", () => pick(b));
    b.addEventListener("focus", () => { if (matchMedia("(min-width: 721px)").matches) pick(b); });
    b.addEventListener("mouseenter", () => { if (matchMedia("(hover: hover) and (min-width: 721px)").matches) pick(b); });
  });

  // The clock in Doha.
  const clock = $("[data-clock]");
  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Qatar" }).format(new Date());
  };
  tick(); setInterval(tick, 30000);

  // The waitlist.
  const form = $("[data-form]");
  const email = $("#email");
  const err = $("[data-err]");
  const submit = $("[data-submit]");
  const planField = $("[data-plan-field]");
  const params = new URLSearchParams(location.search);
  $("[data-ref-field]").value = (params.get("ref") || params.get("utm_source") || "").slice(0, 40);
  $$("[data-plan]").forEach(a => a.addEventListener("click", () => { planField.value = a.dataset.plan; }));
  let token = null;

  // Turnstile loads only when someone starts typing, and only once a site key is set.
  const siteKey = $('meta[name="turnstile-sitekey"]')?.content;
  let tsWidget = null;
  let tsReady = null;
  function loadTurnstile() {
    if (!siteKey || tsReady) return tsReady;
    tsReady = new Promise(resolve => {
      window.onTurnstileLoad = () => {
        tsWidget = window.turnstile.render($("[data-turnstile]"), {
          sitekey: siteKey, appearance: "interaction-only", theme: root.dataset.theme === "light" ? "light" : "dark", action: "waitlist",
        });
        resolve();
      };
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit";
      s.async = true;
      document.head.append(s);
    });
    return tsReady;
  }
  email.addEventListener("focus", loadTurnstile, { once: true });
  const opened = Date.now();

  const showErr = msg => {
    err.textContent = msg;
    email.setAttribute("aria-invalid", msg ? "true" : "false");
  };

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const value = email.value.trim();
    if (!value) return showErr("Type your email so we can send you the build.");
    if (!email.checkValidity() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return showErr("That doesn't look like an email address. Check for a typo.");
    showErr("");
    submit.disabled = true;
    submit.textContent = "Joining";
    try {
      let tsToken = "";
      if (siteKey) {
        await loadTurnstile();
        tsToken = window.turnstile.getResponse(tsWidget) || "";
        if (!tsToken) {
          await new Promise(r => setTimeout(r, 1500));
          tsToken = window.turnstile.getResponse(tsWidget) || "";
        }
      }
      const fd = new FormData(form);
      const body = {
        email: value,
        agents: fd.getAll("agents"),
        plan: fd.get("plan"),
        ref: fd.get("ref"),
        website: fd.get("website"),
        elapsed: Date.now() - opened,
        turnstile: tsToken,
      };
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "We couldn't add you just now. Try again in a minute.");
      token = data.token || null;
      $('[data-step="1"]').hidden = true;
      const step2 = $('[data-step="2"]');
      step2.hidden = false;
      $("[data-done]").textContent = data.confirm
        ? "You're on the list. Check your inbox for the confirm link."
        : "You're on the list.";
      $("[data-done]").focus();
    } catch (x) {
      showErr(x.message || "We couldn't add you just now. Try again in a minute.");
      if (tsWidget !== null) window.turnstile?.reset(tsWidget);
    } finally {
      submit.disabled = false;
      submit.textContent = "Join";
    }
  });

  $("[data-details]").addEventListener("click", async () => {
    const thanks = $("[data-thanks]");
    const fd = new FormData(form);
    if (!token) { thanks.textContent = "Thanks. You can close this page."; return; }
    thanks.textContent = "Sending";
    try {
      const res = await fetch("/api/details", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, sessions: fd.get("sessions") || "", os: fd.get("os") || "" }),
      });
      if (!res.ok) throw new Error();
      thanks.textContent = "Thanks. That's all we need.";
    } catch {
      thanks.textContent = "Those didn't send, but you're still on the list.";
    }
  });
})();
