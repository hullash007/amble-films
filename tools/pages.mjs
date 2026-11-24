// Amble Films: one function per page. Shared pieces come from build.mjs.
import {
  socialList, head, header, footer, ctaBand, filmCard, filmData, reelData, reelFigure, stockVisual, previewFirst, pageHero, secHead, stepsCompact,
  write, esc, svc, contactFor, arrow, playIcon, pad, ld, ORG, crumbs, FILMS, REEL, SITE, CATEGORIES, CATEGORY_INTROS, KINDS,
  SERVICES, INDUSTRIES, STEPS, FAQ
} from "./lib.mjs";

const T = s => s + " | Amble Films";
const crumbNav = list => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${list.map(([n, h], i) =>
  i === list.length - 1 ? `<li aria-current="page">${esc(n)}</li>` : `<li><a href="${h}">${esc(n)}</a></li>`).join("")}</ol></nav>`;

/* ======================= HOME ======================= */
function home() {
  const featured = FILMS.filter(f => f.featured).slice(0, 3);
  const used = featured.length ? featured : FILMS.slice(0, 2);
  const schema = ld({ "@context": "https://schema.org", "@graph": [
    { ...ORG, "@id": SITE.url + "/#org", logo: SITE.url + "/icon-512.png", email: SITE.email, telephone: SITE.phone,
      description: SITE.description, founder: { "@type": "Person", name: SITE.founder.name, jobTitle: SITE.founder.role },
      sameAs: Object.values(SITE.social) },
    { "@type": "WebSite", name: SITE.name, url: SITE.url + "/", publisher: { "@id": SITE.url + "/#org" } }
  ] });
  const body = `<main id="main">
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-copy">
    <h1 class="h-hero" id="hero-title">Cinematic films for brands, products and ideas.</h1>
    <div class="hero-foot">
      <p class="lead">Amble Films is a film studio. We write, direct and finish brand, product, advertising, explainer and educational films for organisations anywhere in the world.</p>
      <div class="actions"><a class="btn" href="/contact/">Start a project</a><a class="link-arrow" href="/work/">Explore our work ${arrow}</a></div>
    </div>
  </div>
  <div class="wrap-wide">${reelFigure()}</div>
</section>

<section class="section" aria-labelledby="work-title">
  <div class="wrap">
    ${secHead("Selected work", "Recent films", "work-title", `<a class="link-arrow" href="/work/">Explore all work ${arrow}</a>`)}
    <div class="film-grid home-films${used.length === 1 ? " one" : ""}">
      ${used.map((f, i) => filmCard(f, { lead: i === 0 && used.length === 3 })).join("\n      ")}
    </div>
  </div>
</section>

<section class="section statement" aria-labelledby="studio-title">
  <div class="wrap statement-in">
    <h2 class="eyebrow" id="studio-title">The studio</h2>
    <p class="statement-text">We make films the way a director would, and produce them with the reach of modern tools. Worlds, products and ideas, shown the way you imagine them and finished with care.</p>
    <a class="link-arrow" href="/studio/">About the studio ${arrow}</a>
  </div>
</section>

<section class="section alt" aria-labelledby="services-title">
  <div class="wrap">
    ${secHead("Services", "What we make", "services-title", `<p class="lead">Every film starts with a brief and a fixed quote.</p>`)}
    <ul class="index-list">
      ${SERVICES.map((s, i) => `<li><a href="/services/${s.slug}/"><span class="num">${pad(i + 1)}</span><span class="name">${esc(s.name)}</span><span class="desc">${esc(s.line)}</span>${arrow}</a></li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="who-title">
  <div class="wrap">
    ${secHead("Who we work with", "Films for organisations of every kind", "who-title", `<a class="link-arrow" href="/industries/">How we help each one ${arrow}</a>`)}
    <ul class="seg-grid">
      ${INDUSTRIES.map(x => `<li><a href="/industries/#${x.id}"><h3 class="h3">${esc(x.name)}</h3><p>${esc(x.line)}</p></a></li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="section dark" aria-labelledby="why-title">
  <div class="wrap">
    ${secHead("Why Amble Films", "Directed with intent. Finished with care.", "why-title")}
    <ul class="points">
      <li><h3 class="h3">A director on every frame</h3><p>Every shot is chosen, cut and graded by a director, so the film looks intended rather than produced by chance.</p></li>
      <li><h3 class="h3">Built around your objective</h3><p>We start from what the film must achieve and who must watch it, then design the story to do that job.</p></li>
      <li><h3 class="h3">Worlds without limits</h3><p>Settings, scale and characters that would be impractical to shoot become part of the creative palette.</p></li>
      <li><h3 class="h3">One director, brief to delivery</h3><p>The person you brief is the person who directs your film, wherever in the world you are.</p></li>
    </ul>
  </div>
</section>

${previewFirst()}

<section class="section" aria-labelledby="process-title">
  <div class="wrap">
    ${secHead("Process", "From brief to final film", "process-title", `<a class="link-arrow" href="/process/">How we work ${arrow}</a>`)}
    ${stepsCompact()}
  </div>
</section>

${ctaBand()}
</main>`;
  write("/", head({ path: "/", title: "Amble Films | Cinematic films for brands, products and ideas", description: SITE.description, schema })
    + header("/") + body + footer(filmData(used) + reelData()), { priority: "1.0" });
}

/* ======================= WORK ======================= */
// Every category gets an introduction. A category shows its own films first; with none yet, it shows a related
// Amble Films film or, failing that, a captioned licensed stock still. It never shows an empty state.
function categoryCard(c, used) {
  const intro = CATEGORY_INTROS[c], own = FILMS.filter(f => f.category === c);
  const s = intro.service ? svc(intro.service) : null;
  const img = f => `<img src="${f.poster}-800.jpg" width="800" height="450" alt="${esc(f.alt)}" loading="lazy" decoding="async">`;
  let media = "", status = "";
  if (own.length) {
    // show a different film from the one leading the grid above, where there is one
    const pick = own.find(f => f !== FILMS[0] && !used.has(f)) || own[0]; used.add(pick);
    media = `<button class="cat-media" type="button" data-filter-to="${c}" aria-label="Show ${esc(CATEGORIES[c])}">${img(pick)}</button>`;
    status = `${own.length} ${own.length === 1 ? "film" : "films"} above`;
  } else if (intro.visual) {
    media = stockVisual(intro.visual, { still: true });
  } else {
    const related = FILMS.find(f => intro.service && (f.services || []).includes(intro.service) && !used.has(f))
      || FILMS.find(f => intro.service && (f.services || []).includes(intro.service));
    if (related) { used.add(related);
      media = `<div class="cat-media">${img(related)}<span class="cat-note">Related film: ${esc(related.title)}</span></div>`;
      status = "Shown in our " + (KINDS[related.kind]?.label || "film").toLowerCase() + "s"; }
  }
  const link = own.length ? `<button class="link-arrow" type="button" data-filter-to="${c}">Watch ${esc(CATEGORIES[c].toLowerCase())} ${arrow}</button>`
    : s ? `<a class="link-arrow" href="/services/${s.slug}/">${esc(s.name)}: what you receive ${arrow}</a>`
    : `<a class="link-arrow" href="/contact/?need=Not%20sure%20yet">Explore an idea with us ${arrow}</a>`;
  return `<li class="cat">${media}<div class="cat-body">${status ? `<p class="cat-status">${esc(status)}</p>` : ""}<h3 class="h3">${esc(CATEGORIES[c])}</h3><p>${esc(intro.line)}</p>${link}</div></li>`;
}

function work() {
  const cats = Object.keys(CATEGORIES).filter(c => FILMS.some(f => f.category === c));
  const kinds = Object.keys(KINDS).filter(k => FILMS.some(f => f.kind === k));
  const filters = cats.length > 1 ? `<div class="filters" role="group" aria-label="Filter films by category">
      <button type="button" data-filter="all" aria-pressed="true">All films</button>
      ${cats.map(c => `<button type="button" data-filter="${c}" aria-pressed="false">${esc(CATEGORIES[c])}</button>`).join("\n      ")}
    </div>` : "";
  const legend = `<p class="legend">${kinds.map(k => `<span><b>${esc(KINDS[k].label)}</b> ${esc(KINDS[k].note)}</span>`).join("")}</p>`;
  const body = `<main id="main">
${pageHero({ eyebrow: "Our work", h1: "Films that do the talking.", lead: "Every film is labelled, so you always know whether you are watching work made for a client, a film made for our own studio or a concept." })}
<section class="section tight-top" id="films" aria-labelledby="films-title">
  <div class="wrap">
    <h2 class="sr-only" id="films-title">All films</h2>
    <div class="work-bar">${filters}${legend}</div>
    <div class="film-grid work" data-film-grid>
      ${FILMS.map((f, i) => filmCard(f, { eager: i === 0, lead: i === 0, summary: true })).join("\n      ")}
    </div>
  </div>
</section>
<section class="section alt" aria-labelledby="cats-title">
  <div class="wrap">
    ${secHead("What we make", "Six kinds of film", "cats-title", `<p class="lead">Our portfolio is growing. Where a category has no film of ours yet, we say so plainly.</p>`)}
    <ul class="cat-grid">
      ${(() => { const used = new Set(); return Object.keys(CATEGORIES).map(c => categoryCard(c, used)); })().join("\n      ")}
    </ul>
  </div>
</section>
<section class="section" aria-labelledby="showreel-title">
  <div class="wrap">
    ${secHead("Showreel", "Moments from our films", "showreel-title")}
    ${reelFigure()}
  </div>
</section>
${ctaBand({ title: "Looking for something specific?", text: "Tell us about your project and we will show you how we would approach it." })}
</main>`;
  const lead = FILMS[0];
  write("/work/", head({ path: "/work/", title: T("Our work: brand, advertising and educational films"), description: "Films by Amble Films, each labelled as client work, a studio film or a concept: brand, product, advertising, explainer and educational films.",
    schema: crumbs([["Work", "/work/"]]), image: lead.poster + "-1600.jpg", imageAlt: lead.alt, imageW: 1600, imageH: 900 })
    + header("/work/") + body + footer(filmData(FILMS) + reelData()), { priority: "0.9" });
}

/* ======================= SERVICES ======================= */
function services() {
  const body = `<main id="main">
${pageHero({ eyebrow: "Services", h1: "What we make.", lead: "Films for brands, products, campaigns and learning. Each one is written for a purpose, directed by people and finished to a cinematic standard." })}
<section class="section tight-top" aria-label="All services">
  <div class="wrap">
    <ol class="svc-list">
      ${SERVICES.map((s, i) => `<li>
        <span class="num">${pad(i + 1)}</span>
        <div class="svc-main"><h2 class="h2"><a href="/services/${s.slug}/">${esc(s.name)}</a></h2><p>${esc(s.lead)}</p></div>
        <ul class="svc-uses" aria-label="Typical uses">${s.uses.slice(0, 3).map(u => `<li>${esc(u)}</li>`).join("")}</ul>
        <a class="link-arrow" href="/services/${s.slug}/" aria-hidden="true" tabindex="-1">Explore ${arrow}</a>
      </li>`).join("\n      ")}
    </ol>
    <div class="unsure">
      <h2 class="h3">Not sure which you need?</h2>
      <p>Describe what you want the film to do. We will suggest the right format.</p>
      <a class="btn ghost" href="/contact/?need=Not%20sure%20yet">Ask us</a>
    </div>
  </div>
</section>
${ctaBand()}
</main>`;
  write("/services/", head({ path: "/services/", title: T("Services: brand, product, advertising and educational films"),
    description: "Brand films, product films, advertising, explainers, educational films, launch and campaign content, and ongoing video production.",
    schema: crumbs([["Services", "/services/"]]) }) + header("/services/") + body + footer(), { priority: "0.9" });
}

function serviceDetail(s) {
  const p = "/services/" + s.slug + "/";
  const examples = FILMS.filter(f => (f.services || []).includes(s.slug));
  const others = SERVICES.filter(o => o !== s);
  const list = (title, items) => `<div class="detail-col"><h2 class="label">${title}</h2><ul class="ticks">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>`;
  const rest = examples.slice(1);
  const exampleBlock = rest.length
    ? `<div class="film-grid${rest.length === 1 ? " one" : ""}">${rest.map(f => filmCard(f, { summary: true })).join("")}</div>`
    : `<div class="no-examples"><p>Films made this way get the same craft as every film in our portfolio: a director on every frame, one consistent look and a finish made with care. Tell us what you publish and how often, and we will show you how a run of films would come together.</p><div class="actions"><a class="btn ghost" href="${contactFor(s.need)}">Discuss your project</a><a class="link-arrow" href="/work/">Watch our films ${arrow}</a></div></div>`;
  // The hero shows the strongest related Amble Films film; a captioned stock loop only when there is none.
  const heroFilm = examples[0];
  const heroVisual = heroFilm
    ? `<div class="wrap-wide svc-visual"><article class="film film-hero" data-film="${heroFilm.id}" data-cat="${heroFilm.category}" data-kind="${heroFilm.kind}">
    <button class="film-media" type="button" data-play aria-label="Play ${esc(heroFilm.title)}, ${esc(heroFilm.length)}">
      <img src="${heroFilm.poster}-800.jpg" srcset="${heroFilm.poster}-800.jpg 800w, ${heroFilm.poster}-1600.jpg 1600w" sizes="100vw" width="1600" height="900" alt="${esc(heroFilm.alt)}" fetchpriority="high" decoding="async">
      <span class="play" aria-hidden="true">${playIcon}</span>
      <span class="hero-film-cap"><b>${esc(heroFilm.title)}</b> ${esc(KINDS[heroFilm.kind].label)} · ${esc(heroFilm.length)}</span>
    </button></article></div>`
    : s.visual ? `<div class="wrap-wide svc-visual">${stockVisual(s.visual)}</div>` : "";
  const body = `<main id="main">
${pageHero({ crumb: crumbNav([["Services", "/services/"], [s.name, p]]), eyebrow: s.name, h1: s.h1, lead: s.lead,
  actions: `<a class="btn" href="${contactFor(s.need)}">Start a project</a>` + (examples.length
    ? `<a class="link-arrow" href="#featured">Watch a related film ${arrow}</a>` : `<a class="link-arrow" href="/work/">See our work ${arrow}</a>`) })}
${heroVisual ? `<section class="section tight-top hero-visual" id="featured" aria-label="${heroFilm ? "Featured film" : "Illustrative footage"}">${heroVisual}</section>` : ""}
<section class="section tight-top" aria-label="What is included">
  <div class="wrap detail-grid">
    ${list("What you receive", s.receive)}
    ${list("Where it is used", s.uses)}
    ${list("Typical deliverables", s.deliver)}
  </div>
</section>
<section class="section alt" aria-labelledby="approach-title">
  <div class="wrap approach">
    <div><p class="eyebrow">Our approach</p><h2 class="h2" id="approach-title">How we make it</h2></div>
    <div><p class="approach-text">${esc(s.approach)}</p>${stepsCompact()}<a class="link-arrow" href="/process/">The full process ${arrow}</a></div>
  </div>
</section>
${rest.length || !examples.length ? `<section class="section" id="examples" aria-labelledby="ex-title">
  <div class="wrap">
    ${secHead(rest.length ? "More examples" : "Our films", rest.length ? "More related films" : "The same craft, every time", "ex-title")}
    ${exampleBlock}
  </div>
</section>` : ""}
<section class="section ${rest.length || !examples.length ? "tight-top" : "short-top"}" aria-labelledby="other-title">
  <div class="wrap">
    <h2 class="label" id="other-title">Other services</h2>
    <ul class="chips-links">${others.map(o => `<li><a href="/services/${o.slug}/">${esc(o.name)}</a></li>`).join("")}</ul>
  </div>
</section>
${ctaBand({ title: "Planning " + (/^[AEIOU]/.test(s.need) ? "an " : "a ") + s.need.toLowerCase().replace(/s$/, "") + "?", text: "Tell us what it needs to do and who it is for. We will reply with questions, a direction and a fixed quote.", need: s.need })}
</main>`;
  const schema = ld({ "@context": "https://schema.org", "@type": "Service", name: s.name, serviceType: s.name, description: s.meta,
    url: SITE.url + p, provider: ORG, areaServed: "Worldwide" }) + crumbs([["Services", "/services/"], [s.name, p]]);
  write(p, head({ path: p, title: T(s.title), description: s.meta, schema }) + header(p) + body + footer(examples.length ? filmData(examples) : ""), { priority: "0.8" });
}

/* ======================= INDUSTRIES ======================= */
function industries() {
  const body = `<main id="main">
${pageHero({ eyebrow: "Who we work with", h1: "Films for organisations of every kind.", lead: "From early-stage startups to established companies, institutions and agencies. Here is how film can help each of them." })}
<section class="section tight-top" aria-label="Industries">
  <div class="wrap">
    <p class="meta note">These are the kinds of organisation our films are made for. It is not a client list.</p>
    <ol class="ind-list">
      ${INDUSTRIES.map((x, i) => `<li id="${x.id}">
        <span class="num">${pad(i + 1)}</span>
        <div class="ind-head"><h2 class="h2">${esc(x.name)}</h2><p class="lead">${esc(x.line)}</p></div>
        <div class="ind-body">
          <h3 class="label">How film helps</h3>
          <ul class="ticks">${x.uses.map(u => `<li>${esc(u)}</li>`).join("")}</ul>
          <h3 class="label">Relevant services</h3>
          <ul class="chips-links">${x.services.map(sl => `<li><a href="/services/${sl}/">${esc(svc(sl).name)}</a></li>`).join("")}</ul>
        </div>
      </li>`).join("\n      ")}
    </ol>
  </div>
</section>
${ctaBand({ title: "Not on the list?", text: "If your organisation needs to explain, sell or teach something, a film can help. Tell us what you have in mind." })}
</main>`;
  write("/industries/", head({ path: "/industries/", title: T("Who we work with"), description: "How Amble Films helps brands, startups, e-commerce, corporations, education, agencies and publishers with cinematic film.",
    schema: crumbs([["Industries", "/industries/"]]) }) + header("/industries/") + body + footer(), { priority: "0.8" });
}

/* ======================= STUDIO ======================= */
function studio() {
  const body = `<main id="main">
${pageHero({ eyebrow: "The studio", h1: "A film studio, directed by people.", lead: "Amble Films makes cinematic films for brands, products and ideas. We bring the discipline of traditional filmmaking to AI-assisted production, and we put creative direction first." })}
<section class="section tight-top" aria-label="A still from our films">
  <div class="wrap-wide"><figure class="still"><img src="${REEL.poster}" width="1920" height="1080" alt="${esc(REEL.alt)}" loading="lazy" decoding="async"></figure></div>
</section>
<section class="section" aria-labelledby="believe-title">
  <div class="wrap">
    ${secHead("What we believe", "Four ideas behind every film", "believe-title")}
    <ul class="points light">
      <li><h3 class="h3">The idea comes first</h3><p>A film is only as strong as the single thing it has to say. We find that before we make anything.</p></li>
      <li><h3 class="h3">Every frame is chosen</h3><p>Nothing reaches the final cut by accident. Composition, light and timing are decisions, not defaults.</p></li>
      <li><h3 class="h3">Clarity is a craft</h3><p>Whether the subject is a product, a service or a lesson, the audience should understand it the first time.</p></li>
      <li><h3 class="h3">Honest about the work</h3><p>We label our work clearly, quote a fixed price and tell you what is possible before we begin.</p></li>
    </ul>
  </div>
</section>
<section class="section dark" aria-labelledby="ai-title">
  <div class="wrap two-col">
    <div><p class="eyebrow">People and tools</p><h2 class="h2" id="ai-title">Human direction. AI-assisted production.</h2></div>
    <div class="prose-dark">
      <p>AI changes how a film is produced, not what makes it good. Story, performance, composition, pacing and sound still decide whether a film works, and those decisions are made by people.</p>
      <p>We use generative tools to build worlds, characters and shots that would otherwise need locations, sets and crews. Then we select, direct, edit, grade and mix the result by hand. Most of what the tools generate never reaches the final cut.</p>
    </div>
  </div>
</section>
<section class="section" aria-labelledby="approach-title">
  <div class="wrap">
    ${secHead("Our approach", "Story, look and finish", "approach-title")}
    <ul class="points three">
      <li><h3 class="h3">Story</h3><p>We structure every film around its audience: what they know, what they need and what they should feel at the end.</p></li>
      <li><h3 class="h3">Look</h3><p>Each project gets its own visual language, from palette and lens to character design, kept consistent across every shot.</p></li>
      <li><h3 class="h3">Finish</h3><p>Edit, sound design, music and colour grade are done with the same care as the pictures, because that is where a film becomes cinematic.</p></li>
    </ul>
  </div>
</section>
<section class="section alt" aria-labelledby="remote-title">
  <div class="wrap two-col">
    <div><p class="eyebrow">Working together</p><h2 class="h2" id="remote-title">Wherever you are.</h2></div>
    <div>
      <p class="lead">We work remotely with clients anywhere. Briefs, reviews and approvals happen over calls and shared review links, arranged around your time zone.</p>
      <p class="lead">The person you brief is the person who directs your film.</p>
      <p class="sign"><b>${esc(SITE.founder.name)}</b><span>${esc(SITE.founder.role)}, Amble Films</span></p>
    </div>
  </div>
</section>
${ctaBand()}
</main>`;
  write("/studio/", head({ path: "/studio/", title: T("The studio"), description: "Amble Films is a film studio that combines human creative direction with AI-assisted production, working remotely with clients anywhere.",
    schema: crumbs([["Studio", "/studio/"]]) }) + header("/studio/") + body + footer(), { priority: "0.7" });
}

/* ======================= PROCESS ======================= */
function processPage() {
  const body = `<main id="main">
${pageHero({ eyebrow: "Our process", h1: "A clear path from brief to final film.", lead: "Four stages, with your input and your approval built into each one. You know the plan and the full price before production starts." })}
<section class="section tight-top" aria-label="The four stages">
  <div class="wrap">
    <ol class="stages">
      ${STEPS.map((s, i) => `<li>
        <span class="num">${pad(i + 1)}</span>
        <div class="stage-main"><h2 class="h2">${s.name}</h2><p>${esc(s.text)}</p></div>
        <dl class="stage-io"><div><dt>Your input</dt><dd>${esc(s.you)}</dd></div><div><dt>You receive</dt><dd>${esc(s.get)}</dd></div></dl>
      </li>`).join("\n      ")}
    </ol>
  </div>
</section>
${previewFirst()}
<section class="section" aria-labelledby="faq-title">
  <div class="wrap faq-layout">
    <div><p class="eyebrow">Questions</p><h2 class="h2" id="faq-title">What clients ask before they start</h2></div>
    <div class="faq">
      ${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n      ")}
    </div>
  </div>
</section>
${ctaBand()}
</main>`;
  const schema = ld({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) })
    + crumbs([["Process", "/process/"]]);
  write("/process/", head({ path: "/process/", title: T("Our process"), description: "How Amble Films makes a film: brief, direction, production and delivery, with your input and approval at every stage.", schema })
    + header("/process/") + body + footer(), { priority: "0.7" });
}

/* ======================= CONTACT ======================= */
const NEEDS = [...SERVICES.map(s => s.need), "Not sure yet"];
function contact() {
  const sel = (id, name, label, opts) => `<div class="field"><label for="${id}">${label} <span class="opt">(optional)</span></label><select id="${id}" name="${name}"><option value="">Choose one</option>${opts.map(o => `<option>${esc(o)}</option>`).join("")}</select></div>`;
  const body = `<main id="main">
<section class="contact" aria-labelledby="contact-title">
  <div class="wrap contact-grid">
    <div class="contact-intro">
      <p class="eyebrow">Start a project</p>
      <h1 class="h1" id="contact-title">Tell us about your film.</h1>
      <p class="lead">A few details are enough to begin. We reply to every enquiry by email, usually with a few questions and a suggested next step.</p>
      <div class="direct">
        <h2 class="label">Prefer to talk first?</h2>
        <ul class="direct-list"><li><a data-email href="#"></a></li><li><a data-wa href="#">WhatsApp ${esc(SITE.whatsappDisplay)}</a></li></ul>
        ${socialList()}
      </div>
    </div>
    <form class="enquiry" data-enquiry action="https://formsubmit.co/${SITE.email}" method="POST" novalidate>
      <input type="hidden" name="_subject" value="Website enquiry">
      <div class="progress" aria-hidden="true"><span data-progress></span></div>
      <p class="step-count" data-step-count aria-live="polite"></p>
      <fieldset class="step" data-step="1">
        <legend class="h3">What would you like to make?</legend>
        <div class="choices" role="radiogroup" aria-describedby="f-kind-err">
          ${NEEDS.map((n, i) => `<label class="choice"><input type="radio" name="kind" value="${esc(n)}"${i === 0 ? " required" : ""}><span>${esc(n)}</span></label>`).join("\n          ")}
        </div>
        <span class="err" id="f-kind-err"></span>
        <div class="step-nav"><button class="btn" type="button" data-next>Continue</button></div>
      </fieldset>
      <fieldset class="step" data-step="2">
        <legend class="h3">About the film</legend>
        <div class="field wide"><label for="f-msg">What are you looking to create?</label><textarea id="f-msg" name="message" required aria-describedby="f-msg-err" placeholder="What the film is for, and anything you already know about it."></textarea><span class="err" id="f-msg-err"></span></div>
        <div class="field wide"><label for="f-aud">Who is it for? <span class="opt">(optional)</span></label><input id="f-aud" name="audience" placeholder="For example: new customers, investors, Class 8 students"></div>
        ${sel("f-timing", "timing", "Timeline", ["As soon as possible", "Within 1 to 3 months", "Later this year", "Just exploring"])}
        ${sel("f-budget", "budget", "Budget", ["Under ₹50,000", "₹50,000 to ₹2,00,000", "₹2,00,000 to ₹5,00,000", "Above ₹5,00,000", "Not sure yet"])}
        <div class="step-nav"><button class="btn ghost" type="button" data-back>Back</button><button class="btn" type="button" data-next>Continue</button></div>
      </fieldset>
      <fieldset class="step" data-step="3">
        <legend class="h3">How can we reach you?</legend>
        <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required aria-describedby="f-name-err"><span class="err" id="f-name-err"></span></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="f-email-err"><span class="err" id="f-email-err"></span></div>
        <div class="field"><label for="f-company">Company or organisation <span class="opt">(optional)</span></label><input id="f-company" name="company" autocomplete="organization"></div>
        <div class="field"><label for="f-phone">Phone or WhatsApp <span class="opt">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"></div>
        <div class="hp" aria-hidden="true"><label for="f-hp">Leave this empty</label><input id="f-hp" type="text" name="_honey" tabindex="-1" autocomplete="off"></div>
        <div class="step-nav"><button class="btn ghost" type="button" data-back>Back</button><button class="btn" type="submit">Send enquiry</button></div>
        <p class="form-note">Your details are used only to reply to you. <a href="/privacy/">Privacy</a></p>
        <p class="form-status" role="status" aria-live="polite"></p>
      </fieldset>
    </form>
  </div>
</section>
</main>`;
  write("/contact/", head({ path: "/contact/", title: T("Start a project"), description: "Tell Amble Films about the film you need. We reply to every enquiry by email.",
    schema: crumbs([["Start a project", "/contact/"]]) }) + header("/contact/") + body + footer(), { priority: "0.9" });
}

/* ======================= PRIVACY & 404 ======================= */
function privacy() {
  const body = `<main id="main">
${pageHero({ eyebrow: "Privacy", h1: "Your details, and what we do with them.", lead: "In plain words. Last updated 24 November 2026." })}
<section class="section tight-top"><div class="wrap prose">
  <h2>What we collect</h2>
  <p>Only what you choose to send us through the enquiry form, by email or on WhatsApp: your name and email address and, if you give them, your phone number, your organisation, your project type, your audience, your budget range, your timeline and what you tell us about your project.</p>
  <h2>Why we collect it</h2>
  <p>To reply to your enquiry and, if we work together, to make your film. We do not sell your details, add you to a mailing list or share them with anyone for their own use.</p>
  <h2>Who handles it for us</h2>
  <ul>
    <li><b>FormSubmit</b> (formsubmit.co) passes enquiries from the form to our inbox and sends you a copy.</li>
    <li><b>Zoho Mail</b> hosts our email.</li>
    <li><b>WhatsApp</b> carries any messages you send us there.</li>
    <li><b>Netlify</b> hosts this website and, like any web host, keeps short-lived technical logs of visits.</li>
  </ul>
  <h2>Cookies and tracking</h2>
  <p>This site sets no cookies and uses no advertising or analytics trackers. Fonts and images are served from this site itself.</p>
  <h2>How long we keep it</h2>
  <p>As long as we need it to reply to you and to keep our business records. Ask us at any time to see, correct or delete what we hold about you.</p>
  <h2>Contact</h2>
  <p>Write to <a data-email href="#"></a>.</p>
</div></section>
</main>`;
  write("/privacy/", head({ path: "/privacy/", title: T("Privacy"), description: "What Amble Films collects when you get in touch, and what we do with it." }) + header("/privacy/") + body + footer(), { priority: "0.3" });
}

function notFound() {
  const body = `<main id="main">
${pageHero({ eyebrow: "Page not found", h1: "This page has moved, or never existed.", lead: "Try one of these instead.",
  actions: `<a class="btn" href="/">Home</a><a class="link-arrow" href="/work/">Our work ${arrow}</a><a class="link-arrow" href="/services/">Services ${arrow}</a><a class="link-arrow" href="/contact/">Start a project ${arrow}</a>` })}
</main>`;
  write("/404", head({ path: "/404.html", title: T("Page not found"), description: "This page could not be found." }).replace("<head>", '<head>\n<meta name="robots" content="noindex">') + header("") + body + footer(), { sitemap: false });
}

export function buildPages() {
  home(); work(); services(); SERVICES.forEach(serviceDetail); industries(); studio(); processPage(); contact(); privacy(); notFound();
}
