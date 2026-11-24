# Amble Films website

Static site hosted on Netlify. Every page is plain HTML generated from the files in `/content`, so the host needs no build step.

## Changing a film

1. Put the new `.mp4` in `/videos`.
2. Put two 16:9 poster frames in `/assets/img`, named `NAME-800.jpg` and `NAME-1600.jpg`.
3. Edit `/content/films.json`:
   - `kind`: `client`, `concept` or `study` (shown on the film as Client film, Concept film or Study)
   - `category`: `brand`, `product`, `advertising`, `explainer`, `education` or `experiments`
   - `services`: the service pages the film appears on as an example, e.g. `["brand-films"]`
   - `featured: true` puts it on the home page (up to three)
   - The `reel` block is the showreel on the home and work pages
4. Run `node tools/build.mjs` from this folder, then commit everything it changed.

Category filters on the Work page appear automatically once films span more than one category.

## Changing words

- Services, industries, process steps and FAQs: `/content/site.mjs`
- Everything else on a page: `/tools/pages.mjs`
- Shared header, footer and film cards: `/tools/lib.mjs`

Then run `node tools/build.mjs`.

## Design system

`/assets/site.css` starts with the tokens (colour, type, spacing). Change a value there and it changes everywhere.

## Enquiries

The form sends through FormSubmit to the address in `/assets/site.js` (`EMAIL`). Without JavaScript it posts to the same address directly.
