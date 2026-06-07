# Brilla Platform

One reusable engine that helps people decide what to order — powering many venues (festivals, markets, restaurants, beverage brands). **Build the engine once; launch a new experience by writing one data file.**

This is a customer-discovery prototype: no accounts, no payments, no backend. It runs as plain static files.

## Open it

Just open **`index.html`** in a browser — it's the Brilla hub and links to every experience. Each experience opens at `app.html?event=<id>` (best viewed on a phone, or in your browser's mobile/device view).

> Everything loads via plain `<script src>`, so opening the files directly (`file://`) works in most browsers. If yours blocks local scripts, run a tiny server from this folder: `python3 -m http.server` then visit `http://localhost:8000`.

## What's here

```
brilla-platform/
├── index.html              ← the hub (lists all experiences)
├── app.html                ← engine shell: reads ?event=<id>, loads its data, renders
├── brilla.css              ← shared, themable styles (the look)
├── brilla-engine.js        ← the engine: quiz, scoring, recommendations, directory, map, plan
└── data/
    ├── events.js               ← catalog shown on the hub
    ├── hawaii-beer-fest.js     ← experience 1 (beverage festival)
    ├── kakaako-night-market.js ← experience 2 (food + drink market)
    └── _template.js            ← copy this to make a new experience
```

The engine never changes per venue. A venue is **data**: its vendors, products, map, theme, quiz and the "why" reasons all live in one `data/<id>.js` file.

## Add a new experience (the whole workflow)

1. Copy `data/_template.js` → `data/<your-id>.js` (e.g. `data/maui-food-wine.js`).
2. Fill in the config: `theme` (colors), `brand`, `nouns`, `categories`, `home`, `quiz`, `reasonRules`, `vendors` (each with `products`), and an optional `map`.
3. Add a card for it in `data/events.js` so it appears on the hub.
4. Open `app.html?event=<your-id>`. Done — no engine changes.

### Config cheat-sheet
- **theme** — `a1/a2/a3` make the accent gradient; `inkOn` is text drawn on the accent; `hi` is the highlight color.
- **nouns** — the words used in the UI (`booth` vs `stall`, `Pours` vs `Dishes`, `My Festival Plan` vs `My Market Run`, …).
- **features** — toggle the `vendors` directory and `map` tabs on/off.
- **categories** — each gets a color used for monograms, map pins, filters and the legend.
- **quiz** — each option's `w` adds weight to product **tags**; negative weights push matches down. `matchTags` + `mood` power the "matches your mood" reason.
- **scoring.primaryStyleKey** — the question whose answer is the user's main preference; products tagged with that value get a ranking boost so the named style leads. Optional `jitterKey` adds a "surprise me" shuffle.
- **reasonRules** — top-to-bottom; up to 2 rules that match (answer condition **and** product has `tag`) become the "why" lines.
- **products** — use `abv` (drinks) or `price` (food); the chip adapts automatically.

## How a recommendation works
1. The 5-tap quiz builds a weighted tag profile from the answers.
2. Every product is scored: weighted tag matches + a boost for the user's named style + a small quality prior + optional "surprise" jitter.
3. The top 3 across **distinct vendors** are returned, each with reasons generated from the user's own answers.

## Hosting / sharing
Drop this folder on any static host (Cloudflare Pages/Workers, Netlify, GitHub Pages, S3) and share the link or a QR code. No build step.

## Note
The earlier single-file `hawaii-beer-fest-brilla-demo.html` (one level up) still works and is kept for reference. This platform version supersedes it: same Hawaii Beer Fest experience, now driven by data so new venues are trivial to add.
