/* =========================================================================
   data.js  (Pick4Me v2 content)
   All content lives here. Edit this file to customize the restaurant.

   👇 WHERE TO CUSTOMIZE
   • Name / tagline / blurb .... RESTAURANT (just below)
   • Menu items ................ MENU_ITEMS array
   • Quiz questions ............ QUIZ_QUESTIONS array
   • Colors .................... :root block at top of styles.css
   Keep each item's `tags` consistent with the quiz option `tags` so the
   recommender can match them. `labels` are the customer-facing badges.
   ========================================================================= */

const RESTAURANT = {
  name: "Maguro Demo Spot",
  tagline: "Can't decide? We'll pick for you.",
  blurb: "Answer 5 quick questions and get a dish matched to your mood."
};

const SCORING = {
  tagMatch: 10,
  featuredBoost: 4
};

/* ---- Quiz: 5 questions, one at a time --------------------------------- */
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
      { label: "🤷 Surprise me", value: "any", tags: [], reason: "" }
    ]
  },
  {
    id: "spice",
    prompt: "Spice level?",
    weight: 1,
    options: [
      { label: "😌 Mild", value: "mild", tags: ["savory", "fresh"], reason: "mild" },
      { label: "🌶️ Medium", value: "medium", tags: ["bold"], reason: "a little kick" },
      { label: "🔥 Bring the heat", value: "hot", tags: ["spicy", "bold"], reason: "spicy" }
    ]
  },
  {
    id: "hunger",
    prompt: "How hungry are you?",
    weight: 1,
    options: [
      { label: "🍃 Light", value: "light", tags: ["light-hunger", "quick"], reason: "something light" },
      { label: "🍚 Medium", value: "medium", tags: ["medium-hunger"], reason: "a regular portion" },
      { label: "🍱 Very hungry", value: "big", tags: ["big-hunger", "filling"], reason: "something filling" }
    ]
  },
  {
    id: "budget",
    prompt: "Budget?",
    subtitle: "We'll only show picks that fit.",
    type: "budget",
    options: [
      { label: "No budget", value: "none" },
      { label: "Under $10", value: "u10" },
      { label: "Under $15", value: "u15" },
      { label: "Under $20", value: "u20" },
      { label: "Custom amount", value: "custom" }
    ]
  },
  {
    id: "vibe",
    prompt: "Pick a vibe.",
    weight: 2,
    options: [
      { label: "✨ Classic", value: "classic", tags: ["classic"], reason: "a classic" },
      { label: "💪 Hearty", value: "hearty", tags: ["filling", "big-hunger"], reason: "hearty" },
      { label: "🌿 Fresh & healthy", value: "healthy", tags: ["healthy", "fresh"], reason: "fresh and healthy" },
      { label: "🎉 Fun & shareable", value: "fun", tags: ["fun", "shareable"], reason: "fun to share" }
    ]
  }
];

/* ---- Menu: 10 items --------------------------------------------------- */
const MENU_ITEMS = [
  {
    id: "classic-ahi",
    name: "Classic Ahi Bowl",
    price: 13,
    description: "Cubed ahi tuna, shoyu, sweet onion, and sesame over warm rice.",
    tags: ["fish", "savory", "medium-hunger", "classic", "rice"],
    labels: ["Popular", "Savory"],
    featured: true
  },
  {
    id: "spicy-tuna",
    name: "Volcano Spicy Tuna",
    price: 14,
    description: "Ahi tossed in chili aioli with crispy onion and togarashi.",
    tags: ["fish", "spicy", "medium-hunger", "bold", "rice"],
    labels: ["Spicy", "Popular"],
    featured: true
  },
  {
    id: "salmon-shoyu",
    name: "Shoyu Salmon Bowl",
    price: 14,
    description: "Buttery salmon, shoyu glaze, edamame, cucumber, and scallion.",
    tags: ["fish", "savory", "medium-hunger", "fresh", "rice"],
    labels: ["Fresh"],
    featured: false
  },
  {
    id: "spicy-salmon-deluxe",
    name: "Spicy Salmon Deluxe",
    price: 18,
    description: "Double salmon, sriracha mayo, jalapeño, avocado, and crunch.",
    tags: ["fish", "spicy", "big-hunger", "bold", "rice"],
    labels: ["Spicy", "Filling"],
    featured: false
  },
  {
    id: "veggie-garden",
    name: "Garden Veggie Bowl",
    price: 11,
    description: "Tofu, avocado, edamame, cucumber, carrot, and ginger dressing.",
    tags: ["veggie", "fresh", "light-hunger", "healthy", "rice"],
    labels: ["Vegetarian", "Light"],
    featured: false
  },
  {
    id: "shrimp-tempura",
    name: "Crispy Shrimp Tempura Bowl",
    price: 15,
    description: "Golden tempura shrimp, spicy mayo, slaw, and pickled ginger.",
    tags: ["shrimp", "savory", "big-hunger", "crunchy", "rice"],
    labels: ["Popular", "Filling"],
    featured: true
  },
  {
    id: "poke-nachos",
    name: "Aloha Poke Nachos",
    price: 12,
    description: "Wonton chips piled with ahi, avocado, masago, and eel sauce.",
    tags: ["fish", "savory", "shareable", "fun", "crunchy"],
    labels: ["Shareable"],
    featured: false
  },
  {
    id: "mini-bowl",
    name: "Keiki Mini Bowl",
    price: 9,
    description: "A small bowl with your choice of one protein. Simple and quick.",
    tags: ["fish", "savory", "light-hunger", "quick", "rice"],
    labels: ["Light"],
    featured: false
  },
  {
    id: "double-protein",
    name: "Double Protein Power Bowl",
    price: 19,
    description: "Two proteins, extra rice, and all the toppings. Come hungry.",
    tags: ["fish", "savory", "big-hunger", "filling", "rice"],
    labels: ["Filling"],
    featured: false
  },
  {
    id: "mango-tofu",
    name: "Mango Tofu Fresh Bowl",
    price: 10,
    description: "Crispy tofu, mango salsa, greens, lime, and sweet chili drizzle.",
    tags: ["veggie", "spicy", "light-hunger", "fresh", "healthy"],
    labels: ["Vegetarian", "Light", "Spicy"],
    featured: false
  }
];

/* Export for Node-based testing; harmless in the browser. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { RESTAURANT, MENU_ITEMS, QUIZ_QUESTIONS, SCORING };
}
