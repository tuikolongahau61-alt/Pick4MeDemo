# Hana no Sato — Demo Handoff

Single-file smart-menu demo for **Hana no Sato** (Japanese, Honolulu). Built off the O'Sun Grill
build, so it drops into the same repo and uses the same event-tracking backend.

- **File:** `hana-no-sato.html` (open in any browser — no build step, runs fully client-side)
- **Restaurant slug:** `hana-no-sato`
- **Live demo today:** uses polished gradient tiles for photos. Real photos load automatically once added (see below).

---

## For Armando — before you show the owner

1. **Verify prices.** The prices come from the in-store menu photo and may be out of date. They're all in
   one place: the `MENU_ITEMS` array near the middle of the file, each line has `price: 11.50`. Edit and save.
2. **Pre-load once on wifi** so the Google web-font (the Mincho serif used for the title) is cached, in case
   the venue's wifi is slow.
3. That's it — scan the QR, tap **Help Me Decide**, walk through the 4 questions, land on **"Here's what we'd order."**

---

## For Alex — wiring it up

### 1. Backend / events
The tracking core is copied verbatim from `osun-grill.html`:
- `API_BASE` resolves the same way (`window.PICK4ME_API_BASE` → localhost ternary → `pick4me.fly.dev`).
- `RESTAURANT_SLUG = "hana-no-sato"` — the backend needs to accept this slug at
  `POST /api/v1/restaurants/hana-no-sato/events` (same contract as O'Sun Grill).
- `EXPERIMENT = "hana_smart_menu_v1"`.
- Navigation / quiz: `view_screen`, `screen_exit`, `back_clicked`, `home_clicked` (`{from_screen}`),
  `quiz_started`, `quiz_answer`, `quiz_abandoned`, `recommendation_shown`
  (with `answers`, `ranked_ids`, `scores`, `top_item_id`), `recommendation_list_extended` (`{shown, total}`),
  `filter_selected`, `menu_item_clicked`, `result_item_clicked`, `view_full_menu_clicked`, `session_end`.
- Feedback: `floating_feedback_opened`, `feedback_submitted`.
- **Remember-your-order:** `order_item_added` (`{item_id, qty, order_size}`),
  `order_item_removed` (`{item_id}`), `order_opened` (`{order_size}`), `order_cleared`,
  `order_intro_shown` (first-add explainer), `order_note_added` (`{item_id, has_note, presets}`),
  `order_show_server` (`{from_lang}` — diner tapped "Show in English for staff").
- Language: `language_changed` (`{lang, from_screen}`); every event also stamps the active `language`.

The order list is a read-off-to-server list only — **no checkout/payment**.

**sessionStorage keys** (per-visit, all namespaced `pw_`): `pw_session_id`, `pw_order_hana` (the order list,
incl. per-item notes/presets), `pw_lang`, `pw_order_explained` (first-add explainer seen), `pw_lang_hinted`
(language nudge seen).

No hardcoded `pick4me.fly.dev` outside the guarded `API_BASE` block, so it passes the pre-commit hook.

### 2. Photos
Each item expects a local image at:

```
menu_pictures/compressed/<item-id>.webp
```

The loader (`paintMedia`) tries the local file first and falls back to the gradient tile if it's missing —
so you can add photos incrementally without breaking anything. Recommended size ~800×600, center-cropped, `.webp`.

**Optional remote stock layer:** set `const USE_STOCK_PHOTOS = true;` and give each item a `stock: "<url>"`
to show generic stock photos between the local file and the tile fallback. Off by default for a clean offline demo.

### 3. Filenames to create (42 items)

| Category | File (`menu_pictures/compressed/…`) | Dish |
|---|---|---|
| Ramen | `shoyu-ramen.webp` | Shoyu Ramen |
| Ramen | `miso-ramen.webp` | Miso Ramen |
| Ramen | `veg-pork-ramen.webp` | Vegetable & Pork Ramen |
| Ramen | `curry-ramen.webp` | Curry Ramen |
| Ramen | `tantan-ramen.webp` | Tan Tan Ramen |
| Udon & Soba | `curry-udon.webp` | Curry Udon |
| Udon & Soba | `yakiudon.webp` | Yaki Udon |
| Udon & Soba | `shrimp-tempura-udon.webp` | Shrimp Tempura Udon (Cold) |
| Bento | `grilled-salmon-bento.webp` | Grilled Salmon Bento |
| Bento | `grilled-mackerel-bento.webp` | Grilled Mackerel Bento |
| Bento | `karaage-bento.webp` | Karaage Chicken Bento |
| Bento | `pork-cutlet-bento.webp` | Pork Cutlet Bento |
| Bento | `ginger-pork-bento.webp` | Ginger Pork Bento |
| Bento | `chicken-cutlet-bento.webp` | Chicken Cutlet Bento |
| Bento | `assorted-fried-bento.webp` | Assorted Fried Bento |
| Bowls | `beef-bowl.webp` | Beef Bowl |
| Bowls | `mabo-don.webp` | Mabo Don |
| Bowls | `katsu-bowl.webp` | Katsu Bowl |
| Bowls | `assorted-tempura-bowl.webp` | Assorted Tempura Bowl |
| Bowls | `shrimp-tempura-bowl.webp` | Shrimp Tempura Bowl |
| Bowls | `eel-bowl.webp` | Eel Bowl |
| Curry | `beef-curry.webp` | Beef Curry |
| Curry | `pork-cutlet-curry.webp` | Pork Cutlet Curry |
| Sushi & Rolls | `sashimi-bowl.webp` | Sashimi Bowl |
| Sushi & Rolls | `assorted-sashimi.webp` | Assorted Sashimi Platter |
| Sushi & Rolls | `spicy-ahi-roll.webp` | Spicy Ahi Roll |
| Sushi & Rolls | `california-roll.webp` | California Roll |
| Sushi & Rolls | `eel-cucumber-roll.webp` | Eel & Cucumber Roll |
| Sushi & Rolls | `inari-sushi.webp` | Inari Sushi |
| Small Plates | `edamame.webp` | Edamame |
| Small Plates | `garlic-edamame.webp` | Garlic Edamame |
| Small Plates | `gyoza.webp` | Gyoza |
| Small Plates | `takoyaki.webp` | Takoyaki |
| Small Plates | `agedashi-tofu.webp` | Agedashi Tofu |
| Small Plates | `karaage-chicken.webp` | Karaage Chicken |
| Small Plates | `shrimp-tempura.webp` | Shrimp Tempura |
| Small Plates | `vegetable-tempura.webp` | Vegetable Tempura |
| Small Plates | `ahi-poke.webp` | Ahi Poke |
| Salads | `pork-shabu-salad.webp` | Pork Shabu Salad |
| Salads | `seaweed-salad.webp` | Wakame Seaweed Salad |
| Dessert | `mochi-ice-cream.webp` | Mochi Ice Cream |
| Dessert | `matcha-ice-cream.webp` | Green Tea Ice Cream |

### 4. Deploy
Same as O'Sun Grill (see `CLAUDE.md`): serve the HTML via the Cloudflare Worker, point a QR at the
`hana-no-sato` route, and make sure the Worker injects `window.PICK4ME_API_BASE`.

---

## How the recommendation works (so you can tune it)
Four generalized, restaurant-agnostic questions — **mood → hunger → spice → avoid** — drive a simple
tag-based score in `scoreItem()`. Avoidances (`avoid`) hard-filter the pool; everything else is a soft
boost/penalty. To reuse this at another restaurant, you only change `MENU_ITEMS` (and its tags); the quiz
and scoring stay the same.

## What the diner can do (feature map)
- **Browse the full menu** grouped by category, with category + dietary (Vegetarian / Popular / Spicy) filters. Tapping an active category chip again clears back to "All". The filter bar auto-hides on scroll-down and returns on scroll-up.
- **Help Me Decide** → 4-question quiz → a "Here's what we'd order" results screen (top 4, with a "Show more picks" button to extend the list).
- **Remember your order** — a ＋ on every dish builds a list (the 🧾 pill, bottom-right). The order sheet is a "show your server" list with quantities, a running estimated total, and per-item notes. A one-time explainer popup fires on the first add.
- **Per-item notes** — tappable preset chips (translated) **+** a free-text box. The chips are **dish-aware**: each preset only appears where it's relevant (driven by `PRESET_RULES` + the `GINGER_ITEMS` / `ONION_ITEMS` sets in the script). "Allergy" always shows. To tune which chips appear, edit those rules/sets.
- **Home** — 🏠 buttons on the results and detail screens, plus the tappable 花の里 title in the quiz, all return to the landing menu.

> **Note translation caveat:** preset chips translate across all languages (stored as keys). **Free-typed** note text is shown verbatim and is *not* translated — so when a diner taps "Show in English for staff," the presets flip to English but any custom typed text stays in the original language.

## Languages (multilingual)
English (default) + Japanese, Korean, and Simplified Chinese. A 🌐 button in the header opens the
picker; the choice persists for the visit (`pw_lang` in sessionStorage), re-renders everything, and
fires a `language_changed` event (`{lang, from_screen}`). Every `trackEvent` now stamps the active `language`.

- Interface strings live in the `STRINGS` object (one block per language).
- Per-dish names/descriptions live in `ITEM_I18N` (keyed by item id: `jad` = JA description, `kon`/`kod` = Korean name/desc, `zhn`/`zhd` = Chinese name/desc). English falls through to the base `MENU_ITEMS` fields.
- Adding a language = add one block to `STRINGS` + the matching keys to `ITEM_I18N`, then add it to the `LANGS` array. No font files needed — phones render JA/KO/ZH with system fonts.
- On a first visit a small bubble (`🌐 English · 日本語 · 한국어 · 中文`) points at the language button for ~5s, then fades. A diner can also tap "Show in English for staff" inside the order sheet to flip the whole app back to English on demand.
- **Before relying on it:** the Japanese is reviewed; please have a native speaker spot-check the **Korean and Chinese** copy.

## Footer
"Powered by PlateUp" + Instagram link to [@hananosato_hawaii](https://www.instagram.com/hananosato_hawaii/).
