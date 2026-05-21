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
   │  You should never need to edit script.js to launch a new           │
   │  restaurant — change the data here and the colors in styles.css.    │
   └───────────────────────────────────────────────────────────────────┘
   ========================================================================= */

/* ---- Restaurant info ----------------------------------------------------
   👇 CHANGE THESE THREE LINES for your restaurant. */
const RESTAURANT = {
  name: "Maguro Demo Spot",
  tagline: "Can't decide what to eat?",
  blurb: "Fresh poke, made to order. Let us pick something perfect for you.",
};

/* ---- Menu items ---------------------------------------------------------
   👇 CHANGE THIS to your menu. Add/remove items freely.
   Each item:
     id          unique string (no spaces)
     name        display name
     price       number (USD)
     description short copy
     tags        keywords used by the recommendation scorer — KEEP your tag
                 words consistent with the quiz options below so matches work
     featured    true = gets a small scoring boost + a ★ badge on the card
   ------------------------------------------------------------------------ */
const MENU_ITEMS = [
  {
    id: "classic-ahi",
    name: "Classic Ahi Bowl",
    price: 13,
    description: "Cubed ahi tuna, shoyu, sweet onion, sesame over warm rice.",
    tags: ["fish", "savory", "medium-hunger", "classic", "rice"],
    featured: true,
  },
  {
    id: "spicy-tuna",
    name: "Volcano Spicy Tuna",
    price: 14,
    description: "Ahi tossed in chili aioli with crispy onion and togarashi.",
    tags: ["fish", "spicy", "medium-hunger", "bold", "rice"],
    featured: true,
  },
  {
    id: "salmon-shoyu",
    name: "Shoyu Salmon Bowl",
    price: 14,
    description: "Buttery salmon, shoyu glaze, edamame, cucumber, scallion.",
    tags: ["fish", "savory", "medium-hunger", "fresh", "rice"],
    featured: false,
  },
  {
    id: "spicy-salmon-deluxe",
    name: "Spicy Salmon Deluxe",
    price: 18,
    description: "Double salmon, sriracha mayo, jalapeño, avocado, crunch.",
    tags: ["fish", "spicy", "big-hunger", "bold", "rice"],
    featured: false,
  },
  {
    id: "veggie-garden",
    name: "Garden Veggie Bowl",
    price: 11,
    description: "Tofu, avocado, edamame, cucumber, carrot, ginger dressing.",
    tags: ["veggie", "fresh", "light-hunger", "healthy", "rice"],
    featured: false,
  },
  {
    id: "shrimp-tempura",
    name: "Crispy Shrimp Tempura Bowl",
    price: 15,
    description: "Golden tempura shrimp, spicy mayo, slaw, pickled ginger.",
    tags: ["shrimp", "savory", "big-hunger", "crunchy", "rice"],
    featured: true,
  },
  {
    id: "poke-nachos",
    name: "Aloha Poke Nachos",
    price: 12,
    description: "Wonton chips piled with ahi, avocado, masago, eel sauce.",
    tags: ["fish", "savory", "shareable", "fun", "crunchy"],
    featured: false,
  },
  {
    id: "mini-bowl",
    name: "Keiki Mini Bowl",
    price: 9,
    description: "Small bowl, your choice of one protein, simple and quick.",
    tags: ["fish", "savory", "light-hunger", "quick", "rice"],
    featured: false,
  },
  {
    id: "double-protein",
    name: "Double Protein Power Bowl",
    price: 19,
    description: "Two proteins, extra rice, all the toppings. Come hungry.",
    tags: ["fish", "savory", "big-hunger", "filling", "rice"],
    featured: false,
  },
  {
    id: "mango-tofu",
    name: "Mango Tofu Fresh Bowl",
    price: 10,
    description: "Crispy tofu, mango salsa, greens, lime, sweet chili drizzle.",
    tags: ["veggie", "spicy", "light-hunger", "fresh", "healthy"],
    featured: false,
  },
];

/* ---- Quiz questions -----------------------------------------------------
   👇 CHANGE THIS to your quiz. Add/remove questions or options.
   Each question:
     id        used as the key in the answers object (no spaces)
     prompt    question text shown to the customer
     options   array of { label, value, tags }
               tags are added to the user's profile when selected — these
               must match the `tags` you put on MENU_ITEMS above to score.
   The "budget" question is special: its options carry a numeric `cap`
   (or null for "no budget"). The scorer reads it to filter by price.
   ------------------------------------------------------------------------ */
const QUIZ_QUESTIONS = [
  {
    id: "craving",
    prompt: "What sounds good?",
    options: [
      { label: "🐟 Fish", value: "fish", tags: ["fish"] },
      { label: "🍤 Shrimp", value: "shrimp", tags: ["shrimp"] },
      { label: "🥑 Veggie", value: "veggie", tags: ["veggie"] },
      { label: "🤷 Surprise me", value: "any", tags: [] },
    ],
  },
  {
    id: "spice",
    prompt: "Spice level?",
    options: [
      { label: "😌 Mild", value: "mild", tags: ["savory", "fresh"] },
      { label: "🌶️ Medium", value: "medium", tags: ["bold"] },
      { label: "🔥 Bring the heat", value: "hot", tags: ["spicy", "bold"] },
    ],
  },
  {
    id: "hunger",
    prompt: "How hungry are you?",
    options: [
      { label: "🍃 Light", value: "light", tags: ["light-hunger", "quick"] },
      { label: "🍚 Medium", value: "medium", tags: ["medium-hunger"] },
      { label: "🍱 Very hungry", value: "big", tags: ["big-hunger", "filling"] },
    ],
  },
  {
    id: "budget",
    prompt: "Budget?",
    type: "budget", // handled specially by the scorer
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
    prompt: "Vibe?",
    options: [
      { label: "✨ Classic", value: "classic", tags: ["classic"] },
      { label: "💪 Hearty", value: "hearty", tags: ["filling", "big-hunger"] },
      { label: "🌿 Fresh & healthy", value: "healthy", tags: ["healthy", "fresh"] },
      { label: "🎉 Fun & shareable", value: "fun", tags: ["fun", "shareable"] },
    ],
  },
];

/* ---- Scoring weights ----------------------------------------------------
   Centralized so behavior is easy to tune without touching logic.
   ------------------------------------------------------------------------ */
const SCORING = {
  tagMatch: 10,     // points per matching tag
  featuredBoost: 3, // small boost for featured items
};

/* ---- Export pattern -----------------------------------------------------
   In the browser these become globals on window. The guarded module.exports
   means the same file can be `require`d or `import`ed during a React port.
   ------------------------------------------------------------------------ */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { RESTAURANT, MENU_ITEMS, QUIZ_QUESTIONS, SCORING };
}
