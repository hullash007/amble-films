# Stock asset licence register

Not public: `/docs/*` returns 404 on the website (see `_redirects`).

Every stock asset on amblefilms.in is listed here. **Do not add a stock file to the site without adding a row first.**
Stock footage is never presented as Amble Films work: every use carries the caption
*"Illustrative footage: licensed stock, graded by Amble Films. Not client work."* (`STOCK_NOTE` in `content/site.mjs`),
and stock is never listed in `content/films.json`.

## Licence basis (Mixkit)

- Mixkit (owned by Envato) issues **two different video licences, chosen per clip**: the *Stock Video Free License*
  (commercial use allowed) and the *Stock Video Restricted License* (personal, non-commercial use only).
  Each clip's own page shows which one applies, so each clip below was checked individually on its own page.
- Mixkit's video page states that Free License clips can be used in commercial projects, including online marketing
  and ads, with no watermark and no attribution required. Restricted License clips are for personal projects only.
- Mixkit User Terms: you receive a non-exclusive licence, not ownership; Items may not be redistributed as stock or
  made available to third parties on their own; for some Items a third-party component (such as a trademark or brand)
  may be under different terms. Hence the trademark check in the last column.
- Licence pages: https://mixkit.co/license/ (Stock Video Free License) · Terms: https://mixkit.co/terms/

## Assets in use

| Site file(s) | Source | Original asset URL | Creator | Licence (as shown on the item page) | Proof | Downloaded | Commercial use | Attribution | Restrictions and checks | Used on |
|---|---|---|---|---|---|---|---|---|---|---|
| `videos/stock/smoke-720.mp4`, `smoke-480.mp4`, `assets/img/stock/smoke-800.jpg`, `smoke-1600.jpg` | Mixkit | https://mixkit.co/free-stock-video/soft-and-traslucent-smoke-flows-up-on-a-dark-background-50956/ | Mixkit (not named on page) | Stock Video Free License | Item page label read 2026-11-24; file `assets.mixkit.co/videos/50956/50956-1080.mp4` | 2026-11-24 | Yes | Not required | No redistribution as stock. Every frame checked: no people, logos, products or property. | Work page, "Product films" category card (still) |
| `videos/stock/inks-720.mp4`, `inks-480.mp4`, `assets/img/stock/inks-*.jpg` | Mixkit | https://mixkit.co/free-stock-video/vibrant-colored-inks-interacting-with-a-black-liquid-creating-flowing-99927/ | Mixkit (not named on page) | Stock Video Free License | Item page label read 2026-11-24; file `.../99927/1717719862/99927-video-1080.mp4` | 2026-11-24 | Yes | Not required | No redistribution as stock. Every frame checked: abstract ink only. | Work page, "Advertising" category card (still) |
| `videos/stock/confetti-720.mp4`, `confetti-480.mp4`, `assets/img/stock/confetti-*.jpg` | Mixkit | https://mixkit.co/free-stock-video/close-up-shot-of-metallic-confetti-falling-over-a-black-99994/ | Mixkit (not named on page) | Stock Video Free License | Item page label read 2026-11-24; file `.../99994/1718655757/99994-video-1080.mp4` | 2026-11-24 | Yes | Not required | No redistribution as stock. Every frame checked: abstract particles only. | Work page, "Creative concepts" category card (still) |
| `videos/stock/bokeh-720.mp4`, `bokeh-480.mp4`, `assets/img/stock/bokeh-*.jpg` | Mixkit | https://mixkit.co/free-stock-video/monochrome-bokeh-lights-floating-softly-99828/ | Mixkit (not named on page) | Stock Video Free License | Item page label read 2026-11-24; file `.../99828/1717025246/99828-video-1080.mp4` | 2026-11-24 | Yes | Not required | No redistribution as stock. Every frame checked: out-of-focus lights only. | Ongoing Video Production service page (loop) |

All four were trimmed to 10 seconds, colour graded to the Amble palette, re-encoded (720p and 480p, no audio) and given
still posters. Original downloads are kept outside the repository in `C:\Users\mengh\amble-tools\stock-src\`.

## Checked and rejected

| Clip | Why rejected |
|---|---|
| https://mixkit.co/free-stock-video/bright-orange-and-blue-ink-exploding-45675/ | **Restricted License** (personal use only) |
| https://mixkit.co/free-stock-video/layer-of-luminous-particles-in-space-18140/ | **Restricted License** (personal use only) |
| https://mixkit.co/free-stock-video/aerial-view-of-the-glass-corporate-buildings-of-a-big-49845/ | Free License, but a third-party trademark (a Google "G" logo) is visible on a building |
| https://mixkit.co/free-stock-video/close-up-view-of-a-elegant-watch-44070/ | Free License, but the watch dial may carry a maker's mark; magenta grade also clashes with the brand |
| https://mixkit.co/free-stock-video/tour-high-above-a-city-at-dusk-41375/ | Free License, but too dark to read on screen |

## Adding a new asset

1. Open the clip's own page and confirm it says **Stock Video Free License** (not Restricted). Record the date.
2. Watch every second: no readable logos, brand names, recognisable products, artworks or identifiable private property.
   Prefer clips without identifiable people; if people appear, never imply they endorse Amble Films.
3. Add a row above before the file is committed.
4. Add it to `STOCK` in `content/site.mjs` and use it only through `stockVisual()`, which adds the caption.
