# Brilla — AI Menu Recommendation for Food Trucks

**Brand:** Brilla  
**Tagline:** No more menus. Just pick.  
**Status:** Live Pilot — O'Sun Grill, Waikiki (May 2026)

---

## What is Brilla?

Brilla is a mobile-first QR menu + recommendation app that helps customers decide what to order. Customer scans a QR code, answers a few quick questions, and gets a personalized food pick — no more standing at the counter unsure.

**Problems it solves:**
- Decision paralysis — "I don't know what to order"
- Menu readability — physical menus are hard to read
- Language barriers — multilingual support for tourist-heavy markets
- Allergy filtering — finds safe options quickly

---

## Current Pilot: O'Sun Grill

**Location:** O'Sun Grill — Vietnamese plate lunch food truck, Waikiki  
**Live URL:** `brilla.alextheastronaut.workers.dev/osun-grill`  
**Main repo:** [vidollet/Brilla](https://github.com/vidollet/Brilla)  
**Timeline:** Week of May 26, 2026 — live diner testing  
**Languages:** English, Spanish, Japanese, Chinese  
**Backend:** Neon (PostgreSQL) — event tracking live

### How it works

1. Customer scans QR code at the food truck
2. Picks their language
3. Views the menu or takes a short quiz (hunger level, budget, craving, allergies)
4. Gets a personalized dish recommendation
5. Rates it 1–5 stars on the result screen

---

## Files

| File | Description |
|------|-------------|
| `osun-grill.html` | Main frontend — the live pilot app for O'Sun Grill |
| `UI_MOCKUP_MAY29.html` | UI mockup of proposed changes (open in browser) |

---

## Tech Stack

- **Frontend:** Single-file HTML/CSS/JS, mobile-first
- **Backend:** Cloudflare Workers + Neon — [vidollet/Brilla](https://github.com/vidollet/Brilla)
- **Tracking:** Quiz answers, recommendations, and ratings logged to Neon

---

## Pilot Goal

35 diners tested → 20+ rate it 4–5 stars by June 24 = desirability proven → pitch second food truck.

---

## Dev Workflow

This is Armando's dev fork. Before making changes:

1. Pull latest `osun-grill.html` from [vidollet/Brilla](https://github.com/vidollet/Brilla)
2. Make and test changes locally
3. Push here, then notify Alex of what changed for production deployment

**Don't edit the live site directly** — all changes deploy through Alex's repo.

---

*Last updated: May 29, 2026*
