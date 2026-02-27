/**
 * slang-quiz.js
 * K-POP vocabulary and Korean internet slang quizzes
 *
 * @module SlangQuiz
 * @requires game-data.js (defaultKpopVocabulary, defaultKoreanNetSlang)
 * @requires game-engine.js (global functions: shuffle, addXP, addCombo, etc.)
 */

// -- K-POP Slang Quiz --

/**
 * K-POP slang quiz game state
 * @private
 */
var kpopSlangScore = 0;
var kpopSlangRound = 0;
var kpopSlangTotal = 10;
var kpopSlangCurrent = null;
var kpopSlangAnswered = false;

/**
 * Gets K-POP vocabulary pool from global data or fallback
 * @private
 * @returns {Array<Object>} K-POP vocabulary array
 */
function getKpopSlangPool() {
    return (typeof kpopVocabulary !== "undefined" && kpopVocabulary.length > 0)
        ? kpopVocabulary
        : defaultKpopVocabulary;
}

/**
 * Initializes and starts the K-POP slang quiz
 * @public
 * @param {HTMLElement} container - Container element
 * @example
 * showKpopSlang(document.getElementById('gameContainer'));
 */
function showKpopSlang(container) {
    kpopSlangScore = 0;
    kpopSlangRound = 0;
    kpopSlangAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextKpopSlang(container);
}

/**
 * Advances to next K-POP slang round
 * @private
 * @param {HTMLElement} container - Container element
 */
function nextKpopSlang(container) {
    if (kpopSlangRound >= kpopSlangTotal) {
        renderKpopSlangEnd(container);
        return;
    }
    var pool = getKpopSlangPool();
    var available = shuffle(pool);
    kpopSlangCurrent = available[kpopSlangRound % available.length];
    kpopSlangAnswered = false;
    kpopSlangRound++;
    renderKpopSlangQuestion(container);
}

/**
 * Renders K-POP slang question UI
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderKpopSlangQuestion(container) {
    var q = kpopSlangCurrent;
    var pool = getKpopSlangPool();
    var wrong = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].korean !== q.korean) wrong.push(pool[i]);
    }
    wrong = shuffle(wrong).slice(0, 3);
    var allOptions = shuffle([q].concat(wrong));

    var h = '<h2 class="game-title">K-POP Slang</h2>';
    h += '<div style="text-align:center;color:var(--gold);font-size:0.9rem;margin-bottom:5px">';
    h += '&#9733; &#9733; &#9733; Round ' + kpopSlangRound + ' / ' + kpopSlangTotal + ' &#9733; &#9733; &#9733;</div>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((kpopSlangRound / kpopSlangTotal) * 100) + '%"></div></div>';
    h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.3),rgba(255,45,149,0.2));padding:25px;border-radius:15px;margin-bottom:20px;text-align:center;border:1px solid rgba(255,215,0,0.3)">';
    h += '<div style="font-size:0.8rem;color:var(--gold);margin-bottom:8px">&#9733; K-POP Term &#9733;</div>';
    h += '<div style="font-size:2rem;color:var(--neon-pink);margin-bottom:5px">' + escapeHtml(q.korean) + '</div>';
    if (q.romanization) {
        h += '<div style="color:var(--neon-cyan);font-size:0.9rem">' + escapeHtml(q.romanization) + '</div>';
    }
    h += '</div>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">What does this term mean?</p>';
    h += '<div class="quiz-options" style="grid-template-columns:1fr">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j].korean) + '" style="font-size:0.95rem;text-align:left">';
        h += escapeHtml(allOptions[j].english) + '</div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:10px;color:var(--gold)">&#9733; Score: ' + kpopSlangScore + ' &#9733;</div>';
    container.innerHTML = h;

    attachKpopSlangHandlers(container);
}

/**
 * Attaches event handlers to K-POP slang quiz options
 * @private
 * @param {HTMLElement} container - Container element
 */
function attachKpopSlangHandlers(container) {
    var opts = container.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (kpopSlangAnswered) return;
            kpopSlangAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === kpopSlangCurrent.korean);

            if (isCorrect) {
                this.classList.add('correct');
                kpopSlangScore += 100;
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
                    if (all[m].getAttribute('data-answer') === kpopSlangCurrent.korean) {
                        all[m].classList.add('correct');
                    }
                }
            }

            if (kpopSlangCurrent.example) {
                var ex = document.createElement('div');
                ex.style.cssText = 'margin-top:12px;background:var(--glass);padding:12px;border-radius:12px;text-align:center';
                ex.innerHTML = '<div style="color:var(--neon-cyan);font-size:0.85rem;margin-bottom:4px">Example:</div>' +
                    '<div style="color:var(--neon-pink)">' + escapeHtml(kpopSlangCurrent.example) + '</div>';
                container.appendChild(ex);
            }
            setTimeout(function () { nextKpopSlang(container); }, 2500);
        };
    }
}

/**
 * Renders K-POP slang quiz completion screen
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderKpopSlangEnd(container) {
    var pct = Math.round((kpopSlangScore / (kpopSlangTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(kpopSlangScore / 10);

    var h = '<h2 class="game-title">K-POP Slang Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#9733;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + kpopSlangScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="kpopSlangAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="kpopSlangBackBtn">Back</button>';
    h += '</div></div>';
    container.innerHTML = h;

    document.getElementById('kpopSlangAgainBtn').onclick = function () { showKpopSlang(container); };
    document.getElementById('kpopSlangBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}

// -- Net Slang Quiz --

/**
 * Net slang quiz game state
 * @private
 */
var netSlangScore = 0;
var netSlangRound = 0;
var netSlangTotal = 10;
var netSlangCurrent = null;
var netSlangAnswered = false;

/**
 * Gets net slang pool from global data or fallback
 * @private
 * @returns {Array<Object>} Net slang array
 */
function getNetSlangPool() {
    return (typeof koreanNetSlang !== "undefined" && koreanNetSlang.length > 0)
        ? koreanNetSlang
        : defaultKoreanNetSlang;
}

/**
 * Initializes and starts the net slang quiz
 * @public
 * @param {HTMLElement} container - Container element
 * @example
 * showNetSlangQuiz(document.getElementById('gameContainer'));
 */
function showNetSlangQuiz(container) {
    netSlangScore = 0;
    netSlangRound = 0;
    netSlangAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextNetSlang(container);
}

/**
 * Advances to next net slang round
 * @private
 * @param {HTMLElement} container - Container element
 */
function nextNetSlang(container) {
    if (netSlangRound >= netSlangTotal) {
        renderNetSlangEnd(container);
        return;
    }
    var pool = getNetSlangPool();
    var available = shuffle(pool);
    netSlangCurrent = available[netSlangRound % available.length];
    netSlangAnswered = false;
    netSlangRound++;
    renderNetSlangQuestion(container);
}

/**
 * Renders net slang question UI with chat bubble style
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderNetSlangQuestion(container) {
    var q = netSlangCurrent;
    var pool = getNetSlangPool();
    var wrong = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].abbreviation !== q.abbreviation) wrong.push(pool[i]);
    }
    wrong = shuffle(wrong).slice(0, 3);
    var allOptions = shuffle([q].concat(wrong));

    var h = '<h2 class="game-title">Korean Net Slang</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + netSlangRound + ' / ' + netSlangTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((netSlangRound / netSlangTotal) * 100) + '%"></div></div>';
    h += '<div style="max-width:280px;margin:0 auto 20px;background:linear-gradient(135deg,rgba(0,212,255,0.15),rgba(157,78,221,0.15));padding:20px 25px;border-radius:20px 20px 20px 5px;border:1px solid rgba(0,212,255,0.3)">';
    h += '<div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:8px">KakaoTalk Message</div>';
    h += '<div style="font-size:3rem;text-align:center;color:var(--neon-pink);letter-spacing:4px">' + escapeHtml(q.abbreviation) + '</div></div>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">What does this abbreviation stand for?</p>';
    h += '<div class="quiz-options" style="grid-template-columns:1fr">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j].abbreviation) + '" style="text-align:left">';
        h += '<strong>' + escapeHtml(allOptions[j].fullForm) + '</strong>';
        h += ' <span style="color:rgba(255,255,255,0.5)">(' + escapeHtml(allOptions[j].english) + ')</span></div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:10px;color:var(--gold)">Score: ' + netSlangScore + '</div>';
    container.innerHTML = h;

    attachNetSlangHandlers(container);
}

/**
 * Attaches event handlers to net slang quiz options
 * @private
 * @param {HTMLElement} container - Container element
 */
function attachNetSlangHandlers(container) {
    var opts = container.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (netSlangAnswered) return;
            netSlangAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === netSlangCurrent.abbreviation);

            if (isCorrect) {
                this.classList.add('correct');
                netSlangScore += 100;
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
                    if (all[m].getAttribute('data-answer') === netSlangCurrent.abbreviation) {
                        all[m].classList.add('correct');
                    }
                }
            }

            var info = document.createElement('div');
            info.style.cssText = 'margin-top:12px;background:var(--glass);padding:12px;border-radius:12px;text-align:center';
            info.innerHTML = '<span style="color:var(--neon-pink);font-size:1.3rem">' + escapeHtml(netSlangCurrent.abbreviation) + '</span>' +
                ' = <strong style="color:var(--neon-cyan)">' + escapeHtml(netSlangCurrent.fullForm) + '</strong>' +
                '<div style="color:rgba(255,255,255,0.6);margin-top:4px;font-size:0.85rem">' + escapeHtml(netSlangCurrent.meaning) + '</div>';
            container.appendChild(info);
            setTimeout(function () { nextNetSlang(container); }, 2500);
        };
    }
}

/**
 * Renders net slang quiz completion screen
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderNetSlangEnd(container) {
    var pct = Math.round((netSlangScore / (netSlangTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(netSlangScore / 10);

    var h = '<h2 class="game-title">Net Slang Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#128172;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + netSlangScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="netSlangAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="netSlangBackBtn">Back</button>';
    h += '</div></div>';
    container.innerHTML = h;

    document.getElementById('netSlangAgainBtn').onclick = function () { showNetSlangQuiz(container); };
    document.getElementById('netSlangBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}
