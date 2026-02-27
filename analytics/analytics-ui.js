/**
 * analytics-ui.js
 * Smart analytics dashboard and UI components
 *
 * @module AnalyticsUI
 * @requires analytics/word-analyzer.js (WordAnalyzer)
 * @requires analytics/learning-profile.js (LearningProfile)
 * @requires analytics/smart-recommender.js (SmartRecommender)
 * @requires analytics/data-combiner.js (DataCombiner)
 * @requires game-engine.js (global functions: escapeHtml, addXP, addCombo, etc.)
 */

/**
 * Smart session internal state
 * @private
 * @type {Object}
 */
var _smartSessionState = {
    words: [],
    index: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    phase: "flashcard",
    difficulty: 1,
    startTime: 0,
    answers: []
};

// -- Dashboard --

/**
 * Builds profile summary row HTML
 * @private
 * @param {Object} gs - Game state
 * @param {Object} velocity - Learning velocity data
 * @param {Object} streak - Study streak data
 * @returns {string} Profile row HTML
 */
function buildProfileRow(gs, velocity, streak) {
    var h = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px">';
    h += '<div class="stat-item"><div class="stat-value">' + (gs.level || 1) + '</div><div class="stat-label">LEVEL</div></div>';
    h += '<div class="stat-item"><div class="stat-value">' + (velocity.wordsPerDay || 0) + '</div><div class="stat-label">SESSIONS/DAY</div></div>';
    h += '<div class="stat-item"><div class="stat-value">' + streak.currentStreak + '</div><div class="stat-label">DAY STREAK</div></div>';
    h += buildTrendCell(velocity);
    h += '</div>';
    return h;
}

/**
 * Builds trend indicator cell
 * @private
 * @param {Object} velocity - Learning velocity data
 * @returns {string} Trend cell HTML
 */
function buildTrendCell(velocity) {
    var icon = velocity.trend === "accelerating" ? "^" : velocity.trend === "declining" ? "v" : "-";
    var color = velocity.trend === "accelerating" ? "var(--neon-cyan)" : velocity.trend === "declining" ? "var(--fire)" : "var(--gold)";
    var h = '<div class="stat-item"><div class="stat-value">';
    h += '<span style="color:' + color + '">' + icon + '</span>';
    h += '</div><div class="stat-label">' + (velocity.trend || "N/A").toUpperCase() + '</div></div>';
    return h;
}

/**
 * Builds daily challenge banner HTML
 * @private
 * @param {Object} challenge - Challenge data
 * @returns {string} Challenge banner HTML
 */
function buildChallengeBanner(challenge) {
    var h = '<div style="background:linear-gradient(135deg,rgba(255,107,53,0.2),rgba(255,215,0,0.2));border:1px solid rgba(255,215,0,0.3);padding:15px;border-radius:15px;margin-bottom:20px;cursor:pointer" id="smartChallengeBtn">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center">';
    h += '<div><div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:var(--gold);margin-bottom:5px">DAILY CHALLENGE</div>';
    h += '<div style="font-weight:bold">' + escapeHtml(challenge.title) + '</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">' + escapeHtml(challenge.description) + '</div></div>';
    h += '<div style="font-size:2rem;opacity:0.6">!</div></div></div>';
    return h;
}

/**
 * Builds word of the day card HTML
 * @private
 * @param {Object} wotd - Word of the day data
 * @returns {string} WOTD card HTML
 */
function buildWordOfTheDayCard(wotd) {
    if (!wotd || !wotd.word) return '';

    var h = '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(0,212,255,0.2));border:1px solid rgba(157,78,221,0.3);padding:20px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:var(--neon-purple);margin-bottom:8px">WORD OF THE DAY</div>';
    h += '<div style="display:flex;justify-content:space-between;align-items:center">';
    h += '<div>';
    h += '<div style="font-size:2rem;margin-bottom:5px">' + escapeHtml(wotd.word.korean) + '</div>';
    h += '<div style="color:rgba(255,255,255,0.7)">' + escapeHtml(wotd.word.romanization || "") + '</div>';
    h += '<div style="color:var(--neon-cyan)">' + escapeHtml(wotd.word.english) + '</div>';
    h += '</div>';
    h += '<div style="text-align:right">';
    h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Difficulty: ' + wotd.difficulty + '/10</div>';

    var ctxCount = 0;
    if (wotd.context) {
        ctxCount = wotd.context.proverbs.length + wotd.context.quotes.length + wotd.context.lyrics.length +
                   wotd.context.patterns.length + wotd.context.situations.length;
    }
    if (ctxCount > 0) {
        h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Found in ' + ctxCount + ' contexts</div>';
    }
    h += '<button class="game-btn" style="padding:8px 16px;font-size:0.8rem;margin-top:8px" id="smartExploreWotd">Explore</button>';
    h += '</div></div></div>';
    return h;
}

/**
 * Builds recommendations section HTML
 * @private
 * @param {Array<Object>} plan - Study plan items
 * @returns {string} Recommendations HTML
 */
function buildRecommendations(plan) {
    var h = '<div style="margin-bottom:20px">';
    h += '<div style="font-size:0.9rem;font-weight:bold;margin-bottom:10px;color:var(--neon-pink)">RECOMMENDATIONS</div>';

    for (var pi = 0; pi < Math.min(plan.length, 3); pi++) {
        var item = plan[pi];
        var prioColor = item.priority === "high" ? "var(--fire)" : item.priority === "medium" ? "var(--gold)" : "var(--neon-cyan)";
        h += '<div style="background:var(--glass);padding:12px 15px;border-radius:12px;margin-bottom:8px;border-left:3px solid ' + prioColor + ';cursor:pointer" class="smartRecItem" data-mode="' + (item.mode || "flashcards") + '">';
        h += '<div style="font-weight:bold;font-size:0.9rem">' + escapeHtml(item.action) + '</div>';
        h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">' + escapeHtml(item.reason) + '</div>';
        h += '</div>';
    }
    h += '</div>';
    return h;
}

/**
 * Builds category progress bars HTML
 * @private
 * @param {Array<Object>} strengths - Category strength data
 * @returns {string} Category bars HTML
 */
function buildCategoryBars(strengths) {
    var h = '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-size:0.9rem;font-weight:bold;margin-bottom:15px;color:var(--neon-cyan)">CATEGORY PROGRESS</div>';

    var displayCount = Math.min(strengths.length, 10);
    for (var ci = 0; ci < displayCount; ci++) {
        var cat = strengths[ci];
        var catLabel = cat.category;
        if (typeof categoryNames !== "undefined" && categoryNames[cat.category]) {
            catLabel = categoryNames[cat.category];
        }
        var barColor = cat.percentage >= 70 ? "var(--neon-cyan)" : cat.percentage >= 30 ? "var(--neon-purple)" : "var(--fire)";

        h += '<div style="margin-bottom:8px">';
        h += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:3px">';
        h += '<span>' + escapeHtml(catLabel) + '</span>';
        h += '<span style="color:rgba(255,255,255,0.5)">' + cat.collected + '/' + cat.total + ' (' + cat.percentage + '%)</span>';
        h += '</div>';
        h += '<div style="background:rgba(255,255,255,0.1);border-radius:5px;height:8px;overflow:hidden">';
        h += '<div style="height:100%;width:' + Math.max(2, cat.percentage) + '%;background:' + barColor + ';border-radius:5px;transition:width 0.5s"></div>';
        h += '</div></div>';
    }
    h += '</div>';
    return h;
}

/**
 * Attaches event handlers to the dashboard
 * @private
 * @param {HTMLElement} c - Container element
 * @param {Object} challenge - Challenge data
 * @param {Object} wotd - Word of the day data
 */
function attachDashboardHandlers(c, challenge, wotd) {
    document.getElementById("smartStartSession").onclick = function () {
        showSmartSession(c);
    };
    document.getElementById("smartShowExplorer").onclick = function () {
        showWordExplorer(c);
    };
    document.getElementById("smartShowWeekly").onclick = function () {
        showWeeklyReport(c);
    };
    document.getElementById("smartShowCrossQuiz").onclick = function () {
        _showCrossQuizUI(c);
    };
    document.getElementById("smartChallengeBtn").onclick = function () {
        if (challenge.mode && typeof showMode === "function") {
            showMode(challenge.mode);
        }
    };

    if (document.getElementById("smartExploreWotd") && wotd && wotd.word) {
        document.getElementById("smartExploreWotd").onclick = function () {
            _showWordDetail(c, wotd.word.korean);
        };
    }

    var recItems = document.querySelectorAll(".smartRecItem");
    for (var ri = 0; ri < recItems.length; ri++) {
        recItems[ri].onclick = function () {
            var mode = this.getAttribute("data-mode");
            if (mode && typeof showMode === "function") showMode(mode);
        };
    }
}

/**
 * Renders the main smart analytics dashboard
 * @public
 * @param {HTMLElement} c - Container element
 * @example
 * showSmartDashboard(document.getElementById('gameContainer'));
 */
function showSmartDashboard(c) {
    var gs = (typeof gameState !== "undefined") ? gameState : {};
    var velocity = LearningProfile.getLearningVelocity();
    var streak = LearningProfile.getStudyStreak();
    var strengths = LearningProfile.getStrengths();
    var plan = LearningProfile.getOptimalStudyPlan();
    var wotd = SmartRecommender.getWordOfTheDay();
    var challenge = SmartRecommender.getDailyChallenge();

    var h = '<h2 class="game-title">Smart Dashboard</h2>';
    h += buildProfileRow(gs, velocity, streak);
    h += buildChallengeBanner(challenge);
    h += buildWordOfTheDayCard(wotd);
    h += buildRecommendations(plan);
    h += buildCategoryBars(strengths);

    h += '<div class="game-controls" style="flex-direction:column;gap:10px">';
    h += '<button class="game-btn" id="smartStartSession" style="width:100%">Start Smart Session</button>';
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">';
    h += '<button class="game-btn secondary" id="smartShowExplorer" style="font-size:0.85rem">Word Explorer</button>';
    h += '<button class="game-btn secondary" id="smartShowWeekly" style="font-size:0.85rem">Weekly Report</button>';
    h += '<button class="game-btn secondary" id="smartShowCrossQuiz" style="font-size:0.85rem">Cross Quiz</button>';
    h += '</div></div>';

    c.innerHTML = h;
    attachDashboardHandlers(c, challenge, wotd);
}

// -- Smart Session --

/**
 * Initializes session state with recommended words
 * @private
 * @returns {void}
 */
function initSmartSessionState() {
    var recommended = SmartRecommender.getNextWords(10);
    _smartSessionState.words = [];
    for (var i = 0; i < recommended.length; i++) {
        _smartSessionState.words.push(recommended[i].word);
    }

    if (_smartSessionState.words.length === 0) {
        var allW = WordAnalyzer._getAllWords();
        for (var f = allW.length - 1; f > 0; f--) {
            var j = Math.floor(Math.random() * (f + 1));
            var t = allW[f]; allW[f] = allW[j]; allW[j] = t;
        }
        _smartSessionState.words = allW.slice(0, 10);
    }

    _smartSessionState.index = 0;
    _smartSessionState.score = 0;
    _smartSessionState.correct = 0;
    _smartSessionState.wrong = 0;
    _smartSessionState.streak = 0;
    _smartSessionState.difficulty = 1;
    _smartSessionState.startTime = Date.now();
    _smartSessionState.answers = [];
}

/**
 * Builds flashcard phase HTML
 * @private
 * @param {Object} word - Word object
 * @returns {string} Flashcard HTML
 */
function buildFlashcardPhase(word) {
    var h = '<div class="flashcard" id="smartFlashcard" style="cursor:pointer">';
    h += '<div class="flashcard-korean" style="font-size:3rem">' + escapeHtml(word.korean) + '</div>';
    h += '<div id="smartFlashHidden" style="display:none">';
    h += '<div class="flashcard-romanization">' + escapeHtml(word.romanization || "") + '</div>';
    h += '<div class="flashcard-english" style="font-size:1.3rem">' + escapeHtml(word.english) + '</div>';
    h += '</div>';
    h += '<div id="smartFlashPrompt" style="font-size:0.9rem;color:rgba(255,255,255,0.6);margin-top:15px">Tap to reveal</div>';
    h += '</div>';
    h += '<div class="game-controls" id="smartFlashBtns" style="display:none">';
    h += '<button class="game-btn" id="smartKnew">I knew it</button>';
    h += '<button class="game-btn secondary" id="smartDidntKnow">Didn\'t know</button>';
    h += '</div>';
    return h;
}

/**
 * Generates shuffled quiz options for a word
 * @private
 * @param {Object} word - Correct word
 * @returns {Array<string>} Shuffled option strings
 */
function generateQuizOptions(word) {
    var options = [word.english];
    var allW = WordAnalyzer._getAllWords();

    for (var o = allW.length - 1; o > 0; o--) {
        var oj = Math.floor(Math.random() * (o + 1));
        var ot = allW[o]; allW[o] = allW[oj]; allW[oj] = ot;
    }

    for (var oi = 0; oi < allW.length && options.length < 4; oi++) {
        if (allW[oi].english !== word.english) {
            var dup = false;
            for (var di = 0; di < options.length; di++) {
                if (options[di] === allW[oi].english) { dup = true; break; }
            }
            if (!dup) options.push(allW[oi].english);
        }
    }

    for (var si = options.length - 1; si > 0; si--) {
        var sj = Math.floor(Math.random() * (si + 1));
        var st = options[si]; options[si] = options[sj]; options[sj] = st;
    }
    return options;
}

/**
 * Builds quiz phase HTML
 * @private
 * @param {Object} word - Word object
 * @returns {string} Quiz HTML
 */
function buildQuizPhase(word) {
    var options = generateQuizOptions(word);
    var h = '<div style="text-align:center;font-size:2.5rem;margin:20px 0;padding:30px;background:linear-gradient(135deg,var(--neon-purple),var(--neon-pink));border-radius:20px">';
    h += escapeHtml(word.korean) + '</div>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">Select the correct meaning:</p>';
    h += '<div class="quiz-options">';
    for (var qi = 0; qi < options.length; qi++) {
        h += '<div class="quiz-option smartQuizOpt" data-answer="' + escapeHtml(options[qi]) + '">' + escapeHtml(options[qi]) + '</div>';
    }
    h += '</div>';
    return h;
}

/**
 * Builds typing phase HTML
 * @private
 * @param {Object} word - Word object
 * @returns {string} Typing HTML
 */
function buildTypingPhase(word) {
    var h = '<div style="text-align:center;margin:20px 0">';
    h += '<div style="font-size:1rem;color:rgba(255,255,255,0.6);margin-bottom:10px">Type the English meaning of:</div>';
    h += '<div style="font-size:2.5rem;padding:20px;background:linear-gradient(135deg,var(--neon-purple),var(--neon-pink));border-radius:20px;display:inline-block">' + escapeHtml(word.korean) + '</div>';
    h += '<div style="color:rgba(255,255,255,0.5);margin-top:8px;font-size:0.9rem">' + escapeHtml(word.romanization || "") + '</div>';
    h += '</div>';
    h += '<input type="text" class="speed-input" id="smartTypeInput" placeholder="Type English meaning..." autocomplete="off">';
    h += '<div class="game-controls" style="margin-top:15px"><button class="game-btn" id="smartTypeSubmit">Check</button></div>';
    return h;
}

/**
 * Renders a single step of the smart session
 * @private
 * @param {HTMLElement} c - Container element
 */
function _renderSmartStep(c) {
    var ss = _smartSessionState;
    if (ss.index >= ss.words.length) {
        _renderSmartSummary(c);
        return;
    }

    var word = ss.words[ss.index];
    var progress = Math.round((ss.index / ss.words.length) * 100);
    var phases = ["flashcard", "quiz", "typing"];
    ss.phase = phases[Math.min(ss.difficulty - 1, phases.length - 1)];

    var h = '<h2 class="game-title">Smart Session</h2>';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">';
    h += '<span style="font-size:0.8rem;color:rgba(255,255,255,0.5)">Word ' + (ss.index + 1) + '/' + ss.words.length + '</span>';
    h += '<span style="font-size:0.8rem;color:rgba(255,255,255,0.5)">Score: ' + ss.score + '</span>';
    h += '<span style="font-size:0.8rem;color:' + (ss.streak >= 3 ? 'var(--fire)' : 'rgba(255,255,255,0.5)') + '">Streak: ' + ss.streak + '</span>';
    h += '</div>';
    h += '<div class="level-progress" style="margin-bottom:20px"><div class="level-bar" style="width:' + progress + '%"></div></div>';

    if (ss.phase === "flashcard") {
        h += buildFlashcardPhase(word);
    } else if (ss.phase === "quiz") {
        h += buildQuizPhase(word);
    } else {
        h += buildTypingPhase(word);
    }

    c.innerHTML = h;
    _bindSmartStepEvents(c, word);
}

/**
 * Binds events for the current session step
 * @private
 * @param {HTMLElement} c - Container element
 * @param {Object} word - Current word
 */
function _bindSmartStepEvents(c, word) {
    var ss = _smartSessionState;

    if (ss.phase === "flashcard") {
        document.getElementById("smartFlashcard").onclick = function () {
            document.getElementById("smartFlashHidden").style.display = "block";
            document.getElementById("smartFlashPrompt").style.display = "none";
            document.getElementById("smartFlashBtns").style.display = "flex";
            if (typeof speakKorean === "function") speakKorean(word.korean);
        };
        document.getElementById("smartKnew").onclick = function () { _smartAnswer(c, true); };
        document.getElementById("smartDidntKnow").onclick = function () { _smartAnswer(c, false); };

    } else if (ss.phase === "quiz") {
        var opts = document.querySelectorAll(".smartQuizOpt");
        for (var bo = 0; bo < opts.length; bo++) {
            opts[bo].onclick = function () {
                if (this.classList.contains("correct") || this.classList.contains("wrong")) return;
                var isCorrect = this.getAttribute("data-answer") === word.english;
                this.classList.add(isCorrect ? "correct" : "wrong");
                if (!isCorrect) {
                    var allOpts = document.querySelectorAll(".smartQuizOpt");
                    for (var ao = 0; ao < allOpts.length; ao++) {
                        if (allOpts[ao].getAttribute("data-answer") === word.english) {
                            allOpts[ao].classList.add("correct");
                        }
                    }
                }
                setTimeout(function () { _smartAnswer(c, isCorrect); }, 800);
            };
        }
    } else {
        var typeInput = document.getElementById("smartTypeInput");
        if (typeInput) typeInput.focus();
        var submitFn = function () {
            var val = (document.getElementById("smartTypeInput").value || "").trim().toLowerCase();
            var correct = word.english.toLowerCase();
            var isCorrect = val === correct || (correct.indexOf(val) === 0 && val.length >= 3);
            _smartAnswer(c, isCorrect);
        };
        document.getElementById("smartTypeSubmit").onclick = submitFn;
        if (typeInput) {
            typeInput.onkeydown = function (e) {
                if (e.key === "Enter") submitFn();
            };
        }
    }
}

/**
 * Processes an answer in the smart session
 * @private
 * @param {HTMLElement} c - Container element
 * @param {boolean} isCorrect - Whether the answer was correct
 */
function _smartAnswer(c, isCorrect) {
    var ss = _smartSessionState;
    var word = ss.words[ss.index];
    ss.answers.push({ word: word, correct: isCorrect, phase: ss.phase });

    if (isCorrect) {
        ss.correct++;
        ss.streak++;
        ss.score += (10 * ss.difficulty);
        if (typeof addXP === "function") addXP(5 * ss.difficulty);
        if (typeof addCombo === "function") addCombo();
        if (typeof collectWord === "function") collectWord(word);
        if (typeof SoundEngine !== "undefined" && SoundEngine.correct) SoundEngine.correct();
        if (ss.streak >= 3 && ss.streak % 3 === 0) {
            ss.difficulty = Math.min(3, ss.difficulty + 1);
        }
    } else {
        ss.wrong++;
        ss.streak = 0;
        ss.difficulty = Math.max(1, ss.difficulty - 1);
        if (typeof resetCombo === "function") resetCombo();
        if (typeof trackWeakWord === "function") trackWeakWord(word);
        if (typeof SoundEngine !== "undefined" && SoundEngine.wrong) SoundEngine.wrong();

        var context = DataCombiner.findWordInContext(word.korean);
        if (context.proverbs.length > 0 || context.quotes.length > 0 || context.situations.length > 0) {
            _showContextHint(c, word, context);
            return;
        }
    }

    ss.index++;
    _renderSmartStep(c);
}

/**
 * Shows a context hint for an incorrect answer
 * @private
 * @param {HTMLElement} c - Container element
 * @param {Object} word - Word object
 * @param {Object} context - Context data
 */
function _showContextHint(c, word, context) {
    var h = '<div style="text-align:center;padding:20px">';
    h += '<div style="font-size:1.5rem;color:var(--fire);margin-bottom:15px">Not quite!</div>';
    h += '<div style="font-size:2rem;margin-bottom:5px">' + escapeHtml(word.korean) + '</div>';
    h += '<div style="color:var(--neon-cyan);font-size:1.2rem;margin-bottom:20px">' + escapeHtml(word.english) + '</div>';

    h += '<div class="learning-tip">';
    h += '<div style="font-weight:bold;margin-bottom:8px">Remember it with context:</div>';
    if (context.proverbs.length > 0) {
        h += '<div style="margin-bottom:8px"><span style="color:var(--gold)">Proverb:</span> ' + escapeHtml(context.proverbs[0].korean) + '</div>';
        h += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.6)">' + escapeHtml(context.proverbs[0].meaning || context.proverbs[0].english) + '</div>';
    } else if (context.quotes.length > 0) {
        h += '<div style="margin-bottom:8px"><span style="color:var(--gold)">K-Drama (' + escapeHtml(context.quotes[0].drama) + '):</span></div>';
        h += '<div style="font-size:0.9rem">' + escapeHtml(context.quotes[0].korean) + '</div>';
    } else if (context.situations.length > 0) {
        h += '<div style="margin-bottom:8px"><span style="color:var(--gold)">' + escapeHtml(context.situations[0].scene) + ':</span></div>';
        h += '<div style="font-size:0.9rem">' + escapeHtml(context.situations[0].phrase.korean) + '</div>';
    }
    h += '</div>';
    h += '<button class="game-btn" id="smartHintContinue" style="margin-top:15px">Continue</button>';
    h += '</div>';

    c.innerHTML = h;
    document.getElementById("smartHintContinue").onclick = function () {
        _smartSessionState.index++;
        _renderSmartStep(c);
    };
}

/**
 * Renders session summary after completion
 * @private
 * @param {HTMLElement} c - Container element
 */
function _renderSmartSummary(c) {
    var ss = _smartSessionState;
    var duration = Math.round((Date.now() - ss.startTime) / 1000);
    var accuracy = ss.words.length > 0 ? Math.round((ss.correct / ss.words.length) * 100) : 0;

    if (typeof recordStudyStat === "function") {
        recordStudyStat("smartSession", ss.score, duration);
    }

    var h = '<h2 class="game-title">Session Complete!</h2>';
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<div style="font-size:3rem;color:var(--gold);margin:15px 0">' + ss.score + ' pts</div></div>';
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:25px">';
    h += '<div class="stat-item"><div class="stat-value" style="color:var(--neon-cyan)">' + ss.correct + '</div><div class="stat-label">CORRECT</div></div>';
    h += '<div class="stat-item"><div class="stat-value" style="color:var(--fire)">' + ss.wrong + '</div><div class="stat-label">WRONG</div></div>';
    h += '<div class="stat-item"><div class="stat-value">' + accuracy + '%</div><div class="stat-label">ACCURACY</div></div>';
    h += '</div>';

    h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-weight:bold;margin-bottom:10px">Word Breakdown</div>';
    for (var i = 0; i < ss.answers.length; i++) {
        var ans = ss.answers[i];
        var icon = ans.correct ? '<span style="color:var(--neon-cyan)">O</span>' : '<span style="color:var(--fire)">X</span>';
        h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05)">';
        h += '<span>' + icon + ' ' + escapeHtml(ans.word.korean) + '</span>';
        h += '<span style="color:rgba(255,255,255,0.5);font-size:0.85rem">' + escapeHtml(ans.word.english) + '</span></div>';
    }
    h += '</div>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="smartAgainBtn">New Session</button>';
    h += '<button class="game-btn secondary" id="smartDashBtn">Dashboard</button></div>';

    c.innerHTML = h;
    if (typeof createConfetti === "function") createConfetti(40);
    document.getElementById("smartAgainBtn").onclick = function () { showSmartSession(c); };
    document.getElementById("smartDashBtn").onclick = function () { showSmartDashboard(c); };
}

/**
 * Starts a personalized smart study session
 * @public
 * @param {HTMLElement} c - Container element
 * @example
 * showSmartSession(document.getElementById('gameContainer'));
 */
function showSmartSession(c) {
    initSmartSessionState();
    _renderSmartStep(c);
}

// -- Word Explorer --

/**
 * Gets daily quick pick words from various categories
 * @private
 * @returns {Array<Object>} Quick pick word objects
 */
function _getQuickPicks() {
    var picks = [];
    var allWords = WordAnalyzer._getAllWords();
    if (allWords.length === 0) return picks;

    var seenCats = {};
    var dayNum = Math.floor(Date.now() / 86400000);
    for (var i = 0; i < allWords.length && picks.length < 8; i++) {
        var idx = (i + dayNum) % allWords.length;
        var w = allWords[idx];
        if (w.category && !seenCats[w.category]) {
            seenCats[w.category] = true;
            picks.push(w);
        }
    }
    return picks;
}

/**
 * Renders detailed word information
 * @private
 * @param {HTMLElement} container - Container element
 * @param {Object} word - Word object
 */
function _renderWordDetail(container, word) {
    var related = WordAnalyzer.findRelatedWords(word.korean);
    var context = DataCombiner.findWordInContext(word.korean);
    var difficulty = WordAnalyzer.getWordDifficulty(word);
    var minPairs = WordAnalyzer.findMinimalPairMatches(word.korean);
    var path = DataCombiner.buildLearningPath(word, 4);

    var h = '';
    h += '<div style="background:linear-gradient(135deg,var(--neon-purple),var(--neon-pink));padding:25px;border-radius:20px;text-align:center;margin-bottom:20px">';
    h += '<div style="font-size:3rem;margin-bottom:8px">' + escapeHtml(word.korean) + '</div>';
    h += '<div style="font-size:1rem;color:rgba(255,255,255,0.8)">' + escapeHtml(word.romanization || "") + '</div>';
    h += '<div style="font-size:1.2rem;margin-top:5px">' + escapeHtml(word.english) + '</div>';
    h += '<div style="margin-top:10px;display:flex;justify-content:center;gap:10px">';
    h += '<span class="rarity-' + (word.rarity || "common") + '" style="padding:4px 10px;border-radius:10px;font-size:0.75rem">' + escapeHtml(word.rarity || "common") + '</span>';
    h += '<span style="background:rgba(0,0,0,0.3);padding:4px 10px;border-radius:10px;font-size:0.75rem">Difficulty: ' + difficulty + '/10</span>';
    if (word.category) h += '<span style="background:rgba(0,0,0,0.3);padding:4px 10px;border-radius:10px;font-size:0.75rem">' + escapeHtml(word.category) + '</span>';
    h += '</div>';
    h += '<button class="game-btn" style="margin-top:12px;padding:6px 18px;font-size:0.85rem" onclick="if(typeof speakKorean===\'function\')speakKorean(\'' + escapeHtml(word.korean) + '\')">Listen</button>';
    h += '</div>';

    var hasContext = context.proverbs.length + context.quotes.length + context.lyrics.length +
                    context.patterns.length + context.situations.length + context.memes.length;
    if (hasContext > 0) {
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:15px">';
        h += '<div style="font-weight:bold;color:var(--neon-cyan);margin-bottom:10px">Found in Context (' + hasContext + ')</div>';
        if (context.proverbs.length > 0) {
            h += '<div style="margin-bottom:10px"><div style="font-size:0.75rem;color:var(--gold);text-transform:uppercase;margin-bottom:5px">Proverbs</div>';
            for (var cp = 0; cp < Math.min(context.proverbs.length, 3); cp++) {
                h += '<div style="padding:8px;background:rgba(255,215,0,0.1);border-radius:8px;margin-bottom:4px;font-size:0.9rem">' + escapeHtml(context.proverbs[cp].korean);
                h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">' + escapeHtml(context.proverbs[cp].meaning || context.proverbs[cp].english) + '</div></div>';
            }
            h += '</div>';
        }
        if (context.quotes.length > 0) {
            h += '<div style="margin-bottom:10px"><div style="font-size:0.75rem;color:var(--neon-pink);text-transform:uppercase;margin-bottom:5px">K-Drama Quotes</div>';
            for (var cq = 0; cq < Math.min(context.quotes.length, 3); cq++) {
                h += '<div style="padding:8px;background:rgba(255,45,149,0.1);border-radius:8px;margin-bottom:4px;font-size:0.9rem">"' + escapeHtml(context.quotes[cq].korean) + '"';
                h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">- ' + escapeHtml(context.quotes[cq].drama || "") + '</div></div>';
            }
            h += '</div>';
        }
        h += '</div>';
    }

    if (related.length > 0) {
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:15px">';
        h += '<div style="font-weight:bold;color:var(--neon-pink);margin-bottom:10px">Related Words (' + related.length + ')</div>';
        h += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
        for (var rw = 0; rw < related.length; rw++) {
            h += '<button class="cat-btn explorerRelated" data-word="' + escapeHtml(related[rw].word.korean) + '" title="' + escapeHtml(related[rw].reason) + '">';
            h += escapeHtml(related[rw].word.korean) + ' <span style="font-size:0.7rem;opacity:0.7">' + escapeHtml(related[rw].word.english) + '</span></button>';
        }
        h += '</div></div>';
    }

    if (path.length > 1) {
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:15px">';
        h += '<div style="font-weight:bold;color:var(--gold);margin-bottom:10px">Learning Path</div>';
        for (var lp = 0; lp < path.length; lp++) {
            var step = path[lp];
            h += '<div style="display:flex;align-items:center;margin-bottom:8px">';
            h += '<div style="width:24px;height:24px;background:var(--neon-purple);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:bold;flex-shrink:0">' + step.step + '</div>';
            h += '<div style="flex:1;margin-left:10px"><span style="font-weight:bold">' + escapeHtml(step.word.korean) + '</span> - ' + escapeHtml(step.word.english) + '</div></div>';
            if (lp < path.length - 1) h += '<div style="width:2px;height:15px;background:rgba(157,78,221,0.3);margin-left:11px"></div>';
        }
        h += '</div>';
    }

    if (minPairs.length > 0) {
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:15px">';
        h += '<div style="font-weight:bold;color:var(--neon-blue);margin-bottom:10px">Similar Sounding Words</div>';
        for (var mp = 0; mp < Math.min(minPairs.length, 5); mp++) {
            h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05)">';
            h += '<span class="explorerRelated" data-word="' + escapeHtml(minPairs[mp].word.korean) + '" style="cursor:pointer">' + escapeHtml(minPairs[mp].word.korean) + '</span>';
            h += '<span style="color:rgba(255,255,255,0.5);font-size:0.85rem">' + escapeHtml(minPairs[mp].word.english) + '</span></div>';
        }
        h += '</div>';
    }

    container.innerHTML = h;

    var relBtns = container.querySelectorAll(".explorerRelated");
    for (var rb = 0; rb < relBtns.length; rb++) {
        relBtns[rb].onclick = function () {
            var w = this.getAttribute("data-word");
            document.getElementById("explorerSearch").value = w;
            _doExplorerSearch(w);
        };
    }
}

/**
 * Performs search in word explorer
 * @private
 * @param {string} query - Search query
 */
function _doExplorerSearch(query) {
    var resultsDiv = document.getElementById("explorerResults");
    if (!resultsDiv) return;

    var allWords = WordAnalyzer._getAllWords();
    var matches = [];

    for (var i = 0; i < allWords.length; i++) {
        var w = allWords[i];
        if (w.korean === query || w.english.toLowerCase() === query.toLowerCase()) {
            matches.unshift(w);
        } else if (w.korean.indexOf(query) !== -1 || w.english.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            matches.push(w);
        }
    }

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.5)">No words found for "' + escapeHtml(query) + '"</p>';
        return;
    }

    if (matches.length === 1) {
        _renderWordDetail(resultsDiv, matches[0]);
        return;
    }

    var h = '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:10px">' + matches.length + ' results found:</div>';
    var showCount = Math.min(matches.length, 20);
    for (var m = 0; m < showCount; m++) {
        h += '<div class="explorerResultItem" data-word="' + escapeHtml(matches[m].korean) + '" style="background:var(--glass);padding:10px 15px;border-radius:10px;margin-bottom:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center">';
        h += '<span style="font-size:1.1rem">' + escapeHtml(matches[m].korean) + '</span>';
        h += '<span style="color:rgba(255,255,255,0.5);font-size:0.85rem">' + escapeHtml(matches[m].english) + '</span></div>';
    }
    resultsDiv.innerHTML = h;

    var resultItems = resultsDiv.querySelectorAll(".explorerResultItem");
    for (var ri = 0; ri < resultItems.length; ri++) {
        resultItems[ri].onclick = function () {
            _doExplorerSearch(this.getAttribute("data-word"));
        };
    }
}

/**
 * Opens word explorer and searches for a specific word
 * @private
 * @param {HTMLElement} c - Container element
 * @param {string} korean - Korean word to search
 */
function _showWordDetail(c, korean) {
    showWordExplorer(c);
    setTimeout(function () {
        var searchInput = document.getElementById("explorerSearch");
        if (searchInput) {
            searchInput.value = korean;
            _doExplorerSearch(korean);
        }
    }, 100);
}

/**
 * Renders the word explorer interface
 * @public
 * @param {HTMLElement} c - Container element
 * @example
 * showWordExplorer(document.getElementById('gameContainer'));
 */
function showWordExplorer(c) {
    var h = '<h2 class="game-title">Word Explorer</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:20px">Search any word to discover connections and context</p>';
    h += '<div style="display:flex;gap:10px;margin-bottom:20px">';
    h += '<input type="text" class="speed-input" id="explorerSearch" placeholder="Type Korean or English..." style="flex:1;text-align:left">';
    h += '<button class="game-btn" id="explorerSearchBtn">Search</button></div>';

    h += '<div style="margin-bottom:20px">';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5);margin-bottom:8px">Quick picks:</div>';
    h += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
    var picks = _getQuickPicks();
    for (var p = 0; p < picks.length; p++) {
        h += '<button class="cat-btn explorerPick" data-word="' + escapeHtml(picks[p].korean) + '">' + escapeHtml(picks[p].korean) + ' (' + escapeHtml(picks[p].english) + ')</button>';
    }
    h += '</div></div>';
    h += '<div id="explorerResults"></div>';
    h += '<div style="margin-top:20px"><button class="game-btn secondary" id="explorerBackBtn" style="width:100%">Back to Dashboard</button></div>';

    c.innerHTML = h;

    var searchFn = function () {
        var query = (document.getElementById("explorerSearch").value || "").trim();
        if (query.length > 0) _doExplorerSearch(query);
    };
    document.getElementById("explorerSearchBtn").onclick = searchFn;
    document.getElementById("explorerSearch").onkeydown = function (e) {
        if (e.key === "Enter") searchFn();
    };
    document.getElementById("explorerBackBtn").onclick = function () { showSmartDashboard(c); };

    var pickBtns = document.querySelectorAll(".explorerPick");
    for (var pb = 0; pb < pickBtns.length; pb++) {
        pickBtns[pb].onclick = function () {
            document.getElementById("explorerSearch").value = this.getAttribute("data-word");
            _doExplorerSearch(this.getAttribute("data-word"));
        };
    }
}

// -- Weekly Report --

/**
 * Collects weekly stats from daily study data
 * @private
 * @param {Array<Object>} stats - Raw stats data
 * @returns {Object} This week and last week data
 */
function collectWeeklyData(stats) {
    var now = Date.now();
    var oneWeekAgo = now - 7 * 86400000;
    var twoWeeksAgo = now - 14 * 86400000;

    var thisWeek = { sessions: 0, score: 0, duration: 0, modes: {}, dates: {} };
    var lastWeek = { sessions: 0, score: 0, duration: 0, modes: {}, dates: {} };

    for (var i = 0; i < stats.length; i++) {
        var s = stats[i];
        var ts = s.timestamp || new Date(s.date).getTime();
        var target = null;
        if (ts >= oneWeekAgo) target = thisWeek;
        else if (ts >= twoWeeksAgo) target = lastWeek;
        if (target) {
            target.sessions++;
            target.score += (s.score || 0);
            target.duration += (s.duration || 0);
            target.modes[s.mode || "unknown"] = (target.modes[s.mode || "unknown"] || 0) + 1;
            target.dates[s.date] = (target.dates[s.date] || 0) + 1;
        }
    }
    return { thisWeek: thisWeek, lastWeek: lastWeek };
}

/**
 * Renders the weekly learning report
 * @public
 * @param {HTMLElement} c - Container element
 * @example
 * showWeeklyReport(document.getElementById('gameContainer'));
 */
function showWeeklyReport(c) {
    var stats = [];
    try { stats = JSON.parse(localStorage.getItem("dailyStudyStats") || "[]"); } catch (e) {}

    var data = collectWeeklyData(stats);
    var tw = data.thisWeek;
    var lw = data.lastWeek;
    var sessionsDiff = tw.sessions - lw.sessions;
    var scoreDiff = tw.score - lw.score;
    var activeDays = 0;
    for (var dd in tw.dates) { if (tw.dates.hasOwnProperty(dd)) activeDays++; }

    var h = '<h2 class="game-title">Weekly Report</h2>';
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">';
    h += '<div class="stat-item"><div class="stat-value">' + tw.sessions + '</div><div class="stat-label">SESSIONS</div>';
    h += '<div style="font-size:0.7rem;color:' + (sessionsDiff >= 0 ? 'var(--neon-cyan)' : 'var(--fire)') + '">' + (sessionsDiff >= 0 ? '+' : '') + sessionsDiff + ' vs last week</div></div>';
    h += '<div class="stat-item"><div class="stat-value">' + tw.score + '</div><div class="stat-label">TOTAL SCORE</div>';
    h += '<div style="font-size:0.7rem;color:' + (scoreDiff >= 0 ? 'var(--neon-cyan)' : 'var(--fire)') + '">' + (scoreDiff >= 0 ? '+' : '') + scoreDiff + ' vs last week</div></div>';
    h += '<div class="stat-item"><div class="stat-value">' + activeDays + '/7</div><div class="stat-label">ACTIVE DAYS</div></div>';
    h += '</div>';

    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-weight:bold;color:var(--neon-cyan);margin-bottom:15px">Daily Activity</div>';
    h += '<div style="display:flex;align-items:flex-end;justify-content:space-between;height:120px;gap:4px">';

    var dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    var today = new Date();
    var maxSessions = 1;
    var dailyData = [];
    for (var d = 6; d >= 0; d--) {
        var dayDate = new Date(today);
        dayDate.setDate(dayDate.getDate() - d);
        var dateStr = dayDate.toISOString().slice(0, 10);
        var count = tw.dates[dateStr] || 0;
        if (count > maxSessions) maxSessions = count;
        dailyData.push({ count: count, dayName: dayLabels[dayDate.getDay() === 0 ? 6 : dayDate.getDay() - 1] });
    }

    for (var bd = 0; bd < dailyData.length; bd++) {
        var barHeight = dailyData[bd].count > 0 ? Math.max(10, Math.round((dailyData[bd].count / maxSessions) * 100)) : 5;
        var barColor = dailyData[bd].count > 0 ? "var(--neon-purple)" : "rgba(255,255,255,0.1)";
        h += '<div style="flex:1;text-align:center"><div style="height:100px;display:flex;align-items:flex-end;justify-content:center">';
        h += '<div style="width:100%;max-width:30px;height:' + barHeight + '%;background:' + barColor + ';border-radius:4px 4px 0 0;position:relative">';
        if (dailyData[bd].count > 0) h += '<div style="position:absolute;top:-18px;width:100%;text-align:center;font-size:0.7rem;color:var(--neon-cyan)">' + dailyData[bd].count + '</div>';
        h += '</div></div><div style="font-size:0.65rem;color:rgba(255,255,255,0.5);margin-top:5px">' + dailyData[bd].dayName + '</div></div>';
    }
    h += '</div></div>';

    var plan = LearningProfile.getOptimalStudyPlan();
    h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-weight:bold;color:var(--gold);margin-bottom:10px">Next Week Recommendations</div>';
    for (var pi = 0; pi < Math.min(plan.length, 3); pi++) {
        h += '<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05)">';
        h += '<div style="font-size:0.9rem">' + escapeHtml(plan[pi].action) + '</div>';
        h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">' + escapeHtml(plan[pi].reason) + '</div></div>';
    }
    h += '</div>';

    var prediction = LearningProfile.predictLevel(7);
    if (prediction.predictedLevel > prediction.currentLevel) {
        h += '<div style="background:linear-gradient(135deg,rgba(0,245,212,0.15),rgba(0,212,255,0.15));border:1px solid rgba(0,245,212,0.3);padding:15px;border-radius:15px;margin-bottom:20px;text-align:center">';
        h += '<div style="font-size:0.8rem;color:var(--neon-cyan)">At your current pace, you\'ll reach Level ' + prediction.predictedLevel + ' in about a week!</div></div>';
    }

    h += '<div class="game-controls"><button class="game-btn secondary" id="weeklyBackBtn" style="width:100%">Back to Dashboard</button></div>';
    c.innerHTML = h;
    document.getElementById("weeklyBackBtn").onclick = function () { showSmartDashboard(c); };
}

// -- Cross-Content Quiz UI --

/**
 * Renders a cross-content quiz question
 * @private
 * @param {HTMLElement} c - Container element
 * @param {Object} state - Quiz state
 */
function _renderCrossQuestion(c, state) {
    if (state.index >= state.questions.length) {
        _renderCrossResult(c, state);
        return;
    }

    var q = state.questions[state.index];
    var progress = Math.round((state.index / state.questions.length) * 100);

    var h = '<h2 class="game-title">Cross-Content Quiz</h2>';
    h += '<div style="display:flex;justify-content:space-between;font-size:0.8rem;color:rgba(255,255,255,0.5);margin-bottom:8px">';
    h += '<span>Question ' + (state.index + 1) + '/' + state.questions.length + '</span>';
    h += '<span>Score: ' + state.score + '</span></div>';
    h += '<div class="level-progress" style="margin-bottom:20px"><div class="level-bar" style="width:' + progress + '%"></div></div>';
    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-size:1.1rem;white-space:pre-wrap">' + escapeHtml(q.question) + '</div>';
    h += '<div style="font-size:0.7rem;color:rgba(255,255,255,0.3);margin-top:8px">Sources: ' + (q.sources || []).join(", ") + '</div></div>';
    h += '<div class="quiz-options">';
    for (var oi = 0; oi < q.options.length; oi++) {
        h += '<div class="quiz-option crossQuizOpt" data-answer="' + escapeHtml(q.options[oi]) + '" style="font-size:0.9rem">' + escapeHtml(q.options[oi]) + '</div>';
    }
    h += '</div>';
    c.innerHTML = h;

    var opts = document.querySelectorAll(".crossQuizOpt");
    for (var bo = 0; bo < opts.length; bo++) {
        opts[bo].onclick = function () {
            if (this.classList.contains("correct") || this.classList.contains("wrong")) return;
            var isCorrect = this.getAttribute("data-answer") === q.answer;
            this.classList.add(isCorrect ? "correct" : "wrong");
            if (isCorrect) { state.score += 10; state.correct++; if (typeof addXP === "function") addXP(5); }
            if (!isCorrect) {
                var all = document.querySelectorAll(".crossQuizOpt");
                for (var ao = 0; ao < all.length; ao++) {
                    if (all[ao].getAttribute("data-answer") === q.answer) all[ao].classList.add("correct");
                }
            }
            setTimeout(function () { state.index++; _renderCrossQuestion(c, state); }, 1000);
        };
    }
}

/**
 * Renders cross-content quiz results
 * @private
 * @param {HTMLElement} c - Container element
 * @param {Object} state - Quiz state
 */
function _renderCrossResult(c, state) {
    var accuracy = state.questions.length > 0 ? Math.round((state.correct / state.questions.length) * 100) : 0;
    var h = '<h2 class="game-title">Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:3rem;color:var(--gold);margin:15px 0">' + state.score + ' pts</div>';
    h += '<div style="font-size:1.2rem;margin-bottom:20px">' + state.correct + '/' + state.questions.length + ' correct (' + accuracy + '%)</div></div>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="crossQuizAgain">Try Again</button>';
    h += '<button class="game-btn secondary" id="crossQuizDash">Dashboard</button></div>';
    c.innerHTML = h;
    if (typeof createConfetti === "function" && accuracy >= 70) createConfetti(30);
    document.getElementById("crossQuizAgain").onclick = function () { _showCrossQuizUI(c); };
    document.getElementById("crossQuizDash").onclick = function () { showSmartDashboard(c); };
}

/**
 * Launches the cross-content quiz UI
 * @private
 * @param {HTMLElement} c - Container element
 */
function _showCrossQuizUI(c) {
    var questions = DataCombiner.getCrossContentQuiz("medium");
    if (questions.length === 0) {
        c.innerHTML = '<h2 class="game-title">Cross-Content Quiz</h2><p style="text-align:center;color:rgba(255,255,255,0.6)">Not enough content data loaded for quiz generation.</p>' +
            '<button class="game-btn secondary" id="crossQuizBack" style="margin-top:20px;display:block;margin-left:auto;margin-right:auto">Back</button>';
        document.getElementById("crossQuizBack").onclick = function () { showSmartDashboard(c); };
        return;
    }
    _renderCrossQuestion(c, { index: 0, score: 0, correct: 0, questions: questions });
}
