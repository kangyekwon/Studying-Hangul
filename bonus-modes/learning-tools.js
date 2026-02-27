/**
 * learning-tools.js
 * Study tips, conversation practice, K-Drama vocabulary,
 * PDF export, and share screen utilities
 *
 * @module LearningTools
 * @requires game-data.js (defaultKoreanStudyTips, defaultConversationStarters, defaultDramaVocabulary)
 * @requires game-engine.js (global functions: shuffle, addXP, addCombo, escapeHtml, etc.)
 * @requires jsPDF (optional, for PDF generation)
 * @requires qrcode (optional, for QR code generation)
 * @requires html2canvas (optional, for screenshot feature)
 */

// ============================================================
// 1. STUDY TIPS (showStudyTips)
// ============================================================

/**
 * Study tips browsing state
 * @private
 */
var tipIndex = 0;
var tipCategory = "all";
var tipFavorites = [];

/**
 * Gets study tips pool from global data or fallback
 * @private
 * @returns {Array<Object>} Study tips array
 */
function getTipsPool() {
    return (typeof koreanStudyTips !== "undefined" && koreanStudyTips.length > 0)
        ? koreanStudyTips
        : defaultKoreanStudyTips;
}

/**
 * Gets tips filtered by current category
 * @private
 * @returns {Array<Object>} Filtered tips array
 */
function getFilteredTips() {
    var pool = getTipsPool();
    if (tipCategory === "all") return pool;
    var filtered = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].category === tipCategory) filtered.push(pool[i]);
    }
    return filtered.length > 0 ? filtered : pool;
}

/**
 * Initializes and shows the study tips viewer
 * @public
 * @param {HTMLElement} container - Container element
 * @example
 * showStudyTips(document.getElementById('gameContainer'));
 */
function showStudyTips(container) {
    tipIndex = 0;
    tipCategory = "all";
    try {
        var saved = localStorage.getItem('kpop_tip_favorites');
        if (saved) tipFavorites = JSON.parse(saved);
    } catch (e) { tipFavorites = []; }
    renderStudyTips(container);
}

/**
 * Builds category filter buttons HTML
 * @private
 * @returns {string} HTML markup for category buttons
 */
function buildCategoryButtons() {
    var categories = ["all", "pronunciation", "grammar", "vocabulary", "writing", "culture"];
    var h = '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:15px">';
    for (var i = 0; i < categories.length; i++) {
        var catLabel = categories[i].charAt(0).toUpperCase() + categories[i].slice(1);
        h += '<button class="cat-btn' + (tipCategory === categories[i] ? ' active' : '') + '" data-cat="' + categories[i] + '">' + catLabel + '</button>';
    }
    h += '</div>';
    return h;
}

/**
 * Builds a single tip card HTML
 * @private
 * @param {Object} tip - Tip object
 * @param {boolean} isFav - Whether tip is favorited
 * @returns {string} HTML markup for tip card
 */
function buildTipCard(tip, isFav) {
    var h = '<div style="background:var(--glass);padding:25px;border-radius:15px;border:1px solid rgba(157,78,221,0.3);margin-bottom:15px;min-height:150px">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
    h += '<span style="background:rgba(0,212,255,0.2);color:var(--neon-cyan);padding:4px 12px;border-radius:10px;font-size:0.75rem">' + escapeHtml(tip.category) + '</span>';
    h += '<button class="game-btn secondary" id="tipFavBtn" style="padding:4px 12px;font-size:0.85rem">' + (isFav ? '&#9733; Saved' : '&#9734; Save') + '</button>';
    h += '</div>';
    h += '<h3 style="color:var(--neon-pink);margin-bottom:10px;font-size:1.2rem">' + escapeHtml(tip.title) + '</h3>';
    h += '<p style="color:rgba(255,255,255,0.8);line-height:1.6">' + escapeHtml(tip.content) + '</p>';
    h += '</div>';
    return h;
}

/**
 * Renders the study tips viewer UI
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderStudyTips(container) {
    var tips = getFilteredTips();
    if (tipIndex >= tips.length) tipIndex = 0;
    if (tipIndex < 0) tipIndex = tips.length - 1;
    var tip = tips[tipIndex];
    var isFav = tipFavorites.indexOf(tip.title) !== -1;

    var h = '<h2 class="game-title">Study Tips</h2>';
    h += buildCategoryButtons();
    h += '<div style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:10px;font-size:0.85rem">' + (tipIndex + 1) + ' / ' + tips.length + '</div>';
    h += buildTipCard(tip, isFav);
    h += '<div style="display:flex;gap:10px;justify-content:center">';
    h += '<button class="game-btn secondary" id="tipPrevBtn" style="padding:12px 24px">&#9664; Prev</button>';
    h += '<button class="game-btn secondary" id="tipNextBtn" style="padding:12px 24px">Next &#9654;</button>';
    h += '</div>';
    h += '<div class="game-controls" style="margin-top:15px">';
    h += '<button class="game-btn secondary" id="tipBackBtn">Back</button>';
    h += '</div>';
    container.innerHTML = h;

    attachTipHandlers(container, tip);
}

/**
 * Attaches event handlers for study tips navigation
 * @private
 * @param {HTMLElement} container - Container element
 * @param {Object} tip - Current tip object
 */
function attachTipHandlers(container, tip) {
    document.getElementById('tipPrevBtn').onclick = function () {
        tipIndex--;
        renderStudyTips(container);
    };
    document.getElementById('tipNextBtn').onclick = function () {
        tipIndex++;
        renderStudyTips(container);
    };
    document.getElementById('tipFavBtn').onclick = function () {
        var idx = tipFavorites.indexOf(tip.title);
        if (idx === -1) { tipFavorites.push(tip.title); } else { tipFavorites.splice(idx, 1); }
        try { localStorage.setItem('kpop_tip_favorites', JSON.stringify(tipFavorites)); } catch (e) {}
        renderStudyTips(container);
    };
    document.getElementById('tipBackBtn').onclick = function () {
        if (typeof showMode === "function") showMode(gameState.currentMode);
    };
    var catBtns = container.querySelectorAll('.cat-btn');
    for (var j = 0; j < catBtns.length; j++) {
        catBtns[j].onclick = function () {
            tipCategory = this.getAttribute('data-cat');
            tipIndex = 0;
            renderStudyTips(container);
        };
    }
}


// ============================================================
// 2. CONVERSATION PRACTICE (showConversationPractice)
// ============================================================

/**
 * Conversation practice browsing index
 * @private
 */
var convIndex = 0;

/**
 * Gets conversation pool from global data or fallback
 * @private
 * @returns {Array<Object>} Conversation starters array
 */
function getConvPool() {
    return (typeof conversationStarters !== "undefined" && conversationStarters.length > 0)
        ? conversationStarters
        : defaultConversationStarters;
}

/**
 * Initializes and starts conversation practice
 * @public
 * @param {HTMLElement} container - Container element
 * @example
 * showConversationPractice(document.getElementById('gameContainer'));
 */
function showConversationPractice(container) {
    convIndex = 0;
    gameState.gamesPlayed++;
    saveProgress();
    renderConversation(container);
}

/**
 * Builds conversation phrase card HTML
 * @private
 * @param {Object} conv - Conversation object
 * @returns {string} HTML markup for conversation card
 */
function buildConversationCard(conv) {
    var h = '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(0,212,255,0.1));padding:25px;border-radius:15px;margin-bottom:20px;border:1px solid rgba(157,78,221,0.3)">';
    h += '<div style="font-size:0.8rem;color:var(--neon-cyan);margin-bottom:10px">' + escapeHtml(conv.context) + '</div>';
    h += '<div style="font-size:1.8rem;color:var(--neon-pink);margin-bottom:8px;line-height:1.4">' + escapeHtml(conv.korean) + '</div>';
    h += '<div style="color:var(--neon-cyan);margin-bottom:5px">' + escapeHtml(conv.romanization) + '</div>';
    h += '<div style="color:rgba(255,255,255,0.7)">' + escapeHtml(conv.english) + '</div>';
    h += '</div>';
    return h;
}

/**
 * Checks whether the Speech Recognition API is available
 * @private
 * @returns {boolean} Whether speech recognition is supported
 */
function hasSpeechRecognition() {
    return (typeof webkitSpeechRecognition !== "undefined" || typeof SpeechRecognition !== "undefined");
}

/**
 * Builds conversation action buttons HTML
 * @private
 * @returns {string} HTML markup for action buttons
 */
function buildConversationButtons() {
    var h = '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:15px">';
    h += '<button class="game-btn" id="convListenBtn" style="padding:12px 24px">&#128266; Listen</button>';
    if (hasSpeechRecognition()) {
        h += '<button class="game-btn secondary" id="convSpeakBtn" style="padding:12px 24px">&#127908; Practice Speaking</button>';
    }
    h += '</div>';
    h += '<div id="convResult" style="margin-bottom:15px;text-align:center"></div>';
    h += '<div style="display:flex;gap:10px;justify-content:center">';
    h += '<button class="game-btn secondary" id="convPrevBtn" style="padding:12px 24px">&#9664; Prev</button>';
    h += '<button class="game-btn secondary" id="convNextBtn" style="padding:12px 24px">Next &#9654;</button>';
    h += '</div>';
    h += '<div class="game-controls" style="margin-top:15px">';
    h += '<button class="game-btn secondary" id="convBackBtn">Back</button>';
    h += '</div>';
    return h;
}

/**
 * Builds speech recognition result HTML
 * @private
 * @param {string} transcript - Recognized text
 * @param {number} confidence - Confidence percentage
 * @param {boolean} match - Whether transcript matches target
 * @returns {string} HTML markup for result display
 */
function buildSpeechResult(transcript, confidence, match) {
    var matchColor = match ? "var(--neon-cyan)" : "var(--gold)";
    return '<div style="background:var(--glass);padding:15px;border-radius:12px">' +
        '<div style="color:' + matchColor + ';font-size:1.1rem;margin-bottom:5px">' + (match ? 'Great match!' : 'You said:') + '</div>' +
        '<div style="color:var(--neon-pink);font-size:1.2rem">' + escapeHtml(transcript) + '</div>' +
        '<div style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin-top:4px">Confidence: ' + confidence + '%</div></div>';
}

/**
 * Sets up speech recognition for conversation practice
 * @private
 * @param {Object} conv - Current conversation object
 */
function setupSpeechRecognition(conv) {
    var speakBtn = document.getElementById('convSpeakBtn');
    if (!hasSpeechRecognition() || !speakBtn) return;

    speakBtn.onclick = function () {
        var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        var rec = new SpeechRec();
        rec.lang = 'ko-KR';
        rec.interimResults = false;
        rec.maxAlternatives = 3;
        var btn = document.getElementById('convSpeakBtn');
        if (btn) { btn.textContent = 'Listening...'; btn.disabled = true; }
        rec.onresult = function (e) {
            var transcript = e.results[0][0].transcript;
            var confidence = Math.round(e.results[0][0].confidence * 100);
            var resultDiv = document.getElementById('convResult');
            if (resultDiv) {
                var match = (transcript.replace(/\s/g, '') === conv.korean.replace(/\s/g, ''));
                resultDiv.innerHTML = buildSpeechResult(transcript, confidence, match);
                if (match) { SoundEngine.correct(); addXP(20); }
            }
            if (btn) { btn.textContent = 'Practice Speaking'; btn.disabled = false; }
        };
        rec.onerror = function () {
            var resultDiv = document.getElementById('convResult');
            if (resultDiv) {
                resultDiv.innerHTML = '<div style="color:rgba(255,75,75,0.8)">Could not recognize speech. Try again.</div>';
            }
            if (btn) { btn.textContent = 'Practice Speaking'; btn.disabled = false; }
        };
        rec.onend = function () {
            if (btn) { btn.textContent = 'Practice Speaking'; btn.disabled = false; }
        };
        rec.start();
    };
}

/**
 * Renders the conversation practice UI
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderConversation(container) {
    var pool = getConvPool();
    if (convIndex >= pool.length) convIndex = 0;
    if (convIndex < 0) convIndex = pool.length - 1;
    var conv = pool[convIndex];

    var h = '<h2 class="game-title">Conversation Practice</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:10px;font-size:0.85rem">' + (convIndex + 1) + ' / ' + pool.length + '</p>';
    h += buildConversationCard(conv);
    h += buildConversationButtons();
    container.innerHTML = h;

    document.getElementById('convListenBtn').onclick = function () { speakKorean(conv.korean); };
    document.getElementById('convPrevBtn').onclick = function () { convIndex--; renderConversation(container); };
    document.getElementById('convNextBtn').onclick = function () { convIndex++; renderConversation(container); };
    document.getElementById('convBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
    setupSpeechRecognition(conv);
}


// ============================================================
// 3. DRAMA VOCAB (showDramaVocab)
// ============================================================

/**
 * Drama vocab quiz game state
 * @private
 */
var dramaScore = 0;
var dramaRound = 0;
var dramaTotal = 10;
var dramaCurrent = null;
var dramaAnswered = false;

/**
 * Gets drama vocabulary pool from global data or fallback
 * @private
 * @returns {Array<Object>} Drama vocabulary array
 */
function getDramaPool() {
    return (typeof dramaVocabulary !== "undefined" && dramaVocabulary.length > 0)
        ? dramaVocabulary
        : defaultDramaVocabulary;
}

/**
 * Initializes and starts the drama vocab quiz
 * @public
 * @param {HTMLElement} container - Container element
 * @example
 * showDramaVocab(document.getElementById('gameContainer'));
 */
function showDramaVocab(container) {
    dramaScore = 0;
    dramaRound = 0;
    dramaAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextDramaRound(container);
}

/**
 * Advances to next drama vocab round
 * @private
 * @param {HTMLElement} container - Container element
 */
function nextDramaRound(container) {
    if (dramaRound >= dramaTotal) {
        renderDramaEnd(container);
        return;
    }
    var pool = getDramaPool();
    var available = shuffle(pool);
    dramaCurrent = available[dramaRound % available.length];
    dramaAnswered = false;
    dramaRound++;
    renderDramaQuestion(container);
}

/**
 * Builds the TV screen frame HTML for drama context
 * @private
 * @param {Object} q - Current drama vocab question
 * @returns {string} HTML markup for TV frame
 */
function buildDramaFrame(q) {
    var h = '<div style="background:#111;border:4px solid #444;border-radius:15px;padding:25px;margin-bottom:20px;position:relative;box-shadow:0 0 30px rgba(0,0,0,0.5)">';
    h += '<div style="position:absolute;top:8px;left:12px;width:8px;height:8px;border-radius:50%;background:#ff4444"></div>';
    h += '<div style="position:absolute;top:8px;right:12px;font-size:0.65rem;color:rgba(255,255,255,0.3)">LIVE</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:8px;text-align:center">K-Drama Scene</div>';
    h += '<div style="font-size:1rem;color:rgba(255,255,255,0.7);text-align:center;margin-bottom:8px">' + escapeHtml(q.context) + '</div>';
    h += '<div style="font-size:1.1rem;color:var(--neon-cyan);text-align:center">' + escapeHtml(q.english) + '</div>';
    h += '</div>';
    return h;
}

/**
 * Builds drama quiz option HTML for a single option
 * @private
 * @param {Object} option - Drama vocab option object
 * @returns {string} HTML markup for one quiz option
 */
function buildDramaOption(option) {
    var h = '<div class="quiz-option" data-answer="' + escapeHtml(option.korean) + '">';
    h += '<div style="font-size:1.3rem;color:var(--neon-pink)">' + escapeHtml(option.korean) + '</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5)">' + escapeHtml(option.romanization) + '</div>';
    h += '</div>';
    return h;
}

/**
 * Renders the drama vocab question UI
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderDramaQuestion(container) {
    var q = dramaCurrent;
    var pool = getDramaPool();
    var wrong = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].korean !== q.korean) wrong.push(pool[i]);
    }
    wrong = shuffle(wrong).slice(0, 3);
    var allOptions = shuffle([q].concat(wrong));

    var h = '<h2 class="game-title">K-Drama Vocab</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + dramaRound + ' / ' + dramaTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((dramaRound / dramaTotal) * 100) + '%"></div></div>';
    h += buildDramaFrame(q);
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">Which Korean term matches this?</p>';
    h += '<div class="quiz-options">';
    for (var j = 0; j < allOptions.length; j++) {
        h += buildDramaOption(allOptions[j]);
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:10px;color:var(--gold)">Score: ' + dramaScore + '</div>';
    container.innerHTML = h;

    attachDramaHandlers(container, q);
}

/**
 * Attaches event handlers to drama quiz options
 * @private
 * @param {HTMLElement} container - Container element
 * @param {Object} q - Current question object
 */
function attachDramaHandlers(container, q) {
    var opts = container.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (dramaAnswered) return;
            dramaAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === dramaCurrent.korean);
            if (isCorrect) {
                this.classList.add('correct');
                dramaScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                var all = container.querySelectorAll('.quiz-option');
                for (var m = 0; m < all.length; m++) {
                    if (all[m].getAttribute('data-answer') === dramaCurrent.korean) {
                        all[m].classList.add('correct');
                    }
                }
            }
            if (q.dramas) {
                var info = document.createElement('div');
                info.style.cssText = 'margin-top:12px;background:var(--glass);padding:12px;border-radius:12px;text-align:center';
                info.innerHTML = '<div style="color:var(--neon-cyan);font-size:0.85rem;margin-bottom:4px">Featured in:</div>' +
                    '<div style="color:rgba(255,255,255,0.7)">' + escapeHtml(q.dramas) + '</div>';
                container.appendChild(info);
            }
            setTimeout(function () { nextDramaRound(container); }, 2500);
        };
    }
}

/**
 * Renders drama vocab quiz completion screen
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderDramaEnd(container) {
    var pct = Math.round((dramaScore / (dramaTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(dramaScore / 10);
    var h = '<h2 class="game-title">K-Drama Vocab Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#127909;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + dramaScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="dramaAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="dramaBackBtn">Back</button>';
    h += '</div></div>';
    container.innerHTML = h;

    document.getElementById('dramaAgainBtn').onclick = function () {
        showDramaVocab(container);
    };
    document.getElementById('dramaBackBtn').onclick = function () {
        if (typeof showMode === "function") showMode(gameState.currentMode);
    };
}


// ============================================================
// 4. PDF EXPORT (showPDFExport)
// ============================================================

/**
 * Checks whether jsPDF is available
 * @private
 * @returns {boolean} Whether jsPDF is loaded
 */
function hasJsPDF() {
    return (typeof jsPDF !== "undefined" ||
        (typeof window.jspdf !== "undefined" && typeof window.jspdf.jsPDF !== "undefined"));
}

/**
 * Builds export option buttons HTML
 * @private
 * @returns {string} HTML markup for export buttons
 */
function buildExportButtons() {
    var h = '<div style="display:grid;gap:12px;max-width:400px;margin:0 auto 20px">';
    h += '<button class="game-btn" id="pdfCollectedBtn" style="text-align:left;padding:18px 24px">';
    h += '<div style="font-size:1.1rem">My Vocabulary</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">All collected words</div></button>';
    h += '<button class="game-btn secondary" id="pdfWeakBtn" style="text-align:left;padding:18px 24px">';
    h += '<div style="font-size:1.1rem">Weak Words</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">Words you need to practice more</div></button>';
    h += '<button class="game-btn secondary" id="pdfCategoryBtn" style="text-align:left;padding:18px 24px">';
    h += '<div style="font-size:1.1rem">Category Export</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">Export current category words</div></button>';
    h += '</div>';
    return h;
}

/**
 * Initializes and shows the PDF export screen
 * @public
 * @param {HTMLElement} container - Container element
 * @example
 * showPDFExport(document.getElementById('gameContainer'));
 */
function showPDFExport(container) {
    var h = '<h2 class="game-title">Export Study Sheet</h2>';
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<p style="color:rgba(255,255,255,0.6);margin-bottom:15px">Generate a printable study sheet of your vocabulary.</p>';
    h += '</div>';
    h += buildExportButtons();
    if (!hasJsPDF()) {
        h += '<p style="text-align:center;color:rgba(255,255,255,0.4);font-size:0.85rem;margin-bottom:15px">jsPDF not loaded. Will generate printable HTML instead.</p>';
    }
    h += '<div id="pdfPreview" style="margin-bottom:15px"></div>';
    h += '<div class="game-controls"><button class="game-btn secondary" id="pdfBackBtn">Back</button></div>';
    container.innerHTML = h;

    document.getElementById('pdfCollectedBtn').onclick = function () { generateExport(container, 'collected'); };
    document.getElementById('pdfWeakBtn').onclick = function () { generateExport(container, 'weak'); };
    document.getElementById('pdfCategoryBtn').onclick = function () { generateExport(container, 'category'); };
    document.getElementById('pdfBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}

/**
 * Gets words for export based on type
 * @private
 * @param {string} type - Export type ('collected', 'weak', or 'category')
 * @returns {Array<Object>} Words to export (max 50)
 */
function getExportWords(type) {
    var words = [];
    if (type === 'collected') {
        words = getCollectedWords();
    } else if (type === 'weak') {
        words = getWeakWords();
    } else {
        words = getWords();
    }
    return words.slice(0, 50);
}

/**
 * Gets all collected words from word database
 * @private
 * @returns {Array<Object>} Collected words array
 */
function getCollectedWords() {
    var collected = gameState.collectedWords || {};
    var allWords = [];
    for (var cat in wordDatabase) {
        allWords = allWords.concat(wordDatabase[cat]);
    }
    var result = [];
    for (var i = 0; i < allWords.length; i++) {
        if (collected[allWords[i].korean]) result.push(allWords[i]);
    }
    return result;
}

/**
 * Gets words the user has not yet collected
 * @private
 * @returns {Array<Object>} Weak words array
 */
function getWeakWords() {
    var allW = getWords();
    var coll = gameState.collectedWords || {};
    var weak = [];
    for (var j = 0; j < allW.length; j++) {
        if (!coll[allW[j].korean]) weak.push(allW[j]);
    }
    return weak.length > 0 ? weak : allW.slice(0, 20);
}

/**
 * Generates a PDF or printable HTML export
 * @private
 * @param {HTMLElement} container - Container element
 * @param {string} type - Export type
 */
function generateExport(container, type) {
    var words = getExportWords(type);
    if (hasJsPDF() && words.length > 0) {
        try {
            generatePDF(words);
        } catch (e) {
            generatePrintableHTML(container, words);
        }
    } else {
        generatePrintableHTML(container, words);
    }
}

/**
 * Generates and downloads a PDF study sheet
 * @private
 * @param {Array<Object>} words - Words to include
 */
function generatePDF(words) {
    var PDF = (typeof jsPDF !== "undefined") ? jsPDF : window.jspdf.jsPDF;
    var doc = new PDF();
    doc.setFontSize(18);
    doc.text('Korean Study Sheet', 20, 20);
    doc.setFontSize(10);
    doc.text('Generated: ' + new Date().toLocaleDateString(), 20, 28);
    var y = 40;
    doc.setFontSize(11);
    for (var i = 0; i < words.length; i++) {
        if (y > 270) { doc.addPage(); y = 20; }
        var w = words[i];
        doc.text((i + 1) + '. ' + (w.korean || '') + ' (' + (w.romanization || '') + ') - ' + (w.english || ''), 20, y);
        y += 8;
    }
    doc.save('korean-study-sheet.pdf');
    if (typeof showToast === "function") showToast('PDF downloaded!');
}

/**
 * Builds printable table rows HTML
 * @private
 * @param {Array<Object>} words - Words to display
 * @returns {string} HTML markup for table rows
 */
function buildPrintableRows(words) {
    var h = '';
    for (var i = 0; i < words.length; i++) {
        var w = words[i];
        h += '<tr><td style="padding:4px 6px;border:1px solid #ddd">' + (i + 1) + '</td>';
        h += '<td style="padding:4px 6px;border:1px solid #ddd">' + escapeHtml(w.korean || '') + '</td>';
        h += '<td style="padding:4px 6px;border:1px solid #ddd">' + escapeHtml(w.romanization || '') + '</td>';
        h += '<td style="padding:4px 6px;border:1px solid #ddd">' + escapeHtml(w.english || '') + '</td></tr>';
    }
    return h;
}

/**
 * Generates printable HTML as fallback for PDF
 * @private
 * @param {HTMLElement} container - Container element
 * @param {Array<Object>} words - Words to display
 */
function generatePrintableHTML(container, words) {
    var preview = document.getElementById('pdfPreview');
    if (!preview) return;
    var h = '<div style="background:#fff;color:#000;padding:20px;border-radius:12px;max-height:400px;overflow-y:auto">';
    h += '<h3 style="margin-bottom:10px;color:#333">Korean Study Sheet</h3>';
    h += '<p style="font-size:0.8rem;color:#666;margin-bottom:15px">Generated: ' + new Date().toLocaleDateString() + '</p>';
    if (words.length === 0) {
        h += '<p style="color:#999">No words to export. Play some games to collect words!</p>';
    } else {
        h += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem">';
        h += '<tr style="background:#f0f0f0"><th style="padding:6px;border:1px solid #ddd;text-align:left">#</th><th style="padding:6px;border:1px solid #ddd;text-align:left">Korean</th><th style="padding:6px;border:1px solid #ddd;text-align:left">Romanization</th><th style="padding:6px;border:1px solid #ddd;text-align:left">English</th></tr>';
        h += buildPrintableRows(words);
        h += '</table>';
    }
    h += '<button onclick="window.print()" style="margin-top:12px;padding:8px 20px;background:#9d4edd;color:#fff;border:none;border-radius:8px;cursor:pointer">Print This Page</button>';
    h += '</div>';
    preview.innerHTML = h;
}


// ============================================================
// 5. SHARE SCREEN (showShareScreen)
// ============================================================

/**
 * Builds share stats card HTML
 * @private
 * @returns {string} HTML markup for share card
 */
function buildShareCard() {
    var totalWords = gameState.wordsLearned || 0;
    var level = gameState.level || 1;
    var streak = gameState.streak || 0;
    var games = gameState.gamesPlayed || 0;

    var h = '<div style="background:linear-gradient(135deg,rgba(255,45,149,0.2),rgba(157,78,221,0.2));padding:20px;border-radius:15px;margin-bottom:20px;text-align:center;border:1px solid rgba(255,45,149,0.3)" id="shareCard">';
    h += '<div style="font-size:1.5rem;color:var(--neon-pink);margin-bottom:5px">K-POP Korean Learner</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:15px 0">';
    h += '<div><div style="font-size:2rem;color:var(--gold)">' + level + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Level</div></div>';
    h += '<div><div style="font-size:2rem;color:var(--neon-cyan)">' + totalWords + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Words</div></div>';
    h += '<div><div style="font-size:2rem;color:var(--neon-pink)">' + games + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Games</div></div>';
    h += '</div>';
    if (streak > 0) {
        h += '<div style="color:var(--fire);font-size:0.9rem">&#128293; ' + streak + ' day streak!</div>';
    }
    h += '</div>';
    return h;
}

/**
 * Builds share action buttons HTML
 * @private
 * @returns {string} HTML markup for share buttons
 */
function buildShareButtons() {
    var hasShare = (typeof navigator.share === "function");
    var hasCanvas = (typeof html2canvas !== "undefined");

    var h = '<div style="display:grid;gap:10px;max-width:350px;margin:0 auto 20px">';
    if (hasShare) {
        h += '<button class="game-btn" id="shareWebBtn" style="padding:14px">&#128228; Share Score</button>';
    }
    h += '<button class="game-btn secondary" id="shareCopyBtn" style="padding:14px">&#128203; Copy Link</button>';
    if (hasCanvas) {
        h += '<button class="game-btn secondary" id="shareScreenshotBtn" style="padding:14px">&#128247; Screenshot</button>';
    }
    h += '</div>';
    return h;
}

/**
 * Generates QR code in the container
 * @private
 * @param {string} url - URL to encode
 */
function generateQRCode(url) {
    if (typeof qrcode === "undefined") return;
    try {
        var qr = qrcode(0, 'M');
        qr.addData(url);
        qr.make();
        var qrDiv = document.getElementById('qrContainer');
        if (qrDiv) qrDiv.innerHTML = qr.createImgTag(5);
    } catch (e) {}
}

/**
 * Sets up the clipboard copy functionality
 * @private
 * @param {string} url - URL to copy
 */
function setupCopyLink(url) {
    var copyBtn = document.getElementById('shareCopyBtn');
    if (!copyBtn) return;
    copyBtn.onclick = function () {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(function () {
                    var st = document.getElementById('shareStatus');
                    if (st) st.innerHTML = '<span style="color:var(--neon-cyan)">Link copied!</span>';
                });
            } else {
                copyFallback(url);
            }
        } catch (e) {}
    };
}

/**
 * Fallback clipboard copy using textarea element
 * @private
 * @param {string} url - URL to copy
 */
function copyFallback(url) {
    var ta = document.createElement('textarea');
    ta.value = url;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    var st = document.getElementById('shareStatus');
    if (st) st.innerHTML = '<span style="color:var(--neon-cyan)">Link copied!</span>';
}

/**
 * Sets up the Web Share API handler
 * @private
 * @param {string} shareText - Text to share
 * @param {string} url - URL to share
 */
function setupWebShare(shareText, url) {
    if (typeof navigator.share !== "function") return;
    var shareBtn = document.getElementById('shareWebBtn');
    if (!shareBtn) return;
    shareBtn.onclick = function () {
        navigator.share({
            title: 'K-POP Korean Learning',
            text: shareText,
            url: url
        }).catch(function () {});
    };
}

/**
 * Sets up the screenshot download handler
 * @private
 */
function setupScreenshot() {
    if (typeof html2canvas === "undefined") return;
    var ssBtn = document.getElementById('shareScreenshotBtn');
    if (!ssBtn) return;
    ssBtn.onclick = function () {
        var card = document.getElementById('shareCard');
        if (!card) return;
        html2canvas(card).then(function (canvas) {
            var link = document.createElement('a');
            link.download = 'korean-learning-stats.png';
            link.href = canvas.toDataURL();
            link.click();
            if (typeof showToast === "function") showToast('Screenshot saved!');
        }).catch(function () {});
    };
}

/**
 * Initializes and shows the share screen
 * @public
 * @param {HTMLElement} container - Container element
 * @example
 * showShareScreen(document.getElementById('gameContainer'));
 */
function showShareScreen(container) {
    var appUrl = window.location.href;
    var totalWords = gameState.wordsLearned || 0;
    var level = gameState.level || 1;
    var games = gameState.gamesPlayed || 0;
    var hasQR = (typeof qrcode !== "undefined");

    var shareText = 'I am learning Korean! Level ' + level + ', ' + totalWords + ' words learned, ' + games + ' games played! Try it too: ' + appUrl;

    var h = '<h2 class="game-title">Share</h2>';
    h += buildShareCard();
    if (hasQR) {
        h += '<div style="text-align:center;margin-bottom:20px">';
        h += '<div id="qrContainer" style="background:#fff;display:inline-block;padding:15px;border-radius:12px"></div>';
        h += '<p style="color:rgba(255,255,255,0.5);font-size:0.8rem;margin-top:8px">Scan to open the app</p></div>';
    }
    h += buildShareButtons();
    h += '<div id="shareStatus" style="text-align:center;margin-bottom:15px"></div>';
    h += '<div class="game-controls"><button class="game-btn secondary" id="shareBackBtn">Back</button></div>';
    container.innerHTML = h;

    generateQRCode(appUrl);
    setupWebShare(shareText, appUrl);
    setupCopyLink(appUrl);
    setupScreenshot();
    document.getElementById('shareBackBtn').onclick = function () {
        if (typeof showMode === "function") showMode(gameState.currentMode);
    };
}
