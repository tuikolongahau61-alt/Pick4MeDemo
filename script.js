/* Pick4Me v2 — no page scrolling, active screen only */
console.log("PICK4ME VERSION 2 LOADED");
document.documentElement.dataset.pick4meVersion = "2";

function trackEvent(eventName, data = {}) {
  console.log("[trackEvent]", eventName, data);
}

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

function scoreItem(item, answers, questions, weights) {
  let score = 0;
  questions.forEach((q) => {
    if (q.type === "budget") return;
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

function buildReason(item, answers, questions) {
  const reasons = [];
  questions.forEach((q) => {
    if (q.type === "budget") return;
    const opt = q.options.find((o) => o.value === answers[q.id]);
    if (!opt || !opt.reason) return;
    const overlaps = (opt.tags || []).some((t) => item.tags.includes(t));
    if (overlaps) reasons.push({ text: opt.reason, weight: q.weight == null ? 1 : q.weight });
  });
  reasons.sort((a, b) => b.weight - a.weight);
  const picked = reasons.slice(0, 2).map((r) => r.text).filter(Boolean);
  if (picked.length === 0) return "A house favorite we think you'll enjoy.";
  if (picked.length === 1) return `Picked because you wanted ${picked[0]}.`;
  return `Picked because you wanted ${picked[0]} and ${picked[1]}.`;
}

function recommend(items, answers, questions, budgetCap, weights) {
  const scored = items.map((item) => ({ item, score: scoreItem(item, answers, questions, weights) }));
  const bestOf = (list) => list.slice().sort((a, b) => b.score - a.score || a.item.price - b.item.price)[0];
  let chosen;
  let fallback = false;
  if (budgetCap == null) {
    chosen = bestOf(scored);
  } else {
    const affordable = scored.filter((s) => s.item.price <= budgetCap);
    if (affordable.length) {
      chosen = bestOf(affordable);
    } else {
      chosen = scored.slice().sort((a, b) => a.item.price - b.item.price || b.score - a.score)[0];
      fallback = true;
    }
  }
  return {
    item: chosen.item,
    score: chosen.score,
    fallback,
    withinBudget: !fallback,
    reason: buildReason(chosen.item, answers, questions)
  };
}

const state = {
  screen: "landing",
  answers: {},
  customAmount: "",
  step: 0,
  result: null
};

const SCREENS = ["landing", "quiz", "result", "menu"];

function getScreenEl(name) {
  return document.getElementById(`screen-${name}`);
}

function forceTop(el) {
  if (el) el.scrollTop = 0;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  window.scrollTo(0, 0);
}

function showScreen(name) {
  state.screen = name;
  document.body.classList.add("is-switching");

  let activeEl = null;

  SCREENS.forEach((screenName) => {
    const el = getScreenEl(screenName);
    if (!el) return;
    const isActive = screenName === name;
    el.hidden = !isActive;
    el.classList.toggle("is-active", isActive);
    el.setAttribute("aria-hidden", String(!isActive));
    if (isActive) activeEl = el;
  });

  forceTop(activeEl);

  requestAnimationFrame(() => {
    forceTop(activeEl);
    document.body.classList.remove("is-switching");
  });

  trackEvent("view_screen", { screen: name });
}

function renderLanding() {
  document.getElementById("restaurant-name").textContent = RESTAURANT.name;
  document.getElementById("restaurant-tagline").textContent = RESTAURANT.tagline;
  document.getElementById("restaurant-blurb").textContent = RESTAURANT.blurb;
}

function renderQuizStep() {
  const q = QUIZ_QUESTIONS[state.step];
  const total = QUIZ_QUESTIONS.length;
  const root = document.getElementById("quiz-body");
  root.innerHTML = "";

  document.getElementById("quiz-progress").textContent = `Question ${state.step + 1} of ${total}`;
  document.getElementById("quiz-bar-fill").style.width = `${((state.step + 1) / total) * 100}%`;
  document.getElementById("btn-quiz-back").textContent = state.step === 0 ? "← Home" : "← Back";

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

      if (q.type === "budget") {
        renderQuizStep();
        return;
      }

      opts.querySelectorAll(".option").forEach((c) => c.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      window.setTimeout(nextStep, 140);
    });
    opts.appendChild(btn);
  });

  root.appendChild(opts);

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
    input.addEventListener("input", (e) => {
      state.customAmount = e.target.value;
    });

    wrap.appendChild(label);
    wrap.appendChild(input);
    root.appendChild(wrap);
  }

  const isLast = state.step === total - 1;
  const next = document.getElementById("btn-quiz-next");
  next.textContent = isLast ? "See my pick →" : "Next →";
  next.disabled = state.answers[q.id] == null;

  forceTop(getScreenEl("quiz"));
}

function nextStep() {
  const q = QUIZ_QUESTIONS[state.step];
  if (state.answers[q.id] == null) return;

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
    fallback: state.result.fallback
  });
  renderResult();
  showScreen("result");
}

function renderResult() {
  const root = document.getElementById("result-body");
  root.innerHTML = "";
  if (!state.result) return;

  const note = document.createElement("p");
  note.className = "result-note";
  note.textContent = state.result.fallback
    ? "Nothing fit that budget perfectly, so here’s the closest pick:"
    : "Here’s your pick";
  root.appendChild(note);

  root.appendChild(buildItemCard(state.result.item, true));

  const why = document.createElement("p");
  why.className = "result-reason";
  why.textContent = state.result.reason;
  root.appendChild(why);
}

function renderMenu() {
  const root = document.getElementById("menu-list");
  root.innerHTML = "";
  MENU_ITEMS.forEach((item) => root.appendChild(buildItemCard(item, false)));
}

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
  price.textContent = `$${item.price}`;

  head.appendChild(name);
  head.appendChild(price);
  card.appendChild(head);

  const desc = document.createElement("p");
  desc.className = "item-desc";
  desc.textContent = item.description;
  card.appendChild(desc);

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

function wireEvents() {
  document.getElementById("btn-pick").addEventListener("click", startQuiz);
  document.getElementById("btn-view-menu").addEventListener("click", () => showScreen("menu"));
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

document.addEventListener("DOMContentLoaded", init);
