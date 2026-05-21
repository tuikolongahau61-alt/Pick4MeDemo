/* =========================================================================
   script.js
   Two layers, kept separate on purpose:
     1. PURE LOGIC  — buildTagProfile, scoreItem, recommend. No DOM. These
        are the functions you lift straight into a React app / hook.
     2. UI LAYER    — render + event wiring. This is the part you'd replace
        with JSX components later.
   ========================================================================= */

/* ============================ ANALYTICS ============================ */
/* Reusable placeholder. Swap the console.log for a real call later. */
function trackEvent(eventName, data = {}) {
  console.log("[trackEvent]", eventName, data);
}

/* ============================ PURE LOGIC ============================ */
/* All functions below are dependency-free (besides the data constants)
   and return plain values — ready to unit test or reuse in React. */

/* Collect every tag the user picked into one flat array. */
function buildTagProfile(answers, questions) {
  const tags = [];
  questions.forEach((q) => {
    if (q.type === "budget") return; // budget handled separately
    const chosen = answers[q.id];
    const opt = q.options.find((o) => o.value === chosen);
    if (opt && opt.tags) tags.push(...opt.tags);
  });
  return tags;
}

/* Resolve the budget answer into a numeric cap or null (no filter). */
function resolveBudgetCap(answers, customAmount) {
  const sel = answers.budget;
  if (sel == null || sel === "none") return null;
  if (sel === "u10") return 10;
  if (sel === "u15") return 15;
  if (sel === "u20") return 20;
  if (sel === "custom") {
    const n = Number(customAmount);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  return null;
}

/* Score a single item against the user's tag profile. */
function scoreItem(item, tagProfile, weights) {
  let score = 0;
  tagProfile.forEach((tag) => {
    if (item.tags.includes(tag)) score += weights.tagMatch;
  });
  if (item.featured) score += weights.featuredBoost;
  return score;
}

/* Core recommender.
   - Scores all items by tag overlap (+ featured boost).
   - Filters by budget if a cap is set; no cap = no price filter.
   - If nothing fits the budget, falls back to the cheapest closest match
     (best score among all items, breaking ties by lowest price).
   Returns { item, score, withinBudget, fallback }. */
function recommend(items, tagProfile, budgetCap, weights) {
  const scored = items.map((item) => ({
    item,
    score: scoreItem(item, tagProfile, weights),
  }));

  // Pick the strongest match, ties broken by lower price.
  const bestOf = (list) =>
    list
      .slice()
      .sort((a, b) => b.score - a.score || a.item.price - b.item.price)[0];

  if (budgetCap == null) {
    const top = bestOf(scored);
    return { ...top, withinBudget: true, fallback: false };
  }

  const affordable = scored.filter((s) => s.item.price <= budgetCap);
  if (affordable.length > 0) {
    const top = bestOf(affordable);
    return { ...top, withinBudget: true, fallback: false };
  }

  // Nothing fits the budget → cheapest closest match overall.
  const closest = scored
    .slice()
    .sort((a, b) => a.item.price - b.item.price || b.score - a.score)[0];
  return { ...closest, withinBudget: false, fallback: true };
}

/* ============================ UI LAYER ============================ */
/* Simple section router + renderers. Everything below touches the DOM. */

const state = {
  section: "landing", // landing | quiz | result | menu
  answers: {},
  customAmount: "",
  result: null,
};

const SECTIONS = ["landing", "quiz", "result", "menu"];

function showSection(name) {
  state.section = name;
  SECTIONS.forEach((s) => {
    const el = document.getElementById("section-" + s);
    if (el) el.classList.toggle("is-active", s === name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  trackEvent("view_section", { section: name });
}

/* ---- Landing ---- */
function renderLanding() {
  document.getElementById("restaurant-name").textContent = RESTAURANT.name;
  document.getElementById("restaurant-tagline").textContent = RESTAURANT.tagline;
  document.getElementById("restaurant-blurb").textContent = RESTAURANT.blurb;
}

/* ---- Quiz ---- */
function renderQuiz() {
  const root = document.getElementById("quiz-questions");
  root.innerHTML = "";

  QUIZ_QUESTIONS.forEach((q) => {
    const card = document.createElement("div");
    card.className = "quiz-card";

    const prompt = document.createElement("h3");
    prompt.className = "quiz-prompt";
    prompt.textContent = q.prompt;
    card.appendChild(prompt);

    const opts = document.createElement("div");
    opts.className = "quiz-options";

    q.options.forEach((o) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = o.label;
      btn.dataset.qid = q.id;
      btn.dataset.value = o.value;
      if (state.answers[q.id] === o.value) btn.classList.add("is-selected");

      btn.addEventListener("click", () => {
        state.answers[q.id] = o.value;
        // toggle selected state within this question group
        opts.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        // show/hide custom amount field for budget
        if (q.type === "budget") {
          customWrap.style.display = o.value === "custom" ? "block" : "none";
        }
        trackEvent("quiz_answer", { question: q.id, value: o.value });
      });

      opts.appendChild(btn);
    });

    card.appendChild(opts);

    // Custom amount input for the budget question.
    let customWrap;
    if (q.type === "budget") {
      customWrap = document.createElement("div");
      customWrap.className = "custom-amount";
      customWrap.style.display = state.answers.budget === "custom" ? "block" : "none";

      const label = document.createElement("label");
      label.textContent = "Your max ($)";
      label.setAttribute("for", "custom-amount-input");

      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.id = "custom-amount-input";
      input.placeholder = "e.g. 12";
      input.value = state.customAmount;
      input.addEventListener("input", (e) => {
        state.customAmount = e.target.value;
      });

      customWrap.appendChild(label);
      customWrap.appendChild(input);
      card.appendChild(customWrap);
    }

    root.appendChild(card);
  });
}

function submitQuiz() {
  const tagProfile = buildTagProfile(state.answers, QUIZ_QUESTIONS);
  const cap = resolveBudgetCap(state.answers, state.customAmount);
  state.result = recommend(MENU_ITEMS, tagProfile, cap, SCORING);

  trackEvent("recommendation", {
    pick: state.result.item.id,
    score: state.result.score,
    budgetCap: cap,
    fallback: state.result.fallback,
  });

  renderResult();
  showSection("result");
}

/* ---- Result ---- */
function renderResult() {
  const root = document.getElementById("result-card");
  if (!state.result) {
    root.innerHTML = "";
    return;
  }
  const { item, fallback } = state.result;

  root.innerHTML = "";

  const note = document.createElement("p");
  note.className = "result-note";
  note.textContent = fallback
    ? "Nothing fit perfectly, so here's the closest match for your budget:"
    : "We think you'll love this:";
  root.appendChild(note);

  root.appendChild(buildItemCard(item, true));
}

/* ---- Menu ---- */
function renderMenu() {
  const root = document.getElementById("menu-list");
  root.innerHTML = "";
  MENU_ITEMS.forEach((item) => root.appendChild(buildItemCard(item, false)));
}

/* Shared item card builder, used by both Result and Menu. */
function buildItemCard(item, isHero) {
  const card = document.createElement("article");
  card.className = "item-card" + (isHero ? " item-card--hero" : "");

  if (item.featured) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "★ Featured";
    card.appendChild(badge);
  }

  const head = document.createElement("div");
  head.className = "item-head";

  const name = document.createElement("h3");
  name.className = "item-name";
  name.textContent = item.name;

  const price = document.createElement("span");
  price.className = "item-price";
  price.textContent = "$" + item.price;

  head.appendChild(name);
  head.appendChild(price);
  card.appendChild(head);

  const desc = document.createElement("p");
  desc.className = "item-desc";
  desc.textContent = item.description;
  card.appendChild(desc);

  const tags = document.createElement("div");
  tags.className = "item-tags";
  item.tags.forEach((t) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = t.replace(/-/g, " ");
    tags.appendChild(tag);
  });
  card.appendChild(tags);

  return card;
}

/* ============================ WIRING ============================ */
function wireEvents() {
  document.getElementById("btn-pick").addEventListener("click", () => {
    trackEvent("cta_click", { button: "pick_for_me" });
    showSection("quiz");
  });
  document.getElementById("btn-view-menu").addEventListener("click", () => {
    trackEvent("cta_click", { button: "view_menu" });
    showSection("menu");
  });
  document.getElementById("btn-quiz-submit").addEventListener("click", submitQuiz);
  document.getElementById("btn-quiz-back").addEventListener("click", () => showSection("landing"));
  document.getElementById("btn-result-menu").addEventListener("click", () => showSection("menu"));
  document.getElementById("btn-result-retry").addEventListener("click", () => {
    state.answers = {};
    state.customAmount = "";
    renderQuiz();
    showSection("quiz");
  });
  document.getElementById("btn-menu-back").addEventListener("click", () => showSection("landing"));
  document.getElementById("btn-menu-pick").addEventListener("click", () => {
    renderQuiz();
    showSection("quiz");
  });
}

function init() {
  renderLanding();
  renderQuiz();
  renderMenu();
  wireEvents();
  showSection("landing");
  trackEvent("app_loaded", { restaurant: RESTAURANT.name });
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}

/* Export pure logic for a future React port / tests. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    trackEvent,
    buildTagProfile,
    resolveBudgetCap,
    scoreItem,
    recommend,
  };
}
