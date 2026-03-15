/**
 * Achievement System for K-POP Korean Learning Game.
 * Provides 32 achievements across 6 categories with toast notifications,
 * confetti effects, category filters, and persistent localStorage tracking.
 * Requires: main-app.js (gameState, escapeHtml, addXP, saveProgress,
 *   createConfetti, SoundEngine, getStreakCount, showToast)
 */
(function () {
  "use strict";

  /** @type {string} Storage key for unlocked achievement IDs */
  var STORE_UNLOCKED = "achievements_unlocked";
  /** @type {string} Storage key for achievement progress data */
  var STORE_PROGRESS = "achievements_progress";
  /** @type {string} Storage key for total achievement XP */
  var STORE_XP = "total_achievement_xp";
  /** @type {boolean} Re-entrancy guard for check loop */
  var isChecking = false;

  /**
   * @typedef {Object} Achievement
   * @property {string} id - Unique identifier
   * @property {string} name - English display name
   * @property {string} nameKr - Korean display name
   * @property {string} desc - Short description
   * @property {string} icon - Emoji icon
   * @property {string} category - Category key
   * @property {number} xp - XP reward on unlock
   * @property {function(): boolean} condition - Returns true when earned
   */

  /** @type {Object<string, string>} Category display labels */
  var CATEGORIES = {
    learning: "Learning",
    streak: "Streak",
    game: "Game",
    combo: "Combo",
    level: "Level",
    special: "Special"
  };

  /** @type {Object} Mutable progress for complex condition tracking */
  var progress = {};

  /**
   * Count collected words matching a specific rarity.
   * @param {string} rarity - Rarity level to count
   * @returns {number} Number of matching words
   */
  function countRarity(rarity) {
    var n = 0;
    for (var k in gameState.collectedWords) {
      if (gameState.collectedWords[k] === rarity) n++;
    }
    return n;
  }

  /**
   * Calculate lifetime total XP including levels spent.
   * @returns {number} Total XP earned across all levels
   */
  function getTotalXP() {
    var spent = 0;
    for (var i = 1; i < gameState.level; i++) spent += i * 100;
    return spent + gameState.xp;
  }

  /** @type {Achievement[]} Complete list of 32 achievement definitions */
  var ACHIEVEMENTS = [
    /* --- Learning (6) --- */
    { id: "first_word", name: "First Steps", nameKr: "\uCCAB \uAC78\uC74C", desc: "Learn your first word", icon: "\uD83D\uDC63", category: "learning", xp: 10, condition: function () { return gameState.wordsLearned >= 1; } },
    { id: "word_10", name: "Word Collector", nameKr: "\uB2E8\uC5B4 \uC218\uC9D1\uAC00", desc: "Learn 10 words", icon: "\uD83D\uDCDA", category: "learning", xp: 25, condition: function () { return gameState.wordsLearned >= 10; } },
    { id: "word_50", name: "Vocabulary Builder", nameKr: "\uC5B4\uD718 \uAC74\uC124\uC790", desc: "Learn 50 words", icon: "\uD83C\uDFD7\uFE0F", category: "learning", xp: 50, condition: function () { return gameState.wordsLearned >= 50; } },
    { id: "word_100", name: "Vocabulary Master", nameKr: "\uC5B4\uD718 \uB9C8\uC2A4\uD130", desc: "Learn 100 words", icon: "\uD83C\uDF93", category: "learning", xp: 100, condition: function () { return gameState.wordsLearned >= 100; } },
    { id: "word_200", name: "Word Sage", nameKr: "\uB2E8\uC5B4 \uD604\uC790", desc: "Learn 200 words", icon: "\uD83E\uDDD9", category: "learning", xp: 200, condition: function () { return gameState.wordsLearned >= 200; } },
    { id: "word_500", name: "Walking Dictionary", nameKr: "\uAC78\uC5B4\uB2E4\uB2C8\uB294 \uC0AC\uC804", desc: "Learn 500 words", icon: "\uD83D\uDCD6", category: "learning", xp: 500, condition: function () { return gameState.wordsLearned >= 500; } },

    /* --- Streak (4) --- */
    { id: "streak_3", name: "Three Day Run", nameKr: "3\uC77C \uC5F0\uC18D", desc: "3-day learning streak", icon: "\uD83D\uDD25", category: "streak", xp: 30, condition: function () { return getStreakCount() >= 3; } },
    { id: "streak_7", name: "Weekly Warrior", nameKr: "\uC77C\uC8FC\uC77C \uC644\uC8FC", desc: "7-day learning streak", icon: "\u2694\uFE0F", category: "streak", xp: 70, condition: function () { return getStreakCount() >= 7; } },
    { id: "streak_14", name: "Two Week Power", nameKr: "2\uC8FC\uC758 \uD798", desc: "14-day learning streak", icon: "\uD83D\uDCAA", category: "streak", xp: 140, condition: function () { return getStreakCount() >= 14; } },
    { id: "streak_30", name: "Monthly Legend", nameKr: "\uD55C \uB2EC\uC758 \uC804\uC124", desc: "30-day learning streak", icon: "\uD83D\uDC51", category: "streak", xp: 300, condition: function () { return getStreakCount() >= 30; } },

    /* --- Game (6) --- */
    { id: "games_1", name: "First Game", nameKr: "\uCCAB \uAC8C\uC784", desc: "Play your first game", icon: "\uD83C\uDFAE", category: "game", xp: 10, condition: function () { return gameState.gamesPlayed >= 1; } },
    { id: "games_10", name: "Gamer", nameKr: "\uAC8C\uC774\uBA38", desc: "Play 10 games", icon: "\uD83D\uDD79\uFE0F", category: "game", xp: 30, condition: function () { return gameState.gamesPlayed >= 10; } },
    { id: "games_50", name: "Dedicated Player", nameKr: "\uC5F4\uC815 \uD50C\uB808\uC774\uC5B4", desc: "Play 50 games", icon: "\uD83C\uDFC6", category: "game", xp: 75, condition: function () { return gameState.gamesPlayed >= 50; } },
    { id: "games_100", name: "Game Master", nameKr: "\uAC8C\uC784 \uB9C8\uC2A4\uD130", desc: "Play 100 games", icon: "\uD83C\uDFAF", category: "game", xp: 150, condition: function () { return gameState.gamesPlayed >= 100; } },
    { id: "perfect_quiz", name: "Perfect Score", nameKr: "\uB9CC\uC810\uC655", desc: "Get 100% on any quiz", icon: "\uD83D\uDCAF", category: "game", xp: 50, condition: function () { return progress.perfectQuiz === true; } },
    { id: "speed_demon", name: "Speed Demon", nameKr: "\uC2A4\uD53C\uB4DC\uC655", desc: "10 fast correct answers in a row", icon: "\u26A1", category: "game", xp: 80, condition: function () { return (progress.speedStreak || 0) >= 10; } },

    /* --- Combo (4) --- */
    { id: "combo_5", name: "Combo Starter", nameKr: "\uCF64\uBCF4 \uC2DC\uC791", desc: "Reach a 5 combo", icon: "\u2728", category: "combo", xp: 15, condition: function () { return gameState.bestCombo >= 5; } },
    { id: "combo_10", name: "Combo King", nameKr: "\uCF64\uBCF4 \uC655", desc: "Reach a 10 combo", icon: "\uD83E\uDD34", category: "combo", xp: 30, condition: function () { return gameState.bestCombo >= 10; } },
    { id: "combo_20", name: "Combo Master", nameKr: "\uCF64\uBCF4 \uB9C8\uC2A4\uD130", desc: "Reach a 20 combo", icon: "\uD83D\uDD17", category: "combo", xp: 60, condition: function () { return gameState.bestCombo >= 20; } },
    { id: "combo_50", name: "Combo Legend", nameKr: "\uCF64\uBCF4 \uC804\uC124", desc: "Reach a 50 combo", icon: "\uD83D\uDC8E", category: "combo", xp: 150, condition: function () { return gameState.bestCombo >= 50; } },

    /* --- Level (4) --- */
    { id: "level_5", name: "Rising Star", nameKr: "\uB5A0\uC624\uB974\uB294 \uBCC4", desc: "Reach level 5", icon: "\u2B50", category: "level", xp: 25, condition: function () { return gameState.level >= 5; } },
    { id: "level_10", name: "Shining Star", nameKr: "\uBE5B\uB098\uB294 \uBCC4", desc: "Reach level 10", icon: "\uD83C\uDF1F", category: "level", xp: 50, condition: function () { return gameState.level >= 10; } },
    { id: "level_25", name: "Korean Expert", nameKr: "\uD55C\uAD6D\uC5B4 \uC804\uBB38\uAC00", desc: "Reach level 25", icon: "\uD83C\uDFC5", category: "level", xp: 125, condition: function () { return gameState.level >= 25; } },
    { id: "level_50", name: "Korean Legend", nameKr: "\uD55C\uAD6D\uC5B4 \uC804\uC124", desc: "Reach level 50", icon: "\uD83D\uDC09", category: "level", xp: 250, condition: function () { return gameState.level >= 50; } },

    /* --- Special (8) --- */
    { id: "night_owl", name: "Night Owl", nameKr: "\uC62C\uBE7C\uBBF8", desc: "Study after midnight", icon: "\uD83E\uDD89", category: "special", xp: 20, condition: function () { return progress.nightOwl === true; } },
    { id: "early_bird", name: "Early Bird", nameKr: "\uC544\uCE68\uD615 \uC778\uAC04", desc: "Study before 6 AM", icon: "\uD83D\uDC26", category: "special", xp: 20, condition: function () { return progress.earlyBird === true; } },
    { id: "rare_5", name: "Rare Hunter", nameKr: "\uB808\uC5B4 \uC218\uC9D1\uAC00", desc: "Collect 5 rare words", icon: "\uD83D\uDC9C", category: "special", xp: 40, condition: function () { return countRarity("rare") >= 5; } },
    { id: "legendary_find", name: "Legendary Find", nameKr: "\uC804\uC124 \uBC1C\uACAC", desc: "Find a legendary word", icon: "\uD83C\uDF08", category: "special", xp: 100, condition: function () { return countRarity("legendary") >= 1; } },
    { id: "daily_complete", name: "Daily Champion", nameKr: "\uC77C\uC77C \uCC54\uD53C\uC5B8", desc: "Complete a daily challenge", icon: "\uD83D\uDCC5", category: "special", xp: 25, condition: function () { return localStorage.getItem("dailyDone") === "true"; } },
    { id: "xp_1000", name: "XP Hoarder", nameKr: "\uACBD\uD5D8\uCE58 \uBD80\uC790", desc: "Earn 1000 total XP", icon: "\uD83D\uDCB0", category: "special", xp: 50, condition: function () { return getTotalXP() >= 1000; } },
    { id: "xp_5000", name: "XP Millionaire", nameKr: "\uACBD\uD5D8\uCE58 \uBC31\uB9CC\uC7A5\uC790", desc: "Earn 5000 total XP", icon: "\uD83C\uDFE6", category: "special", xp: 100, condition: function () { return getTotalXP() >= 5000; } },
    { id: "category_master", name: "Category Master", nameKr: "\uCE74\uD14C\uACE0\uB9AC \uB9C8\uC2A4\uD130", desc: "Learn every word in a category", icon: "\uD83C\uDFAA", category: "special", xp: 200, condition: function () { return progress.categoryMastered === true; } }
  ];

  /* ===== localStorage helpers ===== */

  /**
   * Load progress object from localStorage.
   * @returns {void}
   */
  function loadProgress() {
    try {
      var raw = localStorage.getItem(STORE_PROGRESS);
      if (raw) progress = JSON.parse(raw);
    } catch (e) { progress = {}; }
  }

  /**
   * Persist progress object to localStorage.
   * @returns {void}
   */
  function saveProgressData() {
    try {
      localStorage.setItem(STORE_PROGRESS, JSON.stringify(progress));
    } catch (e) { /* silent */ }
  }

  /**
   * Persist the list of unlocked achievement IDs.
   * @returns {void}
   */
  function saveUnlocked() {
    try {
      var ids = [];
      for (var i = 0; i < ACHIEVEMENTS.length; i++) {
        if (gameState.achievements[ACHIEVEMENTS[i].id]) ids.push(ACHIEVEMENTS[i].id);
      }
      localStorage.setItem(STORE_UNLOCKED, JSON.stringify(ids));
    } catch (e) { /* silent */ }
  }

  /**
   * Persist the cumulative achievement XP total.
   * @returns {void}
   */
  function saveXPTotal() {
    try {
      localStorage.setItem(STORE_XP, String(calcXP()));
    } catch (e) { /* silent */ }
  }

  /* ===== Calculation helpers ===== */

  /**
   * Count how many achievements the player has unlocked.
   * @returns {number} Unlocked count
   */
  function countUnlocked() {
    var n = 0;
    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
      if (gameState.achievements[ACHIEVEMENTS[i].id]) n++;
    }
    return n;
  }

  /**
   * Sum XP from all unlocked achievements.
   * @returns {number} Total achievement XP earned
   */
  function calcXP() {
    var total = 0;
    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
      if (gameState.achievements[ACHIEVEMENTS[i].id]) {
        total += ACHIEVEMENTS[i].xp;
      }
    }
    return total;
  }

  /* ===== Time-based tracking ===== */

  /**
   * Check current hour and set time-based progress flags.
   * @returns {void}
   */
  function trackTime() {
    var h = new Date().getHours();
    if (h >= 0 && h < 5) progress.nightOwl = true;
    if (h >= 4 && h < 6) progress.earlyBird = true;
    saveProgressData();
  }

  /* ===== Toast notification ===== */

  /**
   * Display a slide-in toast for a newly unlocked achievement.
   * @param {Achievement} ach - The achievement that was unlocked
   * @returns {void}
   */
  function showAchievementToast(ach) {
    var el = document.createElement("div");
    el.className = "ach-toast";
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "assertive");
    var h = '<div class="ach-toast-inner">';
    h += '<span class="ach-toast-icon">' + ach.icon + '</span>';
    h += '<div class="ach-toast-body">';
    h += '<strong>Achievement Unlocked!</strong><br>';
    h += escapeHtml(ach.nameKr);
    h += '<small> +' + ach.xp + ' XP</small></div></div>';
    el.innerHTML = h;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 400);
    }, 3000);
  }

  /* ===== CSS injection ===== */

  /**
   * Inject achievement-specific CSS styles once into document head.
   * @returns {void}
   */
  function injectCSS() {
    if (document.getElementById("ach-sys-css")) return;
    var s = document.createElement("style");
    s.id = "ach-sys-css";
    s.textContent =
      ".ach-toast{position:fixed;top:20px;right:20px;z-index:10000;" +
      "transform:translateX(120%);transition:transform .4s cubic-bezier(.34,1.56,.64,1);" +
      "pointer-events:none}" +
      ".ach-toast.show{transform:translateX(0)}" +
      ".ach-toast-inner{display:flex;align-items:center;gap:12px;" +
      "background:linear-gradient(135deg,rgba(10,10,26,.95),rgba(30,15,60,.95));" +
      "border:2px solid #ffd700;border-radius:16px;padding:14px 20px;" +
      "box-shadow:0 0 20px rgba(255,215,0,.3),0 8px 32px rgba(0,0,0,.5);" +
      "backdrop-filter:blur(10px);min-width:260px}" +
      ".ach-toast-icon{font-size:2rem}" +
      ".ach-toast-body{color:#fff;font-size:.85rem;line-height:1.4}" +
      ".ach-toast-body strong{color:#ffd700;font-size:.9rem}" +
      ".ach-toast-body small{color:#00d4ff;margin-left:4px}" +
      ".ach-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:15px}" +
      ".ach-card{background:rgba(255,255,255,.05);border:2px solid rgba(255,255,255,.1);" +
      "border-radius:14px;padding:16px 10px;text-align:center;transition:all .3s ease}" +
      ".ach-card.unlocked{border-color:#ffd700;" +
      "box-shadow:0 0 15px rgba(255,215,0,.25);background:rgba(255,215,0,.05)}" +
      ".ach-card.unlocked .ach-ic{animation:achGlow 2s ease-in-out infinite alternate}" +
      ".ach-card.locked{opacity:.5;filter:grayscale(.7)}" +
      ".ach-card.locked .ach-ic{filter:grayscale(1)}" +
      ".ach-ic{font-size:2rem;margin-bottom:6px;display:block}" +
      ".ach-nm{font-size:.85rem;font-weight:bold;color:#fff;margin-bottom:2px}" +
      ".ach-kr{font-size:.75rem;color:rgba(255,255,255,.7);margin-bottom:4px}" +
      ".ach-ds{font-size:.65rem;color:rgba(255,255,255,.5);margin-bottom:4px}" +
      ".ach-xp{font-size:.7rem;color:#ffd700}" +
      ".ach-fbar{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:15px}" +
      ".ach-fb{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);" +
      "border-radius:20px;padding:6px 14px;color:rgba(255,255,255,.7);cursor:pointer;" +
      "font-size:.8rem;transition:all .2s ease}" +
      ".ach-fb:hover{background:rgba(255,255,255,.15)}" +
      ".ach-fb.active{background:linear-gradient(135deg,#ff2d95,#9d4edd);" +
      "border-color:transparent;color:#fff}" +
      ".ach-sum{display:flex;justify-content:center;gap:24px;margin-bottom:15px;" +
      "padding:12px;background:rgba(255,255,255,.05);border-radius:12px}" +
      ".ach-sv{font-size:1.4rem;font-weight:bold;color:#ffd700}" +
      ".ach-sl{font-size:.7rem;color:rgba(255,255,255,.6)}" +
      "@keyframes achGlow{from{text-shadow:0 0 5px rgba(255,215,0,.5)}" +
      "to{text-shadow:0 0 20px rgba(255,215,0,.8),0 0 30px rgba(255,215,0,.4)}}" +
      "@media(max-width:600px){.ach-grid{grid-template-columns:repeat(2,1fr)}}";
    document.head.appendChild(s);
  }

  /* ===== UI builders ===== */

  /**
   * Build HTML for the summary statistics bar.
   * @returns {string} Summary section HTML
   */
  function buildSummary() {
    var u = countUnlocked();
    var t = ACHIEVEMENTS.length;
    var pct = Math.round((u / t) * 100);
    var h = '<div class="ach-sum">';
    h += '<div style="text-align:center"><div class="ach-sv">' + u + ' / ' + t + '</div>';
    h += '<div class="ach-sl">Unlocked</div></div>';
    h += '<div style="text-align:center"><div class="ach-sv">' + pct + '%</div>';
    h += '<div class="ach-sl">Completion</div></div>';
    h += '<div style="text-align:center"><div class="ach-sv">' + calcXP() + '</div>';
    h += '<div class="ach-sl">Total XP</div></div></div>';
    return h;
  }

  /**
   * Build HTML for category filter buttons.
   * @param {string} active - Currently active filter key
   * @returns {string} Filter bar HTML
   */
  function buildFilters(active) {
    var h = '<div class="ach-fbar">';
    h += '<button class="ach-fb' + (active === "all" ? " active" : "");
    h += '" data-action="filter" data-filter="all">All</button>';
    for (var key in CATEGORIES) {
      var cls = active === key ? " active" : "";
      h += '<button class="ach-fb' + cls + '" data-action="filter"';
      h += ' data-filter="' + escapeHtml(key) + '">';
      h += escapeHtml(CATEGORIES[key]) + '</button>';
    }
    h += '</div>';
    return h;
  }

  /**
   * Build HTML for a single achievement card.
   * @param {Achievement} ach - Achievement definition
   * @returns {string} Card HTML
   */
  function buildCard(ach) {
    var ok = gameState.achievements[ach.id] === true;
    var h = '<div class="ach-card ' + (ok ? "unlocked" : "locked") + '">';
    h += '<span class="ach-ic">' + (ok ? ach.icon : "\uD83D\uDD12") + '</span>';
    h += '<div class="ach-nm">' + escapeHtml(ach.name) + '</div>';
    h += '<div class="ach-kr">' + escapeHtml(ach.nameKr) + '</div>';
    h += '<div class="ach-ds">' + escapeHtml(ach.desc) + '</div>';
    h += '<div class="ach-xp">+' + ach.xp + ' XP</div></div>';
    return h;
  }

  /**
   * Render the complete achievements page into a container.
   * @param {HTMLElement} container - Target DOM element
   * @param {string} filter - Active category filter key
   * @returns {void}
   */
  function renderGrid(container, filter) {
    var h = '<h2 class="game-title">Achievements</h2>';
    h += buildSummary();
    h += buildFilters(filter);
    h += '<div class="ach-grid">';
    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
      if (filter !== "all" && ACHIEVEMENTS[i].category !== filter) continue;
      h += buildCard(ACHIEVEMENTS[i]);
    }
    h += '</div>';
    container.innerHTML = h;
    bindFilters(container);
  }

  /**
   * Attach click event listeners to all filter buttons.
   * @param {HTMLElement} container - Parent DOM element
   * @returns {void}
   */
  function bindFilters(container) {
    var btns = container.querySelectorAll('[data-action="filter"]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        renderGrid(container, this.getAttribute("data-filter"));
      });
    }
  }

  /* ===== Core check logic ===== */

  /**
   * Evaluate all achievement conditions and unlock any newly earned.
   * Uses a re-entrancy guard to prevent addXP -> checkAchievements loop.
   * @returns {void}
   */
  function checkAllAchievements() {
    if (isChecking) return;
    isChecking = true;
    trackTime();
    for (var i = 0; i < ACHIEVEMENTS.length; i++) {
      var ach = ACHIEVEMENTS[i];
      if (gameState.achievements[ach.id]) continue;
      try {
        if (!ach.condition()) continue;
      } catch (e) { continue; }
      gameState.achievements[ach.id] = true;
      gameState.xp += ach.xp;
      showAchievementToast(ach);
      if (typeof createConfetti === "function") createConfetti(40);
      if (typeof SoundEngine !== "undefined") SoundEngine.levelUp();
    }
    if (typeof saveProgress === "function") saveProgress();
    saveUnlocked();
    saveXPTotal();
    saveProgressData();
    isChecking = false;
  }

  /* ===== Public API functions ===== */

  /**
   * Display the full achievements UI in the given container.
   * @param {HTMLElement} container - Target DOM element
   * @returns {void}
   */
  function showAchievements(container) {
    injectCSS();
    renderGrid(container, "all");
  }

  /**
   * Record that the player achieved a perfect quiz score.
   * @returns {void}
   */
  function recordPerfectQuiz() {
    progress.perfectQuiz = true;
    saveProgressData();
  }

  /**
   * Record the current speed answer streak count.
   * @param {number} streak - Consecutive fast-answer count
   * @returns {void}
   */
  function recordSpeedStreak(streak) {
    if (streak > (progress.speedStreak || 0)) {
      progress.speedStreak = streak;
      saveProgressData();
    }
  }

  /**
   * Record that a word category has been fully mastered.
   * @returns {void}
   */
  function recordCategoryMastered() {
    progress.categoryMastered = true;
    saveProgressData();
  }

  /**
   * Return the full achievements data array.
   * @returns {Achievement[]} All 32 achievement definitions
   */
  function getAchievementData() {
    return ACHIEVEMENTS;
  }

  /* ===== Initialization ===== */

  loadProgress();
  injectCSS();

  // Override globals defined in main-app.js
  window.achievementDefs = ACHIEVEMENTS;
  window.checkAchievements = checkAllAchievements;
  window.showAchievements = showAchievements;

  // Expose additional API
  window.recordPerfectQuiz = recordPerfectQuiz;
  window.recordSpeedStreak = recordSpeedStreak;
  window.recordCategoryMastered = recordCategoryMastered;
  window.getAchievementData = getAchievementData;
})();
