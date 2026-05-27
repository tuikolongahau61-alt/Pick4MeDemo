# Brilla — Food Decision App for Restaurants & Food Trucks

**Current Pilot Name:** PlateUp  
**Long-Term Brand:** Brilla  
**Tagline:** No more menus. Just pick.  
**Status:** 🚀 Live Pilot — O'Sun Grill (May 26, 2026)

## What is Brilla?

Brilla is a mobile-first QR menu + AI recommendation system that helps customers decide what to order. It solves:
- **Decision paralysis** — "I don't know what to order"
- **Menu readability** — Physical menus are hard to read
- **Group dining** — Family/friends with conflicting preferences
- **Allergies/restrictions** — Finding safe options quickly

## Pilot Goals (This Week)

- Get 5–10 customers to try the app
- Track where users drop off in the quiz
- Collect 1–5 star ratings
- Learn what customers actually need
- Refine recommendation flow based on real feedback

## Current Pilot: "PlateUp"

**Location:** O'Sun Grill (Vietnamese food truck, Waikiki)  
**Live URL:** `plate-up.alex-the-astronaut.workers.dev/o-sun-grill`  
**Pilot Product Name:** PlateUp  
**Timeline:** Week of May 26, 2026 — Testing with 5–10 diners  
**Backend:** ✅ Data collection live

### How It Works

1. **QR Code** — Customer scans code at truck
2. **Quiz** — 4 quick questions (craving, budget, hunger level, restrictions)
3. **Recommendation** — App suggests best item from menu
4. **Feedback** — Customer rates recommendation (1–5 stars)

## Project Structure

```
/
├── index.html              (deprecated demo)
├── osun-grill.html         (O'Sun Grill pilot — main file)
├── index-live.html         (stable version for Alex's backend integration)
├── index-dev.html          (working/testing version)
├── [other demo files]      (garlic-shack.html, thai-tacos.html, etc.)
└── README.md               (this file)
```

## Files in This Repo

| File | Purpose | Status |
|------|---------|--------|
| `osun-grill.html` | O'Sun Grill pilot version | Active |
| `index-live.html` | Stable version (for backend) | In use by Alex |
| `index-dev.html` | Working/iteration version | In use by Armando |
| `garlic-shack.html` | Concept/demo | Not active |
| `thai-tacos.html` | Concept/demo | Not active |

## Naming & Rebranding Timeline

**Phase 1: Pilot (Now – May/June 2026)**
- **Name:** PlateUp
- **Domain:** `plate-up.alex-the-astronaut.workers.dev`
- **Focus:** O'Sun Grill pilot, proving desirability
- **QR Codes:** Printed with PlateUp branding
- **When it ends:** After O'Sun Grill pilot success (20/35 users rate 4+ stars)

**Phase 2: Scaling (June+ 2026)**
- **Name:** Brilla
- **Domain:** TBD (brilla.com or similar)
- **Focus:** Multi-restaurant scaling
- **Trigger:** Rebrand happens when onboarding second food truck
- **Domain redirect:** Old PlateUp links redirect to Brilla (so existing QR codes still work)

## Tech Stack

- **Frontend:** Single-file HTML/CSS/JS (mobile-optimized)
- **Backend:** (In development by Alex) Data collection, menu management
- **Hosting:** Cloudflare Workers (currently), GitHub Pages (demos)
- **Language:** English (Japanese translation planned)

## For Food Truck Owners

- **No technical setup required** — QR code + link
- **Simple feedback loop** — See what customers actually pick
- **Low barrier to entry** — Free pilot, no commitment
- **Concierge support** — We handle menu updates

---

## Development Notes

### For Armando (Customer Discovery)
- Use `index-dev.html` for testing/iterations
- Track feedback in Google Sheets
- Document drop-off patterns
- Commit updates to GitHub

### For Alex (Backend)
- Integrate with `index-live.html`
- Wire data collection (quiz answers, recommendations, clicks, ratings)
- Track metrics for algorithm optimization
- Backend Phase 2: Move menu management to API

## Success Metrics

**Desirability Proof (By June 24):**
- **35 total users tested** at O'Sun Grill
- **20/35 rate it 4–5 stars** (proof of desirability)
- **Ready to pitch second food truck** for Phase 2

**If successful:** Move to Phase 2 (menu management backend), rebrand to Brilla, onboard second vendor

**If unsuccessful:** Pivot to new audience or new pain point (guided by Heather)

## Deployment

**Current:**
```
plate-up.alex-the-astronaut.workers.dev/o-sun-grill
```

**QR Code Strategy:**
- Physical QR codes printed and laminated
- Placed at food truck for customer access
- Points to live demo URL

## TODO

- [ ] Phase 2: Menu management backend
- [ ] Phase 3: Recommendation engine optimization (ML-driven)
- [ ] Rebrand to Brilla (after pilot success)
- [ ] Multi-restaurant dashboard
- [ ] Japanese language support
- [ ] Future: Tap-to-pay integration, group ordering, saved profiles

---

**Questions?** Check the codebase or ask in Slack (#upick-updates).  
**Status:** 🚀 Live at O'Sun Grill — Week 1  
**Last Updated:** May 26, 2026
