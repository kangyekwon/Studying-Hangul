// ============================================================
// system-features.js
// System-level features for K-POP Korean Learning Game
// Dark/Light Mode, Quests, Season Ranking, Avatar, Share Card,
// Enhanced Pokedex Collection, and Save/Load enhancements
// ============================================================

// ============================================================
// 1. DARK / LIGHT MODE SYSTEM
// ============================================================

var darkMode = true; // current default is dark

var lightThemeVars = {
  '--bg-dark': '#f5f5f5',
  '--bg-card': 'rgba(255, 255, 255, 0.9)',
  '--glass': 'rgba(0, 0, 0, 0.04)',
  '--neon-pink': '#d6006e',
  '--neon-purple': '#7b2cbf',
  '--neon-blue': '#0099cc',
  '--neon-cyan': '#00b09b',
  '--gold': '#c9a500',
  '--fire': '#e05520'
};

var darkThemeVars = {
  '--bg-dark': '#0a0a1a',
  '--bg-card': 'rgba(20, 10, 40, 0.8)',
  '--glass': 'rgba(255, 255, 255, 0.05)',
  '--neon-pink': '#ff2d95',
  '--neon-purple': '#9d4edd',
  '--neon-blue': '#00d4ff',
  '--neon-cyan': '#00f5d4',
  '--gold': '#ffd700',
  '--fire': '#ff6b35'
};

function initTheme() {
  var saved = localStorage.getItem('kpop_theme');
  if (saved !== null) {
    darkMode = saved === 'dark';
  } else {
    // Check OS preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      darkMode = false;
    }
  }
  applyTheme();
  createThemeToggleButton();
}

function applyTheme() {
  var root = document.documentElement;
  var vars = darkMode ? darkThemeVars : lightThemeVars;
  for (var key in vars) {
    if (vars.hasOwnProperty(key)) {
      root.style.setProperty(key, vars[key]);
    }
  }

  // Body text color
  document.body.style.color = darkMode ? '#fff' : '#333';

  // Background image gradient
  if (!darkMode) {
    document.body.style.backgroundImage =
      'radial-gradient(ellipse at top, rgba(157,78,221,0.08), transparent 50%), ' +
      'radial-gradient(ellipse at bottom, rgba(0,212,255,0.05), transparent 50%)';
  } else {
    document.body.style.backgroundImage =
      'radial-gradient(ellipse at top, rgba(157,78,221,0.15), transparent 50%), ' +
      'radial-gradient(ellipse at bottom, rgba(0,212,255,0.1), transparent 50%)';
  }

  // Update toggle button icon
  var btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.innerHTML = darkMode ? '&#9788;' : '&#9790;';
    btn.title = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

function toggleTheme() {
  darkMode = !darkMode;
  applyTheme();
  localStorage.setItem('kpop_theme', darkMode ? 'dark' : 'light');
  if (typeof showToast === 'function') {
    showToast(darkMode ? 'Dark mode activated' : 'Light mode activated');
  }
}

function createThemeToggleButton() {
  if (document.getElementById('themeToggleBtn')) return;
  var btn = document.createElement('button');
  btn.id = 'themeToggleBtn';
  btn.onclick = toggleTheme;
  btn.setAttribute('aria-label', 'Toggle theme');
  btn.style.cssText =
    'position:fixed;top:10px;right:55px;width:40px;height:40px;border-radius:50%;' +
    'background:var(--glass);border:1px solid rgba(157,78,221,0.3);color:#fff;' +
    'cursor:pointer;z-index:50;font-size:1.2rem;display:flex;align-items:center;' +
    'justify-content:center;backdrop-filter:blur(10px);transition:all 0.3s ease;';
  btn.innerHTML = darkMode ? '&#9788;' : '&#9790;';
  btn.title = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  document.body.appendChild(btn);
}


// ============================================================
// 2. QUEST / MISSION SYSTEM
// ============================================================

var questSystem = {
  daily: [],
  completed: [],
  lastGenerated: null
};

var questTemplates = [
  {
    type: 'learn_category',
    generate: function() {
      var cats = ['kfood', 'emotions', 'daily', 'slang', 'kculture', 'travel'];
      var catNames = {
        kfood: 'K-Food', emotions: 'Emotions', daily: 'Daily',
        slang: 'Slang', kculture: 'K-Culture', travel: 'Travel'
      };
      var cat = cats[Math.floor(Math.random() * cats.length)];
      var target = 3 + Math.floor(Math.random() * 5);
      return {
        id: 'learn_' + cat + '_' + target,
        title: 'Learn ' + target + ' ' + (catNames[cat] || cat) + ' words',
        category: cat,
        target: target,
        reward: target * 10,
        type: 'learn_category',
        progress: 0
      };
    }
  },
  {
    type: 'play_games',
    generate: function() {
      var target = 2 + Math.floor(Math.random() * 4);
      return {
        id: 'play_' + target,
        title: 'Play ' + target + ' games',
        target: target,
        reward: target * 15,
        type: 'play_games',
        progress: 0
      };
    }
  },
  {
    type: 'get_combo',
    generate: function() {
      var target = 3 + Math.floor(Math.random() * 5);
      return {
        id: 'combo_' + target,
        title: 'Get a ' + target + ' combo',
        target: target,
        reward: target * 8,
        type: 'get_combo',
        progress: 0
      };
    }
  },
  {
    type: 'complete_daily',
    generate: function() {
      return {
        id: 'daily_challenge',
        title: 'Complete daily challenge',
        target: 1,
        reward: 100,
        type: 'complete_daily',
        progress: 0
      };
    }
  },
  {
    type: 'practice_listening',
    generate: function() {
      var target = 2 + Math.floor(Math.random() * 3);
      return {
        id: 'listening_' + target,
        title: 'Practice ' + target + ' listening exercises',
        target: target,
        reward: target * 20,
        type: 'practice_listening',
        progress: 0
      };
    }
  }
];

function generateDailyQuests() {
  var today = new Date().toDateString();
  if (questSystem.lastGenerated === today && questSystem.daily.length > 0) {
    return;
  }

  // Seed random from date for consistency
  questSystem.daily = [];
  questSystem.completed = [];
  questSystem.lastGenerated = today;

  var available = questTemplates.slice();
  for (var i = 0; i < 3 && available.length > 0; i++) {
    var idx = Math.floor(Math.random() * available.length);
    var template = available.splice(idx, 1)[0];
    questSystem.daily.push(template.generate());
  }

  saveSystemFeatures();
}

function checkQuestProgress() {
  if (!questSystem.daily || questSystem.daily.length === 0) return;

  for (var i = 0; i < questSystem.daily.length; i++) {
    var q = questSystem.daily[i];
    if (q.done) continue;

    switch (q.type) {
      case 'learn_category':
        var count = 0;
        if (q.category && typeof wordDatabase !== 'undefined' && wordDatabase[q.category]) {
          var catWords = wordDatabase[q.category];
          for (var j = 0; j < catWords.length; j++) {
            if (gameState.collectedWords[catWords[j].korean]) {
              count++;
            }
          }
        }
        q.progress = Math.min(count, q.target);
        break;
      case 'play_games':
        q.progress = Math.min(gameState.gamesPlayed, q.target);
        break;
      case 'get_combo':
        q.progress = Math.min(gameState.bestCombo, q.target);
        break;
      case 'complete_daily':
        var dailyDone = localStorage.getItem('dailyDone') === 'true' &&
                        localStorage.getItem('dailyDate') === new Date().toDateString();
        q.progress = dailyDone ? 1 : 0;
        break;
      case 'practice_listening':
        // Track via gameState - estimate from correctAnswers
        q.progress = Math.min(q.progress, q.target);
        break;
    }

    if (q.progress >= q.target && !q.done) {
      q.done = true;
      questSystem.completed.push(q.id);
      if (typeof addXP === 'function') {
        addXP(q.reward);
      }
      if (typeof showToast === 'function') {
        showToast('Quest Complete: ' + q.title + ' (+' + q.reward + ' XP)');
      }
      if (typeof createConfetti === 'function') {
        createConfetti(30);
      }
      saveSystemFeatures();
    }
  }
}

function incrementQuestProgress(questType) {
  if (!questSystem.daily) return;
  for (var i = 0; i < questSystem.daily.length; i++) {
    var q = questSystem.daily[i];
    if (q.type === questType && !q.done) {
      q.progress = Math.min(q.progress + 1, q.target);
    }
  }
  checkQuestProgress();
}

function showQuests(c) {
  generateDailyQuests();
  checkQuestProgress();

  var h = '<h2 class="game-title">Daily Quests</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">' +
       'Complete quests for bonus XP!</p>';

  if (questSystem.daily.length === 0) {
    h += '<p style="text-align:center">No quests available. Check back tomorrow!</p>';
    c.innerHTML = h;
    return;
  }

  for (var i = 0; i < questSystem.daily.length; i++) {
    var q = questSystem.daily[i];
    var pct = Math.min(100, Math.round((q.progress / q.target) * 100));
    var isDone = q.done;
    var borderColor = isDone ? 'var(--neon-cyan)' : 'rgba(157,78,221,0.3)';
    var bgDone = isDone ? 'rgba(0,245,212,0.1)' : 'var(--glass)';

    h += '<div style="background:' + bgDone + ';border:1px solid ' + borderColor +
         ';border-radius:15px;padding:20px;margin-bottom:12px;backdrop-filter:blur(10px);">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">';
    h += '<span style="font-weight:600;font-size:1rem">' +
         (isDone ? '<span style="color:var(--neon-cyan)">&#10003; </span>' : '') +
         escapeHtml(q.title) + '</span>';
    h += '<span style="color:var(--gold);font-weight:bold;font-size:0.9rem">+' + q.reward + ' XP</span>';
    h += '</div>';

    // Progress bar
    h += '<div style="background:rgba(255,255,255,0.1);border-radius:10px;height:8px;overflow:hidden">';
    h += '<div style="height:100%;border-radius:10px;width:' + pct + '%;' +
         'background:linear-gradient(90deg,var(--neon-pink),var(--neon-purple));' +
         'transition:width 0.5s ease"></div></div>';
    h += '<div style="text-align:right;font-size:0.8rem;color:rgba(255,255,255,0.6);margin-top:5px">' +
         q.progress + '/' + q.target + '</div>';
    h += '</div>';
  }

  var allDone = questSystem.daily.every(function(q) { return q.done; });
  if (allDone) {
    h += '<p style="text-align:center;color:var(--neon-cyan);font-size:1.2rem;margin-top:20px">' +
         'All quests completed! Come back tomorrow!</p>';
  }

  c.innerHTML = h;
}


// ============================================================
// 3. SEASON RANKING SYSTEM
// ============================================================

var seasonData = {
  currentSeason: 1,
  seasonStart: null,
  seasonEnd: null,
  seasonXP: 0,
  tier: 'Bronze',
  rewards: [],
  seasonHistory: []
};

var SEASON_BASE_DATE = new Date(2025, 0, 1).getTime(); // Jan 1 2025
var SEASON_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

var seasonTiers = [
  { name: 'Bronze',   minXP: 0,    color: '#cd7f32', icon: '&#9913;' },
  { name: 'Silver',   minXP: 500,  color: '#c0c0c0', icon: '&#9913;' },
  { name: 'Gold',     minXP: 1500, color: '#ffd700', icon: '&#9733;' },
  { name: 'Platinum', minXP: 3000, color: '#e5e4e2', icon: '&#9733;' },
  { name: 'Diamond',  minXP: 5000, color: '#b9f2ff', icon: '&#9830;' }
];

function initSeason() {
  var now = Date.now();
  var elapsed = now - SEASON_BASE_DATE;
  var currentSeasonNum = Math.floor(elapsed / SEASON_DURATION_MS) + 1;
  var seasonStartMs = SEASON_BASE_DATE + (currentSeasonNum - 1) * SEASON_DURATION_MS;
  var seasonEndMs = seasonStartMs + SEASON_DURATION_MS;

  // Check if new season started
  if (seasonData.currentSeason !== currentSeasonNum) {
    // Archive old season if we had XP
    if (seasonData.seasonXP > 0) {
      seasonData.seasonHistory.push({
        season: seasonData.currentSeason,
        xp: seasonData.seasonXP,
        tier: seasonData.tier
      });
    }
    seasonData.seasonXP = 0;
    seasonData.currentSeason = currentSeasonNum;
  }

  seasonData.seasonStart = seasonStartMs;
  seasonData.seasonEnd = seasonEndMs;
  seasonData.tier = getSeasonTier(seasonData.seasonXP).name;
  saveSystemFeatures();
}

function getSeasonTier(xp) {
  var result = seasonTiers[0];
  for (var i = 0; i < seasonTiers.length; i++) {
    if (xp >= seasonTiers[i].minXP) {
      result = seasonTiers[i];
    }
  }
  return result;
}

function getNextSeasonTier(xp) {
  for (var i = 0; i < seasonTiers.length; i++) {
    if (xp < seasonTiers[i].minXP) {
      return seasonTiers[i];
    }
  }
  return null; // already max
}

function addSeasonXP(amount) {
  seasonData.seasonXP += amount;
  var newTier = getSeasonTier(seasonData.seasonXP);
  if (newTier.name !== seasonData.tier) {
    seasonData.tier = newTier.name;
    if (typeof showToast === 'function') {
      showToast('Season tier up: ' + newTier.name + '!');
    }
    if (typeof createConfetti === 'function') {
      createConfetti(50);
    }
  }
  saveSystemFeatures();
}

function showSeason(c) {
  initSeason();
  var tier = getSeasonTier(seasonData.seasonXP);
  var nextTier = getNextSeasonTier(seasonData.seasonXP);
  var daysLeft = Math.max(0, Math.ceil((seasonData.seasonEnd - Date.now()) / (24 * 60 * 60 * 1000)));

  var h = '<h2 class="game-title">Season ' + seasonData.currentSeason + '</h2>';

  // Tier display
  h += '<div style="text-align:center;margin:20px 0">';
  h += '<div style="font-size:4rem;color:' + tier.color + '">' + tier.icon + '</div>';
  h += '<div style="font-size:1.8rem;font-weight:bold;color:' + tier.color + '">' + tier.name + '</div>';
  h += '<div style="color:rgba(255,255,255,0.7);margin-top:5px">' + seasonData.seasonXP + ' Season XP</div>';
  h += '</div>';

  // Progress to next tier
  if (nextTier) {
    var tierProgress = seasonData.seasonXP - tier.minXP;
    var tierRange = nextTier.minXP - tier.minXP;
    var tierPct = Math.round((tierProgress / tierRange) * 100);
    h += '<div style="max-width:400px;margin:15px auto">';
    h += '<div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:5px">';
    h += '<span style="color:' + tier.color + '">' + tier.name + '</span>';
    h += '<span style="color:' + nextTier.color + '">' + nextTier.name + ' (' + nextTier.minXP + ' XP)</span>';
    h += '</div>';
    h += '<div style="background:rgba(255,255,255,0.1);border-radius:10px;height:10px;overflow:hidden">';
    h += '<div style="height:100%;width:' + tierPct + '%;border-radius:10px;' +
         'background:linear-gradient(90deg,' + tier.color + ',' + nextTier.color + ');' +
         'transition:width 0.5s ease"></div></div></div>';
  } else {
    h += '<p style="text-align:center;color:var(--gold)">Maximum tier reached!</p>';
  }

  // Days remaining
  h += '<div style="text-align:center;margin:25px 0;padding:15px;' +
       'background:var(--glass);border-radius:15px;border:1px solid rgba(157,78,221,0.3)">';
  h += '<div style="font-size:2rem;font-weight:bold;color:var(--neon-cyan)">' + daysLeft + '</div>';
  h += '<div style="color:rgba(255,255,255,0.6);font-size:0.85rem">Days remaining in season</div>';
  h += '</div>';

  // Tier guide
  h += '<h3 style="text-align:center;margin:20px 0 15px;color:var(--neon-pink)">Tier Guide</h3>';
  h += '<div style="max-width:400px;margin:0 auto">';
  for (var i = 0; i < seasonTiers.length; i++) {
    var t = seasonTiers[i];
    var isActive = t.name === tier.name;
    h += '<div style="display:flex;justify-content:space-between;align-items:center;' +
         'padding:10px 15px;border-radius:10px;margin:4px 0;' +
         'background:' + (isActive ? 'rgba(255,45,149,0.15)' : 'transparent') + ';' +
         'border:1px solid ' + (isActive ? t.color : 'transparent') + '">';
    h += '<span style="color:' + t.color + ';font-weight:' + (isActive ? 'bold' : 'normal') + '">' +
         t.icon + ' ' + t.name + '</span>';
    h += '<span style="color:rgba(255,255,255,0.6)">' + t.minXP + '+ XP</span>';
    h += '</div>';
  }
  h += '</div>';

  // Season history
  if (seasonData.seasonHistory.length > 0) {
    h += '<h3 style="text-align:center;margin:25px 0 15px;color:var(--neon-cyan)">Past Seasons</h3>';
    h += '<div style="max-width:400px;margin:0 auto">';
    for (var j = seasonData.seasonHistory.length - 1; j >= 0 && j >= seasonData.seasonHistory.length - 5; j--) {
      var sh = seasonData.seasonHistory[j];
      var shTier = getSeasonTier(sh.xp);
      h += '<div style="display:flex;justify-content:space-between;padding:10px 15px;' +
           'border-radius:10px;margin:4px 0;background:var(--glass)">';
      h += '<span>Season ' + sh.season + '</span>';
      h += '<span style="color:' + shTier.color + '">' + sh.tier + ' (' + sh.xp + ' XP)</span>';
      h += '</div>';
    }
    h += '</div>';
  }

  c.innerHTML = h;
}


// ============================================================
// 4. AVATAR / PROFILE SYSTEM
// ============================================================

var avatarState = {
  face: 0,
  hair: 0,
  accessory: 0,
  background: 0,
  unlockedItems: {
    face: [0],
    hair: [0],
    accessory: [0],
    background: [0]
  }
};

var avatarItems = {
  face: [
    { name: 'Happy',    level: 1  },
    { name: 'Cool',     level: 3  },
    { name: 'Studying', level: 5  },
    { name: 'Excited',  level: 8  },
    { name: 'Star',     level: 10 }
  ],
  hair: [
    { name: 'Short',    level: 1  },
    { name: 'Long',     level: 3  },
    { name: 'Curly',    level: 5  },
    { name: 'Ponytail', level: 8  },
    { name: 'None',     level: 10 }
  ],
  accessory: [
    { name: 'None',       level: 1  },
    { name: 'Glasses',    level: 3  },
    { name: 'Headphones', level: 5  },
    { name: 'Hat',        level: 8  },
    { name: 'Crown',      level: 10 }
  ],
  background: [
    { name: 'Pink',    level: 1,  color: '#ff69b4' },
    { name: 'Blue',    level: 3,  color: '#4a90d9' },
    { name: 'Purple',  level: 5,  color: '#9d4edd' },
    { name: 'Gold',    level: 8,  color: '#ffd700' },
    { name: 'Rainbow', level: 10, color: 'url(#rainbowGrad)' }
  ]
};

function getAvatarUnlocks(level) {
  var newUnlocks = [];
  var categories = ['face', 'hair', 'accessory', 'background'];
  for (var c = 0; c < categories.length; c++) {
    var cat = categories[c];
    var items = avatarItems[cat];
    for (var i = 0; i < items.length; i++) {
      if (level >= items[i].level && avatarState.unlockedItems[cat].indexOf(i) === -1) {
        avatarState.unlockedItems[cat].push(i);
        newUnlocks.push(cat + ': ' + items[i].name);
      }
    }
  }
  if (newUnlocks.length > 0) {
    saveSystemFeatures();
    if (typeof showToast === 'function') {
      showToast('New avatar items unlocked: ' + newUnlocks.join(', '));
    }
  }
  return newUnlocks;
}

function renderAvatarSVG(face, hair, accessory, bg) {
  var bgColor = avatarItems.background[bg] ? avatarItems.background[bg].color : '#ff69b4';
  var isRainbow = bg === 4;

  var svg = '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">';

  // Defs
  svg += '<defs>';
  svg += '<linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
         '<stop offset="0%" stop-color="#ff2d95"/>' +
         '<stop offset="25%" stop-color="#9d4edd"/>' +
         '<stop offset="50%" stop-color="#00d4ff"/>' +
         '<stop offset="75%" stop-color="#00f5d4"/>' +
         '<stop offset="100%" stop-color="#ffd700"/></linearGradient>';
  svg += '<linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
         '<stop offset="0%" stop-color="#ffdbac"/>' +
         '<stop offset="100%" stop-color="#f1c27d"/></linearGradient>';
  svg += '</defs>';

  // Background circle
  if (isRainbow) {
    svg += '<circle cx="100" cy="100" r="95" fill="url(#rainbowGrad)" opacity="0.3"/>';
  } else {
    svg += '<circle cx="100" cy="100" r="95" fill="' + bgColor + '" opacity="0.3"/>';
  }

  // Hair (behind head)
  switch (hair) {
    case 1: // Long
      svg += '<ellipse cx="100" cy="110" rx="65" ry="80" fill="#2c1810"/>';
      break;
    case 2: // Curly
      svg += '<circle cx="65" cy="70" r="30" fill="#4a2800"/>';
      svg += '<circle cx="135" cy="70" r="30" fill="#4a2800"/>';
      svg += '<circle cx="75" cy="50" r="28" fill="#4a2800"/>';
      svg += '<circle cx="125" cy="50" r="28" fill="#4a2800"/>';
      svg += '<circle cx="100" cy="42" r="30" fill="#4a2800"/>';
      break;
    case 3: // Ponytail
      svg += '<ellipse cx="100" cy="30" rx="45" ry="20" fill="#1a0a00"/>';
      svg += '<path d="M140 55 Q170 40 160 90 Q155 120 145 100" fill="#1a0a00"/>';
      break;
  }

  // Face (head)
  svg += '<circle cx="100" cy="100" r="55" fill="url(#skinGrad)"/>';

  // Hair (front)
  switch (hair) {
    case 0: // Short
      svg += '<path d="M55 85 Q55 45 100 40 Q145 45 145 85" fill="#2c1810"/>';
      svg += '<path d="M60 80 Q60 55 100 50 Q140 55 140 80" fill="url(#skinGrad)"/>';
      break;
    case 1: // Long
      svg += '<path d="M50 90 Q50 42 100 35 Q150 42 150 90" fill="#2c1810"/>';
      svg += '<path d="M58 85 Q58 55 100 48 Q142 55 142 85" fill="url(#skinGrad)"/>';
      break;
    case 2: // Curly
      svg += '<path d="M55 85 Q55 40 100 33 Q145 40 145 85" fill="#4a2800"/>';
      svg += '<path d="M62 82 Q62 53 100 46 Q138 53 138 82" fill="url(#skinGrad)"/>';
      break;
    case 3: // Ponytail
      svg += '<path d="M55 85 Q55 42 100 35 Q145 42 145 85" fill="#1a0a00"/>';
      svg += '<path d="M60 80 Q60 52 100 45 Q140 52 140 80" fill="url(#skinGrad)"/>';
      break;
    case 4: // None (bald)
      // No hair drawn
      break;
  }

  // Eyes - vary by face expression
  switch (face) {
    case 0: // Happy
      svg += '<circle cx="80" cy="95" r="6" fill="#333"/>';
      svg += '<circle cx="120" cy="95" r="6" fill="#333"/>';
      svg += '<circle cx="82" cy="93" r="2" fill="#fff"/>';
      svg += '<circle cx="122" cy="93" r="2" fill="#fff"/>';
      svg += '<path d="M80 115 Q100 130 120 115" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>';
      break;
    case 1: // Cool
      svg += '<line x1="68" y1="93" x2="92" y2="93" stroke="#333" stroke-width="4" stroke-linecap="round"/>';
      svg += '<line x1="108" y1="93" x2="132" y2="93" stroke="#333" stroke-width="4" stroke-linecap="round"/>';
      svg += '<path d="M85 115 Q100 125 115 115" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>';
      break;
    case 2: // Studying
      svg += '<circle cx="80" cy="95" r="7" fill="#333"/>';
      svg += '<circle cx="120" cy="95" r="7" fill="#333"/>';
      svg += '<circle cx="83" cy="92" r="2.5" fill="#fff"/>';
      svg += '<circle cx="123" cy="92" r="2.5" fill="#fff"/>';
      // Slight concentrating mouth
      svg += '<line x1="90" y1="118" x2="110" y2="118" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>';
      // Sweat drop
      svg += '<path d="M142 75 Q146 85 142 90 Q138 85 142 75" fill="#00d4ff" opacity="0.6"/>';
      break;
    case 3: // Excited
      svg += '<path d="M72 88 L80 100 L88 88" fill="#333"/>';
      svg += '<path d="M112 88 L120 100 L128 88" fill="#333"/>';
      svg += '<ellipse cx="100" cy="120" rx="12" ry="8" fill="#333"/>';
      // Sparkles
      svg += '<text x="145" y="78" font-size="14" fill="#ffd700">*</text>';
      svg += '<text x="48" y="75" font-size="12" fill="#ff2d95">*</text>';
      break;
    case 4: // Star eyes
      svg += '<text x="72" y="102" font-size="18" text-anchor="middle" fill="#ffd700">&#9733;</text>';
      svg += '<text x="128" y="102" font-size="18" text-anchor="middle" fill="#ffd700">&#9733;</text>';
      svg += '<path d="M82 118 Q100 132 118 118" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>';
      break;
  }

  // Blush
  svg += '<ellipse cx="70" cy="110" rx="10" ry="6" fill="rgba(255,150,150,0.4)"/>';
  svg += '<ellipse cx="130" cy="110" rx="10" ry="6" fill="rgba(255,150,150,0.4)"/>';

  // Accessories
  switch (accessory) {
    case 1: // Glasses
      svg += '<circle cx="80" cy="95" r="14" fill="none" stroke="#333" stroke-width="2.5"/>';
      svg += '<circle cx="120" cy="95" r="14" fill="none" stroke="#333" stroke-width="2.5"/>';
      svg += '<line x1="94" y1="95" x2="106" y2="95" stroke="#333" stroke-width="2.5"/>';
      svg += '<line x1="66" y1="93" x2="55" y2="88" stroke="#333" stroke-width="2.5"/>';
      svg += '<line x1="134" y1="93" x2="145" y2="88" stroke="#333" stroke-width="2.5"/>';
      break;
    case 2: // Headphones
      svg += '<path d="M52 90 Q52 40 100 35 Q148 40 148 90" fill="none" stroke="#555" stroke-width="5"/>';
      svg += '<rect x="42" y="82" width="16" height="25" rx="8" fill="#9d4edd"/>';
      svg += '<rect x="142" y="82" width="16" height="25" rx="8" fill="#9d4edd"/>';
      break;
    case 3: // Hat
      svg += '<ellipse cx="100" cy="52" rx="55" ry="8" fill="#ff2d95"/>';
      svg += '<path d="M65 52 Q65 25 100 20 Q135 25 135 52" fill="#ff2d95"/>';
      svg += '<rect x="75" y="20" width="50" height="5" rx="2" fill="#ffd700"/>';
      break;
    case 4: // Crown
      svg += '<polygon points="70,50 78,28 90,42 100,18 110,42 122,28 130,50" fill="#ffd700"/>';
      svg += '<rect x="70" y="48" width="60" height="8" rx="2" fill="#ffd700"/>';
      svg += '<circle cx="85" cy="38" r="3" fill="#ff2d95"/>';
      svg += '<circle cx="100" cy="28" r="3" fill="#00d4ff"/>';
      svg += '<circle cx="115" cy="38" r="3" fill="#ff2d95"/>';
      break;
  }

  svg += '</svg>';
  return svg;
}

function showAvatar(c) {
  getAvatarUnlocks(gameState.level);

  var h = '<h2 class="game-title">Avatar Customization</h2>';

  // Current avatar preview
  h += '<div style="width:160px;height:160px;margin:0 auto 20px;border-radius:50%;overflow:hidden;' +
       'border:3px solid var(--neon-pink);box-shadow:0 0 30px rgba(255,45,149,0.3)">';
  h += renderAvatarSVG(avatarState.face, avatarState.hair, avatarState.accessory, avatarState.background);
  h += '</div>';

  // Category selectors
  var categories = [
    { key: 'face',       label: 'Expression' },
    { key: 'hair',       label: 'Hair Style' },
    { key: 'accessory',  label: 'Accessory' },
    { key: 'background', label: 'Background' }
  ];

  for (var ci = 0; ci < categories.length; ci++) {
    var cat = categories[ci];
    var items = avatarItems[cat.key];
    h += '<div style="margin:15px 0">';
    h += '<h3 style="color:var(--neon-cyan);margin-bottom:8px;font-size:0.95rem">' + cat.label + '</h3>';
    h += '<div style="display:flex;flex-wrap:wrap;gap:8px">';

    for (var i = 0; i < items.length; i++) {
      var isUnlocked = avatarState.unlockedItems[cat.key].indexOf(i) !== -1;
      var isSelected = avatarState[cat.key] === i;
      var btnBg = isSelected ?
        'linear-gradient(135deg,var(--neon-pink),var(--neon-purple))' :
        (isUnlocked ? 'var(--glass)' : 'rgba(50,50,50,0.5)');
      var btnBorder = isSelected ? 'var(--neon-pink)' : (isUnlocked ? 'rgba(157,78,221,0.3)' : 'rgba(80,80,80,0.3)');
      var btnOpacity = isUnlocked ? '1' : '0.4';

      h += '<button class="avatar-item-btn" ' +
           'data-cat="' + cat.key + '" data-idx="' + i + '" ' +
           (isUnlocked ? '' : 'disabled ') +
           'style="background:' + btnBg + ';border:1px solid ' + btnBorder + ';' +
           'color:#fff;padding:8px 14px;border-radius:12px;cursor:' + (isUnlocked ? 'pointer' : 'not-allowed') + ';' +
           'font-size:0.85rem;opacity:' + btnOpacity + ';transition:all 0.3s ease">';
      h += items[i].name;
      if (!isUnlocked) {
        h += ' <span style="font-size:0.7rem">(Lv.' + items[i].level + ')</span>';
      }
      h += '</button>';
    }

    h += '</div></div>';
  }

  c.innerHTML = h;

  // Attach click handlers
  var btns = c.querySelectorAll('.avatar-item-btn:not([disabled])');
  for (var b = 0; b < btns.length; b++) {
    btns[b].onclick = function() {
      var catKey = this.getAttribute('data-cat');
      var idx = parseInt(this.getAttribute('data-idx'));
      avatarState[catKey] = idx;
      saveSystemFeatures();
      showAvatar(c);
      if (typeof SoundEngine !== 'undefined' && SoundEngine.correct) {
        SoundEngine.correct();
      }
    };
  }
}


// ============================================================
// 5. SOCIAL SHARE CARD
// ============================================================

function showShareCard(c) {
  initSeason();
  var tier = getSeasonTier(seasonData.seasonXP);

  var h = '<h2 class="game-title">Share Your Progress</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">' +
       'Generate a shareable stats card!</p>';
  h += '<div style="text-align:center"><canvas id="shareCanvas" width="600" height="400" ' +
       'style="max-width:100%;border-radius:15px;border:2px solid var(--neon-pink);' +
       'box-shadow:0 10px 30px rgba(255,45,149,0.2)"></canvas></div>';
  h += '<div class="game-controls" style="margin-top:20px">';
  h += '<button class="game-btn" id="downloadCardBtn">Download PNG</button>';
  h += '<button class="game-btn secondary" id="shareCardBtn">Share</button>';
  h += '</div>';
  c.innerHTML = h;

  var canvas = document.getElementById('shareCanvas');
  generateShareCanvas(canvas, tier);

  document.getElementById('downloadCardBtn').onclick = function() {
    var link = document.createElement('a');
    link.download = 'kpop-korean-stats.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    if (typeof showToast === 'function') {
      showToast('Card downloaded!');
    }
  };

  document.getElementById('shareCardBtn').onclick = function() {
    var text = 'K-POP Korean Learning Stats\n' +
               'Level ' + gameState.level + ' | ' + gameState.wordsLearned + ' Words | ' +
               gameState.streak + ' Day Streak | ' + tier.name + ' Tier';

    if (navigator.share) {
      // Try sharing with image first
      canvas.toBlob(function(blob) {
        if (blob && navigator.canShare) {
          var file = new File([blob], 'kpop-korean-stats.png', { type: 'image/png' });
          var shareData = { text: text, files: [file] };
          if (navigator.canShare(shareData)) {
            navigator.share(shareData).catch(function() {
              navigator.share({ text: text });
            });
          } else {
            navigator.share({ text: text });
          }
        } else {
          navigator.share({ text: text });
        }
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (typeof showToast === 'function') {
        showToast('Stats copied to clipboard!');
      }
    }
  };
}

function generateShareCanvas(canvas, tier) {
  var ctx = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;

  // Background gradient
  var grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#1a0a2e');
  grad.addColorStop(0.5, '#16213e');
  grad.addColorStop(1, '#0a0a1a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Decorative circles
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#ff2d95';
  ctx.beginPath();
  ctx.arc(500, 80, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9d4edd';
  ctx.beginPath();
  ctx.arc(100, 350, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Top border line
  var borderGrad = ctx.createLinearGradient(0, 0, w, 0);
  borderGrad.addColorStop(0, '#ff2d95');
  borderGrad.addColorStop(0.5, '#9d4edd');
  borderGrad.addColorStop(1, '#00d4ff');
  ctx.fillStyle = borderGrad;
  ctx.fillRect(0, 0, w, 4);

  // Avatar area (simple circle avatar representation)
  ctx.save();
  ctx.beginPath();
  ctx.arc(80, 80, 40, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  var avatarGrad = ctx.createLinearGradient(40, 40, 120, 120);
  avatarGrad.addColorStop(0, '#ff2d95');
  avatarGrad.addColorStop(1, '#9d4edd');
  ctx.fillStyle = avatarGrad;
  ctx.fillRect(40, 40, 80, 80);
  // Simple face on avatar
  ctx.fillStyle = '#ffdbac';
  ctx.beginPath();
  ctx.arc(80, 80, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(70, 76, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(90, 76, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(80, 86, 8, 0, Math.PI);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Avatar ring
  ctx.beginPath();
  ctx.arc(80, 80, 42, 0, Math.PI * 2);
  ctx.strokeStyle = '#ff2d95';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Title
  ctx.font = 'bold 24px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#fff';
  ctx.fillText('K-POP Korean Learning', 140, 70);

  // Tier badge
  ctx.font = 'bold 14px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = tier.color;
  ctx.fillText(tier.name + ' Tier', 140, 95);

  // Stats grid
  var stats = [
    { label: 'Level', value: '' + gameState.level, color: '#ff2d95' },
    { label: 'XP', value: '' + gameState.xp, color: '#9d4edd' },
    { label: 'Words', value: '' + gameState.wordsLearned, color: '#00d4ff' },
    { label: 'Streak', value: '' + gameState.streak + ' days', color: '#00f5d4' },
    { label: 'Best Combo', value: '' + gameState.bestCombo, color: '#ffd700' },
    { label: 'Games', value: '' + gameState.gamesPlayed, color: '#ff6b35' }
  ];

  var colWidth = (w - 80) / 3;
  var startY = 160;

  for (var i = 0; i < stats.length; i++) {
    var col = i % 3;
    var row = Math.floor(i / 3);
    var x = 40 + col * colWidth;
    var y = startY + row * 90;

    // Card background
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    roundRect(ctx, x, y, colWidth - 15, 72, 12);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, colWidth - 15, 72, 12);
    ctx.stroke();

    // Value
    ctx.font = 'bold 28px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = stats[i].color;
    ctx.fillText(stats[i].value, x + 15, y + 35);

    // Label
    ctx.font = '12px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(stats[i].label, x + 15, y + 58);
  }

  // Bottom bar
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.fillRect(0, h - 45, w, 45);
  ctx.font = '12px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('K-POP Korean Learning Game', 20, h - 17);

  // Bottom border
  ctx.fillStyle = borderGrad;
  ctx.fillRect(0, h - 4, w, 4);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}


// ============================================================
// 6. ENHANCED WORD COLLECTION (POKEDEX STYLE)
// ============================================================

function showPokedex(c) {
  var allWords = [];
  if (typeof wordDatabase !== 'undefined') {
    for (var cat in wordDatabase) {
      if (wordDatabase.hasOwnProperty(cat) && cat !== 'all') {
        var catWords = wordDatabase[cat];
        for (var i = 0; i < catWords.length; i++) {
          allWords.push({
            word: catWords[i],
            category: cat,
            collected: !!gameState.collectedWords[catWords[i].korean]
          });
        }
      }
    }
  }

  // Deduplicate by Korean text
  var seen = {};
  var unique = [];
  for (var d = 0; d < allWords.length; d++) {
    var k = allWords[d].word.korean;
    if (!seen[k]) {
      seen[k] = true;
      unique.push(allWords[d]);
    }
  }
  allWords = unique;

  var totalCount = allWords.length;
  var collectedCount = allWords.filter(function(w) { return w.collected; }).length;
  var pct = totalCount > 0 ? Math.round((collectedCount / totalCount) * 100) : 0;

  var h = '<h2 class="game-title">Word Collection</h2>';

  // Progress bar
  h += '<div style="text-align:center;margin-bottom:15px">';
  h += '<div style="font-size:1.3rem;font-weight:bold;margin-bottom:8px">' +
       collectedCount + ' / ' + totalCount + ' collected (' + pct + '%)</div>';
  h += '<div style="background:rgba(255,255,255,0.1);border-radius:10px;height:12px;' +
       'max-width:400px;margin:0 auto;overflow:hidden">';
  h += '<div style="height:100%;width:' + pct + '%;border-radius:10px;' +
       'background:linear-gradient(90deg,var(--neon-pink),var(--neon-purple),var(--neon-blue));' +
       'transition:width 0.5s ease"></div></div></div>';

  // Filter buttons
  h += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px">';
  var filters = [
    { key: 'all', label: 'All' },
    { key: 'collected', label: 'Collected' },
    { key: 'missing', label: 'Missing' },
    { key: 'common', label: 'Common' },
    { key: 'rare', label: 'Rare' },
    { key: 'epic', label: 'Epic' },
    { key: 'legendary', label: 'Legendary' }
  ];

  for (var f = 0; f < filters.length; f++) {
    var fActive = (typeof window._pokedexFilter === 'undefined' ? 'all' : window._pokedexFilter) === filters[f].key;
    h += '<button class="cat-btn pokedex-filter' + (fActive ? ' active' : '') + '" ' +
         'data-filter="' + filters[f].key + '">' + filters[f].label + '</button>';
  }
  h += '</div>';

  // Apply filter
  var activeFilter = typeof window._pokedexFilter === 'undefined' ? 'all' : window._pokedexFilter;
  var filtered = allWords;
  switch (activeFilter) {
    case 'collected':
      filtered = allWords.filter(function(w) { return w.collected; });
      break;
    case 'missing':
      filtered = allWords.filter(function(w) { return !w.collected; });
      break;
    case 'common':
      filtered = allWords.filter(function(w) { return w.word.rarity === 'common'; });
      break;
    case 'rare':
      filtered = allWords.filter(function(w) { return w.word.rarity === 'rare'; });
      break;
    case 'epic':
      filtered = allWords.filter(function(w) { return w.word.rarity === 'epic'; });
      break;
    case 'legendary':
      filtered = allWords.filter(function(w) { return w.word.rarity === 'legendary'; });
      break;
  }

  // Card grid
  h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px">';

  var rarityColors = {
    common:    { border: 'rgba(200,200,200,0.4)', bg: 'rgba(200,200,200,0.05)' },
    rare:      { border: 'rgba(0,212,255,0.6)',   bg: 'rgba(0,212,255,0.08)' },
    epic:      { border: 'rgba(157,78,221,0.6)',  bg: 'rgba(157,78,221,0.08)' },
    legendary: { border: 'rgba(255,215,0,0.6)',   bg: 'rgba(255,215,0,0.08)' }
  };

  for (var w = 0; w < filtered.length; w++) {
    var item = filtered[w];
    var rarity = item.word.rarity || 'common';
    var rc = rarityColors[rarity] || rarityColors.common;
    var isCollected = item.collected;

    h += '<div style="background:' + rc.bg + ';border:2px solid ' + rc.border + ';' +
         'border-radius:15px;padding:15px;text-align:center;position:relative;' +
         'transition:all 0.3s ease;backdrop-filter:blur(10px);' +
         'opacity:' + (isCollected ? '1' : '0.5') + '">';

    // Rarity badge
    h += '<div class="flashcard-rarity rarity-' + rarity + '" style="position:absolute;top:8px;right:8px;' +
         'font-size:0.65rem;padding:3px 8px">' + rarity.charAt(0).toUpperCase() + rarity.slice(1) + '</div>';

    if (isCollected) {
      // Collected checkmark
      h += '<div style="position:absolute;top:8px;left:8px;color:var(--neon-cyan);font-size:1rem">&#10003;</div>';
      h += '<div style="font-size:2rem;margin:10px 0 5px">' + item.word.korean + '</div>';
      h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.7)">' +
           escapeHtml(item.word.romanization || '') + '</div>';
      h += '<div style="font-size:0.8rem;margin-top:4px">' + escapeHtml(item.word.english) + '</div>';
    } else {
      h += '<div style="font-size:2rem;margin:10px 0 5px;opacity:0.3">???</div>';
      h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.3)">Not discovered</div>';
      h += '<div style="font-size:0.8rem;margin-top:4px;color:rgba(255,255,255,0.3)">???</div>';
    }

    // Category badge
    var catName = (typeof categoryNames !== 'undefined' && categoryNames[item.category]) ?
                  categoryNames[item.category] : item.category;
    h += '<div style="margin-top:8px;font-size:0.65rem;padding:2px 8px;border-radius:8px;' +
         'background:rgba(255,255,255,0.08);display:inline-block;color:rgba(255,255,255,0.5)">' +
         escapeHtml(catName) + '</div>';

    h += '</div>';
  }

  h += '</div>';

  if (filtered.length === 0) {
    h += '<p style="text-align:center;margin-top:20px;color:rgba(255,255,255,0.5)">No words match this filter.</p>';
  }

  c.innerHTML = h;

  // Attach filter handlers
  var filterBtns = c.querySelectorAll('.pokedex-filter');
  for (var fb = 0; fb < filterBtns.length; fb++) {
    filterBtns[fb].onclick = function() {
      window._pokedexFilter = this.getAttribute('data-filter');
      showPokedex(c);
    };
  }
}


// ============================================================
// 7. SAVE / LOAD SYSTEM ENHANCEMENT
// ============================================================

function saveSystemFeatures() {
  try {
    localStorage.setItem('kpop_theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('kpop_quests', JSON.stringify(questSystem));
    localStorage.setItem('kpop_season', JSON.stringify(seasonData));
    localStorage.setItem('kpop_avatar', JSON.stringify(avatarState));
  } catch (e) {
    // Storage may be full or unavailable
  }
}

function loadSystemFeatures() {
  try {
    // Theme
    var savedTheme = localStorage.getItem('kpop_theme');
    if (savedTheme !== null) {
      darkMode = savedTheme === 'dark';
    }

    // Quests
    var savedQuests = localStorage.getItem('kpop_quests');
    if (savedQuests) {
      var parsed = JSON.parse(savedQuests);
      if (parsed && parsed.daily) {
        questSystem.daily = parsed.daily || [];
        questSystem.completed = parsed.completed || [];
        questSystem.lastGenerated = parsed.lastGenerated || null;
      }
    }

    // Season
    var savedSeason = localStorage.getItem('kpop_season');
    if (savedSeason) {
      var parsedSeason = JSON.parse(savedSeason);
      for (var key in parsedSeason) {
        if (parsedSeason.hasOwnProperty(key) && seasonData.hasOwnProperty(key)) {
          seasonData[key] = parsedSeason[key];
        }
      }
    }

    // Avatar
    var savedAvatar = localStorage.getItem('kpop_avatar');
    if (savedAvatar) {
      var parsedAvatar = JSON.parse(savedAvatar);
      if (parsedAvatar) {
        avatarState.face = parsedAvatar.face || 0;
        avatarState.hair = parsedAvatar.hair || 0;
        avatarState.accessory = parsedAvatar.accessory || 0;
        avatarState.background = parsedAvatar.background || 0;
        if (parsedAvatar.unlockedItems) {
          avatarState.unlockedItems = parsedAvatar.unlockedItems;
        }
      }
    }
  } catch (e) {
    // Ignore parse errors, use defaults
  }
}


// ============================================================
// INITIALIZATION
// ============================================================

function initSystemFeatures() {
  loadSystemFeatures();
  initTheme();
  initSeason();
  generateDailyQuests();

  // Check for avatar unlocks based on current level
  if (typeof gameState !== 'undefined') {
    getAvatarUnlocks(gameState.level);
  }

  // Periodically check quest progress
  setInterval(function() {
    if (typeof gameState !== 'undefined') {
      checkQuestProgress();
    }
  }, 10000);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSystemFeatures);
} else {
  // DOM already loaded, but delay slightly to let index.html scripts run first
  setTimeout(initSystemFeatures, 100);
}
