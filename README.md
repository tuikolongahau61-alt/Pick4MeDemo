# Brilla — QR menu recommender demos

Brilla (product name: **PlateUp**) helps diners decide what to order: scan a QR
code, answer a few quick questions, and get a short list of recommended dishes
with reasons. This repo hosts the PlateUp hub, the individual restaurant demos,
and the reusable Brilla engine behind them — served live via GitHub Pages at
**https://vidollet.github.io/Brilla/**.

## PlateUp hub
The main experience — one file serving all restaurants, each with its own skin, a
smart-menu re-rank quiz, a ratings/trust hub, and an order cart.

- [plateup-main.html](plateup-main.html) — the PlateUp hub. [▶ live demo](https://vidollet.github.io/Brilla/plateup-main.html)

## Restaurant demos
- [hana-no-sato.html](hana-no-sato.html) — Hana no Sato (Japanese, Honolulu): 42-dish smart menu, 4-question quiz, EN/JA/KO/ZH. [▶ live](https://vidollet.github.io/Brilla/hana-no-sato.html)
- [awa-hou.html](awa-hou.html) — 'Awa Hou (kava lounge): education layer + recommender. [▶ live](https://vidollet.github.io/Brilla/awa-hou.html)
- [hawaii-beer-fest-brilla-demo.html](hawaii-beer-fest-brilla-demo.html) — Hawaii Beer Fest: map-first festival guide. [▶ live](https://vidollet.github.io/Brilla/hawaii-beer-fest-brilla-demo.html)

## Brilla engine (reusable platform)
The data-driven engine each venue plugs into — one engine, one data file per venue.

- [index.html](index.html) — Brilla engine entry point. [▶ live](https://vidollet.github.io/Brilla/)
- [app.html](app.html) — experience loader (`?event=<id>`).
- [brilla-engine.js](brilla-engine.js) — recommendation engine (tag-weighted scoring + reasons).
- [brilla.css](brilla.css) — themeable styles.
- [data/](data) — per-venue data files.

## License
[MIT](LICENSE)
