/**
 * ai-spaced-repetition.js
 * SM-2 Spaced Repetition System for Korean vocabulary review.
 * Requires: main-app.js (escapeHtml, getWords, showToast, addXP,
 *   speakKorean, saveProgress, gameState, createConfetti)
 */

/* --- Session State --- */
var SRS_KEY = "srs_cards";
var srsSessionQueue = [];
var srsSessionIdx = 0;
var srsCardFlipped = false;

/* ========== Date Utilities ========== */

/**
 * Get today's date as YYYY-MM-DD string.
 * @returns {string} ISO date string
 */
function srsToday() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get a date string offset from today.
 * @param {number} days - Days offset (negative for past)
 * @returns {string} ISO date string
 */
function srsFutureDate(days) {
  var d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

/* ========== SM-2 Algorithm ========== */

/**
 * SM-2 spaced repetition core algorithm.
 * @param {number} quality - Response quality (0-5)
 * @param {number} repetitions - Current repetition count
 * @param {number} easeFactor - Current ease factor (min 1.3)
 * @param {number} interval - Current interval in days
 * @returns {Object} {repetitions, easeFactor, interval, nextReview}
 */
function sm2Algorithm(quality, repetitions, easeFactor, interval) {
  var ef = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  ef = Math.max(1.3, Math.round(ef * 100) / 100);
  if (quality < 3) {
    return { repetitions: 0, easeFactor: ef, interval: 1, nextReview: srsFutureDate(1) };
  }
  var iv = repetitions === 0 ? 1 : repetitions === 1 ? 6 : Math.round(interval * ef);
  return { repetitions: repetitions + 1, easeFactor: ef, interval: iv, nextReview: srsFutureDate(iv) };
}

/* ========== Storage ========== */

/**
 * Load all SRS cards from localStorage.
 * @returns {Object} Cards map keyed by Korean text
 */
function srsGetCards() {
  try { return JSON.parse(localStorage.getItem(SRS_KEY)) || {}; }
  catch (e) { return {}; }
}

/**
 * Persist SRS cards to localStorage.
 * @param {Object} cards - Cards map to save
 */
function srsSaveCards(cards) {
  try { localStorage.setItem(SRS_KEY, JSON.stringify(cards)); }
  catch (e) { /* storage quota */ }
}

/* ========== Card Management ========== */

/**
 * Add a word to the SRS deck. Prevents duplicates.
 * @param {Object} word - {korean, english, romanization}
 * @returns {boolean} True if added, false if duplicate
 */
function srsAddCard(word) {
  if (!word || !word.korean) return false;
  var cards = srsGetCards();
  if (cards[word.korean]) return false;
  cards[word.korean] = {
    korean: word.korean, english: word.english || "",
    romanization: word.romanization || "",
    repetitions: 0, easeFactor: 2.5, interval: 0,
    nextReview: srsToday(), lastReview: null, history: []
  };
  srsSaveCards(cards);
  return true;
}

/**
 * Auto-register a word from other game modes.
 * @param {Object} word - {korean, english, romanization}
 */
function srsAutoRegister(word) {
  if (srsAddCard(word) && typeof showToast === "function") {
    showToast("SRS: " + word.korean + " added!");
  }
}

/**
 * Get cards due for review today or earlier.
 * @returns {Array} Array of due card objects
 */
function srsGetDueCards() {
  var cards = srsGetCards();
  var today = srsToday();
  var due = [];
  for (var k in cards) {
    if (cards.hasOwnProperty(k) && cards[k].nextReview <= today) {
      due.push(cards[k]);
    }
  }
  return due;
}

/**
 * Record a review rating for a specific card.
 * @param {string} korean - Korean word key
 * @param {number} quality - Rating 0-5
 */
function srsRecordReview(korean, quality) {
  var cards = srsGetCards();
  var card = cards[korean];
  if (!card) return;
  var r = sm2Algorithm(quality, card.repetitions, card.easeFactor, card.interval);
  card.repetitions = r.repetitions;
  card.easeFactor = r.easeFactor;
  card.interval = r.interval;
  card.nextReview = r.nextReview;
  card.lastReview = srsToday();
  card.history.push({ date: srsToday(), quality: quality });
  if (card.history.length > 50) card.history = card.history.slice(-50);
  cards[korean] = card;
  srsSaveCards(cards);
  if (quality >= 3 && typeof addXP === "function") addXP(quality * 5);
}

/**
 * Compute aggregated SRS statistics.
 * @returns {Object} {total, mastered, learning, newCount, dueToday, reviewedToday, completionRate}
 */
function srsGetStats() {
  var cards = srsGetCards();
  var today = srsToday();
  var t = 0, m = 0, l = 0, n = 0, due = 0, rev = 0;
  for (var k in cards) {
    if (!cards.hasOwnProperty(k)) continue;
    t++;
    var c = cards[k];
    if (c.interval > 21) m++;
    else if (c.repetitions > 0) l++;
    else n++;
    if (c.nextReview <= today) due++;
    if (c.lastReview === today) rev++;
  }
  var total = rev + due;
  return { total: t, mastered: m, learning: l, newCount: n,
    dueToday: due, reviewedToday: rev,
    completionRate: total > 0 ? Math.round((rev / total) * 100) : 100 };
}

/**
 * Add all words from current category to SRS.
 */
function srsAddAllWords() {
  var words = typeof getWords === "function" ? getWords() : [];
  var added = 0;
  for (var i = 0; i < words.length; i++) { if (srsAddCard(words[i])) added++; }
  if (typeof showToast === "function") showToast(added + " words added to SRS!");
}

/* ========== Dashboard UI ========== */

/**
 * Build 7-day calendar preview HTML.
 * @returns {string} Calendar HTML string
 */
function srsBuildCalendar() {
  var cards = srsGetCards();
  var h = '<div style="display:flex;gap:8px;justify-content:center;margin:15px 0">';
  for (var i = 0; i < 7; i++) {
    var date = srsFutureDate(i);
    var cnt = 0;
    for (var k in cards) { if (cards[k].nextReview === date) cnt++; }
    var day = i === 0 ? "Today" : new Date(date).toLocaleDateString("en", { weekday: "short" });
    var bg = i === 0 ? "var(--neon-pink)" : "var(--neon-purple)";
    var op = cnt > 0 ? "1" : "0.4";
    h += '<div style="text-align:center;opacity:' + op + '">';
    h += '<div style="font-size:0.7rem;color:rgba(255,255,255,0.6)">' + escapeHtml(day) + "</div>";
    h += '<div style="width:36px;height:36px;border-radius:50%;background:' + bg + ";";
    h += 'display:flex;align-items:center;justify-content:center;margin:4px auto;';
    h += 'font-weight:bold;font-size:0.9rem">' + cnt + "</div></div>";
  }
  return h + "</div>";
}

/**
 * Render the review dashboard screen.
 * @param {HTMLElement} c - Game area container
 */
function showReviewDashboard(c) {
  var stats = srsGetStats();
  var due = srsGetDueCards();
  var h = '<h2 class="game-title">Spaced Repetition</h2>';
  h += '<div style="text-align:center;margin-bottom:15px">';
  if (due.length > 0) {
    h += '<span style="background:var(--neon-pink);padding:6px 16px;border-radius:20px;';
    h += 'font-weight:bold;font-size:0.9rem">' + due.length + " cards due</span>";
  } else {
    h += '<span style="background:var(--neon-cyan);color:#000;padding:6px 16px;';
    h += 'border-radius:20px;font-weight:bold">All caught up!</span>';
  }
  h += "</div>";
  h += srsBuildCalendar();
  h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0">';
  var si = [
    { lb: "Mastered", v: stats.mastered, cl: "var(--neon-cyan)" },
    { lb: "Learning", v: stats.learning, cl: "var(--neon-purple)" },
    { lb: "New", v: stats.newCount, cl: "var(--gold)" }
  ];
  for (var i = 0; i < si.length; i++) {
    h += '<div style="background:var(--glass);border:1px solid rgba(255,255,255,0.1);';
    h += 'border-radius:15px;padding:15px;text-align:center">';
    h += '<div style="font-size:1.8rem;font-weight:bold;color:' + si[i].cl + '">' + si[i].v + "</div>";
    h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.6)">' + escapeHtml(si[i].lb) + "</div></div>";
  }
  h += "</div>";
  h += '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">';
  if (due.length > 0) {
    h += '<button class="game-btn" data-action="srsStartSession">Start Review</button>';
  }
  h += '<button class="game-btn secondary" data-action="srsShowStats">Statistics</button>';
  h += '<button class="game-btn secondary" data-action="srsAddAll">Add All Words</button></div>';
  c.innerHTML = h;
}

/* ========== Review Session UI ========== */

/**
 * Initialize and start a review session.
 * @param {HTMLElement} c - Game area container
 */
function srsStartSession(c) {
  srsSessionQueue = srsGetDueCards();
  if (srsSessionQueue.length === 0) { showReviewDashboard(c); return; }
  for (var i = srsSessionQueue.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = srsSessionQueue[i];
    srsSessionQueue[i] = srsSessionQueue[j];
    srsSessionQueue[j] = tmp;
  }
  srsSessionIdx = 0;
  srsCardFlipped = false;
  srsRenderCard(c);
}

/**
 * Build progress bar HTML for the session.
 * @param {number} current - Current card index
 * @param {number} total - Total cards in session
 * @returns {string} Progress bar HTML
 */
function srsBuildProgress(current, total) {
  var pct = Math.round((current / total) * 100);
  var h = '<div style="background:rgba(255,255,255,0.1);border-radius:10px;height:8px;margin-bottom:8px">';
  h += '<div style="width:' + pct + "%;height:100%;border-radius:10px;";
  h += "background:linear-gradient(90deg,var(--neon-pink),var(--neon-purple));";
  h += 'transition:width 0.3s"></div></div>';
  h += '<div style="text-align:right;font-size:0.75rem;color:rgba(255,255,255,0.5);margin-bottom:15px">';
  return h + (total - current) + " remaining</div>";
}

/**
 * Build rating buttons HTML for card assessment.
 * @returns {string} Rating buttons HTML
 */
function srsBuildRatingBtns() {
  var ratings = [
    { q: 0, lb: "Again", cl: "#ff4444" },
    { q: 1, lb: "Hard", cl: "#ff8800" },
    { q: 2, lb: "Tough", cl: "#cccc00" },
    { q: 3, lb: "Good", cl: "#44cc44" },
    { q: 4, lb: "Easy", cl: "#4488ff" },
    { q: 5, lb: "Perfect", cl: "#aa44ff" }
  ];
  var h = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:15px">';
  for (var i = 0; i < ratings.length; i++) {
    h += '<button class="game-btn" data-action="srsRate" data-quality="' + ratings[i].q + '" ';
    h += 'style="background:' + ratings[i].cl + ';padding:10px 8px;font-size:0.8rem">';
    h += escapeHtml(ratings[i].lb) + "</button>";
  }
  return h + "</div>";
}

/**
 * Render the current flashcard in the session.
 * @param {HTMLElement} c - Game area container
 */
function srsRenderCard(c) {
  if (srsSessionIdx >= srsSessionQueue.length) { srsRenderComplete(c); return; }
  var card = srsSessionQueue[srsSessionIdx];
  var h = '<h2 class="game-title">Review Session</h2>';
  h += srsBuildProgress(srsSessionIdx, srsSessionQueue.length);
  h += '<div class="flashcard" data-action="srsFlipCard" style="min-height:200px;cursor:pointer">';
  if (!srsCardFlipped) {
    h += '<div style="font-size:3.5rem;margin-bottom:10px">' + escapeHtml(card.korean) + "</div>";
    h += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.6)">Tap to reveal</div>';
  } else {
    h += '<div style="font-size:2rem;margin-bottom:8px">' + escapeHtml(card.korean) + "</div>";
    h += '<div style="font-size:1.3rem;margin-bottom:6px">' + escapeHtml(card.english) + "</div>";
    h += '<div style="font-size:0.9rem;color:rgba(255,255,255,0.7)">' + escapeHtml(card.romanization) + "</div>";
    h += '<button class="game-btn secondary" data-action="srsSpeakCard" data-korean="';
    h += escapeHtml(card.korean) + '" style="margin-top:10px;padding:6px 14px;font-size:0.8rem">';
    h += "&#9834; Listen</button>";
  }
  h += "</div>";
  if (srsCardFlipped) h += srsBuildRatingBtns();
  h += '<div style="text-align:center;margin-top:15px">';
  h += '<button class="game-btn secondary" data-action="srsBackDashboard" ';
  h += 'style="padding:8px 16px;font-size:0.8rem">Back</button></div>';
  c.innerHTML = h;
}

/**
 * Render session complete celebration screen.
 * @param {HTMLElement} c - Game area container
 */
function srsRenderComplete(c) {
  var stats = srsGetStats();
  if (typeof createConfetti === "function") createConfetti(60);
  var h = '<h2 class="game-title">Session Complete!</h2>';
  h += '<div style="text-align:center">';
  h += '<div style="font-size:4rem;margin:20px 0">&#127891;</div>';
  h += '<div style="font-size:1.5rem;color:var(--gold);margin-bottom:10px">';
  h += srsSessionQueue.length + " cards reviewed</div>";
  h += '<div style="color:rgba(255,255,255,0.7);margin-bottom:20px">';
  h += "Mastered: " + stats.mastered + " | Learning: " + stats.learning + "</div>";
  h += '<button class="game-btn" data-action="srsBackDashboard">Dashboard</button></div>';
  c.innerHTML = h;
}

/* ========== Statistics UI ========== */

/**
 * Build weekly heatmap (GitHub grass style).
 * @returns {string} Heatmap HTML
 */
function srsBuildHeatmap() {
  var cards = srsGetCards();
  var h = '<div style="margin:15px 0"><div style="font-size:0.85rem;margin-bottom:8px;';
  h += 'color:rgba(255,255,255,0.7)">Weekly Activity</div>';
  h += '<div style="display:flex;gap:4px;justify-content:center">';
  for (var i = 6; i >= 0; i--) {
    var date = srsFutureDate(-i);
    var cnt = 0;
    for (var k in cards) {
      if (!cards.hasOwnProperty(k)) continue;
      for (var j = 0; j < cards[k].history.length; j++) {
        if (cards[k].history[j].date === date) cnt++;
      }
    }
    var intensity = cnt === 0 ? 0.1 : Math.min(1, 0.2 + cnt * 0.15);
    var dayStr = new Date(date).toLocaleDateString("en", { weekday: "narrow" });
    h += '<div style="text-align:center">';
    h += '<div style="font-size:0.6rem;color:rgba(255,255,255,0.4)">' + escapeHtml(dayStr) + "</div>";
    h += '<div style="width:32px;height:32px;border-radius:6px;';
    h += "background:rgba(0,245,212," + intensity + ");";
    h += 'border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;';
    h += 'justify-content:center;font-size:0.65rem">' + (cnt || "") + "</div></div>";
  }
  return h + "</div></div>";
}

/**
 * Build retention distribution bar chart.
 * @returns {string} Chart HTML
 */
function srsBuildRetention() {
  var cards = srsGetCards();
  var bk = { 1: 0, 3: 0, 7: 0, 14: 0, 21: 0, 30: 0 };
  for (var k in cards) {
    if (!cards.hasOwnProperty(k)) continue;
    var iv = cards[k].interval;
    if (iv <= 1) bk[1]++; else if (iv <= 3) bk[3]++; else if (iv <= 7) bk[7]++;
    else if (iv <= 14) bk[14]++; else if (iv <= 21) bk[21]++; else bk[30]++;
  }
  var mx = 1;
  for (var b in bk) { if (bk[b] > mx) mx = bk[b]; }
  var labels = ["1d", "3d", "7d", "14d", "21d", "30d+"];
  var keys = [1, 3, 7, 14, 21, 30];
  var colors = ["#ff4444", "#ff8800", "#cccc00", "#44cc44", "#4488ff", "#aa44ff"];
  var h = '<div style="margin:15px 0"><div style="font-size:0.85rem;margin-bottom:8px;';
  h += 'color:rgba(255,255,255,0.7)">Retention Distribution</div>';
  h += '<div style="display:flex;align-items:flex-end;gap:6px;height:80px;justify-content:center">';
  for (var ci = 0; ci < keys.length; ci++) {
    var pct = Math.max(5, (bk[keys[ci]] / mx) * 100);
    h += '<div style="text-align:center;flex:1">';
    h += '<div style="font-size:0.6rem;color:rgba(255,255,255,0.5)">' + bk[keys[ci]] + "</div>";
    h += '<div style="height:' + pct + "%;background:" + colors[ci] + ";";
    h += 'border-radius:4px 4px 0 0;margin:2px auto;width:24px"></div>';
    h += '<div style="font-size:0.6rem;color:rgba(255,255,255,0.4)">' + labels[ci] + "</div></div>";
  }
  return h + "</div></div>";
}

/**
 * Render the full statistics page.
 * @param {HTMLElement} c - Game area container
 */
function showReviewStats(c) {
  var stats = srsGetStats();
  var h = '<h2 class="game-title">Review Statistics</h2>';
  h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px">';
  var items = [
    { lb: "Total Words", v: stats.total, cl: "#fff" },
    { lb: "Mastered", v: stats.mastered, cl: "var(--neon-cyan)" },
    { lb: "Learning", v: stats.learning, cl: "var(--neon-purple)" },
    { lb: "Completion", v: stats.completionRate + "%", cl: "var(--gold)" }
  ];
  for (var i = 0; i < items.length; i++) {
    h += '<div style="background:var(--glass);border:1px solid rgba(255,255,255,0.1);';
    h += 'border-radius:12px;padding:15px;text-align:center">';
    h += '<div style="font-size:1.6rem;font-weight:bold;color:' + items[i].cl + '">' + items[i].v + "</div>";
    h += '<div style="font-size:0.7rem;color:rgba(255,255,255,0.5)">' + escapeHtml(items[i].lb) + "</div></div>";
  }
  h += "</div>";
  h += srsBuildHeatmap();
  h += srsBuildRetention();
  h += '<div style="text-align:center;margin-top:20px">';
  h += '<button class="game-btn" data-action="srsBackDashboard">Back to Dashboard</button></div>';
  c.innerHTML = h;
}

/* ========== Event Delegation ========== */

/**
 * Handle all SRS-related data-action clicks.
 * @param {Event} e - Click event
 */
function srsHandleAction(e) {
  var el = e.target.closest("[data-action]");
  if (!el) return;
  var action = el.getAttribute("data-action");
  var c = document.getElementById("gameArea");
  if (!c) return;
  switch (action) {
    case "srsStartSession": srsStartSession(c); break;
    case "srsShowStats": showReviewStats(c); break;
    case "srsAddAll": srsAddAllWords(); showReviewDashboard(c); break;
    case "srsBackDashboard": showReviewDashboard(c); break;
    case "srsFlipCard":
      if (!srsCardFlipped) { srsCardFlipped = true; srsRenderCard(c); }
      break;
    case "srsRate":
      var q = parseInt(el.getAttribute("data-quality"), 10);
      if (srsSessionIdx < srsSessionQueue.length) {
        srsRecordReview(srsSessionQueue[srsSessionIdx].korean, q);
        srsSessionIdx++;
        srsCardFlipped = false;
        srsRenderCard(c);
      }
      break;
    case "srsSpeakCard":
      var kr = el.getAttribute("data-korean");
      if (kr && typeof speakKorean === "function") speakKorean(kr);
      break;
    default: break;
  }
}

document.addEventListener("click", srsHandleAction);
