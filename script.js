/* =========================================================================
   script.js
   Two layers, kept separate on purpose:
     1. PURE LOGIC  — scoring + recommendation. No DOM. Easy to test/reuse.
     2. UI LAYER    — rendering and events for the four screens.
   ========================================================================= */

/* ============================ ANALYTICS ============================ */
/* Reusable placeholder. Swap the console.log for a real call later. */
function trackEvent(eventName, data = {}) {
  console.log("[trackEvent]", eventName, data);
}

/* ============================ PURE LOGIC ============================ */

/* Resolve the budget answer into a numeric cap, or null = no price filter. */
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

/* Score one item against the user's answers.
   Improved over the old version:
   - Each question carries a `weight`, so craving and vibe matter more than
     spice. Matching tags are worth tagMatch * weight.
   - Featured items get a small boost so house favorites win close ties.
   Returns a number. */
function scoreItem(item, answers, questions, weights) {
  let score = 0;

  questions.forEach((q) => {
    if (q.type === "budget") return; // budget filters, doesn't score
    const opt = q.options.find((o) => o.value === answers[q.id]);
    if (!opt || !opt.tags) return;
    const w = q.weight == null ? 1 : q.weight;
    opt.tags.forEach((tag) => {
      if (item.tags.includes(tag)) score += weights.tagMatch * w;
    });
  });

  if (item.featured) score += weights.featuredBoost;
  return score;
}

/* Build a short, human reason for the pick from the user's strongest
   answers. Example: "Picked because you wanted something filling and spicy."
   We pull the `reason` phrases from the answers that actually matched the
   chosen item, so the explanation feels honest. Keeps it to 2 reasons. */
function buildReason(item, answers, questions) {
  const reasons = [];
  questions.forEach((q) => {
    if (q.type === "budget") return;
    const opt = q.options.find((o) => o.value === answers[q.id]);
    if (!opt || !opt.reason) return;
    // Only mention a reason if this answer actually overlaps the item.
    const overlaps = (opt.tags || []).some((t) => item.tags.includes(t));
    if (overlaps) reasons.push({ text: opt.reason, weight: q.weight == null ? 1 : q.weight });
  });

  // Strongest reasons first, keep up to two.
  reasons.sort((a, b) => b.weight - a.weight);
  const picked = reasons.slice(0, 2).map((r) => r.text).filter(Boolean);

  if (picked.length === 0) return "A house favorite we think you'll enjoy.";
  if (picked.length === 1) return `Picked because you wanted ${picked[0]}.`;
  return `Picked because you wanted ${picked[0]}, ${picked[1]}.`;
}

/* Core recommender.
   - Scores all items (weighted tag overlap + featured boost).
   - Filters by budget when a cap is set; no cap = no price filter.
   - If nothing fits the budget, falls back to the cheapest closest match.
   Returns { item, score, withinBudget, fallback, reason }. */
function recommend(items, answers, questions, budgetCap, weights) {
  const scored = items.map((item) => ({
    item,
    score: scoreItem(item, answers, questions, weights),
  }));

  const bestOf = (list) =>
    list.slice().sort((a, b) => b.score - a.score || a.item.price - b.item.price)[0];

  let chosen;
  let withinBudget = true;
  let fallback = false;

  if (budgetCap == null) {
    chosen = bestOf(scored);
  } else {
    const affordable = scored.filter((s) => s.item.price <= budgetCap);
    if (affordable.length > 0) {
      chosen = bestOf(affordable);
    } else {
      // Nothing fits → cheapest closest match overall.
      chosen = scored.slice().sort((a, b) => a.item.price - b.item.price || b.score - a.score)[0];
      withinBudget = false;
      fallback = true;
    }
  }

  return {
    item: chosen.item,
    score: chosen.score,
    withinBudget,
    fallback,
    reason: buildReason(chosen.item, answers, questions),
  };
}

/* ============================ UI STATE ============================ */
const state = {
  screen: "landing",      // landing | quiz | result | menu
  answers: {},
  customAmount: "",
  step: 0,                // which quiz question is showing
  result: null,
};

const SCREENS = ["landing", "quiz", "result", "menu"];

function showScreen(name) {
  state.screen = name;
  SCREENS.forEach((s) => {
    const el = document.getElementById("screen-" + s);
    if (el) el.classList.toggle("is-active", s === name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  trackEvent("view_screen", { screen: name });
}

/* ============================ LANDING ============================ */
function renderLanding() {
  document.getElementById("restaurant-name").textContent = RESTAURANT.name;
  document.getElementById("restaurant-tagline").textContent = RESTAURANT.tagline;
  document.getElementById("restaurant-blurb").textContent = RESTAURANT.blurb;
}

/* ============================ QUIZ (one at a time) ============================ */

/* Render the single question at state.step into the quiz screen. */
function renderQuizStep() {
  const q = QUIZ_QUESTIONS[state.step];
  const total = QUIZ_QUESTIONS.length;
  const root = document.getElementById("quiz-body");
  root.innerHTML = "";

  /* Progress: "Question 2 of 5" + a filling bar. */
  const prog = document.getElementById("quiz-progress");
  prog.textContent = `Question ${state.step + 1} of ${total}`;
  const bar = document.getElementById("quiz-bar-fill");
  bar.style.width = `${((state.step + 1) / total) * 100}%`;

  /* Prompt + optional subtitle. */
  const prompt = document.createElement("h2");
  prompt.className = "quiz-prompt";
  prompt.textContent = q.prompt;
  root.appendChild(prompt);

  if (q.subtitle) {
    const sub = document.createElement("p");
    sub.className = "quiz-subtitle";
    sub.textContent = q.subtitle;
    root.appendChild(sub);
  }

  /* Options as big tappable cards. */
  const opts = document.createElement("div");
  opts.className = "quiz-options";

  q.options.forEach((o) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option" + (state.answers[q.id] === o.value ? " is-selected" : "");
    btn.textContent = o.label;
    btn.addEventListener("click", () => {
      state.answers[q.id] = o.value;
      trackEvent("quiz_answer", { question: q.id, value: o.value });

      // Show/hide the custom field if this is the budget question.
      if (q.type === "budget") renderQuizStep();
      else {
        // brief highlight, then auto-advance for a fast feel
        opts.querySelectorAll(".option").forEach((c) => c.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        setTimeout(nextStep, 180);
      }
    });
    opts.appendChild(btn);
  });
  root.appendChild(opts);

  /* Custom amount field, only on the budget question when "custom" chosen. */
  if (q.type === "budget" && state.answers.budget === "custom") {
    const wrap = document.createElement("div");
    wrap.className = "custom-amount";

    const label = document.createElement("label");
    label.setAttribute("for", "custom-amount-input");
    label.textContent = "Your max ($)";

    const input = document.createElement("input");
    input.type = "number";
    input.min = "1";
    input.id = "custom-amount-input";
    input.inputMode = "numeric";
    input.placeholder = "e.g. 12";
    input.value = state.customAmount;
    input.addEventListener("input", (e) => { state.customAmount = e.target.value; });

    wrap.appendChild(label);
    wrap.appendChild(input);
    root.appendChild(wrap);
  }

  /* Footer nav: Back + Next/See pick. Budget needs a manual Next
     (no auto-advance) so users can type a custom amount. */
  const isLast = state.step === total - 1;
  document.getElementById("btn-quiz-next").textContent = isLast ? "See my pick →" : "Next →";
  document.getElementById("btn-quiz-back").style.visibility = state.step === 0 ? "hidden" : "visible";

  // Next is disabled until the current question is answered.
  const answered = state.answers[q.id] != null;
  document.getElementById("btn-quiz-next").disabled = !answered;
}

function nextStep() {
  const q = QUIZ_QUESTIONS[state.step];
  if (state.answers[q.id] == null) return; // guard: must answer first

  if (state.step < QUIZ_QUESTIONS.length - 1) {
    state.step += 1;
    renderQuizStep();
  } else {
    submitQuiz();
  }
}

function prevStep() {
  if (state.step > 0) {
    state.step -= 1;
    renderQuizStep();
  } else {
    showScreen("landing");
  }
}

function startQuiz() {
  state.step = 0;
  renderQuizStep();
  showScreen("quiz");
}

function submitQuiz() {
  const cap = resolveBudgetCap(state.answers, state.customAmount);
  state.result = recommend(MENU_ITEMS, state.answers, QUIZ_QUESTIONS, cap, SCORING);

  trackEvent("recommendation", {
    pick: state.result.item.id,
    score: state.result.score,
    budgetCap: cap,
    fallback: state.result.fallback,
  });

  renderResult();
  showScreen("result");
}

/* ============================ RESULT ============================ */
function renderResult() {
  const root = document.getElementById("result-body");
  root.innerHTML = "";
  if (!state.result) return;

  const { item, fallback, reason } = state.result;

  const note = document.createElement("p");
  note.className = "result-note";
  note.textContent = fallback
    ? "Nothing matched perfectly within your budget — here's the closest pick:"
    : "Here's your pick";
  root.appendChild(note);

  root.appendChild(buildItemCard(item, true));

  const why = document.createElement("p");
  why.className = "result-reason";
  why.textContent = reason;
  root.appendChild(why);
}

/* ============================ MENU ============================ */
function renderMenu() {
  const root = document.getElementById("menu-list");
  root.innerHTML = "";
  MENU_ITEMS.forEach((item) => root.appendChild(buildItemCard(item, false)));
}

/* Shared item card. Shows customer-facing `labels`, never internal tags. */
function buildItemCard(item, isHero) {
  const card = document.createElement("article");
  card.className = "item-card" + (isHero ? " item-card--hero" : "");

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

  // Customer-facing labels only (Spicy, Popular, etc.). Hidden if none.
  if (item.labels && item.labels.length) {
    const labels = document.createElement("div");
    labels.className = "item-labels";
    item.labels.forEach((l) => {
      const tag = document.createElement("span");
      tag.className = "label label--" + l.toLowerCase().replace(/\s+/g, "-");
      tag.textContent = l;
      labels.appendChild(tag);
    });
    card.appendChild(labels);
  }

  return card;
}

/* ============================ WIRING ============================ */
function wireEvents() {
  document.getElementById("btn-pick").addEventListener("click", () => {
    trackEvent("cta_click", { button: "pick_for_me" });
    startQuiz();
  });
  document.getElementById("btn-view-menu").addEventListener("click", () => {
    trackEvent("cta_click", { button: "view_menu" });
    showScreen("menu");
  });

  document.getElementById("btn-quiz-next").addEventListener("click", nextStep);
  document.getElementById("btn-quiz-back").addEventListener("click", prevStep);

  document.getElementById("btn-result-menu").addEventListener("click", () => showScreen("menu"));
  document.getElementById("btn-result-retry").addEventListener("click", () => {
    state.answers = {};
    state.customAmount = "";
    startQuiz();
  });

  document.getElementById("btn-menu-back").addEventListener("click", () => showScreen("landing"));
  document.getElementById("btn-menu-pick").addEventListener("click", startQuiz);
}

function init() {
  renderLanding();
  renderMenu();
  wireEvents();
  showScreen("landing");
  trackEvent("app_loaded", { restaurant: RESTAURANT.name });
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}

/* Export pure logic for tests / future React port. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { trackEvent, resolveBudgetCap, scoreItem, buildReason, recommend };
}
