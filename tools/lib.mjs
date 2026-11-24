// Amble Films site generator: shared pieces. The entry point is tools/build.mjs.
// Writes plain static HTML for every page from /content. No dependencies: run `node tools/build.mjs`.
// The output is committed, so the host needs no build step.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, CATEGORIES, KINDS, SERVICES, INDUSTRIES, STEPS, FAQ } from "../content/site.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const DATA = JSON.parse(read("content/films.json"));
const FILMS = DATA.films, REEL = DATA.reel;
const LOGO = read("content/logo-inline.svg");
const V = { css: 4, js: 2, bear: 5 };
const TODAY = new Date().toISOString().slice(0, 10);

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const svc = slug => SERVICES.find(s => s.slug === slug);
const svcShort = s => s.short || s.name;
const contactFor = need => "/contact/?need=" + encodeURIComponent(need);
const arrow = '<span class="arr" aria-hidden="true">→</span>';
const pad = n => String(n).padStart(2, "0");
const ld = o => '<script type="application/ld+json">' + JSON.stringify(o) + "</script>";
const ORG = { "@type": "Organization", name: SITE.name, url: SITE.url + "/" };
const crumbs = list => ld({ "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...list].map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE.url + p })) });

/* ---------------- Shared pieces ---------------- */

function head({ path: p, title, description, schema = "" }) {
  const url = SITE.url + p;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#F5F1EA">
<script>
if (location.hostname === 'hullash007.github.io') location.replace('https://amblefilms.in' + location.pathname.replace(/^\\/amble-films/, '') + location.search + location.hash);
document.documentElement.classList.add('js');
</script>
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${SITE.url}/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The Amble Films logo, a bear walking along the top of the word Amble">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${SITE.url}/og-image.png">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/marcellus-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/hanken-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=${V.css}">
${schema}
</head>`;
}

const NAV = [["Work", "/work/"], ["Services", "/services/"], ["Industries", "/industries/"], ["Studio", "/studio/"], ["Process", "/process/"]];

function header(active) {
  const cur = h => (active === h ? ' aria-current="page"' : "");
  const subLinks = SERVICES.map(s => `<li><a href="/services/${s.slug}/"${cur("/services/" + s.slug + "/")}>${esc(s.name)}</a></li>`).join("");
  const links = NAV.map(([name, href]) => name === "Services"
    ? `<div class="nav-sub" data-sub>
        <a href="${href}"${active.startsWith("/services/") ? ' aria-current="' + (active === href ? "page" : "true") + '"' : ""}>${name}</a>
        <button class="sub-btn" type="button" aria-expanded="false" aria-controls="sub-services"><span class="sr-only">Show all services</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button>
        <div class="sub" id="sub-services"><ul>${subLinks}</ul><a class="sub-all" href="/services/">All services ${arrow}</a></div>
      </div>`
    : `<a href="${href}"${active.startsWith(href) ? ' aria-current="page"' : ""}>${name}</a>`).join("\n      ");
  const mSub = SERVICES.map(s => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join("");
  return `<body>
<a class="skip" href="#main">Skip to content</a>
<header class="bar">
  <div class="bar-in">
    <a class="logo" href="/" aria-label="Amble Films, home">${LOGO}</a>
    <nav class="nav" aria-label="Main">
      ${links}
    </nav>
    <div class="bar-end">
      <a class="btn small nav-cta" href="/contact/"${cur("/contact/")}>Start a project</a>
      <button class="menu-btn" id="menu-open" type="button" aria-haspopup="dialog" aria-controls="menu"><span class="burger" aria-hidden="true"></span><span>Menu</span></button>
    </div>
  </div>
</header>

<dialog class="menu" id="menu" aria-label="Menu">
  <div class="menu-top">
    <a class="logo" href="/" aria-label="Amble Films, home"><svg class="logo-art" viewBox="0 0 765 344" aria-hidden="true"><use href="#amble-letters"/><use href="#amble-bear-art"/></svg></a>
    <button class="menu-close" id="menu-close" type="button">Close</button>
  </div>
  <nav class="menu-nav" aria-label="Main">
    <ul>
      <li><a href="/"${cur("/")}>Home</a></li>
      <li><a href="/work/"${cur("/work/")}>Work</a></li>
      <li><details${active.startsWith("/services/") ? " open" : ""}><summary>Services</summary><ul class="menu-sub">${mSub}<li><a href="/services/">All services</a></li></ul></details></li>
      <li><a href="/industries/"${cur("/industries/")}>Industries</a></li>
      <li><a href="/studio/"${cur("/studio/")}>Studio</a></li>
      <li><a href="/process/"${cur("/process/")}>Process</a></li>
    </ul>
  </nav>
  <div class="menu-foot">
    <a class="btn block" href="/contact/">Start a project</a>
    <p class="menu-contact"><a data-email href="#"></a><a data-wa href="#">WhatsApp</a></p>
  </div>
</dialog>
`;
}

function ctaBand({ title = "Have a story, a product or an idea that deserves a film?", text = "Tell us what the film needs to do. We will reply with questions, a direction and a fixed quote.", need } = {}) {
  return `<section class="cta-band" aria-labelledby="cta-title">
  <div class="wrap cta-in">
    <h2 class="h2" id="cta-title">${esc(title)}</h2>
    <div class="cta-side">
      <p>${esc(text)}</p>
      <div class="actions"><a class="btn light" href="${need ? contactFor(need) : "/contact/"}">Start a project</a><a class="link-arrow on-dark" data-wa href="#">Message on WhatsApp ${arrow}</a></div>
    </div>
  </div>
</section>`;
}

const SOCIAL_ICONS = {
  youtube: ["YouTube", '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.2 9.3v5.4l4.8-2.7z" fill="currentColor" stroke="none"/>'],
  instagram: ["Instagram", '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/>'],
  linkedin: ["LinkedIn", '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.6v5.9M8 7.5v.1M11.8 16.5v-5.9M11.8 13.4c0-1.7 1-2.8 2.3-2.8s2.2 1 2.2 2.8v3.1"/>']
};
function socialList() {
  return `<ul class="social" aria-label="Amble Films on social media">${Object.entries(SITE.social).map(([k, url]) => SOCIAL_ICONS[k]
    ? `<li><a href="${url}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SOCIAL_ICONS[k][1]}</svg><span>${SOCIAL_ICONS[k][0]}</span><span class="sr-only"> (opens in a new tab)</span></a></li>` : "").join("")}</ul>`;
}

function footer(extraScripts = "") {
  const svcLinks = SERVICES.map(s => `<li><a href="/services/${s.slug}/">${esc(svcShort(s))}</a></li>`).join("");
  return `<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="logo foot-logo" href="/" aria-label="Amble Films, home"><svg class="logo-art" viewBox="0 0 765 344" aria-hidden="true"><use href="#amble-letters"/><use href="#amble-bear-art"/></svg></a>
        <p>${esc(SITE.tagline)} A film studio working with clients anywhere.</p>
      </div>
      <nav aria-labelledby="fn-studio"><h2 id="fn-studio">Studio</h2><ul><li><a href="/work/">Work</a></li><li><a href="/industries/">Industries</a></li><li><a href="/studio/">The studio</a></li><li><a href="/process/">Process</a></li><li><a href="/contact/">Start a project</a></li></ul></nav>
      <nav aria-labelledby="fn-services"><h2 id="fn-services">Services</h2><ul>${svcLinks}</ul></nav>
      <div><h2>Contact</h2><ul><li><a data-email href="#"></a></li><li><a data-wa href="#">WhatsApp ${esc(SITE.whatsappDisplay)}</a></li></ul>${socialList()}</div>
    </div>
    <div class="legal"><span>&copy; <span data-year>${new Date().getFullYear()}</span> Amble Films</span><a href="/privacy/">Privacy</a></div>
  </div>
</footer>

<dialog class="player" id="player" aria-labelledby="player-title">
  <div class="player-top"><p class="player-title" id="player-title"></p><button class="player-close" id="player-close" type="button">Close</button></div>
  <div class="stage" id="stage"></div>
</dialog>
${extraScripts}
<script src="/assets/site.js?v=${V.js}" defer></script>
<script src="/bear.js?v=${V.bear}" defer></script>
</body>
</html>
`;
}

/* ---------------- Film components ---------------- */

const filmData = list => '<script type="application/json" id="film-data">' + JSON.stringify(Object.fromEntries(list.map(f => [f.id, {
  title: f.title + (f.series ? " · " + f.series : ""), poster: f.poster + "-1600.jpg", versions: f.versions }]))).replace(/</g, "\\u003c") + "</script>";
const reelData = () => '<script type="application/json" id="reel-data">' + JSON.stringify(REEL).replace(/</g, "\\u003c") + "</script>";

function filmCard(f, { eager = false, sizes = "(max-width: 760px) 100vw, 50vw" } = {}) {
  const v0 = f.versions[0];
  const langs = f.versions.length > 1
    ? `<div class="langs" role="group" aria-label="Language">${f.versions.map((v, i) => `<button type="button" data-lang="${v.lang}" aria-pressed="${i === 0}">${esc(v.label)}</button>`).join("")}</div>` : "";
  const byline = [f.series, f.kind === "client" && f.client ? "For " + f.client.replace(/^An? /, m => m.toLowerCase()) : ""].filter(Boolean).join(" · ");
  return `<article class="film" data-film="${f.id}" data-cat="${f.category}" data-lang="${v0.lang}">
  <button class="film-media" type="button" data-play aria-label="Play ${esc(f.title)}">
    <img src="${f.poster}-800.jpg" srcset="${f.poster}-800.jpg 800w, ${f.poster}-1600.jpg 1600w" sizes="${sizes}" width="1600" height="900" alt="${esc(f.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    <span class="play" aria-hidden="true"><svg viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5v11l9.5-5.5z"/></svg></span>
  </button>
  <div class="film-cap">
    <p class="tags"><span>${esc(CATEGORIES[f.category] || f.category)}</span><span>${esc(KINDS[f.kind]?.label || "")}</span></p>
    <h3 class="h3">${esc(f.title)}</h3>
    ${byline ? `<p class="meta">${esc(byline)}</p>` : ""}
    <div class="film-row">${langs}<span class="meta len" data-length>${esc(v0.length)}${f.versions.length > 1 ? " · " + esc(v0.label) : ""}</span></div>
  </div>
</article>`;
}

function reelFigure() {
  return `<figure class="reel">
    <video data-reel data-large="${REEL.large}" data-small="${REEL.small}" poster="${REEL.poster}" muted loop playsinline preload="none" aria-hidden="true" width="1920" height="1080"></video>
    <button class="reel-btn" type="button" data-play-reel><span class="play" aria-hidden="true"><svg viewBox="0 0 14 14" fill="currentColor"><path d="M3 1.5v11l9.5-5.5z"/></svg></span><span>Watch the reel</span></button>
  </figure>`;
}

const pageHero = ({ eyebrow, h1, lead, actions = "", crumb = "" }) => `<section class="page-hero">
  <div class="wrap">
    ${crumb}
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}
    <h1 class="h1">${esc(h1)}</h1>
    ${lead ? `<p class="lead">${esc(lead)}</p>` : ""}
    ${actions ? `<div class="actions">${actions}</div>` : ""}
  </div>
</section>`;

const secHead = (eyebrow, title, id, aside = "") => `<div class="sec-head">
      <div>${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ""}<h2 class="h2" id="${id}">${esc(title)}</h2></div>
      ${aside ? `<div class="sec-aside">${aside}</div>` : ""}
    </div>`;

const stepsCompact = () => `<ol class="steps-compact">${STEPS.map((s, i) => `<li><span class="num">${pad(i + 1)}</span><h3 class="h3">${s.name}</h3><p>${esc(s.line)}</p></li>`).join("")}</ol>`;

/* ---------------- Writing pages ---------------- */

const written = [];
function write(p, html, { sitemap = true, priority = "0.7" } = {}) {
  const file = p === "/404" ? "404.html" : path.join(p.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.join(ROOT, path.dirname(file)), { recursive: true });
  // Real links in the HTML itself, so email and WhatsApp work without scripts
  const wa = "https://wa.me/" + SITE.phone.replace(/\D/g, "") + "?text=" + encodeURIComponent("Hi Amble Films, I'd like to talk about a film.");
  html = html.replace(/<a data-email href="#"><\/a>/g, `<a data-email href="mailto:${SITE.email}">${SITE.email}</a>`)
             .replace(/data-wa href="#"/g, `data-wa href="${wa}" target="_blank" rel="noopener"`);
  fs.writeFileSync(path.join(ROOT, file), html);
  if (sitemap) written.push([p, priority]);
}

export { socialList, head, header, footer, ctaBand, filmCard, filmData, reelData, reelFigure, pageHero, secHead, stepsCompact, write, written, esc, svc, svcShort, contactFor, arrow, pad, ld, ORG, crumbs, FILMS, REEL, TODAY, ROOT, SITE, CATEGORIES, KINDS, SERVICES, INDUSTRIES, STEPS, FAQ };

