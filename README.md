# Amble Films website

Static site hosted on Netlify. Every page is plain HTML generated from the files in `/content`, so the host needs no build step.

## Changing a film

1. Put the new `.mp4` (1080p) in `/videos`, and optionally a 720p version that phones will play instead.
2. Put two 16:9 poster frames in `/assets/img`, named `NAME-800.jpg` and `NAME-1600.jpg`.
3. Edit `/content/films.json` (films appear in the order listed; the first is shown largest on the Work page):
   - `kind`: `client`, `studio`, `concept` or `study` (shown as Client film, Studio film, Concept film or Study)
   - `category`: `brand`, `product`, `advertising`, `explainer`, `education` or `concepts`
   - `services`: the service pages the film appears on, e.g. `["brand-films"]`
   - `featured: true` puts it on the home page (up to three; the first is shown largest)
   - `src` (1080p), `small` (optional 720p), `length`
   - The `reel` block is the showreel on the home and work pages
4. Run `node tools/build.mjs` from this folder, then commit everything it changed.

Category filters on the Work page appear automatically once films span more than one category. Each of the six
categories always gets an introduction card on the Work page, so a category with no films never looks empty.

## Colour themes

Three palettes share one stylesheet: `original-black`, `warm-dark` and `light-cream` (tokens at the top of `/assets/site.css`).
`DEFAULT_THEME` in `/tools/lib.mjs` decides what visitors see. To compare them, open a Netlify preview (or localhost) with
`?theme=warm-dark` etc., or use the switcher in the bottom-left corner. The switcher and `?theme=` only work on preview
hosts; amblefilms.in ignores them and never loads `/assets/preview.js`.

To make a theme final: set `DEFAULT_THEME` to it, set `PREVIEW_THEMES` to `false`, rebuild.

## Stock footage

Only through `stockVisual()` in `/tools/lib.mjs`, which always adds the caption "Illustrative footage: licensed stock,
graded by Amble Films. Not client work." Every asset must be recorded in `docs/stock-asset-licenses.md` first.
Never list stock in `films.json`.

## Changing words

- Services, industries, categories, process steps and FAQs: `/content/site.mjs`
- Everything else on a page: `/tools/pages.mjs`
- Shared header, footer, film cards, the "Before you commit" section: `/tools/lib.mjs`

Then run `node tools/build.mjs`.

## Not public

`/content`, `/tools`, `/docs` and this README return 404 on the site (`_redirects`).
`docs/preview-first-offer.md` is the draft commercial offer awaiting approval.

## Netlify badge

The floating "Powered by Netlify" badge is added by Netlify, not by this code. Turn it off in Netlify:
Project configuration → General → Powered by Netlify badge.

## Enquiries

The form sends through FormSubmit to the address in `/assets/site.js` (`EMAIL`). Without JavaScript it posts to the same address directly.
