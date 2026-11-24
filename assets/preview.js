/* Amble Films: theme comparison switcher. PREVIEW ONLY.
   Loaded by the page only when <html data-preview> is set, which happens only on localhost and Netlify
   preview hosts (see themeBoot in tools/lib.mjs). amblefilms.in never loads this file.
   Share a theme with ?theme=original-black | warm-dark | light-cream. The choice is kept while you browse. */
(function () {
  var THEMES = [["one-cream", "One Cream"], ["original-black", "Original Black"], ["warm-dark", "Deep Warm Cream"], ["light-cream", "Light Cream"]];
  var root = document.documentElement;
  var current = function () { return root.getAttribute("data-theme"); };

  function carry() { // keep the theme in every internal link, so a copied link opens in the same theme
    document.querySelectorAll('a[href^="/"]').forEach(function (a) {
      var u = new URL(a.getAttribute("href"), location.origin);
      u.searchParams.set("theme", current());
      a.setAttribute("href", u.pathname + u.search + u.hash);
    });
  }
  function set(t) {
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("amble-theme", t); } catch (e) {}
    var u = new URL(location.href); u.searchParams.set("theme", t); history.replaceState(null, "", u);
    box.querySelectorAll("button[data-t]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.t === t)); });
    carry();
  }

  var css = document.createElement("style");
  css.textContent = ".tp{position:fixed;z-index:60;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));display:flex;align-items:center;gap:4px;padding:4px;background:rgba(20,18,15,.92);color:#F5F1EA;font:500 12px/1 'Hanken Grotesk',system-ui,sans-serif;border-radius:999px;box-shadow:0 6px 24px rgba(0,0,0,.25);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}"
    + ".tp b{padding:0 8px 0 10px;font-weight:500;opacity:.7;letter-spacing:.06em;text-transform:uppercase;font-size:10px}"
    + ".tp button{min-height:36px;padding:0 12px;border-radius:999px;color:inherit;background:none;border:0;font:inherit;cursor:pointer;white-space:nowrap}"
    + ".tp button[aria-pressed=true]{background:#F5F1EA;color:#15130F}"
    + ".tp .tp-x{min-width:36px;padding:0;opacity:.7}"
    + ".tp.min button[data-t]:not([aria-pressed=true]),.tp.min b{display:none}"
    + "@media (max-width:520px){.tp b{display:none}.tp button{padding:0 9px;font-size:11px}}"
    + "@media print{.tp{display:none}}";
  document.head.appendChild(css);

  var box = document.createElement("div");
  box.className = "tp"; box.setAttribute("role", "group"); box.setAttribute("aria-label", "Preview colour theme");
  box.innerHTML = "<b>Theme</b>" + THEMES.map(function (t) { return '<button type="button" data-t="' + t[0] + '" aria-pressed="false">' + t[1] + "</button>"; }).join("")
    + '<button type="button" class="tp-x" aria-label="Minimise theme switcher" title="Minimise">–</button>';
  document.body.appendChild(box);
  box.querySelectorAll("button[data-t]").forEach(function (b) { b.addEventListener("click", function () { box.classList.remove("min"); set(b.dataset.t); }); });
  box.querySelector(".tp-x").addEventListener("click", function () { var m = box.classList.toggle("min"); this.textContent = m ? "+" : "–"; this.setAttribute("aria-label", m ? "Show all themes" : "Minimise theme switcher"); });
  if (new URLSearchParams(location.search).has("shot")) box.style.display = "none"; // clean screenshots
  set(current());
})();
