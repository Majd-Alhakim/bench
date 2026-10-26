// eucas.app: the theme switch, the live notch, the panel tabs, the rule switches, questions and the waitlist.
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

  // Theme: dark by default, light as the option. Panel screens swap to the matching capture.
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

  // Entrances: heading, then text, then picture, once per section. The hero screen opens like a shutter.
  const rise = $$("[data-rise], [data-shutter]");
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

  // The live notch. Its state follows the section in view; its eyes follow the pointer and blink.
  const notch = $("[data-notch]");
  const eyes = $("[data-eyes]");
  const marker = $("[data-marker]");
  const label = $("[data-notch-label]");
  const peek = $("[data-peek]");
  const STATES = {
    working: ["", "protected, sessions working"],
    marker: ["2", "protected, 2 need you"],
    trip: ["", "concerned: something needs a look"],
    focused: ["", "protected, checking with the supervisor"],
    rest: ["", "protected, nothing waiting"],
    pleased: ["", "protected, you're all caught up"],
  };
  function setState(s) {
    if (notch.dataset.state === s || !STATES[s]) return;
    notch.dataset.state = s;
    marker.textContent = STATES[s][0];
    label.textContent = `Your Euca, in the Eucas notch: ${STATES[s][1]}. ${notch.getAttribute("aria-expanded") === "true" ? "Hide" : "Show"} the peek.`;
  }
  if ("IntersectionObserver" in window) {
    const seen = new Map();
    const so = new IntersectionObserver(es => {
      es.forEach(e => seen.set(e.target, e.intersectionRatio));
      let best = null, top = 0;
      seen.forEach((r, el) => { if (r > top) { top = r; best = el; } });
      if (best) setState(best.dataset.state);
    }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-30% 0px -30% 0px" });
    $$("main section[data-state]").forEach(s => so.observe(s));
  }
  if (!reduce) {
    let raf = 0;
    addEventListener("pointermove", e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = notch.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const k = Math.min(1, Math.hypot(dx, dy) / 260);
        const a = Math.atan2(dy, dx);
        eyes.style.setProperty("--ex", `${(Math.cos(a) * 2.5 * k).toFixed(2)}px`);
        eyes.style.setProperty("--ey", `${(Math.sin(a) * 1.5 * k).toFixed(2)}px`);
      });
    }, { passive: true });
    const blink = () => {
      if (!document.hidden) { eyes.classList.remove("blink"); void eyes.offsetWidth; eyes.classList.add("blink"); }
      setTimeout(blink, 3800 + Math.random() * 3400);
    };
    setTimeout(blink, 2400);
  }
  // The peek: opens after a short rest on the notch, folds a moment after the pointer leaves; click or tap toggles it.
  const live = $("[data-live]");
  let openT = 0, closeT = 0, foldT = 0;
  function showPeek(on) {
    clearTimeout(openT); clearTimeout(closeT); clearTimeout(foldT);
    if (on) { peek.classList.remove("folding"); peek.hidden = false; }
    else if (!peek.hidden && !peek.classList.contains("folding")) {
      peek.classList.add("folding");
      foldT = setTimeout(() => { peek.hidden = true; peek.classList.remove("folding"); }, reduce ? 0 : 300);
    }
    notch.setAttribute("aria-expanded", String(on));
    label.textContent = label.textContent.replace(/(Show|Hide) the peek\./, `${on ? "Hide" : "Show"} the peek.`);
  }
  live.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") { clearTimeout(closeT); openT = setTimeout(() => showPeek(true), 280); } });
  live.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") { clearTimeout(openT); closeT = setTimeout(() => showPeek(false), 360); } });
  const isOpen = () => !peek.hidden && !peek.classList.contains("folding");
  notch.addEventListener("click", () => showPeek(!isOpen()));
  addEventListener("keydown", e => { if (e.key === "Escape" && isOpen()) { showPeek(false); notch.focus(); } });
  document.addEventListener("click", e => { if (isOpen() && !live.contains(e.target)) showPeek(false); });

  // The panel's own tabs pick the screen on the plate.
  const SHOW = {
    needs: ["Know which session needs you.", "One glance at the top of your screen. Hover for a peek, click for the panel. Nothing pops up and nothing steals your focus.", "needs",
      "The panel. Needs you, 3: bench is waiting for you and wants to run pnpm build; two sessions are editing one file; search is ready, open a PR for search with the tests first."],
    usage: ["See your limit coming.", "Your 5-hour and weekly usage, the time you'll hit the limit at today's pace, and which projects used it.", "usage",
      "The Usage tab: the 5-hour window at 46 percent, resetting at 15:40, with a forecast of when you reach it; the week at 62 percent; where it went by project."],
    same: ["Two sessions, one file.", "When a second session edits a file another one just changed, both show up side by side, one click apart.", "same-file",
      "Two sessions are editing one file: bench and api-docs both changed src/router.ts since 14:02. Show both."],
    rules: ["Stop approving the same thing.", "Rules say once what your sessions may do. The four limits stay locked.", "rules",
      "The Rules tab: the four limits locked, and your rules with switches, such as allow pnpm test in bench."],
  };
  const tabs = $$("[data-show]");
  const showImg = $("[data-show-img]");
  const panel = $("#show-text");
  const show = $(".show");
  let swapT = 0;
  // A tab change fades the old screen and words out and the new ones in.
  function pickTab(btn, focus) {
    if (btn.getAttribute("aria-selected") === "true" && showImg.dataset.shot === btn.dataset.show) return;
    tabs.forEach(b => { const on = b === btn; b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1; });
    if (focus) btn.focus();
    clearTimeout(swapT);
    if (reduce || !showImg.dataset.shot) return fillTab(btn);
    show.classList.add("swap");
    swapT = setTimeout(() => { fillTab(btn); requestAnimationFrame(() => show.classList.remove("swap")); }, 220);
  }
  function fillTab(btn) {
    const [title, text, shot, alt] = SHOW[btn.dataset.show];
    showImg.dataset.shot = shot;
    panel.setAttribute("aria-labelledby", btn.id);
    $("[data-show-title]").textContent = title;
    $("[data-show-text]").textContent = text;
    showImg.dataset.dark = `screens/${shot}-dark.webp`;
    showImg.dataset.light = `screens/${shot}-light.webp`;
    showImg.src = showImg.dataset[root.dataset.theme === "light" ? "light" : "dark"];
    showImg.alt = alt;
  }
  pickTab(tabs[0], false);
  // Warm the other tabs' screens once the plate is near, so the fade-in never shows a blank.
  if ("IntersectionObserver" in window) {
    const warm = new IntersectionObserver(es => {
      if (!es.some(e => e.isIntersecting)) return;
      warm.disconnect();
      const t = root.dataset.theme === "light" ? "light" : "dark";
      ["usage", "same-file", "rules"].forEach(n => { new Image().src = `screens/${n}-${t}.webp`; });
    }, { rootMargin: "400px 0px" });
    warm.observe(show);
  }
  tabs.forEach((b, i) => {
    b.addEventListener("click", () => pickTab(b, false));
    b.addEventListener("keydown", e => {
      const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      pickTab(tabs[(i + step + tabs.length) % tabs.length], true);
    });
  });

  // Rule switches. The last one is the promise: it doesn't move.
  $$(".band").forEach(band => {
    const sw = $(".switch", band);
    const sync = () => band.classList.toggle("is-on", sw.getAttribute("aria-checked") === "true");
    sync();
    sw.addEventListener("click", () => {
      if (sw.hasAttribute("data-locked")) {
        sw.classList.remove("nope"); void sw.offsetWidth; sw.classList.add("nope");
        $("[data-locked-text]", band).textContent = "These stay on. Your Euca asks you every time, whatever your rules say.";
        return;
      }
      sw.setAttribute("aria-checked", String(sw.getAttribute("aria-checked") !== "true"));
      sync();
    });
  });

  // Questions: one card open at a time.
  const qs = $$("[data-faq] button");
  qs.forEach(b => b.addEventListener("click", () => {
    qs.forEach(o => {
      const on = o === b;
      o.setAttribute("aria-expanded", String(on));
      $("#" + o.getAttribute("aria-controls")).hidden = !on;
    });
  }));

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
