// ============================================================
// ui-enhancements.js
// Major UI/UX Improvements for K-POP Korean Learning Game
// Theme System, Animation Engine, Toast Notifications,
// Tutorial/Onboarding, Accessibility, Progress Visualization
// ============================================================

// ============================================================
// 1. THEME SYSTEM (~200 lines)
// 5 color themes with CSS variable injection
// ============================================================

var themeDefinitions = {
  default: {
    name: 'Default',
    label: 'Pink / Purple',
    preview: ['#ff2d95', '#9d4edd', '#00d4ff'],
    vars: {
      '--neon-pink': '#ff2d95',
      '--neon-purple': '#9d4edd',
      '--neon-blue': '#00d4ff',
      '--neon-cyan': '#00f5d4',
      '--bg-dark': '#0a0a1a',
      '--bg-card': 'rgba(20, 10, 40, 0.8)',
      '--glass': 'rgba(255, 255, 255, 0.05)',
      '--gold': '#ffd700',
      '--fire': '#ff6b35'
    },
    bodyGradient: 'radial-gradient(ellipse at top, rgba(157,78,221,0.15), transparent 50%), radial-gradient(ellipse at bottom, rgba(0,212,255,0.1), transparent 50%)'
  },
  ocean: {
    name: 'Ocean',
    label: 'Blue / Teal',
    preview: ['#0077b6', '#00b4d8', '#90e0ef'],
    vars: {
      '--neon-pink': '#0096c7',
      '--neon-purple': '#0077b6',
      '--neon-blue': '#00b4d8',
      '--neon-cyan': '#90e0ef',
      '--bg-dark': '#03071e',
      '--bg-card': 'rgba(0, 20, 50, 0.8)',
      '--glass': 'rgba(255, 255, 255, 0.05)',
      '--gold': '#f9c74f',
      '--fire': '#f3722c'
    },
    bodyGradient: 'radial-gradient(ellipse at top, rgba(0,119,182,0.15), transparent 50%), radial-gradient(ellipse at bottom, rgba(0,180,216,0.1), transparent 50%)'
  },
  forest: {
    name: 'Forest',
    label: 'Green / Emerald',
    preview: ['#2d6a4f', '#40916c', '#95d5b2'],
    vars: {
      '--neon-pink': '#52b788',
      '--neon-purple': '#2d6a4f',
      '--neon-blue': '#40916c',
      '--neon-cyan': '#95d5b2',
      '--bg-dark': '#0b1a0f',
      '--bg-card': 'rgba(10, 30, 15, 0.8)',
      '--glass': 'rgba(255, 255, 255, 0.05)',
      '--gold': '#ffd166',
      '--fire': '#ef476f'
    },
    bodyGradient: 'radial-gradient(ellipse at top, rgba(45,106,79,0.15), transparent 50%), radial-gradient(ellipse at bottom, rgba(64,145,108,0.1), transparent 50%)'
  },
  sunset: {
    name: 'Sunset',
    label: 'Orange / Warm',
    preview: ['#e85d04', '#f48c06', '#ffba08'],
    vars: {
      '--neon-pink': '#e85d04',
      '--neon-purple': '#dc2f02',
      '--neon-blue': '#f48c06',
      '--neon-cyan': '#ffba08',
      '--bg-dark': '#1a0a02',
      '--bg-card': 'rgba(40, 15, 5, 0.8)',
      '--glass': 'rgba(255, 255, 255, 0.05)',
      '--gold': '#ffd700',
      '--fire': '#ff0000'
    },
    bodyGradient: 'radial-gradient(ellipse at top, rgba(232,93,4,0.15), transparent 50%), radial-gradient(ellipse at bottom, rgba(244,140,6,0.1), transparent 50%)'
  },
  midnight: {
    name: 'Midnight',
    label: 'Dark Purple / Indigo',
    preview: ['#7209b7', '#560bad', '#3a0ca3'],
    vars: {
      '--neon-pink': '#b5179e',
      '--neon-purple': '#7209b7',
      '--neon-blue': '#560bad',
      '--neon-cyan': '#9d4edd',
      '--bg-dark': '#05010d',
      '--bg-card': 'rgba(15, 5, 30, 0.85)',
      '--glass': 'rgba(255, 255, 255, 0.04)',
      '--gold': '#f0c808',
      '--fire': '#f72585'
    },
    bodyGradient: 'radial-gradient(ellipse at top, rgba(114,9,183,0.2), transparent 50%), radial-gradient(ellipse at bottom, rgba(86,11,173,0.12), transparent 50%)'
  }
};

var selectedTheme = 'default';

function initThemeSystem() {
  var saved = localStorage.getItem('selectedTheme');
  if (saved && themeDefinitions[saved]) {
    selectedTheme = saved;
  }
  applyColorTheme(selectedTheme);
  injectThemeSystemCSS();
}

function applyColorTheme(themeKey) {
  if (!themeDefinitions[themeKey]) return;
  var theme = themeDefinitions[themeKey];
  var root = document.documentElement;
  var vars = theme.vars;
  for (var key in vars) {
    if (vars.hasOwnProperty(key)) {
      root.style.setProperty(key, vars[key]);
    }
  }
  document.body.style.backgroundImage = theme.bodyGradient;
  selectedTheme = themeKey;
  localStorage.setItem('selectedTheme', themeKey);

  // If dark mode system exists, let it re-apply text colors
  if (typeof darkMode !== 'undefined' && !darkMode) {
    // In light mode, we keep light mode colors but use the theme accents
    var lightVars = {
      '--bg-dark': '#f5f5f5',
      '--bg-card': 'rgba(255, 255, 255, 0.9)',
      '--glass': 'rgba(0, 0, 0, 0.04)'
    };
    for (var lk in lightVars) {
      if (lightVars.hasOwnProperty(lk)) {
        root.style.setProperty(lk, lightVars[lk]);
      }
    }
  }
}

function showThemePicker(c) {
  var html = '<div class="game-title">Color Themes</div>';
  html += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px;">Choose a color theme for the app</p>';
  html += '<div class="theme-picker-grid">';

  var keys = Object.keys(themeDefinitions);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var theme = themeDefinitions[key];
    var isActive = selectedTheme === key;
    var activeClass = isActive ? ' theme-card-active' : '';

    html += '<div class="theme-card' + activeClass + '" onclick="selectTheme(\'' + key + '\')" role="button" tabindex="0" aria-label="Select ' + theme.name + ' theme">';
    html += '<div class="theme-card-preview">';
    for (var p = 0; p < theme.preview.length; p++) {
      html += '<div class="theme-preview-swatch" style="background:' + theme.preview[p] + '"></div>';
    }
    html += '</div>';
    html += '<div class="theme-card-name">' + theme.name + '</div>';
    html += '<div class="theme-card-label">' + theme.label + '</div>';
    if (isActive) {
      html += '<div class="theme-card-check">&#10003;</div>';
    }
    html += '</div>';
  }

  html += '</div>';
  html += '<div style="text-align:center;margin-top:20px;">';
  html += '<button class="game-btn secondary" onclick="showMode(gameState.currentMode)">Back</button>';
  html += '</div>';
  c.innerHTML = html;
}

function selectTheme(themeKey) {
  applyColorTheme(themeKey);
  var gameArea = document.getElementById('gameArea');
  if (gameArea) {
    showThemePicker(gameArea);
  }
  showEnhancedToast('Theme changed to ' + themeDefinitions[themeKey].name, 'success', 2000);
}

function injectThemeSystemCSS() {
  var style = document.createElement('style');
  style.id = 'ui-theme-system-css';
  style.textContent = [
    '.theme-picker-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(150px,1fr)); gap:15px; max-width:650px; margin:0 auto; }',
    '.theme-card { background:var(--glass); backdrop-filter:blur(10px); border:2px solid rgba(255,255,255,0.1); border-radius:16px; padding:18px; text-align:center; cursor:pointer; transition:all 0.3s ease; }',
    '.theme-card:hover { transform:translateY(-4px); border-color:var(--neon-pink); box-shadow:0 8px 25px rgba(0,0,0,0.3); }',
    '.theme-card:focus-visible { outline:2px solid var(--neon-cyan); outline-offset:2px; }',
    '.theme-card-active { border-color:var(--neon-pink); box-shadow:0 0 20px rgba(255,45,149,0.3); position:relative; }',
    '.theme-card-preview { display:flex; gap:6px; justify-content:center; margin-bottom:12px; }',
    '.theme-preview-swatch { width:36px; height:36px; border-radius:50%; border:2px solid rgba(255,255,255,0.2); }',
    '.theme-card-name { font-weight:700; font-size:1rem; margin-bottom:4px; }',
    '.theme-card-label { font-size:0.8rem; color:rgba(255,255,255,0.5); }',
    '.theme-card-check { position:absolute; top:8px; right:8px; background:var(--neon-pink); color:#fff; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:bold; }'
  ].join('\n');
  document.head.appendChild(style);
}


// ============================================================
// 2. ANIMATION ENGINE (~200 lines)
// Smooth transitions, card flips, particles
// ============================================================

var animationEnabled = true;

function initAnimationEngine() {
  // Respect user preference for reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animationEnabled = false;
  }
  // Listen for changes
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
        animationEnabled = !e.matches;
        toggleAnimations(!e.matches);
      });
    } catch (err) {
      // Safari older versions
    }
  }
  injectAnimationCSS();
}

function toggleAnimations(enabled) {
  var root = document.documentElement;
  if (!enabled) {
    root.style.setProperty('--anim-duration', '0s');
    root.classList.add('reduce-motion');
  } else {
    root.style.removeProperty('--anim-duration');
    root.classList.remove('reduce-motion');
  }
}

function animatePageTransition(targetElement, newContent) {
  if (!animationEnabled) {
    targetElement.innerHTML = newContent;
    return;
  }
  targetElement.classList.add('page-exit');
  setTimeout(function() {
    targetElement.innerHTML = newContent;
    targetElement.classList.remove('page-exit');
    targetElement.classList.add('page-enter');
    setTimeout(function() {
      targetElement.classList.remove('page-enter');
    }, 400);
  }, 250);
}

function animateCardFlip(cardElement, onMidpoint) {
  if (!animationEnabled) {
    if (typeof onMidpoint === 'function') onMidpoint();
    return;
  }
  cardElement.classList.add('card-flip-out');
  setTimeout(function() {
    if (typeof onMidpoint === 'function') onMidpoint();
    cardElement.classList.remove('card-flip-out');
    cardElement.classList.add('card-flip-in');
    setTimeout(function() {
      cardElement.classList.remove('card-flip-in');
    }, 300);
  }, 300);
}

function animateCorrectAnswer(element) {
  if (!animationEnabled || !element) return;
  element.classList.add('anim-correct-bounce');
  setTimeout(function() {
    element.classList.remove('anim-correct-bounce');
  }, 600);
}

function animateWrongAnswer(element) {
  if (!animationEnabled || !element) return;
  element.classList.add('anim-wrong-shake');
  setTimeout(function() {
    element.classList.remove('anim-wrong-shake');
  }, 500);
}

function animateScorePopup(x, y, text) {
  if (!animationEnabled) return;
  var el = document.createElement('div');
  el.className = 'anim-score-popup';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  setTimeout(function() {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 1200);
}

function animateStaggerIn(parentElement, selector, delay) {
  if (!animationEnabled) return;
  var items = parentElement.querySelectorAll(selector);
  var staggerDelay = delay || 60;
  for (var i = 0; i < items.length; i++) {
    (function(item, index) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(15px)';
      setTimeout(function() {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * staggerDelay);
    })(items[i], i);
  }
}

function createFloatingParticles() {
  // CSS-only floating particles background effect
  var container = document.getElementById('bgParticles');
  if (!container) return;
  // Clear existing
  container.innerHTML = '';
  if (!animationEnabled) return;

  var colors = ['var(--neon-pink)', 'var(--neon-purple)', 'var(--neon-blue)', 'var(--neon-cyan)'];
  for (var i = 0; i < 20; i++) {
    var p = document.createElement('div');
    p.className = 'enhanced-particle';
    p.style.left = (Math.random() * 100) + '%';
    p.style.top = (Math.random() * 100) + '%';
    p.style.width = (2 + Math.random() * 4) + 'px';
    p.style.height = p.style.width;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.animationDuration = (6 + Math.random() * 8) + 's';
    p.style.opacity = String(0.2 + Math.random() * 0.4);
    container.appendChild(p);
  }
}

function injectAnimationCSS() {
  var style = document.createElement('style');
  style.id = 'ui-animation-css';
  style.textContent = [
    '/* Page Transitions */',
    '.page-exit { animation: pageExitAnim 0.25s ease forwards; }',
    '.page-enter { animation: pageEnterAnim 0.4s ease forwards; }',
    '@keyframes pageExitAnim { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-15px); } }',
    '@keyframes pageEnterAnim { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }',
    '',
    '/* Card Flip */',
    '.card-flip-out { animation: cardFlipOut 0.3s ease forwards; }',
    '.card-flip-in { animation: cardFlipIn 0.3s ease forwards; }',
    '@keyframes cardFlipOut { from { transform:perspective(800px) rotateY(0); opacity:1; } to { transform:perspective(800px) rotateY(90deg); opacity:0.5; } }',
    '@keyframes cardFlipIn { from { transform:perspective(800px) rotateY(-90deg); opacity:0.5; } to { transform:perspective(800px) rotateY(0); opacity:1; } }',
    '',
    '/* Correct Bounce */',
    '.anim-correct-bounce { animation: correctBounce 0.6s ease; }',
    '@keyframes correctBounce { 0% { transform:scale(1); } 20% { transform:scale(1.15); } 40% { transform:scale(0.95); } 60% { transform:scale(1.05); } 80% { transform:scale(0.98); } 100% { transform:scale(1); } }',
    '',
    '/* Wrong Shake */',
    '.anim-wrong-shake { animation: wrongShake 0.5s ease; }',
    '@keyframes wrongShake { 0%,100% { transform:translateX(0); } 10%,50%,90% { transform:translateX(-6px); } 30%,70% { transform:translateX(6px); } }',
    '',
    '/* Score Popup */',
    '.anim-score-popup { position:fixed; pointer-events:none; font-weight:bold; font-size:1.4rem; color:var(--gold); z-index:250; animation:scoreFloat 1.2s ease forwards; text-shadow:0 0 10px rgba(255,215,0,0.5); }',
    '@keyframes scoreFloat { 0% { opacity:1; transform:translateY(0) scale(1); } 50% { transform:translateY(-30px) scale(1.2); } 100% { opacity:0; transform:translateY(-60px) scale(0.8); } }',
    '',
    '/* Enhanced Floating Particles */',
    '.enhanced-particle { position:absolute; border-radius:50%; animation:enhancedFloat ease-in-out infinite; pointer-events:none; }',
    '@keyframes enhancedFloat { 0% { transform:translate(0,0) scale(1); } 25% { transform:translate(15px,-25px) scale(1.1); } 50% { transform:translate(-10px,-40px) scale(0.9); } 75% { transform:translate(20px,-20px) scale(1.05); } 100% { transform:translate(0,0) scale(1); } }',
    '',
    '/* Reduce Motion Override */',
    '.reduce-motion *, .reduce-motion *::before, .reduce-motion *::after { animation-duration:0.01ms !important; animation-iteration-count:1 !important; transition-duration:0.01ms !important; }',
    '',
    '/* Pulse Glow for interactive elements */',
    '.anim-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }',
    '@keyframes pulseGlow { 0%,100% { box-shadow:0 0 5px var(--neon-pink); } 50% { box-shadow:0 0 20px var(--neon-pink), 0 0 40px var(--neon-purple); } }',
    '',
    '/* Stagger children fade-in */',
    '.anim-stagger-item { opacity:0; transform:translateY(15px); transition:opacity 0.3s ease, transform 0.3s ease; }',
    '.anim-stagger-item.visible { opacity:1; transform:translateY(0); }'
  ].join('\n');
  document.head.appendChild(style);
}


// ============================================================
// 3. NOTIFICATION TOAST SYSTEM (~150 lines)
// Enhanced toasts with types, stacking, and effects
// ============================================================

var toastQueue = [];
var toastCounter = 0;
var toastContainer = null;

function initToastSystem() {
  injectToastCSS();
  toastContainer = document.createElement('div');
  toastContainer.id = 'enhancedToastContainer';
  toastContainer.className = 'enhanced-toast-container';
  toastContainer.setAttribute('role', 'status');
  toastContainer.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastContainer);
}

function showEnhancedToast(message, type, duration) {
  if (!toastContainer) initToastSystem();
  var toastType = type || 'info';
  var toastDuration = duration || 3500;
  toastCounter++;
  var toastId = 'etoast-' + toastCounter;

  var toast = document.createElement('div');
  toast.id = toastId;
  toast.className = 'enhanced-toast enhanced-toast-' + toastType;
  toast.setAttribute('role', 'alert');

  var iconMap = {
    success: '&#10003;',
    error: '&#10007;',
    info: '&#8505;',
    achievement: '&#9733;'
  };
  var icon = iconMap[toastType] || iconMap.info;

  var html = '<div class="enhanced-toast-icon">' + icon + '</div>';
  html += '<div class="enhanced-toast-message">' + message + '</div>';
  html += '<button class="enhanced-toast-close" onclick="dismissToast(\'' + toastId + '\')" aria-label="Close notification">&times;</button>';

  if (toastType === 'achievement') {
    html += '<div class="toast-sparkle-effect"></div>';
  }

  toast.innerHTML = html;
  toastContainer.appendChild(toast);
  toastQueue.push(toastId);

  // Animate in
  requestAnimationFrame(function() {
    toast.classList.add('enhanced-toast-visible');
  });

  // Auto dismiss
  setTimeout(function() {
    dismissToast(toastId);
  }, toastDuration);

  // Limit stack to 5
  if (toastQueue.length > 5) {
    dismissToast(toastQueue[0]);
  }
}

function dismissToast(toastId) {
  var toast = document.getElementById(toastId);
  if (!toast) return;
  toast.classList.remove('enhanced-toast-visible');
  toast.classList.add('enhanced-toast-exit');
  setTimeout(function() {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 300);
  var idx = toastQueue.indexOf(toastId);
  if (idx > -1) toastQueue.splice(idx, 1);
}

function showAchievementToast(title, description) {
  var msg = '<strong>' + title + '</strong>';
  if (description) msg += '<br><span style="font-size:0.85rem;opacity:0.85;">' + description + '</span>';
  showEnhancedToast(msg, 'achievement', 5000);
}

function injectToastCSS() {
  var style = document.createElement('style');
  style.id = 'ui-toast-css';
  style.textContent = [
    '.enhanced-toast-container { position:fixed; top:20px; right:20px; z-index:10000; display:flex; flex-direction:column; gap:10px; max-width:380px; width:calc(100% - 40px); pointer-events:none; }',
    '.enhanced-toast { pointer-events:auto; display:flex; align-items:flex-start; gap:12px; padding:14px 18px; border-radius:14px; backdrop-filter:blur(15px); border:1px solid rgba(255,255,255,0.1); transform:translateX(120%); opacity:0; transition:transform 0.35s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.35s ease; position:relative; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.3); }',
    '.enhanced-toast-visible { transform:translateX(0); opacity:1; }',
    '.enhanced-toast-exit { transform:translateX(120%); opacity:0; transition:transform 0.3s ease, opacity 0.3s ease; }',
    '.enhanced-toast-icon { flex-shrink:0; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.9rem; font-weight:bold; }',
    '.enhanced-toast-message { flex:1; font-size:0.92rem; line-height:1.4; }',
    '.enhanced-toast-close { position:absolute; top:8px; right:10px; background:none; border:none; color:rgba(255,255,255,0.6); font-size:1.2rem; cursor:pointer; padding:2px 6px; line-height:1; }',
    '.enhanced-toast-close:hover { color:#fff; }',
    '',
    '/* Toast Types */',
    '.enhanced-toast-success { background:rgba(16,185,129,0.9); }',
    '.enhanced-toast-success .enhanced-toast-icon { background:rgba(255,255,255,0.2); color:#fff; }',
    '.enhanced-toast-error { background:rgba(239,68,68,0.9); }',
    '.enhanced-toast-error .enhanced-toast-icon { background:rgba(255,255,255,0.2); color:#fff; }',
    '.enhanced-toast-info { background:rgba(59,130,246,0.9); }',
    '.enhanced-toast-info .enhanced-toast-icon { background:rgba(255,255,255,0.2); color:#fff; }',
    '.enhanced-toast-achievement { background:linear-gradient(135deg, rgba(255,215,0,0.95), rgba(255,165,0,0.95)); color:#1a1a2e; }',
    '.enhanced-toast-achievement .enhanced-toast-icon { background:rgba(0,0,0,0.15); color:#1a1a2e; font-size:1.1rem; }',
    '.enhanced-toast-achievement .enhanced-toast-close { color:rgba(0,0,0,0.4); }',
    '.enhanced-toast-achievement .enhanced-toast-close:hover { color:rgba(0,0,0,0.8); }',
    '',
    '/* Achievement Sparkle */',
    '.toast-sparkle-effect { position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; background:linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, transparent 50%); background-size:250% 100%; animation:toastSparkle 2s ease infinite; }',
    '@keyframes toastSparkle { 0% { background-position:200% 0; } 100% { background-position:-50% 0; } }',
    '',
    '/* Mobile responsive */',
    '@media (max-width:480px) { .enhanced-toast-container { top:10px; right:10px; max-width:calc(100% - 20px); width:calc(100% - 20px); } .enhanced-toast { padding:10px 14px; } }'
  ].join('\n');
  document.head.appendChild(style);
}


// ============================================================
// 4. TUTORIAL / ONBOARDING (~200 lines)
// First-time user guide with step-by-step walkthrough
// ============================================================

var tutorialSteps = [
  {
    title: 'Welcome to K-POP Korean Learning!',
    text: 'Learn Korean vocabulary through fun games and interactive activities. Let us show you around!',
    highlight: '.header',
    position: 'bottom'
  },
  {
    title: 'Game Modes',
    text: 'Choose from many game modes here. Try Flashcards to start, then explore quizzes, memory games, and more!',
    highlight: '#navTabs',
    position: 'bottom'
  },
  {
    title: 'Track Your Progress',
    text: 'Your Level, XP, and Streak are displayed here. Keep practicing daily to maintain your streak!',
    highlight: '.stats-bar',
    position: 'bottom'
  },
  {
    title: 'Power-Ups',
    text: 'Use power-ups during games for 2x XP, hints, or to skip difficult words. Earn more by leveling up!',
    highlight: '.power-ups',
    position: 'bottom'
  },
  {
    title: 'Ready to Learn!',
    text: 'Click on any game mode to begin. Start with Flashcards to build your vocabulary, then challenge yourself with quizzes!',
    highlight: '#gameArea',
    position: 'top'
  }
];

var tutorialActive = false;
var tutorialStep = 0;

function showTutorial(c) {
  // c parameter is optional - if provided, renders in-page; otherwise overlay
  var skipTutorial = localStorage.getItem('kpop_tutorial_done');
  if (c) {
    renderTutorialInPage(c);
    return;
  }
  if (skipTutorial === 'true') return;
  startTutorialOverlay();
}

function startTutorialOverlay() {
  tutorialActive = true;
  tutorialStep = 0;
  injectTutorialCSS();
  renderTutorialStep();
}

function renderTutorialStep() {
  if (tutorialStep >= tutorialSteps.length) {
    endTutorial();
    return;
  }

  // Remove existing overlay
  var existing = document.getElementById('tutorialOverlay');
  if (existing) existing.parentNode.removeChild(existing);

  var step = tutorialSteps[tutorialStep];
  var overlay = document.createElement('div');
  overlay.id = 'tutorialOverlay';
  overlay.className = 'tutorial-overlay';

  // Highlight target element
  var target = document.querySelector(step.highlight);
  var rect = null;
  if (target) {
    rect = target.getBoundingClientRect();
    target.classList.add('tutorial-highlighted');
  }

  var boxTop = 0;
  var boxLeft = 0;
  if (rect) {
    if (step.position === 'bottom') {
      boxTop = rect.bottom + 15;
    } else {
      boxTop = rect.top - 220;
    }
    boxLeft = Math.max(15, Math.min(rect.left, window.innerWidth - 350));
  } else {
    boxTop = window.innerHeight / 2 - 100;
    boxLeft = window.innerWidth / 2 - 165;
  }

  // Clamp to viewport
  if (boxTop < 10) boxTop = 10;
  if (boxTop > window.innerHeight - 250) boxTop = window.innerHeight - 250;

  var html = '<div class="tutorial-backdrop" onclick="endTutorial()"></div>';
  html += '<div class="tutorial-box" style="top:' + boxTop + 'px;left:' + boxLeft + 'px;">';
  html += '<div class="tutorial-step-indicator">' + (tutorialStep + 1) + ' / ' + tutorialSteps.length + '</div>';
  html += '<h3 class="tutorial-title">' + step.title + '</h3>';
  html += '<p class="tutorial-text">' + step.text + '</p>';
  html += '<div class="tutorial-actions">';
  if (tutorialStep > 0) {
    html += '<button class="tutorial-btn tutorial-btn-secondary" onclick="prevTutorialStep()">Back</button>';
  }
  html += '<button class="tutorial-btn tutorial-btn-skip" onclick="endTutorial()">Skip</button>';
  if (tutorialStep < tutorialSteps.length - 1) {
    html += '<button class="tutorial-btn tutorial-btn-primary" onclick="nextTutorialStep()">Next</button>';
  } else {
    html += '<button class="tutorial-btn tutorial-btn-primary" onclick="endTutorial()">Got it!</button>';
  }
  html += '</div>';
  html += '<label class="tutorial-dismiss-label"><input type="checkbox" id="tutorialDismissCheck" onchange="setTutorialDismiss(this.checked)"> Don\'t show again</label>';
  html += '</div>';

  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function nextTutorialStep() {
  clearTutorialHighlights();
  tutorialStep++;
  renderTutorialStep();
}

function prevTutorialStep() {
  clearTutorialHighlights();
  tutorialStep--;
  if (tutorialStep < 0) tutorialStep = 0;
  renderTutorialStep();
}

function endTutorial() {
  tutorialActive = false;
  clearTutorialHighlights();
  var overlay = document.getElementById('tutorialOverlay');
  if (overlay) overlay.parentNode.removeChild(overlay);
}

function clearTutorialHighlights() {
  var highlighted = document.querySelectorAll('.tutorial-highlighted');
  for (var i = 0; i < highlighted.length; i++) {
    highlighted[i].classList.remove('tutorial-highlighted');
  }
}

function setTutorialDismiss(checked) {
  if (checked) {
    localStorage.setItem('kpop_tutorial_done', 'true');
  } else {
    localStorage.removeItem('kpop_tutorial_done');
  }
}

function renderTutorialInPage(c) {
  var html = '<div class="game-title">Help & Tutorial</div>';
  html += '<div class="tutorial-page-list">';
  for (var i = 0; i < tutorialSteps.length; i++) {
    var step = tutorialSteps[i];
    html += '<div class="tutorial-page-item">';
    html += '<div class="tutorial-page-number">' + (i + 1) + '</div>';
    html += '<div class="tutorial-page-content">';
    html += '<h4>' + step.title + '</h4>';
    html += '<p>' + step.text + '</p>';
    html += '</div></div>';
  }
  html += '</div>';
  html += '<div style="text-align:center;margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
  html += '<button class="game-btn" onclick="startTutorialOverlay()">Start Interactive Tour</button>';
  html += '<button class="game-btn secondary" onclick="localStorage.removeItem(\'kpop_tutorial_done\')" title="Reset tutorial">Reset Tutorial</button>';
  html += '<button class="game-btn secondary" onclick="showMode(gameState.currentMode)">Back</button>';
  html += '</div>';
  c.innerHTML = html;
}

function injectTutorialCSS() {
  if (document.getElementById('ui-tutorial-css')) return;
  var style = document.createElement('style');
  style.id = 'ui-tutorial-css';
  style.textContent = [
    '.tutorial-overlay { position:fixed; top:0; left:0; width:100%; height:100%; z-index:9999; }',
    '.tutorial-backdrop { position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); }',
    '.tutorial-highlighted { position:relative; z-index:10000; box-shadow:0 0 0 4px var(--neon-cyan), 0 0 30px rgba(0,245,212,0.4) !important; border-radius:15px; }',
    '.tutorial-box { position:fixed; z-index:10001; background:var(--bg-card); backdrop-filter:blur(20px); border:2px solid var(--neon-cyan); border-radius:18px; padding:22px; max-width:330px; width:calc(100% - 30px); box-shadow:0 15px 50px rgba(0,0,0,0.5); animation:slideUp 0.3s ease; }',
    '.tutorial-step-indicator { font-size:0.75rem; color:var(--neon-cyan); margin-bottom:8px; font-weight:600; letter-spacing:1px; }',
    '.tutorial-title { font-size:1.15rem; font-weight:700; margin-bottom:8px; }',
    '.tutorial-text { font-size:0.9rem; color:rgba(255,255,255,0.8); line-height:1.5; margin-bottom:16px; }',
    '.tutorial-actions { display:flex; gap:8px; flex-wrap:wrap; }',
    '.tutorial-btn { border:none; padding:8px 18px; border-radius:20px; cursor:pointer; font-size:0.85rem; font-weight:600; transition:all 0.2s ease; }',
    '.tutorial-btn-primary { background:linear-gradient(135deg, var(--neon-pink), var(--neon-purple)); color:#fff; }',
    '.tutorial-btn-primary:hover { transform:translateY(-2px); box-shadow:0 5px 15px rgba(255,45,149,0.4); }',
    '.tutorial-btn-secondary { background:var(--glass); border:1px solid rgba(255,255,255,0.2); color:#fff; }',
    '.tutorial-btn-skip { background:transparent; color:rgba(255,255,255,0.5); border:none; }',
    '.tutorial-btn-skip:hover { color:#fff; }',
    '.tutorial-dismiss-label { display:flex; align-items:center; gap:6px; font-size:0.78rem; color:rgba(255,255,255,0.5); margin-top:12px; cursor:pointer; }',
    '.tutorial-dismiss-label input { accent-color:var(--neon-cyan); }',
    '',
    '/* In-page tutorial list */',
    '.tutorial-page-list { display:flex; flex-direction:column; gap:12px; max-width:550px; margin:0 auto; }',
    '.tutorial-page-item { display:flex; gap:15px; align-items:flex-start; background:var(--glass); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:16px; }',
    '.tutorial-page-number { flex-shrink:0; width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg, var(--neon-pink), var(--neon-purple)); display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.9rem; }',
    '.tutorial-page-content h4 { font-size:1rem; margin-bottom:4px; }',
    '.tutorial-page-content p { font-size:0.85rem; color:rgba(255,255,255,0.7); line-height:1.4; }'
  ].join('\n');
  document.head.appendChild(style);
}


// ============================================================
// 5. ACCESSIBILITY IMPROVEMENTS (~150 lines)
// Font size, high contrast, ARIA, keyboard navigation
// ============================================================

var accessibilitySettings = {
  fontSize: 'medium',
  highContrast: false
};

function initAccessibility() {
  // Load saved settings
  var saved = localStorage.getItem('kpop_a11y');
  if (saved) {
    try {
      var parsed = JSON.parse(saved);
      if (parsed.fontSize) accessibilitySettings.fontSize = parsed.fontSize;
      if (parsed.highContrast) accessibilitySettings.highContrast = parsed.highContrast;
    } catch (e) {}
  }
  applyFontSize(accessibilitySettings.fontSize);
  applyHighContrast(accessibilitySettings.highContrast);
  enhanceARIA();
  initKeyboardNavigation();
  injectAccessibilityCSS();
}

function saveAccessibilitySettings() {
  localStorage.setItem('kpop_a11y', JSON.stringify(accessibilitySettings));
}

function applyFontSize(size) {
  var root = document.documentElement;
  var sizeMap = { small: '14px', medium: '16px', large: '19px' };
  root.style.fontSize = sizeMap[size] || sizeMap.medium;
  accessibilitySettings.fontSize = size;
  saveAccessibilitySettings();
}

function applyHighContrast(enabled) {
  var root = document.documentElement;
  accessibilitySettings.highContrast = enabled;
  if (enabled) {
    root.classList.add('high-contrast-mode');
  } else {
    root.classList.remove('high-contrast-mode');
  }
  saveAccessibilitySettings();
}

function enhanceARIA() {
  // Add ARIA labels to key interactive elements
  var navTabs = document.getElementById('navTabs');
  if (navTabs) {
    navTabs.setAttribute('role', 'navigation');
    navTabs.setAttribute('aria-label', 'Game mode navigation');
  }

  var gameArea = document.getElementById('gameArea');
  if (gameArea) {
    gameArea.setAttribute('role', 'main');
    gameArea.setAttribute('aria-live', 'polite');
  }

  var statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    statsBar.setAttribute('role', 'status');
    statsBar.setAttribute('aria-label', 'Player statistics');
  }

  var settingsBtn = document.getElementById('soundBtn');
  if (settingsBtn) {
    settingsBtn.setAttribute('aria-label', 'Toggle sound effects');
  }
}

function initKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    // Skip if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    // Escape to close tutorial
    if (e.key === 'Escape') {
      if (tutorialActive) {
        endTutorial();
        e.preventDefault();
      }
    }

    // Arrow keys for nav tabs
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      var activeBtn = document.querySelector('.nav-btn.active');
      if (!activeBtn) return;
      var allBtns = Array.prototype.slice.call(document.querySelectorAll('.nav-btn'));
      var currentIdx = allBtns.indexOf(activeBtn);
      if (currentIdx === -1) return;

      var nextIdx;
      if (e.key === 'ArrowRight') {
        nextIdx = (currentIdx + 1) % allBtns.length;
      } else {
        nextIdx = (currentIdx - 1 + allBtns.length) % allBtns.length;
      }
      allBtns[nextIdx].focus();
    }

    // Number keys 1-9 for quick quiz answer selection
    if (e.key >= '1' && e.key <= '4') {
      var options = document.querySelectorAll('.quiz-option');
      var optIdx = parseInt(e.key) - 1;
      if (options[optIdx]) {
        options[optIdx].click();
      }
    }
  });

  // Make nav buttons keyboard-activatable with Enter/Space
  document.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('nav-btn')) {
      e.preventDefault();
      e.target.click();
    }
    // Theme cards
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('theme-card')) {
      e.preventDefault();
      e.target.click();
    }
  });
}

function showAccessibilitySettings(c) {
  var html = '<div class="game-title">Accessibility Settings</div>';

  // Font Size
  html += '<div class="a11y-section">';
  html += '<h3 class="a11y-section-title">Font Size</h3>';
  html += '<div class="a11y-font-options">';
  var sizes = ['small', 'medium', 'large'];
  var sizeLabels = ['Small (14px)', 'Medium (16px)', 'Large (19px)'];
  for (var i = 0; i < sizes.length; i++) {
    var isActive = accessibilitySettings.fontSize === sizes[i];
    html += '<button class="a11y-option-btn' + (isActive ? ' a11y-option-active' : '') + '" onclick="applyFontSize(\'' + sizes[i] + '\');showAccessibilitySettings(document.getElementById(\'gameArea\'))" aria-pressed="' + isActive + '">';
    html += sizeLabels[i];
    html += '</button>';
  }
  html += '</div></div>';

  // High Contrast
  html += '<div class="a11y-section">';
  html += '<h3 class="a11y-section-title">High Contrast</h3>';
  html += '<div class="a11y-toggle-row">';
  html += '<span>Increase contrast for better readability</span>';
  var hcChecked = accessibilitySettings.highContrast ? ' checked' : '';
  html += '<label class="a11y-toggle"><input type="checkbox"' + hcChecked + ' onchange="applyHighContrast(this.checked)"><span class="a11y-toggle-slider"></span></label>';
  html += '</div></div>';

  // Keyboard Shortcuts
  html += '<div class="a11y-section">';
  html += '<h3 class="a11y-section-title">Keyboard Shortcuts</h3>';
  html += '<div class="a11y-shortcuts-list">';
  html += '<div class="a11y-shortcut"><kbd>1-4</kbd> <span>Select quiz answers</span></div>';
  html += '<div class="a11y-shortcut"><kbd>&#8592; &#8594;</kbd> <span>Navigate game modes</span></div>';
  html += '<div class="a11y-shortcut"><kbd>Esc</kbd> <span>Close tutorial/popup</span></div>';
  html += '</div></div>';

  html += '<div style="text-align:center;margin-top:20px;">';
  html += '<button class="game-btn secondary" onclick="showMode(gameState.currentMode)">Back</button>';
  html += '</div>';

  c.innerHTML = html;
}

function injectAccessibilityCSS() {
  var style = document.createElement('style');
  style.id = 'ui-a11y-css';
  style.textContent = [
    '/* Focus visible for all interactive elements */',
    '*:focus-visible { outline:2px solid var(--neon-cyan); outline-offset:2px; }',
    '',
    '/* High Contrast Mode */',
    '.high-contrast-mode { --glass:rgba(255,255,255,0.12); }',
    '.high-contrast-mode .nav-btn { border-width:2px; }',
    '.high-contrast-mode .game-area { border-width:2px; }',
    '.high-contrast-mode .stat-item { border-width:2px; }',
    '.high-contrast-mode .quiz-option { border-width:3px; }',
    '.high-contrast-mode .flashcard { border:2px solid rgba(255,255,255,0.3); }',
    '.high-contrast-mode p, .high-contrast-mode span, .high-contrast-mode div { text-shadow:0 0 1px rgba(255,255,255,0.1); }',
    '',
    '/* Accessibility Settings Panel */',
    '.a11y-section { background:var(--glass); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:18px; margin-bottom:14px; }',
    '.a11y-section-title { font-size:1rem; font-weight:700; margin-bottom:12px; color:var(--neon-cyan); }',
    '.a11y-font-options { display:flex; gap:10px; flex-wrap:wrap; }',
    '.a11y-option-btn { background:var(--glass); border:2px solid rgba(255,255,255,0.15); color:#fff; padding:10px 18px; border-radius:12px; cursor:pointer; font-size:0.9rem; transition:all 0.2s ease; }',
    '.a11y-option-btn:hover { border-color:var(--neon-pink); }',
    '.a11y-option-active { background:linear-gradient(135deg, var(--neon-pink), var(--neon-purple)); border-color:transparent; }',
    '.a11y-toggle-row { display:flex; justify-content:space-between; align-items:center; }',
    '.a11y-toggle-row span { font-size:0.9rem; color:rgba(255,255,255,0.8); }',
    '',
    '/* Toggle Switch */',
    '.a11y-toggle { position:relative; width:48px; height:26px; display:inline-block; }',
    '.a11y-toggle input { opacity:0; width:0; height:0; }',
    '.a11y-toggle-slider { position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background:rgba(255,255,255,0.15); border-radius:26px; transition:0.3s; }',
    '.a11y-toggle-slider::before { content:""; position:absolute; height:20px; width:20px; left:3px; bottom:3px; background:#fff; border-radius:50%; transition:0.3s; }',
    '.a11y-toggle input:checked + .a11y-toggle-slider { background:var(--neon-pink); }',
    '.a11y-toggle input:checked + .a11y-toggle-slider::before { transform:translateX(22px); }',
    '',
    '/* Keyboard Shortcuts List */',
    '.a11y-shortcuts-list { display:flex; flex-direction:column; gap:8px; }',
    '.a11y-shortcut { display:flex; align-items:center; gap:10px; font-size:0.9rem; }',
    '.a11y-shortcut kbd { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:6px; padding:3px 8px; font-family:monospace; font-size:0.85rem; min-width:35px; text-align:center; }',
    '.a11y-shortcut span { color:rgba(255,255,255,0.7); }'
  ].join('\n');
  document.head.appendChild(style);
}


// ============================================================
// 6. PROGRESS VISUALIZATION (~200 lines)
// CSS-only charts, heatmap, progress rings
// ============================================================

function showProgressViz(c) {
  injectProgressVizCSS();

  var html = '<div class="game-title">Progress Dashboard</div>';

  // Level Progress Ring
  html += '<div class="pviz-section">';
  html += '<h3 class="pviz-section-title">Level Progress</h3>';
  html += buildLevelRing();
  html += '</div>';

  // Category Completion Bars
  html += '<div class="pviz-section">';
  html += '<h3 class="pviz-section-title">Category Mastery</h3>';
  html += buildCategoryBars();
  html += '</div>';

  // Activity Heatmap
  html += '<div class="pviz-section">';
  html += '<h3 class="pviz-section-title">Activity (Last 30 Days)</h3>';
  html += buildActivityHeatmap();
  html += '</div>';

  // Quick Stats Grid
  html += '<div class="pviz-section">';
  html += '<h3 class="pviz-section-title">Quick Stats</h3>';
  html += buildQuickStats();
  html += '</div>';

  html += '<div style="text-align:center;margin-top:20px;">';
  html += '<button class="game-btn secondary" onclick="showMode(gameState.currentMode)">Back</button>';
  html += '</div>';

  c.innerHTML = html;

  // Animate bars after render
  setTimeout(function() {
    animateProgressBars();
  }, 50);
}

function buildLevelRing() {
  var level = (typeof gameState !== 'undefined') ? gameState.level : 1;
  var xp = (typeof gameState !== 'undefined') ? gameState.xp : 0;
  var xpForNext = level * 100;
  var pct = Math.min(100, Math.round((xp / xpForNext) * 100));

  var circumference = 2 * Math.PI * 54;
  var offset = circumference - (pct / 100) * circumference;

  var html = '<div class="pviz-ring-container">';
  html += '<svg class="pviz-ring" viewBox="0 0 120 120" width="140" height="140">';
  html += '<defs><linearGradient id="pvizGrad" x1="0%" y1="0%" x2="100%" y2="0%">';
  html += '<stop offset="0%" style="stop-color:var(--neon-pink)"/>';
  html += '<stop offset="100%" style="stop-color:var(--neon-cyan)"/>';
  html += '</linearGradient></defs>';
  html += '<circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>';
  html += '<circle cx="60" cy="60" r="54" fill="none" stroke="url(#pvizGrad)" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + offset + '" transform="rotate(-90 60 60)" class="pviz-ring-progress"/>';
  html += '</svg>';
  html += '<div class="pviz-ring-label">';
  html += '<div class="pviz-ring-level">Lv.' + level + '</div>';
  html += '<div class="pviz-ring-pct">' + pct + '%</div>';
  html += '<div class="pviz-ring-xp">' + xp + ' / ' + xpForNext + ' XP</div>';
  html += '</div>';
  html += '</div>';
  return html;
}

function buildCategoryBars() {
  var categories = [];
  // Gather categories from allWords if available
  if (typeof allWords !== 'undefined' && Array.isArray(allWords)) {
    var catMap = {};
    var collected = (typeof gameState !== 'undefined' && gameState.collectedWords) ? gameState.collectedWords : {};
    for (var i = 0; i < allWords.length; i++) {
      var cat = allWords[i].category || 'Uncategorized';
      if (!catMap[cat]) catMap[cat] = { total: 0, learned: 0 };
      catMap[cat].total++;
      if (collected[allWords[i].korean]) catMap[cat].learned++;
    }
    for (var catName in catMap) {
      if (catMap.hasOwnProperty(catName)) {
        categories.push({ name: catName, total: catMap[catName].total, learned: catMap[catName].learned });
      }
    }
  }

  if (categories.length === 0) {
    return '<p style="text-align:center;color:rgba(255,255,255,0.5);">No category data available yet. Start learning!</p>';
  }

  // Sort by percentage descending
  categories.sort(function(a, b) {
    return (b.learned / b.total) - (a.learned / a.total);
  });

  // Limit display to 10 categories
  var display = categories.slice(0, 10);
  var html = '<div class="pviz-bars-container">';
  for (var j = 0; j < display.length; j++) {
    var cat = display[j];
    var pct = cat.total > 0 ? Math.round((cat.learned / cat.total) * 100) : 0;
    html += '<div class="pviz-bar-row">';
    html += '<div class="pviz-bar-label">' + cat.name + '</div>';
    html += '<div class="pviz-bar-track">';
    html += '<div class="pviz-bar-fill" data-pct="' + pct + '" style="width:0%"></div>';
    html += '</div>';
    html += '<div class="pviz-bar-value">' + cat.learned + '/' + cat.total + '</div>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function buildActivityHeatmap() {
  var stats = [];
  try {
    stats = JSON.parse(localStorage.getItem('dailyStudyStats') || '[]');
  } catch (e) {}

  // Build a map of date -> count
  var dateMap = {};
  for (var i = 0; i < stats.length; i++) {
    var d = stats[i].date || '';
    if (d) {
      dateMap[d] = (dateMap[d] || 0) + (stats[i].wordsStudied || stats[i].count || 1);
    }
  }

  // Generate last 30 days
  var today = new Date();
  var days = [];
  for (var d2 = 29; d2 >= 0; d2--) {
    var dt = new Date(today);
    dt.setDate(dt.getDate() - d2);
    var dateStr = dt.toISOString().split('T')[0];
    var dayOfWeek = dt.getDay();
    var dayLabel = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][dayOfWeek];
    days.push({
      date: dateStr,
      label: dt.getDate(),
      dow: dayLabel,
      count: dateMap[dateStr] || 0,
      isToday: d2 === 0
    });
  }

  // Find max for scaling
  var maxCount = 1;
  for (var m = 0; m < days.length; m++) {
    if (days[m].count > maxCount) maxCount = days[m].count;
  }

  var html = '<div class="pviz-heatmap">';
  for (var h = 0; h < days.length; h++) {
    var day = days[h];
    var intensity = day.count > 0 ? Math.max(0.2, day.count / maxCount) : 0;
    var bgColor = day.count > 0
      ? 'rgba(255,45,149,' + intensity + ')'
      : 'rgba(255,255,255,0.04)';
    var todayClass = day.isToday ? ' pviz-heatmap-today' : '';
    html += '<div class="pviz-heatmap-cell' + todayClass + '" style="background:' + bgColor + '" title="' + day.date + ': ' + day.count + ' words">';
    html += '<span class="pviz-heatmap-num">' + day.label + '</span>';
    html += '</div>';
  }
  html += '</div>';

  // Legend
  html += '<div class="pviz-heatmap-legend">';
  html += '<span>Less</span>';
  var legendLevels = [0, 0.2, 0.4, 0.7, 1.0];
  for (var lg = 0; lg < legendLevels.length; lg++) {
    var lBg = legendLevels[lg] === 0
      ? 'rgba(255,255,255,0.04)'
      : 'rgba(255,45,149,' + legendLevels[lg] + ')';
    html += '<div class="pviz-heatmap-legend-cell" style="background:' + lBg + '"></div>';
  }
  html += '<span>More</span>';
  html += '</div>';

  return html;
}

function buildQuickStats() {
  var gs = (typeof gameState !== 'undefined') ? gameState : {};
  var wordsLearned = gs.wordsLearned || 0;
  var gamesPlayed = gs.gamesPlayed || 0;
  var correctAnswers = gs.correctAnswers || 0;
  var bestCombo = gs.bestCombo || 0;
  var accuracy = gamesPlayed > 0 ? Math.round((correctAnswers / Math.max(1, correctAnswers + (gamesPlayed - correctAnswers))) * 100) : 0;

  var statsData = [
    { label: 'Words Learned', value: wordsLearned, color: 'var(--neon-pink)' },
    { label: 'Games Played', value: gamesPlayed, color: 'var(--neon-purple)' },
    { label: 'Best Combo', value: bestCombo + 'x', color: 'var(--gold)' },
    { label: 'Accuracy', value: accuracy + '%', color: 'var(--neon-cyan)' }
  ];

  var html = '<div class="pviz-quick-stats">';
  for (var i = 0; i < statsData.length; i++) {
    var s = statsData[i];
    html += '<div class="pviz-quick-stat">';
    html += '<div class="pviz-quick-value" style="color:' + s.color + '">' + s.value + '</div>';
    html += '<div class="pviz-quick-label">' + s.label + '</div>';
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function animateProgressBars() {
  var fills = document.querySelectorAll('.pviz-bar-fill');
  for (var i = 0; i < fills.length; i++) {
    (function(fill) {
      var pct = fill.getAttribute('data-pct') || '0';
      setTimeout(function() {
        fill.style.width = pct + '%';
      }, 50);
    })(fills[i]);
  }
}

function injectProgressVizCSS() {
  if (document.getElementById('ui-pviz-css')) return;
  var style = document.createElement('style');
  style.id = 'ui-pviz-css';
  style.textContent = [
    '/* Progress Viz Sections */',
    '.pviz-section { background:var(--glass); border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:20px; margin-bottom:16px; }',
    '.pviz-section-title { font-size:0.95rem; font-weight:700; margin-bottom:14px; color:var(--neon-cyan); letter-spacing:0.5px; }',
    '',
    '/* Level Ring */',
    '.pviz-ring-container { display:flex; align-items:center; justify-content:center; gap:25px; flex-wrap:wrap; }',
    '.pviz-ring { display:block; }',
    '.pviz-ring-progress { transition:stroke-dashoffset 1s ease; }',
    '.pviz-ring-label { text-align:center; }',
    '.pviz-ring-level { font-size:2rem; font-weight:900; background:linear-gradient(135deg, var(--neon-pink), var(--neon-cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }',
    '.pviz-ring-pct { font-size:1.1rem; color:rgba(255,255,255,0.7); margin-top:4px; }',
    '.pviz-ring-xp { font-size:0.8rem; color:rgba(255,255,255,0.5); margin-top:2px; }',
    '',
    '/* Category Bars */',
    '.pviz-bars-container { display:flex; flex-direction:column; gap:10px; }',
    '.pviz-bar-row { display:flex; align-items:center; gap:10px; }',
    '.pviz-bar-label { flex:0 0 100px; font-size:0.82rem; color:rgba(255,255,255,0.8); text-align:right; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }',
    '.pviz-bar-track { flex:1; height:14px; background:rgba(255,255,255,0.06); border-radius:7px; overflow:hidden; }',
    '.pviz-bar-fill { height:100%; border-radius:7px; background:linear-gradient(90deg, var(--neon-pink), var(--neon-purple), var(--neon-blue)); background-size:200% 100%; transition:width 0.8s cubic-bezier(0.4,0,0.2,1); }',
    '.pviz-bar-value { flex:0 0 55px; font-size:0.78rem; color:rgba(255,255,255,0.5); }',
    '',
    '/* Activity Heatmap */',
    '.pviz-heatmap { display:grid; grid-template-columns:repeat(10,1fr); gap:4px; max-width:400px; margin:0 auto; }',
    '.pviz-heatmap-cell { aspect-ratio:1; border-radius:4px; display:flex; align-items:center; justify-content:center; position:relative; transition:transform 0.2s ease; }',
    '.pviz-heatmap-cell:hover { transform:scale(1.2); z-index:1; }',
    '.pviz-heatmap-num { font-size:0.6rem; color:rgba(255,255,255,0.6); }',
    '.pviz-heatmap-today { border:2px solid var(--gold); }',
    '.pviz-heatmap-legend { display:flex; align-items:center; justify-content:center; gap:4px; margin-top:12px; font-size:0.72rem; color:rgba(255,255,255,0.5); }',
    '.pviz-heatmap-legend-cell { width:16px; height:16px; border-radius:3px; }',
    '',
    '/* Quick Stats */',
    '.pviz-quick-stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(110px,1fr)); gap:12px; }',
    '.pviz-quick-stat { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:16px; text-align:center; }',
    '.pviz-quick-value { font-size:1.8rem; font-weight:900; }',
    '.pviz-quick-label { font-size:0.75rem; color:rgba(255,255,255,0.5); margin-top:4px; text-transform:uppercase; letter-spacing:0.5px; }',
    '',
    '/* Responsive */',
    '@media (max-width:480px) { .pviz-bar-label { flex:0 0 70px; font-size:0.75rem; } .pviz-heatmap { grid-template-columns:repeat(7,1fr); gap:3px; } .pviz-ring-container { flex-direction:column; } }'
  ].join('\n');
  document.head.appendChild(style);
}


// ============================================================
// INITIALIZATION
// Wire everything up on DOM ready
// ============================================================

function initUIEnhancements() {
  initThemeSystem();
  initAnimationEngine();
  initToastSystem();
  initAccessibility();
  createFloatingParticles();

  // Show tutorial for first-time users (after short delay)
  var tutorialDone = localStorage.getItem('kpop_tutorial_done');
  if (tutorialDone !== 'true') {
    setTimeout(function() {
      showTutorial();
    }, 1500);
  }

  // Inject help button near settings
  injectUtilityButtons();
}

function injectUtilityButtons() {
  // Create a small toolbar for theme/accessibility/help
  var toolbar = document.createElement('div');
  toolbar.className = 'ui-enhance-toolbar';
  toolbar.innerHTML = [
    '<button class="ui-toolbar-btn" onclick="showThemePickerPage()" title="Color Themes" aria-label="Open color theme picker">&#127912;</button>',
    '<button class="ui-toolbar-btn" onclick="showAccessibilityPage()" title="Accessibility" aria-label="Open accessibility settings">&#9855;</button>',
    '<button class="ui-toolbar-btn" onclick="showProgressPage()" title="Progress Dashboard" aria-label="Open progress dashboard">&#128202;</button>',
    '<button class="ui-toolbar-btn" onclick="showHelpPage()" title="Help / Tutorial" aria-label="Open tutorial">?</button>'
  ].join('');

  var toolbarStyle = document.createElement('style');
  toolbarStyle.id = 'ui-toolbar-css';
  toolbarStyle.textContent = [
    '.ui-enhance-toolbar { position:fixed; top:10px; left:10px; z-index:50; display:flex; gap:6px; flex-direction:column; }',
    '.ui-toolbar-btn { width:36px; height:36px; border-radius:50%; background:var(--glass); backdrop-filter:blur(10px); border:1px solid rgba(157,78,221,0.3); color:#fff; cursor:pointer; font-size:0.9rem; display:flex; align-items:center; justify-content:center; transition:all 0.2s ease; }',
    '.ui-toolbar-btn:hover { background:rgba(157,78,221,0.3); transform:scale(1.1); }',
    '.ui-toolbar-btn:focus-visible { outline:2px solid var(--neon-cyan); outline-offset:2px; }',
    '@media (max-width:480px) { .ui-enhance-toolbar { flex-direction:row; top:auto; bottom:10px; left:50%; transform:translateX(-50%); } }'
  ].join('\n');
  document.head.appendChild(toolbarStyle);
  document.body.appendChild(toolbar);
}

function showThemePickerPage() {
  var c = document.getElementById('gameArea');
  if (c) showThemePicker(c);
}

function showAccessibilityPage() {
  var c = document.getElementById('gameArea');
  if (c) showAccessibilitySettings(c);
}

function showProgressPage() {
  var c = document.getElementById('gameArea');
  if (c) showProgressViz(c);
}

function showHelpPage() {
  var c = document.getElementById('gameArea');
  if (c) showTutorial(c);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUIEnhancements);
} else {
  // DOM already loaded, run on next tick to ensure other scripts have loaded
  setTimeout(initUIEnhancements, 0);
}
