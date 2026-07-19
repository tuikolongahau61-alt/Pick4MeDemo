# Brilla — QR menu recommender demos

Brilla helps diners decide what to order: scan a QR code, answer a few quick
questions, and get a short list of recommended dishes with reasons. This repo
hosts the demo experiences and the reusable engine behind them (served via
GitHub Pages).

> Note: the go-forward product name is **PlateUp**. Some files here still use
> the earlier "Brilla" name.

## Demos
- [hana-no-sato.html](hana-no-sato.html) — Hana no Sato (Japanese, Honolulu): 42-dish smart menu, 4-question quiz, EN/JA/KO/ZH.
- [awa-hou.html](awa-hou.html) — 'Awa Hou (kava lounge): kava education layer + recommender.
- [hawaii-beer-fest-brilla-demo.html](hawaii-beer-fest-brilla-demo.html) — Hawaii Beer Fest: map-first festival guide with a "help me decide" recommender.

## Reusable platform
- [index.html](index.html) — event hub.
- [app.html](app.html) — experience loader (`?event=<id>`).
- [brilla-engine.js](brilla-engine.js) — recommendation engine (tag-weighted scoring + reasons).
- [brilla.css](brilla.css) — themeable styles.
- [data/](data) — per-venue data files.

## License
[MIT](LICENSE)
