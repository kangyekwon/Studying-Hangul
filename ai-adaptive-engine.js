/**
 * ai-adaptive-engine.js
 * Adaptive learning engine for K-POP Korean Learning Game.
 * Requires: main-app.js, content-data.js, chart.js (CDN)
 * Uses globals: escapeHtml, getWords, shuffle, addXP, addCombo,
 *   resetCombo, SoundEngine, showToast, saveProgress, gameState, wordDatabase
 */

/** @type {string} localStorage key */
var ADAPTIVE_KEY = "adaptive_data";
/** @type {Array<Object>} Recent quiz results */
var aqResults = [];
/** @type {Object|null} Current word */
var aqWord = null;
/** @type {number} Question start timestamp */
var aqStart = 0;
/** @type {string} Current difficulty */
var aqDiff = "easy";
/** @type {Object|null} Mini chart instance */
var aqChart = null;
/** @type {string|null} Weakness drill category */
var wtCat = null;
/** @type {Array<Object>} Weakness drill session results */
var wtResults = [];
/** @type {Object|null} Radar chart instance */
var reportRadar = null;

/**
 * Load adaptive data from localStorage.
 * @returns {Object} Parsed data or fresh defaults
 */
function loadAdaptiveData() {
  try { var r = localStorage.getItem(ADAPTIVE_KEY); if (r) return JSON.parse(r); }
  catch (e) { /* ignore */ }
  return { userLevel: "beginner", totalQuestions: 0, correctRate: 0, categoryStats: {},
    difficultyHistory: [], learningPath: [], streaks: { current: 0, best: 0 },
    weeklyLog: [], lastSession: null };
}

/**
 * Persist adaptive data to localStorage.
 * @param {Object} data - Adaptive data object
 */
function saveAdaptiveData(data) {
  try { localStorage.setItem(ADAPTIVE_KEY, JSON.stringify(data)); } catch (e) { /* full */ }
}

/**
 * Promote difficulty one step up.
 * @param {string} cur - Current difficulty
 * @returns {string} Higher difficulty
 */
function promoteD(cur) {
  return { easy: "medium", medium: "hard", hard: "expert", expert: "expert" }[cur] || "medium";
}

/**
 * Demote difficulty one step down.
 * @param {string} cur - Current difficulty
 * @returns {string} Lower difficulty
 */
function demoteD(cur) {
  return { expert: "hard", hard: "medium", medium: "easy", easy: "easy" }[cur] || "easy";
}

/** @namespace AdaptiveEngine */
var AdaptiveEngine = {
  /**
   * Calculate user proficiency level from history.
   * @returns {string} beginner|elementary|intermediate|advanced|expert
   */
  getUserLevel: function () {
    var d = loadAdaptiveData(), t = d.totalQuestions || 0, r = d.correctRate || 0;
    if (t < 20) return "beginner";
    if (t < 80 || r < 0.5) return "elementary";
    if (t < 200 || r < 0.7) return "intermediate";
    return (t < 500 || r < 0.85) ? "advanced" : "expert";
  },
  /**
   * Determine next question difficulty from recent answers.
   * @param {Array<{correct:boolean,time:number,difficulty:string}>} res - Recent results
   * @returns {string} easy|medium|hard|expert
   */
  getNextDifficulty: function (res) {
    if (!res || res.length < 2) return "easy";
    var l3 = res.slice(-3), l2 = res.slice(-2);
    var ok = l3.every(function (r) { return r.correct; });
    var avg = l3.reduce(function (s, r) { return s + r.time; }, 0) / l3.length;
    if (ok && avg < 3) return promoteD(l3[l3.length - 1].difficulty);
    if (l2.every(function (r) { return !r.correct; })) return demoteD(l2[l2.length - 1].difficulty);
    return l3[l3.length - 1].difficulty || "easy";
  },
  /**
   * Analyze weak categories from stored stats.
   * @returns {Array<{category:string,accuracy:number,count:number}>} Weakest first
   */
  analyzeWeakness: function () {
    var d = loadAdaptiveData(), w = [];
    for (var c in d.categoryStats) {
      var s = d.categoryStats[c];
      if (s.total >= 3) w.push({ category: c, accuracy: s.correct / s.total, count: s.total });
    }
    return w.sort(function (a, b) { return a.accuracy - b.accuracy; });
  },
  /**
   * Generate personalized learning path from weaknesses.
   * @returns {Array<string>} Ordered categories to study
   */
  generateLearningPath: function () {
    var wk = this.analyzeWeakness(), p = [];
    for (var i = 0; i < wk.length && i < 5; i++) { if (wk[i].accuracy < 0.8) p.push(wk[i].category); }
    if (p.length === 0) {
      var tried = loadAdaptiveData().categoryStats || {};
      if (typeof wordDatabase !== "undefined") {
        for (var cat in wordDatabase) { if (!tried[cat]) { p.push(cat); if (p.length >= 5) break; } }
      }
    }
    var d = loadAdaptiveData(); d.learningPath = p; saveAdaptiveData(d);
    return p;
  }
};

/**
 * Record answer result into adaptive data store.
 * @param {string} cat - Question category
 * @param {boolean} ok - Whether answer was correct
 * @param {number} time - Response time in seconds
 * @param {string} diff - Question difficulty
 */
function recordAdaptiveResult(cat, ok, time, diff) {
  var d = loadAdaptiveData();
  d.totalQuestions++;
  if (!d.categoryStats[cat]) d.categoryStats[cat] = { total: 0, correct: 0, avgTime: 0 };
  var cs = d.categoryStats[cat];
  cs.avgTime = ((cs.avgTime * cs.total) + time) / (cs.total + 1);
  cs.total++; if (ok) cs.correct++;
  var tc = 0; for (var k in d.categoryStats) tc += d.categoryStats[k].correct;
  d.correctRate = d.totalQuestions > 0 ? tc / d.totalQuestions : 0;
  if (ok) { d.streaks.current++; if (d.streaks.current > d.streaks.best) d.streaks.best = d.streaks.current; }
  else { d.streaks.current = 0; }
  var today = new Date().toISOString().slice(0, 10);
  var last = d.weeklyLog[d.weeklyLog.length - 1];
  if (last && last.date === today) { last.total++; if (ok) last.correct++; }
  else { d.weeklyLog.push({ date: today, total: 1, correct: ok ? 1 : 0 }); }
  if (d.weeklyLog.length > 30) d.weeklyLog = d.weeklyLog.slice(-30);
  d.userLevel = AdaptiveEngine.getUserLevel();
  d.lastSession = new Date().toISOString();
  saveAdaptiveData(d);
}

/**
 * Build four shuffled answer choice buttons.
 * @param {Object} word - Correct word object
 * @returns {string} HTML string with choice grid
 */
function buildChoices(word) {
  var ws = getWords(), opts = [word], sh = shuffle(ws);
  for (var i = 0; i < sh.length && opts.length < 4; i++) {
    if (sh[i].english !== word.english) opts.push(sh[i]);
  }
  opts = shuffle(opts);
  var h = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:400px;margin:0 auto">';
  for (var j = 0; j < opts.length; j++) {
    h += '<button class="game-btn aq-choice" data-answer="' + escapeHtml(opts[j].english) +
      '" style="padding:12px 8px;font-size:0.95rem">' + escapeHtml(opts[j].english) + "</button>";
  }
  return h + "</div>";
}

/**
 * Disable all active choice buttons.
 */
function disableChoices() {
  var b = document.querySelectorAll(".aq-choice");
  for (var i = 0; i < b.length; i++) b[i].disabled = true;
}

/**
 * Get AI motivational comment based on performance.
 * @returns {string} Feedback message
 */
function getAIComment() {
  var d = loadAdaptiveData(), r = d.correctRate || 0, s = d.streaks.current || 0;
  if (s >= 5) return "Incredible streak! Keep it up!";
  if (r >= 0.8) return "Great accuracy! Ready for a challenge?";
  if (r >= 0.6) return "Good progress! Practice makes perfect.";
  return (r < 0.4 && d.totalQuestions > 10) ? "Focus on basics first." : "Let's learn together!";
}

/**
 * Build a colored difficulty badge.
 * @param {string} diff - Difficulty level
 * @returns {string} HTML badge string
 */
function diffBadge(diff) {
  var c = { easy: "#00f5d4", medium: "#ffd700", hard: "#ff6b35", expert: "#ff2d95" }[diff] || "#00d4ff";
  return '<span style="background:' + c + ';color:#0a0a1a;padding:4px 14px;border-radius:20px;' +
    'font-weight:bold;font-size:0.85rem">' + escapeHtml(diff.toUpperCase()) + "</span>";
}

// ============================================================
// ADAPTIVE QUIZ MODE
// ============================================================

/**
 * Initialize and display adaptive quiz mode.
 * @param {HTMLElement} c - Game container element
 */
function showAdaptiveQuiz(c) {
  aqResults = [];
  aqDiff = AdaptiveEngine.getNextDifficulty([]);
  gameState.gamesPlayed++; saveProgress();
  renderAQ(c);
}

/**
 * Pick a word matching current difficulty tier.
 * @returns {Object|null} Word object or null
 */
function pickAQWord() {
  var ws = getWords(); if (ws.length === 0) return null;
  var sh = shuffle(ws), tier = Math.ceil(sh.length / 4);
  var idx = ({ easy: 0, medium: 1, hard: 2, expert: 3 }[aqDiff] || 0) * tier;
  return sh[Math.min(idx, sh.length - 1)];
}

/**
 * Render one adaptive quiz question with chart.
 * @param {HTMLElement} c - Container element
 */
function renderAQ(c) {
  aqWord = pickAQWord();
  if (!aqWord) { c.innerHTML = '<p style="text-align:center;color:#fff">No words available.</p>'; return; }
  aqStart = Date.now();
  var h = '<h2 class="game-title">Adaptive Quiz</h2>';
  h += '<div style="text-align:center;margin-bottom:12px">' + diffBadge(aqDiff);
  h += ' <span style="color:rgba(255,255,255,0.6);font-size:0.85rem">Q' + (aqResults.length + 1) + '</span></div>';
  h += '<p style="text-align:center;color:var(--neon-cyan);font-size:0.9rem;margin-bottom:18px">' +
    escapeHtml(getAIComment()) + "</p>";
  h += '<div style="text-align:center;font-size:2.8rem;margin:20px 0 30px;text-shadow:0 0 20px var(--neon-pink)">' +
    escapeHtml(aqWord.korean) + "</div>";
  h += buildChoices(aqWord);
  h += '<canvas id="aqChartC" width="300" height="120" style="display:block;margin:20px auto 0;max-width:100%"></canvas>';
  c.innerHTML = h;
  var btns = c.querySelectorAll(".aq-choice");
  for (var i = 0; i < btns.length; i++) btns[i].addEventListener("click", handleAQ);
  drawAQChart();
}

/**
 * Handle adaptive quiz answer selection.
 * @param {Event} e - Click event
 */
function handleAQ(e) {
  var btn = e.currentTarget, ans = btn.getAttribute("data-answer");
  var ok = ans === aqWord.english, t = (Date.now() - aqStart) / 1000;
  aqResults.push({ correct: ok, time: t, difficulty: aqDiff });
  recordAdaptiveResult(aqWord.category || "general", ok, t, aqDiff);
  if (ok) { btn.style.background = "var(--neon-cyan)"; btn.style.color = "#0a0a1a"; addXP(10); addCombo(); SoundEngine.correct(); }
  else { btn.style.background = "#ff4444"; resetCombo(); SoundEngine.wrong(); }
  aqDiff = AdaptiveEngine.getNextDifficulty(aqResults);
  disableChoices();
  var ct = btn.closest(".game-area") || btn.parentElement.parentElement;
  setTimeout(function () { renderAQ(ct); }, 1200);
}

/**
 * Draw mini bar chart of recent answer times.
 */
function drawAQChart() {
  var cv = document.getElementById("aqChartC");
  if (!cv || typeof Chart === "undefined") return;
  if (aqChart) aqChart.destroy();
  var sl = aqResults.slice(-10);
  aqChart = new Chart(cv, { type: "bar",
    data: { labels: sl.map(function (_, i) { return "Q" + (i + 1); }),
      datasets: [{ data: sl.map(function (r) { return r.time; }),
        backgroundColor: sl.map(function (r) { return r.correct ? "#00f5d4" : "#ff4444"; }) }] },
    options: { plugins: { legend: { display: false } }, responsive: false, animation: { duration: 400 },
      scales: { y: { beginAtZero: true, ticks: { color: "#888" } }, x: { ticks: { color: "#888" } } } }
  });
}

// ============================================================
// WEAKNESS TRAINING MODE
// ============================================================

/**
 * Display weakness training overview with category cards.
 * @param {HTMLElement} c - Container element
 */
function showWeaknessTraining(c) {
  var wk = AdaptiveEngine.analyzeWeakness();
  var h = '<h2 class="game-title">Weakness Training</h2>';
  if (wk.length === 0) {
    c.innerHTML = h + '<p style="text-align:center;color:rgba(255,255,255,0.7)">No data yet. Play some quizzes first!</p>';
    return;
  }
  h += '<p style="text-align:center;color:var(--neon-cyan);margin-bottom:18px">Focus on your weakest areas</p>';
  h += '<div style="max-width:400px;margin:0 auto">';
  for (var i = 0; i < wk.length && i < 6; i++) {
    var p = Math.round(wk[i].accuracy * 100);
    var bc = p < 50 ? "#ff4444" : p < 70 ? "#ffd700" : "#00f5d4";
    h += '<div class="wk-card" data-cat="' + escapeHtml(wk[i].category) + '" style="background:var(--bg-card);' +
      'border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:10px;cursor:pointer;' +
      'transition:transform 0.2s,box-shadow 0.2s">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center">';
    h += '<strong style="color:#fff">' + escapeHtml(wk[i].category) + '</strong>';
    h += '<span style="color:' + bc + ';font-weight:bold">' + p + '%</span></div>';
    h += '<div style="background:rgba(255,255,255,0.1);border-radius:6px;height:8px;margin-top:8px">';
    h += '<div style="width:' + p + '%;height:100%;border-radius:6px;background:' + bc + ';transition:width 0.6s"></div></div>';
    h += '<div style="color:rgba(255,255,255,0.5);font-size:0.8rem;margin-top:4px">' + wk[i].count + ' questions</div></div>';
  }
  h += "</div>";
  c.innerHTML = h;
  var cards = c.querySelectorAll(".wk-card");
  for (var j = 0; j < cards.length; j++) {
    cards[j].addEventListener("click", function (e) {
      wtCat = e.currentTarget.getAttribute("data-cat"); wtResults = []; startWTDrill(c);
    });
  }
}

/**
 * Start a focused weakness drill for selected category.
 * @param {HTMLElement} c - Container element
 */
function startWTDrill(c) {
  var cw = (typeof wordDatabase !== "undefined" && wordDatabase[wtCat]) ? wordDatabase[wtCat] : getWords();
  if (cw.length === 0) { showWeaknessTraining(c); return; }
  aqWord = shuffle(cw)[0]; aqStart = Date.now();
  var p = wtResults.length > 0 ? Math.round(wtResults.filter(function (r) { return r.correct; }).length / wtResults.length * 100) : 0;
  var h = '<h2 class="game-title">Training: ' + escapeHtml(wtCat) + "</h2>";
  h += '<div style="text-align:center;margin-bottom:12px;color:var(--neon-cyan)">Session: ' + p + '% | Goal: 80%</div>';
  h += '<div style="text-align:center;font-size:2.5rem;margin:18px 0 25px;text-shadow:0 0 20px var(--neon-purple)">' +
    escapeHtml(aqWord.korean) + "</div>";
  h += buildChoices(aqWord);
  h += '<div style="text-align:center;margin-top:18px"><button class="game-btn secondary" id="wtBack" ' +
    'style="padding:8px 20px;font-size:0.85rem">Back</button></div>';
  c.innerHTML = h;
  var btns = c.querySelectorAll(".aq-choice");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function (ev) {
      var ok = ev.currentTarget.getAttribute("data-answer") === aqWord.english;
      var t = (Date.now() - aqStart) / 1000;
      wtResults.push({ correct: ok, time: t });
      recordAdaptiveResult(wtCat || "general", ok, t, "medium");
      ev.currentTarget.style.background = ok ? "var(--neon-cyan)" : "#ff4444";
      ev.currentTarget.style.color = "#0a0a1a";
      if (ok) { addXP(12); SoundEngine.correct(); } else { SoundEngine.wrong(); }
      disableChoices();
      setTimeout(function () { startWTDrill(c); }, 1000);
    });
  }
  var bb = document.getElementById("wtBack");
  if (bb) bb.addEventListener("click", function () { showWeaknessTraining(c); });
}

// ============================================================
// AI LEARNING REPORT
// ============================================================

/**
 * Build a single stat display box HTML.
 * @param {string} label - Label text
 * @param {string} val - Display value
 * @param {string} color - CSS color
 * @returns {string} HTML string
 */
function statBox(label, val, color) {
  return '<div style="background:var(--bg-card);border-radius:12px;padding:12px;text-align:center">' +
    '<div style="font-size:1.4rem;font-weight:bold;color:' + color + '">' + val + '</div>' +
    '<div style="font-size:0.75rem;color:rgba(255,255,255,0.6)">' + escapeHtml(label) + '</div></div>';
}

/**
 * Display the full AI learning report.
 * @param {HTMLElement} c - Container element
 */
function showAIReport(c) {
  var d = loadAdaptiveData(), pct = Math.round((d.correctRate || 0) * 100);
  var h = '<h2 class="game-title">AI Learning Report</h2>';
  h += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;max-width:400px;margin:0 auto 16px">';
  h += statBox("Level", escapeHtml(d.userLevel || "beginner"), "var(--neon-pink)");
  h += statBox("Accuracy", pct + "%", "var(--neon-cyan)");
  h += statBox("Total Qs", String(d.totalQuestions || 0), "var(--gold)") + "</div>";
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:400px;margin:0 auto 16px">';
  h += statBox("Streak", String(d.streaks.current || 0), "var(--neon-purple)");
  h += statBox("Best", String(d.streaks.best || 0), "#ff6b35") + "</div>";
  // Motivation
  var rate = d.correctRate || 0;
  var msgs = [{ m: 0.8, t: "Outstanding! You're mastering Korean fast!" }, { m: 0.6, t: "Solid progress! Consistency is key." },
    { m: 0.4, t: "Keep going! Every mistake is a lesson." }, { m: 0, t: "Start with the basics and build up!" }];
  var msg = msgs.find(function (x) { return rate >= x.m; }) || msgs[3];
  h += '<div style="text-align:center;padding:10px 16px;margin:0 auto 12px;max-width:400px;' +
    'background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(255,45,149,0.2));border-radius:12px;' +
    'border:1px solid rgba(255,255,255,0.1)"><p style="color:var(--neon-cyan);margin:0;font-size:0.95rem">' +
    escapeHtml(msg.t) + "</p></div>";
  h += '<canvas id="rptRadar" width="300" height="300" style="display:block;margin:20px auto;max-width:100%"></canvas>';
  // Weekly trend
  var log = d.weeklyLog || [];
  if (log.length >= 2) {
    var r7 = log.slice(-7), tQ = 0, tC = 0;
    for (var i = 0; i < r7.length; i++) { tQ += r7[i].total; tC += r7[i].correct; }
    h += '<div style="max-width:400px;margin:12px auto;background:var(--bg-card);border-radius:12px;padding:14px">' +
      '<h3 style="color:var(--neon-pink);font-size:1rem;margin:0 0 8px">Weekly Trend</h3>' +
      '<p style="color:rgba(255,255,255,0.7);margin:0;font-size:0.85rem">Last 7 days: ' + tQ +
      ' questions, ' + (tQ > 0 ? Math.round(tC / tQ * 100) : 0) + '% accuracy</p></div>';
  } else {
    h += '<p style="text-align:center;color:rgba(255,255,255,0.5);font-size:0.85rem">Study more to unlock pattern analysis!</p>';
  }
  // Recommended plan
  var path = AdaptiveEngine.generateLearningPath();
  if (path.length > 0) {
    h += '<div style="max-width:400px;margin:12px auto;background:var(--bg-card);border-radius:12px;padding:14px">' +
      '<h3 style="color:var(--neon-pink);font-size:1rem;margin:0 0 10px">Recommended Focus</h3>';
    for (var p2 = 0; p2 < path.length; p2++) {
      h += '<span style="display:inline-block;background:rgba(255,45,149,0.2);color:var(--neon-cyan);' +
        'padding:4px 12px;border-radius:16px;margin:3px 4px;font-size:0.85rem">' + escapeHtml(path[p2]) + '</span>';
    }
    h += "</div>";
  }
  c.innerHTML = h;
  // Radar chart
  var cv = document.getElementById("rptRadar");
  if (cv && typeof Chart !== "undefined") {
    if (reportRadar) reportRadar.destroy();
    var cats = Object.keys(d.categoryStats || {}).slice(0, 8);
    if (cats.length >= 3) {
      var vals = cats.map(function (k) { var s = d.categoryStats[k]; return s.total > 0 ? Math.round(s.correct / s.total * 100) : 0; });
      reportRadar = new Chart(cv, { type: "radar",
        data: { labels: cats, datasets: [{ label: "Accuracy %", data: vals,
          backgroundColor: "rgba(0,245,212,0.2)", borderColor: "#00f5d4", pointBackgroundColor: "#ff2d95" }] },
        options: { scales: { r: { beginAtZero: true, max: 100, ticks: { color: "#888" }, grid: { color: "rgba(255,255,255,0.1)" } } },
          plugins: { legend: { labels: { color: "#aaa" } } }, responsive: false }
      });
    }
  }
}

// ============================================================
// GLOBAL EXPORTS
// ============================================================
window.AdaptiveEngine = AdaptiveEngine;
window.showAdaptiveQuiz = showAdaptiveQuiz;
window.showWeaknessTraining = showWeaknessTraining;
window.showAIReport = showAIReport;
window.recordAdaptiveResult = recordAdaptiveResult;
window.loadAdaptiveData = loadAdaptiveData;
window.saveAdaptiveData = saveAdaptiveData;
