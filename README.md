# 🌴 Maguro Spot Demo — QR Menu

A lightweight mobile website for a restaurant QR menu. A customer scans a QR
code at the table, opens the site on their phone, answers a quick 5-question
quiz, and gets a dish recommended to them — or browses the full menu.

No build step, no framework, no backend. Just plain HTML, CSS, and JavaScript,
so it hosts anywhere static.

## Live demo

> `https://tuikolongahau61-alt.github.io/Pick4MeDemo/`

## What's in here

The flow: **Landing → "Pick for me" → Quiz → Recommended item → Full menu.**

## Run it locally

No tools needed. Put all four files in one folder and open `index.html` in a
browser (double-click it).

To watch the analytics logs, open DevTools (F12) → Console. Every screen view,
button tap, and recommendation is logged via `trackEvent()`.

## Customizing for your restaurant

Almost everything lives in **`data.js`**:

- **Restaurant name** → `RESTAURANT.name`
- **Tagline** → `RESTAURANT.tagline`
- **Menu items** → the `MENU_ITEMS` array (add/remove freely)
- **Quiz questions** → the `QUIZ_QUESTIONS` array

**Colors** are CSS variables at the top of **`styles.css`** (the `:root` block) —
change them and the whole site re-themes.

> Tip: each menu item has `tags`, and each quiz option has `tags`. The
> recommender works by matching them, so keep the tag words consistent between
> the two. You shouldn't need to edit `script.js` to launch a new restaurant.

## How the recommendation works

1. Quiz answers become a list of tags.
2. The budget answer becomes a price cap (or no cap for "No budget").
3. Each item scores +10 per matching tag, +3 if it's featured.
4. The highest-scoring item within budget wins. If nothing fits the budget,
   it falls back to the cheapest closest match.

## Hosting on GitHub Pages

1. Make sure `index.html` is in the **root** of the repo (not a subfolder).
2. Repo → **Settings → Pages**.
3. Source: **Deploy from a branch**. Branch: `main`, folder: `/ (root)`. Save.
4. Wait ~1–2 minutes, then open the URL it shows you.

The site uses relative paths, so it works correctly from the Pages subfolder.
(Also hosts fine on Netlify, Vercel, or any static host.)

## Connecting it to a QR code

1. Copy your live site URL (test it on your own phone first).
2. Use any QR code generator and paste the URL. Download as PNG, or SVG if
   you'll print it large.
3. Print or display it — table tents, the menu, a window decal, the counter.
4. Scan the printed version with a couple of phones before rolling it out.

> Heads up: if you change hosts later, the URL changes and the old QR stops
> working. To avoid reprinting, point the QR at a domain or short link you
> control and forward that to wherever it's hosted.

## What it does NOT include

By design: no login, no accounts, no payments, no backend, no database. It's a
front-end-only recommendation site.
