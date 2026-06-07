/* =========================================================================
   Brilla engine — build once, run any experience from a data config.
   Pure logic (buildProfile / score / recommend / reasonsFor) is exposed on
   the Brilla global for offline testing. DOM code only runs when start() is
   called by app.html.  No build step, no modules — works from file://.
   ========================================================================= */
(function (root) {
  "use strict";

  /* ---------- small helpers ---------- */
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var initials = function (name) {
    return name.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean)
      .slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  };
  var findOption = function (cfg, key, val) {
    var q = (cfg.quiz || []).find(function (x) { return x.key === key; });
    if (!q) return null;
    return (q.options || []).find(function (o) { return o.value === val; }) || null;
  };

  /* ---------- pure recommendation logic ---------- */
  function flattenProducts(cfg) {
    var out = [];
    (cfg.vendors || []).forEach(function (v) {
      (v.products || []).forEach(function (p, i) {
        var tags = p.tags || [];
        out.push(Object.assign({}, p, {
          id: v.id + "-" + i,
          vendorId: v.id, vendorName: v.name, cat: v.cat, loc: v.loc,
          tags: tags,
          popular: tags.indexOf("popular") >= 0,
          signature: tags.indexOf("signature") >= 0,
          award: tags.indexOf("award_winning") >= 0
        }));
      });
    });
    return out;
  }

  function buildProfile(answers, cfg) {
    var weights = {};
    (cfg.quiz || []).forEach(function (q) {
      var val = answers[q.key];
      if (!val) return;
      var opt = (q.options || []).find(function (o) { return o.value === val; });
      if (!opt || !opt.w) return;
      for (var t in opt.w) weights[t] = (weights[t] || 0) + opt.w[t];
    });
    return { weights: weights, answers: answers };
  }

  function score(product, profile, cfg) {
    var s = 0, w = profile.weights, sc = cfg.scoring || {};
    for (var i = 0; i < product.tags.length; i++) {
      if (w[product.tags[i]]) s += w[product.tags[i]];
    }
    // reinforce the user's explicitly named go-to style/category
    if (sc.primaryStyleKey) {
      var v = profile.answers[sc.primaryStyleKey];
      if (v && v !== sc.openValue && product.tags.indexOf(v) >= 0) s += (sc.styleBonus || 4);
    }
    // gentle quality prior
    s += (product.popular ? 0.4 : 0) + (product.signature ? 0.3 : 0) + (product.award ? 0.2 : 0);
    // optional "surprise me" jitter
    if (sc.jitterKey && (sc.jitterValues || []).indexOf(profile.answers[sc.jitterKey]) >= 0) {
      s += Math.random() * 3;
    }
    return s;
  }

  function reasonsFor(product, answers, cfg) {
    var out = [];
    (cfg.reasonRules || []).forEach(function (rule) {
      if (out.length >= 2) return;
      var a = answers[rule.answerKey];
      if (rule.answerIn && rule.answerIn.indexOf(a) < 0) return;
      var text;
      if (rule.type === "option-tags") {
        var opt = findOption(cfg, rule.answerKey, a);
        var mt = (opt && opt.matchTags) || [];
        var hit = mt.some(function (t) { return product.tags.indexOf(t) >= 0; });
        if (!hit) return;
        text = rule.text.replace("{label}", (opt.mood || opt.label || "").toLowerCase());
      } else {
        if (rule.tag && product.tags.indexOf(rule.tag) < 0) return;
        text = rule.text;
      }
      if (out.indexOf(text) < 0) out.push(text);
    });
    if (out.length === 0) out.push(cfg.fallbackReason || "A strong match for what you told us.");
    return out.slice(0, 2);
  }

  function recommend(profile, cfg, opts) {
    opts = opts || {};
    var products = opts.products || flattenProducts(cfg);
    var exclude = opts.exclude || {};
    var n = opts.n || 3;
    var scored = products
      .filter(function (p) { return !exclude[p.id]; })
      .map(function (p) { return { p: p, s: score(p, profile, cfg) }; })
      .sort(function (a, b) { return b.s - a.s; });
    var picks = [], usedV = {};
    scored.forEach(function (e) {
      if (picks.length >= n || usedV[e.p.vendorId]) return;
      usedV[e.p.vendorId] = 1;
      picks.push(Object.assign({}, e.p, { _score: e.s, _reasons: reasonsFor(e.p, profile.answers, cfg) }));
    });
    if (picks.length < n) {
      scored.forEach(function (e) {
        if (picks.length >= n) return;
        if (picks.find(function (x) { return x.id === e.p.id; })) return;
        picks.push(Object.assign({}, e.p, { _score: e.s, _reasons: reasonsFor(e.p, profile.answers, cfg) }));
      });
    }
    return picks;
  }

  /* =======================================================================
     DOM layer (runs only when Brilla.start(id) is called by app.html)
     ======================================================================= */
  var ICONS = {
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 3l3.5 8L5 21M12 3v18M19 3l-3.5 8L19 21"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9a2 2 0 002-2h14a2 2 0 002 2 2 2 0 000 4 2 2 0 00-2 2H5a2 2 0 00-2-2 2 2 0 000-4z"/></svg>',
    music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 13l4 4L19 7"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 4L3 7v13l6-3 6 3 6-3V4l-6 3-6-3z"/><path d="M9 4v13M15 7v13"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-4-7 4V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>'
  };
  var icon = function (name) { return ICONS[name] || ICONS.info; };

  // module state (set on start)
  var CFG, PRODUCTS, NOUN, FEAT;
  var plan = [], answers = {}, step = 0, lastProfile = null, shown = {}, results = [];
  var vFilter = "all", vQuery = "", mapHL = null, toastTimer = null;

  var doc = function () { return root.document; };
  var $ = function (s) { return doc().querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(doc().querySelectorAll(s)); };
  var elc = function (tag, cls, html) { var e = doc().createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  var catColor = function (c) { return ((CFG.categories || {})[c] || {}).color || "var(--a3)"; };
  var catLabel = function (c) { return ((CFG.categories || {})[c] || {}).label || c; };
  var vendorById = function (id) { return (CFG.vendors || []).find(function (v) { return v.id === id; }); };
  var productById = function (id) { return PRODUCTS.find(function (p) { return p.id === id; }); };

  /* ---- persistence (per event) ---- */
  function storeKey() { return "brilla_plan_" + CFG.id; }
  function loadPlan() { try { var r = root.localStorage.getItem(storeKey()); return r ? JSON.parse(r) : []; } catch (e) { return []; } }
  function savePlan() { try { root.localStorage.setItem(storeKey(), JSON.stringify(plan)); } catch (e) {} updateBadges(); }
  var inPlan = function (id) { return plan.indexOf(id) >= 0; };
  function toggleSave(id, label) {
    if (inPlan(id)) { plan = plan.filter(function (x) { return x !== id; }); toast((label || "Item") + " removed from your plan"); }
    else { plan.push(id); toast("Saved to " + NOUN.planTitle + " ✓"); }
    savePlan(); refreshSaveStates();
  }
  function toast(msg) {
    var t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1900);
  }

  /* ---- theme ---- */
  function applyTheme(t) {
    t = t || {};
    var r = doc().documentElement.style, m = {
      "--bg": t.bg, "--bg2": t.bg2, "--a1": t.a1, "--a2": t.a2, "--a3": t.a3,
      "--accent": t.accent, "--ink-on": t.inkOn, "--hi": t.hi
    };
    for (var k in m) if (m[k]) r.setProperty(k, m[k]);
  }

  /* ---- shell ---- */
  function buildShell() {
    var b = CFG.brand || {}, tabs = [];
    tabs.push('<button data-nav="home" class="on">' + icon("home") + 'Home</button>');
    if (FEAT.vendors) tabs.push('<button data-nav="vendors">' + icon("grid") + esc(NOUN.vendorPlural) + '</button>');
    if (FEAT.map) tabs.push('<button data-nav="map">' + icon("map") + 'Map</button>');
    tabs.push('<button data-nav="plan">' + icon("bookmark") + esc(NOUN.planNoun) + '<span class="badge hide" id="nav-badge">0</span></button>');

    return '' +
      '<header class="topbar">' +
        '<div class="brandmark"><span class="logo-badge">' +
          '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2.5l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L12 15.9 6.9 17.7 8.1 12 3.9 8.3l5.6-.6z" fill="var(--ink-on)"/></svg>' +
          '</span><div>' + esc(b.name) + '<div class="by">' + esc(b.byline || "by Brilla") + '</div></div></div>' +
        (b.pill ? '<span class="pill-21">' + esc(b.pill) + '</span>' : '') +
      '</header>' +
      '<section id="view-home" class="view active"></section>' +
      '<section id="view-quiz" class="view"></section>' +
      '<section id="view-results" class="view"></section>' +
      (FEAT.vendors ? '<section id="view-vendors" class="view"></section>' : '') +
      (FEAT.map ? '<section id="view-map" class="view"></section>' : '') +
      '<section id="view-plan" class="view"></section>' +
      '<nav class="nav" style="grid-template-columns:repeat(' + tabs.length + ',1fr)">' + tabs.join("") + '</nav>' +
      '<div class="toast" id="toast"></div>';
  }

  var VIEWS = ["home", "quiz", "results", "vendors", "map", "plan"];
  function showView(name) {
    VIEWS.forEach(function (v) { var s = $("#view-" + v); if (s) s.classList.toggle("active", v === name); });
    $$(".nav button[data-nav]").forEach(function (b) { b.classList.toggle("on", b.dataset.nav === name); });
    root.scrollTo(0, 0);
    if (name === "home") renderHome();
    if (name === "vendors") renderVendors();
    if (name === "map") renderMap();
    if (name === "plan") renderPlan();
  }

  /* ---- HOME ---- */
  function renderHome() {
    var h = CFG.home || {}, b = CFG.brand || {};
    var facts = (h.facts || []).map(function (f) {
      return '<span class="fact">' + icon(f.icon || "info") + esc(f.label) + '</span>';
    }).join("");
    var stats = (h.stats || []).map(function (s) {
      return '<div class="stat"><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></div>';
    }).join("");
    var how = (h.how || []).map(function (s, i) {
      return '<div class="how-step"><span class="how-num">' + (i + 1) + '</span><div><b>' + esc(s.title) + '</b><p>' + esc(s.body) + '</p></div></div>';
    }).join("");
    var d = h.decide || {};
    $("#view-home").innerHTML = '' +
      '<div class="hero">' +
        '<svg class="hero-art" viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
          '<defs><radialGradient id="bhsun" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0" stop-color="var(--a3)" stop-opacity=".5"/><stop offset="60%" stop-color="var(--a2)" stop-opacity=".16"/>' +
          '<stop offset="100%" stop-color="var(--a1)" stop-opacity="0"/></radialGradient></defs>' +
          '<circle cx="380" cy="60" r="130" fill="url(#bhsun)"/>' +
          '<path d="M0 300 Q120 235 240 268 T480 250 V300 Z" fill="#000" opacity=".30"/>' +
          '<g fill="var(--accent)" opacity=".5"><circle cx="60" cy="40" r="1.6"/><circle cx="120" cy="22" r="1.2"/>' +
          '<circle cx="200" cy="50" r="1.4"/><circle cx="300" cy="30" r="1.2"/><circle cx="440" cy="120" r="1.4"/></g>' +
        '</svg>' +
        '<div class="hero-inner">' +
          (h.kicker ? '<span class="hero-kicker"><span class="dot"></span>' + esc(h.kicker) + '</span>' : '') +
          '<h1>' + esc((h.title || [])[0] || "") + '<br><span class="grad">' + esc((h.title || [])[1] || "") + '</span></h1>' +
          (h.sub ? '<p class="hero-sub">' + esc(h.sub) + '</p>' : '') +
          (facts ? '<div class="facts">' + facts + '</div>' : '') +
        '</div>' +
      '</div>' +
      (stats ? '<div class="stats">' + stats + '</div>' : '') +
      '<div class="decide-card"><div class="spark"></div>' +
        '<h2>' + esc(d.heading || "Not sure where to start?") + '</h2>' +
        '<p>' + esc(d.body || "") + '</p>' +
        '<button class="cta cta-primary" data-action="start-quiz">' + icon("spark") + esc(d.primary || "Help Me Decide") + '</button>' +
        (FEAT.vendors ? '<button class="cta cta-secondary" data-nav="vendors">' + esc(d.secondary || ("Browse " + NOUN.vendorPlural)) + '</button>' : '') +
        (d.timehint ? '<div class="timehint">' + icon("clock") + esc(d.timehint) + '</div>' : '') +
      '</div>' +
      (how ? '<div class="pad"><div class="block-title"><h3>How it works</h3></div><div class="how">' + how + '</div>' +
        (h.lineupTitle ? '<div class="block-title"><h3>' + esc(h.lineupTitle) + '</h3>' +
          (FEAT.vendors ? '<button class="link-btn" data-nav="vendors">See all →</button>' : '') + '</div>' +
          (h.lineupBlurb ? '<p class="muted" style="font-size:13.5px;margin:-4px 0 0">' + esc(h.lineupBlurb) + '</p>' : '') : '') +
      '</div>' : '') +
      (h.disclaimer ? '<p class="disclaimer">' + esc(h.disclaimer) + '</p>' : '') +
      '<div class="foot"><span class="bb">Built by Brilla</span><br>' + esc(h.footTagline || "The recommendation is the product.") + '</div>';
  }

  /* ---- QUIZ ---- */
  function startQuiz() { answers = {}; step = 0; showView("quiz"); renderQuiz(); }
  function renderQuiz() {
    var qs = CFG.quiz, q = qs[step];
    $("#view-quiz").innerHTML = '' +
      '<div class="quiz-wrap">' +
        '<div class="progress"><div class="bar"><div class="fill" style="width:' + ((step + 1) / qs.length * 100) + '%"></div></div>' +
          '<span class="count">' + (step + 1) + ' / ' + qs.length + '</span></div>' +
        '<div class="qhead"><span class="section-eyebrow">' + esc(q.eyebrow || "Your taste") + '</span>' +
          '<h2>' + esc(q.q) + '</h2>' + (q.desc ? '<p>' + esc(q.desc) + '</p>' : '') + '</div>' +
        '<div class="options" id="qoptions"></div>' +
        '<div class="quiz-nav">' +
          '<button class="qback" data-action="quiz-back" style="visibility:' + (step === 0 ? "hidden" : "visible") + '">← Back</button>' +
          '<button class="qskip" data-action="quiz-skip">No preference — skip</button>' +
        '</div>' +
      '</div>';
    var box = $("#qoptions");
    q.options.forEach(function (o) {
      var sel = answers[q.key] === o.value;
      var btn = elc("button", "opt" + (sel ? " sel" : ""));
      btn.innerHTML = (o.emoji ? '<span class="emoji">' + o.emoji + '</span>' : '') +
        '<span style="min-width:0"><span class="otxt">' + esc(o.label) + '</span>' +
        (o.desc ? '<br><span class="odesc">' + esc(o.desc) + '</span>' : '') + '</span>' +
        '<span class="chk">' + icon("check") + '</span>';
      btn.addEventListener("click", function () { answers[q.key] = o.value; advance(); });
      box.appendChild(btn);
    });
  }
  function advance() {
    renderQuiz();
    setTimeout(function () {
      if (step < CFG.quiz.length - 1) { step++; renderQuiz(); } else finishQuiz();
    }, 180);
  }
  function finishQuiz() {
    lastProfile = buildProfile(answers, CFG);
    shown = {};
    results = recommend(lastProfile, CFG, { products: PRODUCTS, n: 3 });
    results.forEach(function (r) { shown[r.id] = 1; });
    renderResults(); showView("results");
  }

  /* ---- RESULTS ---- */
  function renderResults() {
    var head = '<div class="results-head"><span class="section-eyebrow">' + esc((CFG.results || {}).eyebrow || "Your game plan") + '</span>' +
      '<h2 style="margin-top:8px">Your <span class="grad">Top 3 ' + esc(NOUN.stopPlural || "Picks") + '</span></h2>' +
      '<p>' + esc(summarize()) + '</p></div>';
    var cards = results.map(function (p, idx) {
      var v = vendorById(p.vendorId), saved = inPlan(p.id);
      return '<div class="rec rec-' + (idx + 1) + '"><div class="rec-top">' +
        '<span class="rank">' + (idx + 1) + '</span>' +
        '<div class="rec-vendor"><div class="vn"><span class="mono" style="background:' + catColor(p.cat) + '">' + initials(v.name) + '</span>' +
        '<h3>' + esc(v.name) + '</h3></div></div></div>' +
        '<div class="rec-beer">' + esc(p.name) + '</div>' +
        '<div class="chips"><span class="chip cat" style="background:' + catColor(p.cat) + '">' + esc(catLabel(p.cat)) + '</span>' +
        productChips(p) + '</div>' +
        '<div class="why">' + p._reasons.map(function (r) {
          return '<div class="wrow">' + icon("check") + '<span>' + esc(r) + '</span></div>';
        }).join("") + '</div>' +
        '<div class="rec-foot">' +
          (FEAT.map ? '<button class="loc" data-map="' + p.vendorId + '"><span class="pin">' + p.loc + '</span>' + esc(NOUN.stop) + ' ' + p.loc + ' · view on map</button>'
                    : '<span class="loc"><span class="pin">' + p.loc + '</span>' + esc(NOUN.stop) + ' ' + p.loc + '</span>') +
          '<button class="savebtn' + (saved ? " saved" : "") + '" data-save="' + p.id + '" data-label="' + esc(p.name) + '">' +
          (saved ? icon("check") + " Saved" : icon("heart") + " Save") + '</button>' +
        '</div></div>';
    }).join("");
    var actions = '<div class="results-actions">' +
      '<button class="cta cta-secondary" data-action="more-stops">🎲 Show me 3 different ' + esc((NOUN.stopPlural || "picks").toLowerCase()) + '</button>' +
      '<button class="cta cta-ghost" data-action="restart-quiz">↺ Retake the quiz</button>' +
      '<button class="cta cta-primary" data-nav="plan" style="margin-top:4px">View ' + esc(NOUN.planTitle) + '</button></div>' +
      '<div class="foot">The recommendation is the product. The menu is supporting information.</div>';
    $("#view-results").innerHTML = head + '<div id="rec-list">' + cards + '</div>' + actions;
  }
  function productChips(p) {
    var out = '<span class="chip">' + esc(p.style) + '</span>';
    if (p.abv != null) out += '<span class="chip hi">' + Number(p.abv).toFixed(1) + '% ABV</span>';
    if (p.price != null) out += '<span class="chip hi">' + esc(p.price) + '</span>';
    return out;
  }
  function summarize() {
    var s = CFG.summary; if (!s) return "Based on what you told us, here's where we'd start.";
    var bits = [];
    (s.parts || []).forEach(function (pt) {
      var val = answers[pt.key]; if (!val) return;
      var map = pt.map || {}; if (map[val]) bits.push(map[val]);
    });
    if (!bits.length) return s.fallback || "Here's where we'd start.";
    return (s.prefix || "Based on your taste — ") + bits.join(", ") + (s.suffix || " — here's where we'd start.");
  }
  function moreStops() {
    var next = recommend(lastProfile, CFG, { products: PRODUCTS, n: 3, exclude: shown });
    if (next.length < 3) { shown = {}; next = recommend(lastProfile, CFG, { products: PRODUCTS, n: 3 }); toast("Looped back to your best matches"); }
    next.forEach(function (r) { shown[r.id] = 1; });
    results = next; renderResults(); root.scrollTo(0, 0);
  }

  /* ---- VENDORS ---- */
  function renderVendors() {
    var fl = [["all", "All"]].concat(Object.keys(CFG.categories || {}).map(function (k) { return [k, CFG.categories[k].label]; }));
    var chips = fl.map(function (f) {
      return '<button class="fchip' + (vFilter === f[0] ? " on" : "") + '" data-filter="' + f[0] + '">' + esc(f[1]) + '</button>';
    }).join("");
    var q = vQuery.trim().toLowerCase(), shownN = 0, cards = "";
    (CFG.vendors || []).forEach(function (v) {
      if (vFilter !== "all" && v.cat !== vFilter) return;
      var hay = (v.name + " " + (v.origin || "") + " " + (v.blurb || "") + " " +
        (v.products || []).map(function (p) { return p.name + " " + p.style + " " + (p.tags || []).join(" "); }).join(" ")).toLowerCase();
      if (q && hay.indexOf(q) < 0) return;
      shownN++;
      cards += '<div class="vcard"><div class="vcard-head">' +
        '<span class="mono" style="background:' + catColor(v.cat) + '">' + initials(v.name) + '</span>' +
        '<div style="flex:1;min-width:0"><h3>' + esc(v.name) + '</h3><div class="vmeta"><span class="cat-dot" style="background:' + catColor(v.cat) + '"></span>' +
        '<span class="muted">' + esc(catLabel(v.cat)) + (v.origin ? ' · ' + esc(v.origin) : '') + '</span></div></div>' +
        (v.loc != null ? '<span class="vloc"' + (FEAT.map ? ' data-map="' + v.id + '"' : '') + '>📍 ' + esc(NOUN.stop) + ' ' + v.loc + '</span>' : '') +
        '</div>' + (v.blurb ? '<p class="vblurb">' + esc(v.blurb) + '</p>' : '') +
        '<div class="beerlist">' + (v.products || []).map(function (p, i) {
          var id = v.id + "-" + i, saved = inPlan(id), sub = esc(p.style);
          if (p.abv != null) sub += " · " + Number(p.abv).toFixed(1) + "% ABV";
          if (p.price != null) sub += " · " + esc(p.price);
          return '<div class="beer"><div class="bi"><div class="bn">' + esc(p.name) + '</div><div class="bs">' + sub + '</div></div>' +
            '<button class="heart' + (saved ? " on" : "") + '" data-save="' + id + '" data-label="' + esc(p.name) + '">' + icon("heart") + '</button></div>';
        }).join("") + '</div></div>';
    });
    if (shownN === 0) cards = '<div class="empty"><div class="em">🔍</div><h3>No matches</h3><p>Try a different search or filter.</p></div>';
    $("#view-vendors").innerHTML = '<div class="subhead"><span class="section-eyebrow">Discover</span><h2>' + esc(NOUN.catalogTitle) + '</h2></div>' +
      '<div class="search">' + icon("search") + '<input id="vsearch" type="search" placeholder="' + esc(NOUN.searchPlaceholder || ("Search " + NOUN.vendorPlural.toLowerCase() + "…")) + '" autocomplete="off" value="' + esc(vQuery) + '"></div>' +
      '<div class="filters">' + chips + '</div>' +
      '<div class="vcount">' + shownN + ' ' + (shownN === 1 ? NOUN.vendor : NOUN.vendorPlural).toLowerCase() + ((q || vFilter !== "all") ? " matching" : "") + ' · tap a heart to save</div>' +
      cards + '<div class="foot">' + esc((CFG.home || {}).directoryFoot || "Listings are illustrative for this concept demo.") + '</div>';
    var si = $("#vsearch");
    if (si) si.addEventListener("input", function (e) { vQuery = e.target.value; var pos = e.target.selectionStart; renderVendors(); var n = $("#vsearch"); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (x) {} } });
  }

  /* ---- MAP ---- */
  function renderMap() {
    var m = CFG.map || {}, zones = (m.zones || []).map(function (z) {
      if (z.shape === "circle") return '<circle cx="' + z.x + '" cy="' + z.y + '" r="' + (z.r || 12) + '" fill="' + (z.fill || "#1a2330") + '" stroke="' + (z.stroke || "#666") + '" stroke-opacity=".5"/>' +
        '<text x="' + z.x + '" y="' + (z.y + 3) + '" text-anchor="middle" fill="' + (z.labelColor || "#cfe") + '" font-family="Outfit,sans-serif" font-size="8" font-weight="700">' + esc(z.label || "") + '</text>';
      return '<rect x="' + z.x + '" y="' + z.y + '" width="' + (z.w || 60) + '" height="' + (z.h || 28) + '" rx="6" fill="' + (z.fill || "#241a33") + '" stroke="' + (z.stroke || "#666") + '" stroke-opacity=".5"/>' +
        '<text x="' + (z.x + (z.w || 60) / 2) + '" y="' + (z.y + (z.h || 28) / 2 + 4) + '" text-anchor="middle" fill="' + (z.labelColor || "#cfe") + '" font-family="Outfit,sans-serif" font-size="10" font-weight="700">' + esc(z.label || "") + '</text>';
    }).join("");
    var legend = Object.keys(CFG.categories || {}).map(function (k) {
      return '<span><i style="background:' + CFG.categories[k].color + '"></i>' + esc(CFG.categories[k].label) + '</span>';
    }).join("");
    $("#view-map").innerHTML = '<div class="map-intro"><span class="section-eyebrow">Get around</span><h2>' + esc(m.title || "Festival Map") + '</h2>' +
      '<p>' + esc(m.note || "Tap a numbered spot to see what's there. Your saved stops glow.") + '</p></div>' +
      '<div class="map-stage" id="map-stage"><svg class="bg" viewBox="0 0 300 400" preserveAspectRatio="none">' +
        '<defs><linearGradient id="bglawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (m.bg1 || "#16332a") + '"/><stop offset="1" stop-color="' + (m.bg2 || "#0f241d") + '"/></linearGradient></defs>' +
        '<rect width="300" height="400" fill="url(#bglawn)"/>' +
        '<g stroke="#fff" stroke-opacity=".05" stroke-width="1"><path d="M0 100H300M0 200H300M0 300H300M75 0V400M150 0V400M225 0V400"/></g>' +
        zones + '</svg><div id="pins"></div>' +
        '<div class="map-pop" id="map-pop"><div class="mp-top"><span class="mono" id="mp-mono"></span>' +
        '<div style="min-width:0"><h4 id="mp-name"></h4><div class="mp-meta" id="mp-meta"></div></div>' +
        '<div class="mp-act">' + (FEAT.vendors ? '<button class="mini-btn" id="mp-view">Details</button>' : '') + '<button class="mini-btn solid" id="mp-save">Save</button></div></div></div>' +
      '</div><div class="legend">' + legend + '</div>';
    var pins = $("#pins");
    (CFG.vendors || []).forEach(function (v) {
      if (v.x == null || v.y == null) return;
      var saved = (v.products || []).some(function (p, i) { return inPlan(v.id + "-" + i); });
      var p = elc("button", "pin" + (saved ? " saved" : "") + (mapHL === v.id ? " hl" : ""));
      p.style.left = v.x + "%"; p.style.top = v.y + "%"; p.style.background = catColor(v.cat);
      p.textContent = v.loc; p.setAttribute("aria-label", v.name);
      p.addEventListener("click", function () { openPop(v.id); });
      pins.appendChild(p);
    });
    if (mapHL) openPop(mapHL);
  }
  function openPop(id) {
    var v = vendorById(id); if (!v) return;
    $("#mp-mono").style.background = catColor(v.cat);
    $("#mp-mono").textContent = initials(v.name);
    $("#mp-name").textContent = v.name;
    $("#mp-meta").textContent = catLabel(v.cat) + " · " + (v.products || []).length + " " + NOUN.productPlural.toLowerCase() + " · " + NOUN.stop + " " + v.loc;
    var sb = $("#mp-save"), any = (v.products || []).some(function (p, i) { return inPlan(v.id + "-" + i); });
    sb.textContent = any ? "Saved ✓" : "Save top " + NOUN.product.toLowerCase();
    sb.onclick = function () { toggleSave(v.id + "-0", v.products[0].name); renderMap(); openPop(id); };
    var mv = $("#mp-view"); if (mv) mv.onclick = function () { vQuery = v.name; vFilter = "all"; showView("vendors"); };
    $("#map-pop").classList.add("show");
  }
  function highlightOnMap(id) { mapHL = id; showView("map"); setTimeout(function () { mapHL = null; }, 2600); }

  /* ---- PLAN ---- */
  function renderPlan() {
    var items = plan.map(productById).filter(Boolean).sort(function (a, b) { return (a.loc || 0) - (b.loc || 0); });
    var head = '<div class="plan-head"><div><span class="section-eyebrow">Your night, sorted</span>' +
      '<h2 style="margin-top:8px">' + esc(NOUN.planTitle) + '</h2><p id="plan-sub"></p></div>' +
      '<span class="cnt">' + plan.length + ' saved</span></div>';
    var body, actions = "";
    if (!items.length) {
      body = '<div class="empty"><div class="em">🍻</div><h3>Your plan is empty</h3>' +
        '<p>Take the quick quiz and we’ll suggest your first ' + esc(NOUN.stopPlural ? NOUN.stopPlural.toLowerCase() : "picks") + '.</p>' +
        '<button class="cta cta-primary" data-action="start-quiz" style="margin-top:0">' + esc((CFG.home.decide || {}).primary || "Help Me Decide") + '</button></div>';
    } else {
      var vc = {}; items.forEach(function (p) { vc[p.vendorId] = 1; });
      body = items.map(function (p) {
        var sub = esc(p.vendorName) + " · " + esc(p.style) + (p.abv != null ? " · " + Number(p.abv).toFixed(1) + "%" : (p.price != null ? " · " + esc(p.price) : ""));
        return '<div class="plan-item"><span class="pnum">' + (p.loc != null ? p.loc : "•") + '</span>' +
          '<div class="pinfo"><div class="pbn">' + esc(p.name) + '</div><div class="pvn">' + sub + '</div></div>' +
          (FEAT.map ? '<button class="rm" data-map="' + p.vendorId + '" aria-label="Map">' + icon("pin") + '</button>' : '') +
          '<button class="rm" data-save="' + p.id + '" data-label="' + esc(p.name) + '" aria-label="Remove">' + icon("x") + '</button></div>';
      }).join("");
      actions = '<div class="plan-actions"><button class="cta cta-primary" data-action="share" style="margin-top:0">📋 Copy my plan to share</button>' +
        '<button class="cta cta-ghost" data-action="clear-plan">Clear plan</button></div>';
    }
    $("#view-plan").innerHTML = head + '<div id="plan-list">' + body + '</div>' + actions +
      '<div class="foot">Go from “too many choices” to “I know exactly where I’m headed.”</div>';
    var sub = $("#plan-sub");
    if (sub) sub.textContent = items.length ? ("Your route — " + items.length + " " + (items.length === 1 ? NOUN.product.toLowerCase() : NOUN.productPlural.toLowerCase()) + " across " + Object.keys(items.reduce(function (a, p) { a[p.vendorId] = 1; return a; }, {})).length + " " + NOUN.vendorPlural.toLowerCase() + ".") : "Nothing saved yet.";
  }
  function sharePlan() {
    var items = plan.map(productById).filter(Boolean).sort(function (a, b) { return (a.loc || 0) - (b.loc || 0); });
    var text = (CFG.brand.name) + " plan:\n" + items.map(function (p) { return "• " + NOUN.stop + " " + (p.loc != null ? p.loc : "-") + " — " + p.name + " @ " + p.vendorName; }).join("\n") + "\n\nBuilt with Brilla";
    if (root.navigator && root.navigator.share) root.navigator.share({ title: CFG.brand.name, text: text }).catch(function () {});
    else if (root.navigator && root.navigator.clipboard) root.navigator.clipboard.writeText(text).then(function () { toast("Plan copied to clipboard ✓"); }).catch(function () { toast("Couldn't copy"); });
    else toast("Sharing not supported here");
  }

  /* ---- shared state refresh ---- */
  function refreshSaveStates() {
    $$("[data-save]").forEach(function (btn) {
      var saved = inPlan(btn.dataset.save);
      if (btn.classList.contains("savebtn")) { btn.classList.toggle("saved", saved); btn.innerHTML = saved ? icon("check") + " Saved" : icon("heart") + " Save"; }
      else if (btn.classList.contains("heart")) btn.classList.toggle("on", saved);
    });
    updateBadges();
  }
  function updateBadges() {
    var b = $("#nav-badge"); if (!b) return;
    b.textContent = plan.length; b.classList.toggle("hide", plan.length === 0);
  }

  /* ---- events ---- */
  var wired = false;
  function wireEvents() {
    if (wired) return;
    wired = true;
    doc().addEventListener("click", function (e) {
      var nav = e.target.closest("[data-nav]"); if (nav) { showView(nav.dataset.nav); return; }
      var act = e.target.closest("[data-action]");
      if (act) {
        var a = act.dataset.action;
        if (a === "start-quiz" || a === "restart-quiz") startQuiz();
        else if (a === "quiz-back") { if (step > 0) { step--; renderQuiz(); } }
        else if (a === "quiz-skip") { answers[CFG.quiz[step].key] = null; if (step < CFG.quiz.length - 1) { step++; renderQuiz(); } else finishQuiz(); }
        else if (a === "more-stops") moreStops();
        else if (a === "share") sharePlan();
        else if (a === "clear-plan") { if (plan.length) { plan = []; savePlan(); renderPlan(); toast("Plan cleared"); } }
        return;
      }
      var fl = e.target.closest("[data-filter]"); if (fl) { vFilter = fl.dataset.filter; renderVendors(); return; }
      var sv = e.target.closest("[data-save]"); if (sv) { toggleSave(sv.dataset.save, sv.dataset.label); return; }
      var mp = e.target.closest("[data-map]"); if (mp && FEAT.map) { highlightOnMap(mp.dataset.map); return; }
    });
  }

  /* ---- public API ---- */
  var Brilla = {
    configs: {},
    _pending: null,
    register: function (cfg) { this.configs[cfg.id] = cfg; if (this._pending === cfg.id) { this._pending = null; this.start(cfg.id); } },
    start: function (id) {
      var cfg = this.configs[id];
      if (!cfg) { this._pending = id; return; }   // data file not loaded yet
      CFG = cfg;
      NOUN = Object.assign({ vendor: "vendor", vendorPlural: "Vendors", product: "item", productPlural: "Items",
        catalogTitle: "Directory", stop: "Stop", stopPlural: "Stops", planTitle: "My Plan", planNoun: "My Plan" }, cfg.nouns || {});
      FEAT = Object.assign({ vendors: true, map: true }, cfg.features || {});
      PRODUCTS = flattenProducts(cfg);
      applyTheme(cfg.theme);
      plan = loadPlan();
      var rootEl = doc().getElementById("root");
      rootEl.className = "app"; rootEl.innerHTML = buildShell();
      doc().title = (cfg.brand && cfg.brand.name ? cfg.brand.name + " — " : "") + "Brilla";
      wireEvents(); updateBadges(); renderHome(); showView("home");
    },
    // pure logic (for tests / reuse)
    buildProfile: buildProfile, score: score, recommend: recommend,
    reasonsFor: reasonsFor, flattenProducts: flattenProducts
  };
  root.Brilla = Brilla;
})(typeof window !== "undefined" ? window : globalThis);
