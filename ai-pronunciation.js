/**
 * ai-pronunciation.js
 * AI Pronunciation Evaluation System for K-POP Korean Learning Game.
 * Uses Web Speech API (SpeechRecognition) for browser-based pronunciation assessment.
 * Requires: main-app.js (escapeHtml, speakKorean, getWords, shuffle, addXP, addCombo,
 *   resetCombo, SoundEngine, createConfetti, showToast, saveProgress, gameState, collectWord)
 * Requires: hangul-js (Hangul) for jamo decomposition
 */
(function () {
  "use strict";

  // ============================================================
  // Constants
  // ============================================================

  /** @type {number} Maximum recording time in milliseconds */
  var MAX_RECORD_MS = 10000;

  /** @type {number} Challenge word count */
  var CHALLENGE_WORD_COUNT = 10;

  /** @type {number} Seconds per challenge word */
  var CHALLENGE_TIME_PER_WORD = 10;

  /** @type {string} LocalStorage key for pronunciation history */
  var HISTORY_STORAGE_KEY = "kpopPronunciationHistory";

  /** @type {number} Maximum history entries to keep */
  var MAX_HISTORY_ENTRIES = 200;

  // ============================================================
  // Pronunciation Word Data by Difficulty
  // ============================================================

  /**
   * Word data organized by difficulty level.
   * Each word has korean, romanization, and english fields.
   * @type {Object.<string, Array.<{korean:string, romanization:string, english:string}>>}
   */
  var pronunciationWords = {
    beginner: [
      {korean: "\uC548\uB155\uD558\uC138\uC694", romanization: "annyeonghaseyo", english: "hello"},
      {korean: "\uAC10\uC0AC\uD569\uB2C8\uB2E4", romanization: "gamsahamnida", english: "thank you"},
      {korean: "\uC0AC\uB791", romanization: "sarang", english: "love"},
      {korean: "\uD558\uB098", romanization: "hana", english: "one"},
      {korean: "\uB458", romanization: "dul", english: "two"},
      {korean: "\uC14B", romanization: "set", english: "three"},
      {korean: "\uB137", romanization: "net", english: "four"},
      {korean: "\uB2E4\uC12F", romanization: "daseot", english: "five"},
      {korean: "\uBE68\uAC04\uC0C9", romanization: "ppalgansaek", english: "red"},
      {korean: "\uD30C\uB780\uC0C9", romanization: "paransaek", english: "blue"},
      {korean: "\uB178\uB780\uC0C9", romanization: "noransaek", english: "yellow"},
      {korean: "\uD558\uC580\uC0C9", romanization: "hayansaek", english: "white"},
      {korean: "\uAC80\uC815\uC0C9", romanization: "geomjeongsaek", english: "black"},
      {korean: "\uB124", romanization: "ne", english: "yes"},
      {korean: "\uC544\uB2C8\uC694", romanization: "aniyo", english: "no"},
      {korean: "\uBB3C", romanization: "mul", english: "water"},
      {korean: "\uBC25", romanization: "bap", english: "rice"},
      {korean: "\uC9D1", romanization: "jip", english: "house"},
      {korean: "\uC0AC\uB78C", romanization: "saram", english: "person"},
      {korean: "\uCE5C\uAD6C", romanization: "chingu", english: "friend"}
    ],
    intermediate: [
      {korean: "\uBE44\uBE54\uBC25", romanization: "bibimbap", english: "mixed rice"},
      {korean: "\uB5A1\uBCF6\uC774", romanization: "tteokbokki", english: "spicy rice cakes"},
      {korean: "\uBD88\uACE0\uAE30", romanization: "bulgogi", english: "grilled beef"},
      {korean: "\uAE40\uCE58\uCC0C\uAC1C", romanization: "kimchi-jjigae", english: "kimchi stew"},
      {korean: "\uC0BC\uACA8\uC0B4", romanization: "samgyeopsal", english: "pork belly"},
      {korean: "\uAC15\uC544\uC9C0", romanization: "gangaji", english: "puppy"},
      {korean: "\uACE0\uC591\uC774", romanization: "goyangi", english: "cat"},
      {korean: "\uD1A0\uB07C", romanization: "tokki", english: "rabbit"},
      {korean: "\uC5B4\uBA38\uB2C8", romanization: "eomeoni", english: "mother"},
      {korean: "\uC544\uBC84\uC9C0", romanization: "abeoji", english: "father"},
      {korean: "\uD615\uC81C", romanization: "hyeongje", english: "brothers"},
      {korean: "\uC790\uB9E4", romanization: "jamae", english: "sisters"},
      {korean: "\uD560\uBA38\uB2C8", romanization: "halmeoni", english: "grandmother"},
      {korean: "\uD560\uC544\uBC84\uC9C0", romanization: "harabeoji", english: "grandfather"},
      {korean: "\uD559\uAD50", romanization: "hakgyo", english: "school"},
      {korean: "\uC120\uC0DD\uB2D8", romanization: "seonsaengnim", english: "teacher"},
      {korean: "\uBCD1\uC6D0", romanization: "byeongwon", english: "hospital"},
      {korean: "\uACBD\uCC30", romanization: "gyeongchal", english: "police"},
      {korean: "\uC18C\uBC29\uAD00", romanization: "sobangwan", english: "firefighter"},
      {korean: "\uB300\uD55C\uBBFC\uAD6D", romanization: "daehanminguk", english: "Republic of Korea"}
    ],
    advanced: [
      {korean: "\uD589\uBCF5", romanization: "haengbok", english: "happiness"},
      {korean: "\uC2AC\uD514", romanization: "seulpeum", english: "sadness"},
      {korean: "\uBD84\uB178", romanization: "bunno", english: "anger"},
      {korean: "\uC124\uB808\uC784", romanization: "seolleim", english: "excitement"},
      {korean: "\uADF8\uB9AC\uC6C0", romanization: "geurium", english: "longing"},
      {korean: "\uBBF8\uC548\uD568", romanization: "mianham", english: "feeling sorry"},
      {korean: "\uCD94\uC11D", romanization: "chuseok", english: "Korean thanksgiving"},
      {korean: "\uC124\uB0A0", romanization: "seollal", english: "Lunar New Year"},
      {korean: "\uD55C\uBCF5", romanization: "hanbok", english: "Korean traditional clothes"},
      {korean: "\uC0AC\uBB3C\uB180\uC774", romanization: "samulnori", english: "traditional percussion"},
      {korean: "\uC5F4\uC2EC\uD788", romanization: "yeolsimhi", english: "diligently"},
      {korean: "\uC560\uAD6D\uAC00", romanization: "aegukga", english: "national anthem"},
      {korean: "\uC548\uB155\uD788 \uACC4\uC138\uC694", romanization: "annyeonghi gyeseyo", english: "goodbye (to one staying)"},
      {korean: "\uC548\uB155\uD788 \uAC00\uC138\uC694", romanization: "annyeonghi gaseyo", english: "goodbye (to one leaving)"},
      {korean: "\uC8C4\uC1A1\uD569\uB2C8\uB2E4", romanization: "joesonghamnida", english: "I am sorry (formal)"},
      {korean: "\uBC31\uC9C0\uC7A5", romanization: "baekjijang", english: "blank slate"},
      {korean: "\uACE0\uC9C4\uAC10\uB798", romanization: "gojingamrae", english: "no pain no gain"},
      {korean: "\uC77C\uC11D\uC774\uC870", romanization: "ilseogijo", english: "killing two birds with one stone"},
      {korean: "\uC790\uC5C5\uC790\uB4DD", romanization: "jaeopjadeuk", english: "you reap what you sow"},
      {korean: "\uD654\uC774\uBD80\uB3D9", romanization: "hwaibudong", english: "harmony without uniformity"}
    ]
  };

  // ============================================================
  // Browser Compatibility Check
  // ============================================================

  /**
   * Check if the Web Speech API SpeechRecognition is available.
   * @returns {boolean} True if SpeechRecognition is supported
   */
  function isSpeechRecognitionSupported() {
    return !!(
      window.SpeechRecognition ||
      window.webkitSpeechRecognition
    );
  }

  /**
   * Create a new SpeechRecognition instance.
   * @returns {SpeechRecognition|null} Recognition instance or null
   */
  function createRecognition() {
    var SR = window.SpeechRecognition ||
      window.webkitSpeechRecognition;
    if (!SR) return null;
    var recognition = new SR();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;
    return recognition;
  }

  // ============================================================
  // Levenshtein Distance & Scoring
  // ============================================================

  /**
   * Compute the Levenshtein edit distance between two strings.
   * @param {string} a - First string
   * @param {string} b - Second string
   * @returns {number} Edit distance
   */
  function levenshteinDistance(a, b) {
    var m = a.length;
    var n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
      dp[i] = [i];
    }
    for (var j = 0; j <= n; j++) {
      dp[0][j] = j;
    }
    for (var i2 = 1; i2 <= m; i2++) {
      for (var j2 = 1; j2 <= n; j2++) {
        var cost = a[i2 - 1] === b[j2 - 1] ? 0 : 1;
        dp[i2][j2] = Math.min(
          dp[i2 - 1][j2] + 1,
          dp[i2][j2 - 1] + 1,
          dp[i2 - 1][j2 - 1] + cost
        );
      }
    }
    return dp[m][n];
  }

  /**
   * Decompose a Korean string into individual jamo characters.
   * Uses Hangul.js library if available, else returns the string as-is.
   * @param {string} str - Korean string
   * @returns {Array.<string>} Array of jamo characters
   */
  function decomposeToJamo(str) {
    if (typeof Hangul !== "undefined" && Hangul.disassemble) {
      return Hangul.disassemble(str);
    }
    return str.split("");
  }

  /**
   * Calculate pronunciation accuracy score (0-100).
   * Compares original text with recognized speech using
   * both character-level and jamo-level Levenshtein distance.
   * @param {string} original - The target Korean text
   * @param {string} recognized - The recognized Korean text
   * @returns {number} Score from 0 to 100
   */
  function calculatePronunciationScore(original, recognized) {
    if (!recognized || recognized.length === 0) return 0;
    var origClean = original.replace(/\s+/g, "");
    var recClean = recognized.replace(/\s+/g, "");
    if (origClean === recClean) return 100;

    var charDist = levenshteinDistance(origClean, recClean);
    var maxCharLen = Math.max(origClean.length, recClean.length);
    var charScore = maxCharLen > 0
      ? (1 - charDist / maxCharLen) * 100
      : 0;

    var origJamo = decomposeToJamo(origClean);
    var recJamo = decomposeToJamo(recClean);
    var jamoDist = levenshteinDistance(
      origJamo.join(""),
      recJamo.join("")
    );
    var maxJamoLen = Math.max(origJamo.length, recJamo.length);
    var jamoScore = maxJamoLen > 0
      ? (1 - jamoDist / maxJamoLen) * 100
      : 0;

    var combined = charScore * 0.4 + jamoScore * 0.6;
    return Math.round(Math.max(0, Math.min(100, combined)));
  }

  /**
   * Convert a numeric score (0-100) to a star rating string.
   * @param {number} score - Score from 0 to 100
   * @returns {string} Star rating string
   */
  function scoreToStars(score) {
    if (score >= 90) return "\u2B50\u2B50\u2B50";
    if (score >= 70) return "\u2B50\u2B50";
    if (score >= 50) return "\u2B50";
    return "";
  }

  /**
   * Get a color CSS string based on score.
   * @param {number} score - Score from 0 to 100
   * @returns {string} CSS color value
   */
  function scoreToColor(score) {
    if (score >= 90) return "var(--neon-cyan)";
    if (score >= 70) return "var(--gold)";
    if (score >= 50) return "var(--neon-pink)";
    return "#ff4757";
  }

  // ============================================================
  // Syllable Matching
  // ============================================================

  /**
   * Generate per-syllable match results between original and recognized.
   * Returns an array of objects with char and matched boolean.
   * @param {string} original - Target text
   * @param {string} recognized - Recognized text
   * @returns {Array.<{char:string, matched:boolean}>} Match results
   */
  function syllableMatch(original, recognized) {
    var results = [];
    var recChars = (recognized || "").replace(/\s+/g, "");
    var origChars = original.replace(/\s+/g, "");
    for (var i = 0; i < origChars.length; i++) {
      var ch = origChars[i];
      var found = recChars.indexOf(ch) !== -1;
      results.push({char: ch, matched: found});
    }
    return results;
  }

  /**
   * Render syllable match results as HTML spans.
   * Matched syllables are green, unmatched are red.
   * @param {Array.<{char:string, matched:boolean}>} matches - Match data
   * @returns {string} HTML string
   */
  function renderSyllableFeedback(matches) {
    var html = "";
    for (var i = 0; i < matches.length; i++) {
      var m = matches[i];
      var color = m.matched
        ? "var(--neon-cyan)"
        : "#ff4757";
      html += '<span style="color:' + color + ";";
      html += "font-size:2rem;margin:0 3px;";
      html += 'font-weight:bold">';
      html += escapeHtml(m.char) + "</span>";
    }
    return html;
  }

  // ============================================================
  // Waveform Visualizer
  // ============================================================

  /** @type {AudioContext|null} */
  var audioCtx = null;
  /** @type {AnalyserNode|null} */
  var analyser = null;
  /** @type {MediaStreamAudioSourceNode|null} */
  var micSource = null;
  /** @type {number|null} */
  var waveformRAF = null;

  /**
   * Start the real-time waveform visualizer on a canvas element.
   * @param {HTMLCanvasElement} canvas - Target canvas
   * @param {MediaStream} stream - Microphone media stream
   */
  function startWaveform(canvas, stream) {
    stopWaveform();
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audioCtx = new AC();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    micSource = audioCtx.createMediaStreamSource(stream);
    micSource.connect(analyser);
    drawWaveform(canvas);
  }

  /**
   * Draw a single waveform animation frame.
   * @param {HTMLCanvasElement} canvas - Target canvas
   */
  function drawWaveform(canvas) {
    if (!analyser) return;
    var ctx = canvas.getContext("2d");
    var bufLen = analyser.frequencyBinCount;
    var data = new Uint8Array(bufLen);
    var W = canvas.width;
    var H = canvas.height;

    function frame() {
      waveformRAF = requestAnimationFrame(frame);
      analyser.getByteTimeDomainData(data);
      ctx.fillStyle = "rgba(10, 10, 26, 0.3)";
      ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ff2d95";
      ctx.beginPath();
      var sliceW = W / bufLen;
      var x = 0;
      for (var i = 0; i < bufLen; i++) {
        var v = data[i] / 128.0;
        var y = (v * H) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceW;
      }
      ctx.lineTo(W, H / 2);
      ctx.stroke();
    }
    frame();
  }

  /**
   * Stop the waveform visualizer and release resources.
   */
  function stopWaveform() {
    if (waveformRAF) {
      cancelAnimationFrame(waveformRAF);
      waveformRAF = null;
    }
    if (micSource) {
      micSource.disconnect();
      micSource = null;
    }
    if (audioCtx && audioCtx.state !== "closed") {
      audioCtx.close();
      audioCtx = null;
    }
    analyser = null;
  }

  // ============================================================
  // History Persistence
  // ============================================================

  /**
   * Load pronunciation history from localStorage.
   * @returns {Array.<Object>} Array of history entries
   */
  function loadHistory() {
    try {
      var raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* silent */ }
    return [];
  }

  /**
   * Save pronunciation history to localStorage.
   * @param {Array.<Object>} history - Array of history entries
   */
  function saveHistory(history) {
    try {
      var trimmed = history.slice(-MAX_HISTORY_ENTRIES);
      localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(trimmed)
      );
    } catch (e) { /* silent */ }
  }

  /**
   * Add a single pronunciation result to history.
   * @param {string} word - The Korean word attempted
   * @param {number} score - Score achieved (0-100)
   * @param {string} recognized - What was recognized
   */
  function addHistoryEntry(word, score, recognized) {
    var history = loadHistory();
    history.push({
      word: word,
      score: score,
      recognized: recognized,
      date: new Date().toISOString()
    });
    saveHistory(history);
  }

  // ============================================================
  // Word Selection Helpers
  // ============================================================

  /**
   * Get pronunciation words for a given difficulty level.
   * Falls back to project vocabulary if available.
   * @param {string} level - beginner, intermediate, or advanced
   * @returns {Array.<{korean:string, romanization:string, english:string}>}
   */
  function getWordsForLevel(level) {
    return pronunciationWords[level] || pronunciationWords.beginner;
  }

  /**
   * Get all pronunciation words across all levels.
   * @returns {Array.<{korean:string, romanization:string, english:string}>}
   */
  function getAllPronunciationWords() {
    var all = [];
    for (var key in pronunciationWords) {
      if (pronunciationWords.hasOwnProperty(key)) {
        all = all.concat(pronunciationWords[key]);
      }
    }
    return all;
  }

  /**
   * Pick a random word from a level.
   * @param {string} level - Difficulty level
   * @returns {{korean:string, romanization:string, english:string}}
   */
  function pickRandomWord(level) {
    var words = getWordsForLevel(level);
    var idx = Math.floor(Math.random() * words.length);
    return words[idx];
  }

  // ============================================================
  // Unsupported Browser Fallback
  // ============================================================

  /**
   * Render an unsupported-browser message in a container.
   * @param {HTMLElement} container - Target container element
   */
  function renderUnsupported(container) {
    var h = '<h2 class="game-title">';
    h += "AI Pronunciation Evaluator</h2>";
    h += '<div style="text-align:center;padding:40px">';
    h += '<div style="font-size:4rem;margin-bottom:20px">';
    h += "&#128308;</div>";
    h += '<p style="color:rgba(255,255,255,0.8);';
    h += 'font-size:1.1rem;margin-bottom:15px">';
    h += "Your browser does not support Speech Recognition.";
    h += "</p>";
    h += '<p style="color:rgba(255,255,255,0.5);';
    h += 'font-size:0.9rem">';
    h += "Please use Chrome, Edge, or Safari for this feature.";
    h += "</p></div>";
    container.innerHTML = h;
  }

  // ============================================================
  // Main Game Mode: Pronunciation Practice
  // ============================================================

  /** @type {Object|null} Current word being practiced */
  var currentPracticeWord = null;
  /** @type {string} Current difficulty level */
  var currentLevel = "beginner";
  /** @type {SpeechRecognition|null} Active recognition instance */
  var activeRecognition = null;
  /** @type {boolean} Whether recording is in progress */
  var isRecording = false;
  /** @type {MediaStream|null} Active microphone stream */
  var activeMicStream = null;

  /**
   * Show the pronunciation practice game UI.
   * @param {HTMLElement} container - Target container element
   */
  function showPronunciationGame(container) {
    if (!isSpeechRecognitionSupported()) {
      renderUnsupported(container);
      return;
    }
    currentPracticeWord = pickRandomWord(currentLevel);
    gameState.gamesPlayed++;
    saveProgress();
    renderPracticeUI(container);
  }

  /**
   * Render the main pronunciation practice interface.
   * @param {HTMLElement} container - Target container element
   */
  function renderPracticeUI(container) {
    var w = currentPracticeWord;
    var h = '<h2 class="game-title">';
    h += "AI Pronunciation Evaluator</h2>";

    // Difficulty selector
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += renderLevelButtons();
    h += "</div>";

    // Word display card
    h += '<div style="background:linear-gradient(135deg,';
    h += "var(--neon-purple),var(--neon-pink));";
    h += "border-radius:20px;padding:30px;";
    h += 'text-align:center;margin-bottom:20px">';
    h += '<div style="font-size:3.5rem;margin-bottom:10px">';
    h += escapeHtml(w.korean) + "</div>";
    h += '<div style="font-size:1.1rem;';
    h += 'color:rgba(255,255,255,0.85);margin-bottom:8px">';
    h += escapeHtml(w.romanization) + "</div>";
    h += '<div style="font-size:1rem;';
    h += 'color:rgba(255,255,255,0.7)">';
    h += escapeHtml(w.english) + "</div>";
    h += "</div>";

    // Waveform canvas
    h += '<canvas id="pronunciationWaveform" width="400"';
    h += ' height="80" style="display:block;margin:0 auto';
    h += " 15px;border-radius:10px;";
    h += "background:rgba(10,10,26,0.5);";
    h += 'border:1px solid rgba(157,78,221,0.3)"></canvas>';

    // Record button
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<button id="pronunciationRecordBtn" class="game-btn"';
    h += ' style="background:linear-gradient(135deg,';
    h += "#ff2d95,#ff0055);padding:18px 40px;";
    h += "font-size:1.2rem;border-radius:50px;";
    h += 'box-shadow:0 0 30px rgba(255,45,149,0.5)">';
    h += "&#127908; Record Pronunciation</button>";
    h += "</div>";

    // Listen to correct pronunciation
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<button id="pronunciationListenBtn"';
    h += ' class="game-btn secondary"';
    h += ' style="padding:10px 24px;font-size:0.9rem">';
    h += "&#128264; Listen to Correct Pronunciation</button>";
    h += "</div>";

    // Result area
    h += '<div id="pronunciationResult"></div>';

    // Next / Skip buttons
    h += '<div style="text-align:center;margin-top:15px">';
    h += '<button id="pronunciationNextBtn" class="game-btn"';
    h += ' style="padding:12px 30px">';
    h += "Next Word</button></div>";

    container.innerHTML = h;
    bindPracticeEvents(container);
  }

  /**
   * Render level selection buttons HTML.
   * @returns {string} HTML string for level buttons
   */
  function renderLevelButtons() {
    var levels = ["beginner", "intermediate", "advanced"];
    var labels = ["Beginner", "Intermediate", "Advanced"];
    var h = "";
    for (var i = 0; i < levels.length; i++) {
      var active = levels[i] === currentLevel;
      h += '<button class="cat-btn';
      h += active ? " active" : "";
      h += '" data-pronlevel="' + levels[i] + '"';
      h += ' style="margin:0 4px">';
      h += labels[i] + "</button>";
    }
    return h;
  }

  /**
   * Bind event listeners for practice mode UI elements.
   * @param {HTMLElement} container - Target container element
   */
  function bindPracticeEvents(container) {
    var recordBtn = document.getElementById("pronunciationRecordBtn");
    var listenBtn = document.getElementById("pronunciationListenBtn");
    var nextBtn = document.getElementById("pronunciationNextBtn");

    if (recordBtn) {
      recordBtn.addEventListener("click", function () {
        handleRecord(container);
      });
    }
    if (listenBtn) {
      listenBtn.addEventListener("click", function () {
        speakKorean(currentPracticeWord.korean);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        currentPracticeWord = pickRandomWord(currentLevel);
        renderPracticeUI(container);
      });
    }

    // Level buttons
    var levelBtns = container.querySelectorAll("[data-pronlevel]");
    for (var i = 0; i < levelBtns.length; i++) {
      levelBtns[i].addEventListener("click", function () {
        currentLevel = this.getAttribute("data-pronlevel");
        currentPracticeWord = pickRandomWord(currentLevel);
        renderPracticeUI(container);
      });
    }
  }

  /**
   * Handle the record button click: request mic, start recognition.
   * @param {HTMLElement} container - Target container element
   */
  function handleRecord(container) {
    if (isRecording) {
      stopRecording();
      return;
    }
    var recordBtn = document.getElementById("pronunciationRecordBtn");
    if (recordBtn) {
      recordBtn.textContent = "Listening...";
      recordBtn.style.background =
        "linear-gradient(135deg, #ff0055, #ff4757)";
      recordBtn.style.animation = "pulse 1s infinite";
    }
    isRecording = true;

    navigator.mediaDevices.getUserMedia({audio: true})
      .then(function (stream) {
        activeMicStream = stream;
        var canvas = document.getElementById("pronunciationWaveform");
        if (canvas) startWaveform(canvas, stream);
        startRecognition(container);
      })
      .catch(function () {
        isRecording = false;
        resetRecordButton();
        showToast("Microphone access denied. Please allow microphone.");
      });
  }

  /**
   * Start the SpeechRecognition session.
   * @param {HTMLElement} container - Target container element
   */
  function startRecognition(container) {
    var recognition = createRecognition();
    if (!recognition) {
      stopRecording();
      return;
    }
    activeRecognition = recognition;

    var timeout = setTimeout(function () {
      stopRecording();
    }, MAX_RECORD_MS);

    recognition.addEventListener("result", function (event) {
      clearTimeout(timeout);
      var transcript = "";
      if (event.results && event.results[0]) {
        transcript = event.results[0][0].transcript;
      }
      stopRecording();
      processResult(container, transcript);
    });

    recognition.addEventListener("error", function () {
      clearTimeout(timeout);
      stopRecording();
      showResultMessage(container, 0, "", "No speech detected. Try again!");
    });

    recognition.addEventListener("end", function () {
      clearTimeout(timeout);
      if (isRecording) {
        isRecording = false;
        resetRecordButton();
        stopWaveform();
        releaseMicrophone();
      }
    });

    recognition.start();
  }

  /**
   * Stop any active recording session.
   */
  function stopRecording() {
    isRecording = false;
    if (activeRecognition) {
      try { activeRecognition.stop(); } catch (e) { /* ok */ }
      activeRecognition = null;
    }
    resetRecordButton();
    stopWaveform();
    releaseMicrophone();
  }

  /**
   * Release the active microphone stream.
   */
  function releaseMicrophone() {
    if (activeMicStream) {
      var tracks = activeMicStream.getTracks();
      for (var i = 0; i < tracks.length; i++) {
        tracks[i].stop();
      }
      activeMicStream = null;
    }
  }

  /**
   * Reset the record button to its default state.
   */
  function resetRecordButton() {
    var btn = document.getElementById("pronunciationRecordBtn");
    if (btn) {
      btn.textContent = "\uD83C\uDFA4 Record Pronunciation";
      btn.style.background =
        "linear-gradient(135deg, #ff2d95, #ff0055)";
      btn.style.animation = "";
    }
  }

  /**
   * Process the speech recognition result.
   * @param {HTMLElement} container - Target container element
   * @param {string} transcript - Recognized text
   */
  function processResult(container, transcript) {
    var original = currentPracticeWord.korean;
    var score = calculatePronunciationScore(original, transcript);
    addHistoryEntry(original, score, transcript);
    applyGameRewards(score);
    showResultMessage(container, score, transcript, "");
  }

  /**
   * Apply XP and combo rewards based on pronunciation score.
   * @param {number} score - Score from 0 to 100
   */
  function applyGameRewards(score) {
    if (score >= 90) {
      addXP(25);
      addCombo();
      if (typeof SoundEngine !== "undefined") SoundEngine.correct();
      createConfetti(30);
      collectWord(currentPracticeWord);
    } else if (score >= 70) {
      addXP(15);
      addCombo();
      if (typeof SoundEngine !== "undefined") SoundEngine.correct();
    } else if (score >= 50) {
      addXP(5);
      resetCombo();
    } else {
      resetCombo();
      if (typeof SoundEngine !== "undefined") SoundEngine.wrong();
      screenShake();
    }
    gameState.correctAnswers++;
    saveProgress();
  }

  /**
   * Show the scoring result in the result area.
   * @param {HTMLElement} container - Target container element
   * @param {number} score - Score from 0 to 100
   * @param {string} recognized - Recognized text
   * @param {string} message - Optional override message
   */
  function showResultMessage(container, score, recognized, message) {
    var resultDiv = document.getElementById("pronunciationResult");
    if (!resultDiv) return;

    var h = '<div style="background:var(--glass);';
    h += "backdrop-filter:blur(10px);";
    h += "border:1px solid rgba(157,78,221,0.3);";
    h += "border-radius:15px;padding:20px;";
    h += 'text-align:center">';

    if (message) {
      h += '<p style="color:rgba(255,255,255,0.7)">';
      h += escapeHtml(message) + "</p>";
      h += "</div>";
      resultDiv.innerHTML = h;
      return;
    }

    // Score display
    h += '<div style="font-size:3rem;font-weight:bold;';
    h += "color:" + scoreToColor(score) + '">';
    h += score + "%</div>";
    h += '<div style="font-size:1.5rem;margin:5px 0">';
    h += scoreToStars(score) + "</div>";

    // Feedback text
    var feedback = getFeedbackText(score);
    h += '<p style="color:rgba(255,255,255,0.8);';
    h += 'margin-bottom:15px">';
    h += escapeHtml(feedback) + "</p>";

    // What was recognized
    if (recognized) {
      h += '<div style="margin-bottom:15px">';
      h += '<span style="color:rgba(255,255,255,0.5);';
      h += 'font-size:0.85rem">You said: </span>';
      h += '<span style="color:var(--neon-blue);';
      h += 'font-size:1.1rem">';
      h += escapeHtml(recognized) + "</span></div>";
    }

    // Syllable-level feedback
    var matches = syllableMatch(
      currentPracticeWord.korean,
      recognized
    );
    h += '<div style="margin-bottom:10px">';
    h += renderSyllableFeedback(matches);
    h += "</div>";

    h += "</div>";
    resultDiv.innerHTML = h;
  }

  /**
   * Get motivational feedback text based on score.
   * @param {number} score - Score from 0 to 100
   * @returns {string} Feedback text
   */
  function getFeedbackText(score) {
    if (score >= 95) return "Perfect pronunciation!";
    if (score >= 90) return "Excellent! Almost perfect!";
    if (score >= 80) return "Great job! Very close!";
    if (score >= 70) return "Good effort! Keep practicing!";
    if (score >= 50) return "Not bad! Try again for a better score.";
    if (score >= 30) return "Keep trying! Listen to the correct pronunciation.";
    return "Try listening first, then record your attempt.";
  }

  // ============================================================
  // Challenge Mode
  // ============================================================

  /** @type {Array} Words for current challenge */
  var challengeWords = [];
  /** @type {number} Current index in challenge */
  var challengeIndex = 0;
  /** @type {number} Cumulative challenge score */
  var challengeScore = 0;
  /** @type {number|null} Challenge timer interval */
  var challengeTimer = null;
  /** @type {number} Seconds remaining for current word */
  var challengeTimeLeft = 0;
  /** @type {string} Challenge difficulty level */
  var challengeDifficulty = "beginner";
  /** @type {boolean} Whether challenge is active */
  var challengeActive = false;

  /**
   * Show the pronunciation challenge mode UI.
   * @param {HTMLElement} container - Target container element
   */
  function showPronunciationChallenge(container) {
    if (!isSpeechRecognitionSupported()) {
      renderUnsupported(container);
      return;
    }
    challengeActive = false;
    challengeIndex = 0;
    challengeScore = 0;
    renderChallengeStart(container);
  }

  /**
   * Render the challenge start/configuration screen.
   * @param {HTMLElement} container - Target container element
   */
  function renderChallengeStart(container) {
    var h = '<h2 class="game-title">';
    h += "Pronunciation Challenge</h2>";
    h += '<div style="text-align:center;padding:20px">';
    h += '<p style="color:rgba(255,255,255,0.7);';
    h += 'margin-bottom:20px;font-size:1.1rem">';
    h += "Pronounce " + CHALLENGE_WORD_COUNT + " words correctly!";
    h += "<br>" + CHALLENGE_TIME_PER_WORD;
    h += " seconds per word.</p>";

    // Difficulty selector
    h += '<div style="margin-bottom:25px">';
    h += renderChallengeLevelButtons();
    h += "</div>";

    h += '<button id="challengeStartBtn" class="game-btn"';
    h += ' style="padding:16px 40px;font-size:1.2rem">';
    h += "Start Challenge</button>";
    h += "</div>";

    container.innerHTML = h;

    var startBtn = document.getElementById("challengeStartBtn");
    if (startBtn) {
      startBtn.addEventListener("click", function () {
        startChallenge(container);
      });
    }

    var lvlBtns = container.querySelectorAll("[data-challevel]");
    for (var i = 0; i < lvlBtns.length; i++) {
      lvlBtns[i].addEventListener("click", function () {
        challengeDifficulty = this.getAttribute("data-challevel");
        renderChallengeStart(container);
      });
    }
  }

  /**
   * Render challenge level selection buttons.
   * @returns {string} HTML string
   */
  function renderChallengeLevelButtons() {
    var levels = ["beginner", "intermediate", "advanced"];
    var labels = ["Beginner", "Intermediate", "Advanced"];
    var h = "";
    for (var i = 0; i < levels.length; i++) {
      var active = levels[i] === challengeDifficulty;
      h += '<button class="cat-btn';
      h += active ? " active" : "";
      h += '" data-challevel="' + levels[i] + '"';
      h += ' style="margin:0 4px">';
      h += labels[i] + "</button>";
    }
    return h;
  }

  /**
   * Start the pronunciation challenge.
   * @param {HTMLElement} container - Target container element
   */
  function startChallenge(container) {
    var words = getWordsForLevel(challengeDifficulty);
    challengeWords = shuffle(words).slice(0, CHALLENGE_WORD_COUNT);
    challengeIndex = 0;
    challengeScore = 0;
    challengeActive = true;
    gameState.gamesPlayed++;
    saveProgress();
    renderChallengeWord(container);
  }

  /**
   * Render the current challenge word with timer.
   * @param {HTMLElement} container - Target container element
   */
  function renderChallengeWord(container) {
    if (challengeIndex >= challengeWords.length) {
      endChallenge(container);
      return;
    }
    var w = challengeWords[challengeIndex];
    challengeTimeLeft = CHALLENGE_TIME_PER_WORD;

    var h = '<h2 class="game-title">';
    h += "Pronunciation Challenge</h2>";

    // Progress bar
    h += '<div style="text-align:center;margin-bottom:10px">';
    h += '<span style="color:rgba(255,255,255,0.5)">';
    h += "Word " + (challengeIndex + 1);
    h += " / " + challengeWords.length + "</span></div>";
    h += '<div class="level-progress" style="margin-bottom:15px">';
    var pct = ((challengeIndex) / challengeWords.length) * 100;
    h += '<div class="level-bar" style="width:' + pct + '%">';
    h += "</div></div>";

    // Timer
    h += '<div id="challengeTimer" class="speed-timer">';
    h += challengeTimeLeft + "</div>";

    // Word card
    h += '<div style="background:linear-gradient(135deg,';
    h += "var(--neon-purple),var(--neon-pink));";
    h += "border-radius:20px;padding:25px;";
    h += 'text-align:center;margin-bottom:15px">';
    h += '<div style="font-size:3rem;margin-bottom:8px">';
    h += escapeHtml(w.korean) + "</div>";
    h += '<div style="font-size:1rem;';
    h += 'color:rgba(255,255,255,0.85)">';
    h += escapeHtml(w.romanization) + "</div>";
    h += '<div style="font-size:0.9rem;';
    h += 'color:rgba(255,255,255,0.7)">';
    h += escapeHtml(w.english) + "</div>";
    h += "</div>";

    // Waveform
    h += '<canvas id="challengeWaveform" width="400"';
    h += ' height="60" style="display:block;margin:0 auto';
    h += " 10px;border-radius:10px;";
    h += "background:rgba(10,10,26,0.5);";
    h += 'border:1px solid rgba(157,78,221,0.3)"></canvas>';

    // Record button
    h += '<div style="text-align:center;margin-bottom:10px">';
    h += '<button id="challengeRecordBtn" class="game-btn"';
    h += ' style="background:linear-gradient(135deg,';
    h += "#ff2d95,#ff0055);padding:14px 35px;";
    h += 'font-size:1.1rem;border-radius:50px">';
    h += "&#127908; Speak Now</button></div>";

    // Score so far
    h += '<div style="text-align:center">';
    h += '<span style="color:var(--gold);font-size:1.2rem">';
    h += "Score: " + challengeScore + "</span></div>";

    // Result area
    h += '<div id="challengeResult"></div>';

    container.innerHTML = h;

    // Timer countdown
    startChallengeTimer(container);

    // Record button
    var recBtn = document.getElementById("challengeRecordBtn");
    if (recBtn) {
      recBtn.addEventListener("click", function () {
        handleChallengeRecord(container);
      });
    }
  }

  /**
   * Start the countdown timer for the current challenge word.
   * @param {HTMLElement} container - Target container element
   */
  function startChallengeTimer(container) {
    clearChallengeTimer();
    challengeTimer = setInterval(function () {
      challengeTimeLeft--;
      var timerEl = document.getElementById("challengeTimer");
      if (timerEl) {
        timerEl.textContent = challengeTimeLeft;
        if (challengeTimeLeft <= 3) {
          timerEl.classList.add("urgent");
        }
      }
      if (challengeTimeLeft <= 0) {
        clearChallengeTimer();
        stopRecording();
        challengeIndex++;
        renderChallengeWord(container);
      }
    }, 1000);
  }

  /**
   * Clear the challenge timer interval.
   */
  function clearChallengeTimer() {
    if (challengeTimer) {
      clearInterval(challengeTimer);
      challengeTimer = null;
    }
  }

  /**
   * Handle recording for a challenge word.
   * @param {HTMLElement} container - Target container element
   */
  function handleChallengeRecord(container) {
    if (isRecording) {
      stopRecording();
      return;
    }
    var recBtn = document.getElementById("challengeRecordBtn");
    if (recBtn) {
      recBtn.textContent = "Listening...";
      recBtn.style.animation = "pulse 1s infinite";
    }
    isRecording = true;

    navigator.mediaDevices.getUserMedia({audio: true})
      .then(function (stream) {
        activeMicStream = stream;
        var canvas = document.getElementById("challengeWaveform");
        if (canvas) startWaveform(canvas, stream);
        startChallengeRecognition(container);
      })
      .catch(function () {
        isRecording = false;
        if (recBtn) {
          recBtn.textContent = "\uD83C\uDFA4 Speak Now";
          recBtn.style.animation = "";
        }
      });
  }

  /**
   * Start recognition for a challenge word.
   * @param {HTMLElement} container - Target container element
   */
  function startChallengeRecognition(container) {
    var recognition = createRecognition();
    if (!recognition) {
      stopRecording();
      return;
    }
    activeRecognition = recognition;

    recognition.addEventListener("result", function (event) {
      var transcript = "";
      if (event.results && event.results[0]) {
        transcript = event.results[0][0].transcript;
      }
      stopRecording();
      processChallengeResult(container, transcript);
    });

    recognition.addEventListener("error", function () {
      stopRecording();
      challengeIndex++;
      renderChallengeWord(container);
    });

    recognition.addEventListener("end", function () {
      if (isRecording) {
        isRecording = false;
        stopWaveform();
        releaseMicrophone();
      }
    });

    recognition.start();
  }

  /**
   * Process a challenge word recognition result.
   * @param {HTMLElement} container - Target container element
   * @param {string} transcript - Recognized text
   */
  function processChallengeResult(container, transcript) {
    var w = challengeWords[challengeIndex];
    var score = calculatePronunciationScore(w.korean, transcript);
    challengeScore += score;
    addHistoryEntry(w.korean, score, transcript);

    if (score >= 70) {
      addXP(10);
      if (typeof SoundEngine !== "undefined") SoundEngine.correct();
    }

    // Brief result display then move on
    var resultDiv = document.getElementById("challengeResult");
    if (resultDiv) {
      var color = scoreToColor(score);
      resultDiv.innerHTML = '<div style="text-align:center;' +
        "padding:10px;color:" + color + ";font-size:1.3rem;" +
        'font-weight:bold">' + score + "% " +
        scoreToStars(score) + "</div>";
    }

    clearChallengeTimer();
    setTimeout(function () {
      challengeIndex++;
      renderChallengeWord(container);
    }, 1500);
  }

  /**
   * End the challenge and show final results.
   * @param {HTMLElement} container - Target container element
   */
  function endChallenge(container) {
    clearChallengeTimer();
    challengeActive = false;
    var avgScore = Math.round(
      challengeScore / CHALLENGE_WORD_COUNT
    );
    var totalXP = Math.round(avgScore / 2);
    addXP(totalXP);

    if (avgScore >= 80) {
      createConfetti(50);
    }

    var h = '<h2 class="game-title">';
    h += "Challenge Complete!</h2>";
    h += '<div style="text-align:center;padding:20px">';

    // Average score
    h += '<div style="font-size:4rem;font-weight:bold;';
    h += "color:" + scoreToColor(avgScore) + '">';
    h += avgScore + "%</div>";
    h += '<div style="font-size:2rem;margin:10px 0">';
    h += scoreToStars(avgScore) + "</div>";
    h += '<p style="color:rgba(255,255,255,0.7);';
    h += 'margin-bottom:10px">Average Score</p>';

    // Stats
    h += '<div style="display:flex;justify-content:center;';
    h += 'gap:20px;margin-bottom:20px">';
    h += '<div class="stat-item"><div class="stat-value">';
    h += challengeScore + "</div>";
    h += '<div class="stat-label">Total Points</div></div>';
    h += '<div class="stat-item"><div class="stat-value">';
    h += "+" + totalXP + "</div>";
    h += '<div class="stat-label">XP Earned</div></div>';
    h += "</div>";

    // Retry button
    h += '<button id="challengeRetryBtn" class="game-btn"';
    h += ' style="padding:14px 35px;font-size:1.1rem">';
    h += "Try Again</button>";
    h += "</div>";

    container.innerHTML = h;

    var retryBtn = document.getElementById("challengeRetryBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", function () {
        showPronunciationChallenge(container);
      });
    }
  }

  // ============================================================
  // Pronunciation History View
  // ============================================================

  /**
   * Show the pronunciation history and statistics UI.
   * @param {HTMLElement} container - Target container element
   */
  function showPronunciationHistory(container) {
    var history = loadHistory();
    var h = '<h2 class="game-title">';
    h += "Pronunciation History</h2>";

    if (history.length === 0) {
      h += '<p style="text-align:center;';
      h += 'color:rgba(255,255,255,0.5);padding:40px">';
      h += "No pronunciation history yet. ";
      h += "Try the Pronunciation Game first!</p>";
      container.innerHTML = h;
      return;
    }

    // Summary stats
    var stats = computeHistoryStats(history);
    h += '<div class="stats-panel" style="margin-bottom:20px">';
    h += renderStatCard(stats.totalAttempts, "Total Attempts");
    h += renderStatCard(stats.avgScore + "%", "Avg Score");
    h += renderStatCard(
      scoreToStars(stats.avgScore) || "--",
      "Rating"
    );
    h += renderStatCard(stats.bestScore + "%", "Best Score");
    h += "</div>";

    // Improvement trend
    if (stats.trend !== 0) {
      var trendColor = stats.trend > 0
        ? "var(--neon-cyan)"
        : "#ff4757";
      var trendSign = stats.trend > 0 ? "+" : "";
      h += '<div style="text-align:center;margin-bottom:20px">';
      h += '<span style="color:' + trendColor + ";";
      h += 'font-size:1.1rem">Trend: ';
      h += trendSign + stats.trend + "% improvement";
      h += "</span></div>";
    }

    // Score chart (canvas)
    h += '<div style="margin-bottom:25px">';
    h += '<h3 style="color:var(--neon-pink);';
    h += 'margin-bottom:10px;text-align:center">';
    h += "Score History</h3>";
    h += '<canvas id="historyChart" width="400" height="180"';
    h += ' style="display:block;margin:0 auto;';
    h += "border-radius:10px;background:rgba(10,10,26,0.5);";
    h += 'border:1px solid rgba(157,78,221,0.3)"></canvas>';
    h += "</div>";

    // Hardest words TOP 10
    h += renderHardestWords(stats.hardestWords);

    // Recent entries
    h += renderRecentEntries(history);

    // Clear history button
    h += '<div style="text-align:center;margin-top:20px">';
    h += '<button id="clearHistoryBtn"';
    h += ' class="game-btn secondary"';
    h += ' style="padding:10px 20px;font-size:0.85rem">';
    h += "Clear History</button></div>";

    container.innerHTML = h;
    drawHistoryChart(history);
    bindHistoryEvents(container);
  }

  /**
   * Compute aggregate statistics from history data.
   * @param {Array.<Object>} history - History entries
   * @returns {Object} Computed statistics
   */
  function computeHistoryStats(history) {
    var total = history.length;
    var sum = 0;
    var best = 0;
    var wordScores = {};

    for (var i = 0; i < history.length; i++) {
      var entry = history[i];
      sum += entry.score;
      if (entry.score > best) best = entry.score;
      if (!wordScores[entry.word]) {
        wordScores[entry.word] = {sum: 0, count: 0};
      }
      wordScores[entry.word].sum += entry.score;
      wordScores[entry.word].count++;
    }

    // Hardest words by average score
    var hardest = [];
    for (var w in wordScores) {
      if (wordScores.hasOwnProperty(w)) {
        var avg = wordScores[w].sum / wordScores[w].count;
        hardest.push({word: w, avg: Math.round(avg)});
      }
    }
    hardest.sort(function (a, b) { return a.avg - b.avg; });
    hardest = hardest.slice(0, 10);

    // Improvement trend (last 10 vs first 10)
    var trend = 0;
    if (total >= 20) {
      var firstSum = 0;
      var lastSum = 0;
      for (var f = 0; f < 10; f++) firstSum += history[f].score;
      for (var l = total - 10; l < total; l++) {
        lastSum += history[l].score;
      }
      trend = Math.round((lastSum - firstSum) / 10);
    }

    return {
      totalAttempts: total,
      avgScore: Math.round(sum / total),
      bestScore: best,
      hardestWords: hardest,
      trend: trend
    };
  }

  /**
   * Render a single stat card.
   * @param {string|number} value - Display value
   * @param {string} label - Display label
   * @returns {string} HTML string
   */
  function renderStatCard(value, label) {
    var h = '<div class="stats-card">';
    h += '<div class="stats-card-value">';
    h += escapeHtml(String(value)) + "</div>";
    h += '<div class="stats-card-label">';
    h += escapeHtml(label) + "</div></div>";
    return h;
  }

  /**
   * Render the hardest words TOP 10 list.
   * @param {Array.<{word:string, avg:number}>} hardest - Hardest words
   * @returns {string} HTML string
   */
  function renderHardestWords(hardest) {
    if (hardest.length === 0) return "";
    var h = '<div style="margin-bottom:20px">';
    h += '<h3 style="color:var(--neon-pink);';
    h += 'margin-bottom:10px;text-align:center">';
    h += "Hardest Words TOP 10</h3>";
    h += '<div style="display:grid;';
    h += "grid-template-columns:repeat(auto-fit,minmax(150px,1fr));";
    h += 'gap:8px">';
    for (var i = 0; i < hardest.length; i++) {
      var item = hardest[i];
      var color = scoreToColor(item.avg);
      h += '<div style="background:var(--glass);';
      h += "border:1px solid rgba(157,78,221,0.3);";
      h += "border-radius:10px;padding:10px;";
      h += 'text-align:center">';
      h += '<div style="font-size:1.2rem">';
      h += escapeHtml(item.word) + "</div>";
      h += '<div style="color:' + color + ";";
      h += 'font-size:0.9rem">Avg: ';
      h += item.avg + "%</div></div>";
    }
    h += "</div></div>";
    return h;
  }

  /**
   * Render the most recent history entries.
   * @param {Array.<Object>} history - History entries
   * @returns {string} HTML string
   */
  function renderRecentEntries(history) {
    var recent = history.slice(-10).reverse();
    var h = '<div style="margin-bottom:15px">';
    h += '<h3 style="color:var(--neon-pink);';
    h += 'margin-bottom:10px;text-align:center">';
    h += "Recent Attempts</h3>";
    for (var i = 0; i < recent.length; i++) {
      var entry = recent[i];
      var color = scoreToColor(entry.score);
      var dateStr = formatDate(entry.date);
      h += '<div style="background:var(--glass);';
      h += "border-radius:8px;padding:8px 12px;";
      h += "margin-bottom:6px;display:flex;";
      h += 'justify-content:space-between;align-items:center">';
      h += '<span style="font-size:1.1rem">';
      h += escapeHtml(entry.word) + "</span>";
      h += '<div style="text-align:right">';
      h += '<span style="color:' + color + ";";
      h += 'font-weight:bold">' + entry.score + "%</span>";
      h += '<br><span style="color:rgba(255,255,255,0.4);';
      h += 'font-size:0.75rem">';
      h += escapeHtml(dateStr) + "</span>";
      h += "</div></div>";
    }
    h += "</div>";
    return h;
  }

  /**
   * Format an ISO date string for display.
   * @param {string} isoStr - ISO date string
   * @returns {string} Formatted date string
   */
  function formatDate(isoStr) {
    try {
      var d = new Date(isoStr);
      return d.toLocaleDateString() + " " +
        d.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        });
    } catch (e) {
      return "";
    }
  }

  /**
   * Draw the score history chart on a canvas.
   * Uses Chart.js if available, otherwise draws a simple chart.
   * @param {Array.<Object>} history - History entries
   */
  function drawHistoryChart(history) {
    var canvas = document.getElementById("historyChart");
    if (!canvas) return;

    // Use Chart.js if available
    if (typeof Chart !== "undefined") {
      drawWithChartJS(canvas, history);
      return;
    }

    // Simple canvas fallback
    drawSimpleChart(canvas, history);
  }

  /**
   * Draw chart using Chart.js library.
   * @param {HTMLCanvasElement} canvas - Target canvas
   * @param {Array.<Object>} history - History entries
   */
  function drawWithChartJS(canvas, history) {
    var recent = history.slice(-30);
    var labels = [];
    var data = [];
    for (var i = 0; i < recent.length; i++) {
      labels.push("#" + (i + 1));
      data.push(recent[i].score);
    }
    new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Score",
          data: data,
          borderColor: "#ff2d95",
          backgroundColor: "rgba(255,45,149,0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: "#ff2d95"
        }]
      },
      options: {
        responsive: false,
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {color: "rgba(255,255,255,0.5)"},
            grid: {color: "rgba(255,255,255,0.1)"}
          },
          x: {
            ticks: {color: "rgba(255,255,255,0.5)"},
            grid: {color: "rgba(255,255,255,0.05)"}
          }
        },
        plugins: {
          legend: {display: false}
        }
      }
    });
  }

  /**
   * Draw a simple bar chart fallback without Chart.js.
   * @param {HTMLCanvasElement} canvas - Target canvas
   * @param {Array.<Object>} history - History entries
   */
  function drawSimpleChart(canvas, history) {
    var ctx = canvas.getContext("2d");
    var W = canvas.width;
    var H = canvas.height;
    var recent = history.slice(-30);
    var barW = Math.max(4, (W - 20) / recent.length - 2);
    var pad = 10;

    ctx.fillStyle = "rgba(10, 10, 26, 0.8)";
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < recent.length; i++) {
      var score = recent[i].score;
      var barH = (score / 100) * (H - pad * 2);
      var x = pad + i * (barW + 2);
      var y = H - pad - barH;

      var gradient = ctx.createLinearGradient(x, y, x, H - pad);
      gradient.addColorStop(0, "#ff2d95");
      gradient.addColorStop(1, "#9d4edd");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barW, barH);
    }
  }

  /**
   * Bind event listeners for history view.
   * @param {HTMLElement} container - Target container element
   */
  function bindHistoryEvents(container) {
    var clearBtn = document.getElementById("clearHistoryBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        saveHistory([]);
        showPronunciationHistory(container);
        showToast("Pronunciation history cleared.");
      });
    }
  }

  // ============================================================
  // Global Exposure
  // ============================================================

  window.showPronunciationGame = showPronunciationGame;
  window.showPronunciationChallenge = showPronunciationChallenge;
  window.showPronunciationHistory = showPronunciationHistory;
  window.calculatePronunciationScore = calculatePronunciationScore;
  window.isSpeechRecognitionSupported = isSpeechRecognitionSupported;

  window.PronunciationSystem = {
    showGame: showPronunciationGame,
    showChallenge: showPronunciationChallenge,
    showHistory: showPronunciationHistory,
    calcScore: calculatePronunciationScore,
    isSupported: isSpeechRecognitionSupported,
    getWordsForLevel: getWordsForLevel,
    getAllWords: getAllPronunciationWords
  };

})();
