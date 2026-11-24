/* =====================================================================
   Amble Films: site script, shared by every page.
   Films are listed in /content/films.json and written into each page by tools/build.mjs.
   ===================================================================== */

// Where enquiries are sent (through formsubmit.co), and the WhatsApp number in international form
const EMAIL = "contact@amblefilms.in";
const WHATSAPP = "918750759538";
const WHATSAPP_TEXT = "Hi Amble Films, I'd like to talk about a film.";

/* ===================================================================== */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const waLink = (text = WHATSAPP_TEXT) => "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text);
const json = id => { try { return JSON.parse($("#" + id).textContent); } catch (e) { return null; } };
$$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

/* ---------- Menu (phones and tablets) ---------- */
const menu = $("#menu"), openBtn = $("#menu-open");
if (menu && openBtn) {
  openBtn.setAttribute("aria-expanded", "false");
  openBtn.addEventListener("click", () => { menu.showModal(); openBtn.setAttribute("aria-expanded", "true"); });
  $("#menu-close").addEventListener("click", () => menu.close());
  menu.addEventListener("close", () => openBtn.setAttribute("aria-expanded", "false"));
  $$("a", menu).forEach(a => a.addEventListener("click", () => menu.close()));
  addEventListener("resize", () => { if (menu.open && innerWidth >= 1024) menu.close(); });
}

/* ---------- Services dropdown (desktop): opens by click, keyboard or hover ---------- */
$$("[data-sub]").forEach(box => {
  const btn = $(".sub-btn", box);
  const set = open => { box.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open)); };
  btn.addEventListener("click", e => { e.stopPropagation(); set(!box.classList.contains("open")); });
  box.addEventListener("focusout", e => { if (!box.contains(e.relatedTarget)) set(false); });
  box.addEventListener("keydown", e => { if (e.key === "Escape") { set(false); btn.focus(); } });
  document.addEventListener("click", e => { if (!box.contains(e.target)) set(false); });
});

/* ---------- Reel and illustrative loops: muted, load only when on screen, never with reduced motion or Data Saver ---------- */
const saver = navigator.connection && navigator.connection.saveData;
const phone = () => matchMedia("(max-width: 860px)").matches;
$$("video[data-reel], video[data-ambient]").forEach(v => {
  if (calm || saver || !("IntersectionObserver" in window)) return;   // the poster frame stays
  let loaded = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (!loaded) { v.src = phone() ? v.dataset.small : v.dataset.large; loaded = true; }
      v.muted = true; v.play().catch(() => {});
    } else if (loaded) v.pause();
  }, { threshold: .2 }).observe(v);
});

/* ---------- Player ---------- */
const FILMS = json("film-data") || {}, REEL = json("reel-data");
const player = $("#player"), stage = $("#stage");
let opener = null;
function play(title, src, poster) {
  if (!player) return;
  opener = document.activeElement;
  stage.innerHTML = "";
  $("#player-title").textContent = title;
  const v = document.createElement("video");
  v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = "auto";
  if (poster) v.poster = poster;
  v.src = src;
  stage.append(v);
  player.showModal();
  v.play().catch(() => {});
}
if (player) {
  $("#player-close").addEventListener("click", () => player.close());
  player.addEventListener("click", e => { if (e.target === player || e.target === stage) player.close(); });
  player.addEventListener("close", () => { stage.innerHTML = ""; if (opener) opener.focus(); });
}
$$("[data-play-reel]").forEach(b => b.addEventListener("click", () => {
  if (REEL) play(REEL.title, phone() ? REEL.small : REEL.large, REEL.poster);
}));

/* ---------- Film cards: play (phones get the lighter file where there is one) ---------- */
$$("[data-film]").forEach(card => {
  const film = FILMS[card.dataset.film]; if (!film) return;
  $$("[data-play]", card).forEach(b => b.addEventListener("click", () => play(film.title, phone() ? film.small : film.src, film.poster)));
});

/* ---------- Work page filters ---------- */
const grid = $("[data-film-grid]");
$$("[data-filter]").forEach(b => b.addEventListener("click", () => {
  const cat = b.dataset.filter;
  $$("[data-filter]").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  let shown = 0;
  $$("[data-film]", grid).forEach(c => { const on = cat === "all" || c.dataset.cat === cat; c.hidden = !on; if (on) shown++; });
  $$("[data-film]", grid).filter(c => !c.hidden).forEach((c, i) => c.classList.toggle("film-lead", i === 0 && cat === "all"));
}));
// Category cards further down the Work page jump back up to the films, filtered
$$("[data-filter-to]").forEach(b => b.addEventListener("click", () => {
  const f = $('[data-filter="' + b.dataset.filterTo + '"]'); if (f) f.click();
  const top = $("#films"); if (top) top.scrollIntoView({ behavior: calm ? "auto" : "smooth" });
}));

/* ---------- Enquiry form: three short steps, sent through FormSubmit ---------- */
$$("form[data-enquiry]").forEach(form => {
  const steps = $$(".step", form), count = $("[data-step-count]", form), bar = $("[data-progress]", form);
  const status = $(".form-status", form), submit = $("button[type=submit]", form);
  let at = 0;

  // A service page can pick the project type: /contact/?need=Brand%20film
  const need = new URLSearchParams(location.search).get("need");
  if (need) { const r = $$("input[name=kind]", form).find(i => i.value === need); if (r) r.checked = true; }

  function show(i, focus) {
    at = i;
    steps.forEach((s, n) => s.classList.toggle("on", n === i));
    count.textContent = "Step " + (i + 1) + " of " + steps.length;
    if (bar) bar.style.width = ((i + 1) / steps.length * 100) + "%";
    if (focus) { const first = $("input:not([type=hidden]):not([tabindex='-1']), textarea, select", steps[i]); (steps[i].querySelector("input:checked") || first)?.focus(); }
  }
  const msgFor = el => el.validity.valueMissing ? (el.type === "radio" ? "Please choose one." : "Please fill this in.")
                     : el.validity.typeMismatch ? "Please check this email address." : "";
  function check(step) {
    let firstBad = null;
    const radios = $$("input[type=radio]", step);
    if (radios.length) {
      const ok = radios.some(r => r.checked), err = $(".err", step), box = $(".choices", step);
      err.textContent = ok ? "" : "Please choose one."; box.classList.toggle("bad", !ok);
      radios.forEach(r => r.setAttribute("aria-invalid", String(!ok)));
      if (!ok) firstBad = radios[0];
    }
    $$("input[required]:not([type=radio]), textarea[required]", step).forEach(el => {
      const m = msgFor(el), box = el.closest(".field");
      box.classList.toggle("bad", !!m); $(".err", box).textContent = m; el.setAttribute("aria-invalid", String(!!m));
      if (m && !firstBad) firstBad = el;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }
  $$("[data-next]", form).forEach(b => b.addEventListener("click", () => { if (check(steps[at])) show(at + 1, true); }));
  $$("[data-back]", form).forEach(b => b.addEventListener("click", () => show(at - 1, true)));
  $$("input[type=radio]", form).forEach(r => r.addEventListener("change", () => { const s = r.closest(".step"); $(".err", s).textContent = ""; $(".choices", s).classList.remove("bad"); }));
  // Errors clear while the visitor types (never on blur), so nothing moves under the pointer when they click Send
  $$("input[required]:not([type=radio]), textarea[required]", form).forEach(el => el.addEventListener("input", () => {
    const box = el.closest(".field");
    if (box.classList.contains("bad") && !msgFor(el)) { box.classList.remove("bad"); $(".err", box).textContent = ""; el.setAttribute("aria-invalid", "false"); }
  }));
  // Enter in a text field moves to the next step instead of submitting early
  form.addEventListener("keydown", e => {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && at < steps.length - 1) { e.preventDefault(); $("[data-next]", steps[at]).click(); }
  });
  show(0, false);

  form.addEventListener("submit", e => {
    e.preventDefault();
    for (let i = 0; i < steps.length; i++) if (!check(steps[i])) { show(i, false); check(steps[i]); return; }
    const d = new FormData(form);
    if (d.get("_honey")) return;
    const subject = d.get("kind") + " enquiry from " + d.get("name");
    submit.disabled = true; submit.textContent = "Sending";
    status.textContent = "";
    fetch("https://formsubmit.co/ajax/" + EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: subject,
        _replyto: d.get("email"),
        _template: "table",
        _autoresponse: "Thank you for writing to Amble Films. We have your enquiry and will reply to you by email. If it is urgent, you can also message us on WhatsApp: +" + WHATSAPP + ".",
        Name: d.get("name"),
        Email: d.get("email"),
        Phone: d.get("phone") || "Not given",
        Organisation: d.get("company") || "Not given",
        Need: d.get("kind"),
        Audience: d.get("audience") || "Not given",
        Budget: d.get("budget") || "Not given",
        Timing: d.get("timing") || "Not given",
        Project: d.get("message"),
        Page: location.pathname + location.search
      })
    })
    .then(r => r.json())
    .then(res => {
      if (String(res.success) !== "true") throw new Error(res.message || "Not sent");
      const done = document.createElement("div");
      done.className = "sent"; done.tabIndex = -1; done.setAttribute("role", "status");
      done.innerHTML = '<p class="eyebrow">Enquiry sent</p><h2 class="h3">Thank you. Your enquiry is with us.</h2><p></p><div class="actions"><a class="btn" href="/work/">Watch our films</a><a class="link-arrow" data-wa-done>Message us on WhatsApp <span class="arr" aria-hidden="true">→</span></a></div>';
      $("p:not(.eyebrow)", done).textContent = "We will reply to " + d.get("email") + " by email. A copy of your message is on its way to you now.";
      const wa = $("[data-wa-done]", done); wa.href = waLink(); wa.target = "_blank"; wa.rel = "noopener";
      form.replaceChildren(done); done.focus();
    })
    .catch(() => {
      const body = d.get("message") + "\n\n" + d.get("name") + (d.get("company") ? "\n" + d.get("company") : "") + "\n" + d.get("email") + (d.get("phone") ? "\n" + d.get("phone") : "");
      const mail = document.createElement("a");
      mail.textContent = "send it by email";
      mail.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      const wa = document.createElement("a");
      wa.textContent = "WhatsApp"; wa.href = waLink(subject + "\n\n" + d.get("message")); wa.target = "_blank"; wa.rel = "noopener";
      status.textContent = "Your enquiry could not be sent from here. Please ";
      status.append(mail, " or ", wa, ". Nothing you typed has been lost.");
    })
    .finally(() => { if (submit.isConnected) { submit.disabled = false; submit.textContent = "Send enquiry"; } });
  });
});
