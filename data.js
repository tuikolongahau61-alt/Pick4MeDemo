/* =========================================================================
   data.js
   All static content lives here: restaurant info, menu items, quiz config.

   ┌───────────────────────────────────────────────────────────────────┐
   │  WHERE TO CUSTOMIZE — quick map                                     │
   │                                                                     │
   │  • Restaurant NAME .......... RESTAURANT.name      (just below)     │
   │  • TAGLINE .................. RESTAURANT.tagline   (just below)     │
   │  • MENU ITEMS ............... MENU_ITEMS array      (this file)     │
   │  • QUIZ QUESTIONS ........... QUIZ_QUESTIONS array  (this file)     │
   │  • COLORS / fonts ........... :root block at top of styles.css      │
   │                                                                     │
   │  You should never need to edit script.js to launch a new            │
   │  restaurant — change the data here and the colors in styles.css.    │
   └───────────────────────────────────────────────────────────────────┘
   ========================================================================= */

/* ---- Restaurant info ----------------------------------------------------
   👇 CHANGE THESE for your restaurant. */
const RESTAURANT = {
  name: "Maguro Demo Spot",
  tagline: "Can't decide? We'll pick for you.",
  blurb: "Answer 5 quick questions and get a dish matched to your mood.",
};

/* ---- Menu items ---------------------------------------------------------
   👇 CHANGE THIS to your menu. Add/remove items freely.
   Each item:
     id          unique string (no spaces)
     name        display name
     price       number (USD)
     description short copy shown on the card
     tags        INTERNAL keywords used only by the recommender. Customers
                 never see these. Keep them consistent with quiz option tags.
     labels      CUSTOMER-FACING badges shown on the card, e.g.
                 "Spicy", "Popular", "Light", "Filling", "Vegetarian".
                 Keep these short and friendly. Leave [] for none.
     featured    true = small scoring boost (does not auto-show a badge;
                 add "Popular" to labels if you want a visible badge)
   ------------------------------------------------------------------------ */
const MENU_ITEMS = [
  {
    id: "classic-ahi",
    name: "Classic Ahi Bowl",
    price: 13,
    description: "Cubed ahi tuna, shoyu, sweet onion, and sesame over warm rice.",
    tags: ["fish", "savory", "medium-hunger", "classic", "rice"],
    labels: ["Popular", "Savory"],
    featured: true,
  },
  {
    id: "spicy-tuna",
    name: "Volcano Spicy Tuna",
    price: 14,
    description: "Ahi tossed in chili aioli with crispy onion and togarashi.",
    tags: ["fish", "spicy", "medium-hunger", "bold", "rice"],
    labels: ["Spicy", "Popular"],
    featured: true,
  },
  {
    id: "salmon-shoyu",
    name: "Shoyu Salmon Bowl",
    price: 14,
    description: "Buttery salmon, shoyu glaze, edamame, cucumber, and scallion.",
    tags: ["fish", "savory", "medium-hunger", "fresh", "rice"],
    labels: ["Fresh"],
    featured: false,
  },
  {
    id: "spicy-salmon-deluxe",
    name: "Spicy Salmon Deluxe",
    price: 18,
    description: "Double salmon, sriracha mayo, jalapeño, avocado, and crunch.",
    tags: ["fish", "spicy", "big-hunger", "bold", "rice"],
    labels: ["Spicy", "Filling"],
    featured: false,
  },
  {
    id: "veggie-garden",
    name: "Garden Veggie Bowl",
    price: 11,
    description: "Tofu, avocado, edamame, cucumber, carrot, and ginger dressing.",
    tags: ["veggie", "fresh", "light-hunger", "healthy", "rice"],
    labels: ["Vegetarian", "Light"],
    featured: false,
  },
  {
    id: "shrimp-tempura",
    name: "Crispy Shrimp Tempura Bowl",
    price: 15,
    description: "Golden tempura shrimp, spicy mayo, slaw, and pickled ginger.",
    tags: ["shrimp", "savory", "big-hunger", "crunchy", "rice"],
    labels: ["Popular", "Filling"],
    featured: true,
  },
  {
    id: "poke-nachos",
    name: "Aloha Poke Nachos",
    price: 12,
    description: "Wonton chips piled with ahi, avocado, masago, and eel sauce.",
    tags: ["fish", "savory", "shareable", "fun", "crunchy"],
    labels: ["Shareable"],
    featured: false,
  },
  {
    id: "mini-bowl",
    name: "Keiki Mini Bowl",
    price: 9,
    description: "A small bowl with your choice of one protein. Simple and quick.",
    tags: ["fish", "savory", "light-hunger", "quick", "rice"],
    labels: ["Light"],
    featured: false,
  },
  {
    id: "double-protein",
    name: "Double Protein Power Bowl",
    price: 19,
    description: "Two proteins, extra rice, and all the toppings. Come hungry.",
    tags: ["fish", "savory", "big-hunger", "filling", "rice"],
    labels: ["Filling"],
    featured: false,
  },
  {
    id: "mango-tofu",
    name: "Mango Tofu Fresh Bowl",
    price: 10,
    description: "Crispy tofu, mango salsa, greens, lime, and sweet chili drizzle.",
    tags: ["veggie", "spicy", "light-hunger", "fresh", "healthy"],
    labels: ["Vegetarian", "Light", "Spicy"],
    featured: false,
  },
];

/* ---- Quiz questions -----------------------------------------------------
   👇 CHANGE THIS to your quiz. Add/remove questions or options.
   Each question:
     id        key used in the answers object (no spaces)
     prompt    question text shown to the customer
     subtitle  optional small helper line under the prompt
     weight    how strongly this question influences the match (default 1).
               Higher = answers here matter more. Craving/vibe are weighted
               up because they shape the pick the most.
     options   array of { label, value, tags, reason }
               tags  -> matched against item tags (internal)
               reason-> short phrase used to explain the pick, e.g. "spicy"
   The "budget" question is special: options carry a numeric `cap`
   (or null for "no budget"). It filters by price instead of tags.
   ------------------------------------------------------------------------ */
const QUIZ_QUESTIONS = [
  {
    id: "craving",
    prompt: "What sounds good?",
    subtitle: "Pick your main craving.",
    weight: 2,
    options: [
      { label: "🐟 Fish", value: "fish", tags: ["fish"], reason: "fish" },
      { label: "🍤 Shrimp", value: "shrimp", tags: ["shrimp"], reason: "shrimp" },
      { label: "🥑 Veggie", value: "veggie", tags: ["veggie", "healthy"], reason: "veggie" },
      { label: "🤷 Surprise me", value: "any", tags: [], reason: "" },
    ],
  },
  {
    id: "spice",
    prompt: "Spice level?",
    weight: 1,
    options: [
      { label: "😌 Mild", value: "mild", tags: ["savory", "fresh"], reason: "mild" },
      { label: "🌶️ Medium", value: "medium", tags: ["bold"], reason: "a little kick" },
      { label: "🔥 Bring the heat", value: "hot", tags: ["spicy", "bold"], reason: "spicy" },
    ],
  },
  {
    id: "hunger",
    prompt: "How hungry are you?",
    weight: 1,
    options: [
      { label: "🍃 Light", value: "light", tags: ["light-hunger", "quick"], reason: "something light" },
      { label: "🍚 Medium", value: "medium", tags: ["medium-hunger"], reason: "a regular portion" },
      { label: "🍱 Very hungry", value: "big", tags: ["big-hunger", "filling"], reason: "something filling" },
    ],
  },
  {
    id: "budget",
    prompt: "Budget?",
    subtitle: "We'll only show picks that fit.",
    type: "budget",
    weight: 0,
    options: [
      { label: "No budget", value: "none", cap: null },
      { label: "Under $10", value: "u10", cap: 10 },
      { label: "Under $15", value: "u15", cap: 15 },
      { label: "Under $20", value: "u20", cap: 20 },
      { label: "Custom amount", value: "custom", cap: "custom" },
    ],
  },
  {
    id: "vibe",
    prompt: "Pick a vibe.",
    weight: 2,
    options: [
      { label: "✨ Classic", value: "classic", tags: ["classic"], reason: "a classic" },
      { label: "💪 Hearty", value: "hearty", tags: ["filling", "big-hunger"], reason: "hearty" },
      { label: "🌿 Fresh & healthy", value: "healthy", tags: ["healthy", "fresh"], reason: "fresh and healthy" },
      { label: "🎉 Fun & shareable", value: "fun", tags: ["fun", "shareable"], reason: "fun to share" },
    ],
  },
];

/* ---- Scoring weights ----------------------------------------------------
   Tune recommender behavior here without touching the logic.
   tagMatch      base points per matching tag (multiplied by question weight)
   featuredBoost small nudge so house favorites win close ties
   ------------------------------------------------------------------------ */
const SCORING = {
  tagMatch: 10,
  featuredBoost: 4,
};

/* ---- Export (lets the logic be unit-tested in Node; harmless in browser) */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { RESTAURANT, MENU_ITEMS, QUIZ_QUESTIONS, SCORING };
}
