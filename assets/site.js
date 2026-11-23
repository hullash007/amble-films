/* =====================================================================
   Amble Films: site script, shared by every page.
   EDIT THESE FOUR THINGS
   ===================================================================== */

// 1. Where enquiries are sent, and the email shown on the site
const EMAIL = "contact@amblefilms.in";

// 2. WhatsApp: the number in international form without + or spaces, and the message that opens ready to send
const WHATSAPP = "918750759538";
const WHATSAPP_TEXT = "Hi Amble Films, I'd like to talk about a film.";

// 3. Social pages. Delete a line to hide it; add a line (youtube, instagram, linkedin) to show it.
const SOCIAL = {
  youtube:   "https://www.youtube.com/@AmbleFilms",
  instagram: "https://www.instagram.com/amble_films/"
};

// 4. Films that open in the player. Each has an English (en) and a Hindi (hi) version.
const FILMS = {
  latitudes: {
    title: "Locating Places on the Earth, Part 2: Latitudes",
    poster: "/assets/img/latitudes-1600.jpg",
    en: { src: "/videos/latitudes-en.mp4", length: "4:20" },
    hi: { src: "/videos/latitudes-hi.mp4", length: "4:49" }
  },
  longitudes: {
    title: "Locating Places on the Earth, Part 3: Longitudes and the Prime Meridian",
    poster: "/assets/img/longitudes-1600.jpg",
    en: { src: "/videos/longitudes-en.mp4", length: "5:02" },
    hi: { src: "/videos/longitudes-hi.mp4", length: "5:12" }
  }
};
const LANG_NAME = { en: "English", hi: "Hindi" };

/* ===================================================================== */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const waLink = (text = WHATSAPP_TEXT) => "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text);

/* ---------- Contact links: email, WhatsApp and social pages, with icons ---------- */
const ICONS = {
  email: '<rect x="3" y="5.5" width="18" height="13" rx="0"/><path d="M3.5 7.5l8.5 6 8.5-6"/>',
  whatsapp: '<path d="M4.5 19.5l1.1-3.6A7.8 7.8 0 1 1 8.4 18.6z"/><path d="M9.3 8.6c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .4-.1.6-.5.8-.6.3-1.6.4-2.9-.2a8.3 8.3 0 0 1-4.1-4.1c-.6-1.3-.5-2.3-.3-2.9z" fill="currentColor" stroke="none"/>',
  youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.2 9.3v5.4l4.8-2.7z" fill="currentColor" stroke="none"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/>',
  linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.6v5.9M8 7.5v.1M11.8 16.5v-5.9M11.8 13.4c0-1.7 1-2.8 2.3-2.8s2.2 1 2.2 2.8v3.1"/>'
};
const NAMES = { youtube: "YouTube", instagram: "Instagram", linkedin: "LinkedIn" };
const svg = path => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
function item(href, icon, label, hint, newTab) {
  const li = document.createElement("li"), a = document.createElement("a");
  a.href = href;
  if (newTab) { a.target = "_blank"; a.rel = "noopener"; }
  a.innerHTML = svg(icon) + '<span></span><span class="sr-only"></span>';
  a.children[1].textContent = label; a.children[2].textContent = hint;
  li.append(a); return li;
}
$$("[data-contact]").forEach(list => {
  const mode = list.dataset.contact;            // "" = everything, "no-wa" = no WhatsApp, "social" = social pages only
  if (mode !== "social") list.append(item("mailto:" + EMAIL, ICONS.email, EMAIL, " (send us an email)"));
  if (!mode) list.append(item(waLink(), ICONS.whatsapp, "WhatsApp", " (opens WhatsApp)", true));
  Object.keys(SOCIAL).forEach(k => { if (NAMES[k] && SOCIAL[k]) list.append(item(SOCIAL[k], ICONS[k], NAMES[k], " (opens in a new tab)", true)); });
});
$$("[data-wa]").forEach(a => { a.href = waLink(a.dataset.wa || undefined); a.target = "_blank"; a.rel = "noopener"; });
$$("[data-wa-icon]").forEach(el => { el.innerHTML = svg(ICONS.whatsapp); });
$$("[data-email]").forEach(a => { a.href = "mailto:" + EMAIL; if (!a.textContent.trim()) a.textContent = EMAIL; });
$$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

/* ---------- Menu ---------- */
const menu = $("#menu");
if (menu) {
  $("#menu-open").addEventListener("click", () => menu.showModal());
  $("#menu-close").addEventListener("click", () => menu.close());
  $$("a", menu).forEach(a => a.addEventListener("click", () => menu.close()));
}

/* ---------- Hero reel: the smaller file on phones, nothing at all with Data Saver or reduced motion ---------- */
$$("video[data-reel]").forEach(v => {
  const saver = navigator.connection && navigator.connection.saveData;
  if (calm || saver) return;                        // the poster stays
  v.src = matchMedia("(max-width: 768px)").matches ? v.dataset.small : v.dataset.large;
  v.muted = true; v.play().catch(() => {});
});

/* ---------- Language switches on film cards ---------- */
function setLang(card, lang) {
  const film = FILMS[card.dataset.film];
  card.dataset.lang = lang;
  $$(".langs button", card).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  const len = $("[data-length]", card); if (len) len.textContent = film[lang].length + " · " + LANG_NAME[lang];
}
$$("[data-film]").forEach(card => {
  $$(".langs button", card).forEach(b => b.addEventListener("click", () => setLang(card, b.dataset.lang)));
  setLang(card, card.dataset.lang || "en");
});

/* ---------- Player ---------- */
const player = $("#player"), stage = $("#stage");
function openFilm(key, lang) {
  const film = FILMS[key]; if (!film || !player) return;
  stage.innerHTML = "";
  $("#player-title").textContent = film.title + " (" + LANG_NAME[lang] + ")";
  const v = document.createElement("video");
  v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = "auto";
  v.poster = film.poster; v.src = film[lang].src;
  stage.append(v);
  player.showModal();
}
$$("[data-play]").forEach(btn => btn.addEventListener("click", () => {
  const card = btn.closest("[data-film]");
  openFilm(card.dataset.film, card.dataset.lang || "en");
}));
if (player) {
  $("#player-close").addEventListener("click", () => player.close());
  player.addEventListener("click", e => { if (e.target === player) player.close(); });
  player.addEventListener("close", () => { stage.innerHTML = ""; });
}

/* ---------- Featured player (lesson films page): choose the part and the language ---------- */
$$("[data-feature]").forEach(box => {
  const v = $("video", box), title = $("[data-feature-title]", box), len = $("[data-feature-length]", box);
  const state = { film: box.dataset.feature, lang: "en" };
  function show(autoplay) {
    const film = FILMS[state.film];
    v.poster = film.poster; v.src = film[state.lang].src; v.load();
    title.textContent = film.title;
    len.textContent = film[state.lang].length + " · " + LANG_NAME[state.lang];
    $$("[data-part]", box).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.part === state.film)));
    $$("[data-lang]", box).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)));
    if (autoplay) v.play().catch(() => {});
  }
  $$("[data-part]", box).forEach(b => b.addEventListener("click", () => { state.film = b.dataset.part; show(!v.paused); }));
  $$("[data-lang]", box).forEach(b => b.addEventListener("click", () => {
    const t = v.currentTime, playing = !v.paused;
    state.lang = b.dataset.lang; show(false);
    if (t > 1) v.addEventListener("loadedmetadata", () => { v.currentTime = Math.min(t, v.duration - 1); if (playing) v.play().catch(() => {}); }, { once: true });
    else if (playing) v.play().catch(() => {});
  }));
  show(false);
});

/* ---------- Buttons that pick the service in the form before scrolling to it ---------- */
$$("[data-set-need]").forEach(a => a.addEventListener("click", () => {
  const f = $("form[data-enquiry]"); if (f && f.kind) { f.kind.value = a.dataset.setNeed; f.kind.dispatchEvent(new Event("change")); }
}));

/* ---------- Page to screen comparison ---------- */
$$(".compare").forEach(c => {
  const r = $("input", c);
  const set = () => c.style.setProperty("--pos", r.value + "%");
  r.addEventListener("input", set); set();
});

/* ---------- Enquiry form ---------- */
$$("form[data-enquiry]").forEach(form => {
  const need = new URLSearchParams(location.search).get("need") || form.dataset.need;
  if (need) { const opt = $$("option", form.kind).find(o => o.value === need); if (opt) form.kind.value = need; }
  const status = $(".form-status", form), btn = $("button[type=submit]", form);
  const fields = $$("input[required], select[required], textarea[required]", form);
  const why = el => el.validity.valueMissing ? (el.tagName === "SELECT" ? "Please choose one." : "Please fill this in.")
                  : el.validity.typeMismatch ? "Please check this email address." : "";
  function check(el) {
    const msg = why(el), box = el.closest(".field"), err = $(".err", box);
    box.classList.toggle("bad", !!msg); err.textContent = msg;
    el.setAttribute("aria-invalid", String(!!msg));
    return !msg;
  }
  fields.forEach(el => el.addEventListener(el.tagName === "SELECT" ? "change" : "blur", () => { if (el.closest(".field").classList.contains("bad") || el.value) check(el); }));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const bad = fields.filter(el => !check(el));
    if (bad.length) { bad[0].focus(); return; }
    const d = new FormData(form);
    if (d.get("_honey")) return;
    const subject = d.get("kind") + " enquiry from " + d.get("name");
    btn.disabled = true; btn.textContent = "Sending";
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
        Budget: d.get("budget") || "Not given",
        Timing: d.get("timing") || "Not given",
        Project: d.get("message"),
        Page: location.pathname
      })
    })
    .then(r => r.json())
    .then(res => {
      if (String(res.success) !== "true") throw new Error(res.message || "Not sent");
      const done = document.createElement("div");
      done.className = "sent"; done.tabIndex = -1;
      done.innerHTML = '<h3 class="d-m">Thank you. Your enquiry is with us.</h3><p></p><div class="actions"><a class="btn ghost small" data-wa-done>Message us on WhatsApp</a><a class="link" href="/lesson-films/">Watch a lesson film</a></div>';
      $("p", done).textContent = "We will reply to " + d.get("email") + " by email. A copy of this message is on its way to you now.";
      $("[data-wa-done]", done).href = waLink(); $("[data-wa-done]", done).target = "_blank";
      form.replaceChildren(done); done.focus();
    })
    .catch(() => {
      const body = d.get("message") + "\n\n" + d.get("name") + (d.get("company") ? "\n" + d.get("company") : "") + "\n" + d.get("email") + (d.get("phone") ? "\n" + d.get("phone") : "");
      const mail = document.createElement("a");
      mail.className = "link"; mail.textContent = "send it by email";
      mail.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      const wa = document.createElement("a");
      wa.className = "link"; wa.textContent = "WhatsApp"; wa.href = waLink(subject + "\n\n" + d.get("message")); wa.target = "_blank";
      status.textContent = "Your enquiry could not be sent from here. Please ";
      status.append(mail, " or ", wa, ".");
    })
    .finally(() => { if (btn.isConnected) { btn.disabled = false; btn.textContent = "Send enquiry"; } });
  });
});

/* ---------- Sticky bar on phones: shows once the top of the page has gone, hides at the form ---------- */
const sticky = $(".sticky"), topMark = $("[data-sticky-after]"), enq = $("#enquire");
if (sticky && topMark && "IntersectionObserver" in window) {
  let past = false, atForm = false;
  const update = () => sticky.classList.toggle("show", past && !atForm);
  new IntersectionObserver(([e]) => { past = !e.isIntersecting; update(); }).observe(topMark);
  if (enq) new IntersectionObserver(([e]) => { atForm = e.isIntersecting; update(); }, { rootMargin: "0px 0px -30% 0px" }).observe(enq);
}

/* ---------- Gentle reveal as sections come into view ---------- */
if (!calm && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(el => io.observe(el));
} else $$(".reveal").forEach(el => el.classList.add("in"));
