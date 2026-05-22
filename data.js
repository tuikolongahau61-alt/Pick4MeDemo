const RESTAURANT = {
  name: "Maguro",
  tagline: "Fresh island flavor, picked fast.",
  blurb: "Not sure what to order? Take the quick quiz and Pick4Me will choose for you."
};

const SCORING = {
  tagMatch: 10,
  featuredBoost: 4
};

const QUIZ_QUESTIONS = [
  {
    id: "craving",
    prompt: "What are you craving?",
    weight: 2,
    options: [
      { label: "Fresh and light", value: "fresh", tags: ["fresh", "light"], reason: "something fresh and light" },
      { label: "Filling and hearty", value: "filling", tags: ["filling", "rice"], reason: "something filling" },
      { label: "Spicy", value: "spicy", tags: ["spicy"], reason: "some heat" },
      { label: "Chef favorite", value: "favorite", tags: ["popular", "featured"], reason: "a house favorite" }
    ]
  },
  {
    id: "protein",
    prompt: "Pick your protein vibe.",
    weight: 1.5,
    options: [
      { label: "Tuna", value: "tuna", tags: ["tuna"], reason: "tuna" },
      { label: "Salmon", value: "salmon", tags: ["salmon"], reason: "salmon" },
      { label: "Chicken", value: "chicken", tags: ["chicken"], reason: "chicken" },
      { label: "Vegetarian", value: "vegetarian", tags: ["vegetarian"], reason: "a vegetarian option" }
    ]
  },
  {
    id: "vibe",
    prompt: "What kind of meal is this?",
    weight: 1.25,
    options: [
      { label: "Quick snack", value: "snack", tags: ["snack", "light"], reason: "a quick snack" },
      { label: "Full meal", value: "meal", tags: ["filling", "rice"], reason: "a full meal" },
      { label: "Something safe", value: "safe", tags: ["popular"], reason: "a safe popular pick" },
      { label: "Try something fun", value: "fun", tags: ["featured", "spicy"], reason: "something fun" }
    ]
  },
  {
    id: "budget",
    prompt: "Budget?",
    subtitle: "Optional, but it helps us pick smarter.",
    type: "budget",
    options: [
      { label: "Under $10", value: "u10" },
      { label: "Under $15", value: "u15" },
      { label: "Under $20", value: "u20" },
      { label: "No budget", value: "none" },
      { label: "Custom amount", value: "custom" }
    ]
  }
];

const MENU_ITEMS = [
  {
    id: "spicy-tuna-bowl",
    name: "Spicy Tuna Bowl",
    price: 15,
    description: "Rice bowl with spicy tuna, cucumber, green onion, and house sauce.",
    tags: ["tuna", "spicy", "rice", "filling", "popular", "featured"],
    labels: ["Spicy", "Popular"],
    featured: true
  },
  {
    id: "salmon-poke",
    name: "Salmon Poke",
    price: 16,
    description: "Fresh salmon with shoyu, sesame, sweet onion, and rice.",
    tags: ["salmon", "fresh", "rice", "filling", "popular"],
    labels: ["Fresh", "Popular"]
  },
  {
    id: "ahi-nachos",
    name: "Ahi Nachos",
    price: 13,
    description: "Crispy wonton chips with ahi, sauce, and island toppings.",
    tags: ["tuna", "snack", "fresh", "featured"],
    labels: ["Shareable"],
    featured: true
  },
  {
    id: "chicken-katsu",
    name: "Chicken Katsu Plate",
    price: 14,
    description: "Crispy chicken katsu with rice, sauce, and simple sides.",
    tags: ["chicken", "filling", "rice", "popular"],
    labels: ["Filling"]
  },
  {
    id: "veggie-roll",
    name: "Veggie Roll",
    price: 9,
    description: "Cucumber, avocado, carrot, and rice wrapped clean and simple.",
    tags: ["vegetarian", "light", "fresh", "snack"],
    labels: ["Vegetarian", "Light"]
  },
  {
    id: "miso-soup",
    name: "Miso Soup",
    price: 5,
    description: "Warm miso broth with tofu, seaweed, and green onion.",
    tags: ["light", "snack", "vegetarian"],
    labels: ["Light"]
  }
];
