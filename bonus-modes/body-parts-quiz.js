/**
 * body-parts-quiz.js
 * Interactive body parts identification quiz with SVG human figure
 *
 * @module BodyPartsQuiz
 * @requires game-data.js (defaultKoreanBodyParts)
 * @requires game-engine.js (global functions: shuffle, addXP, addCombo, etc.)
 */

/**
 * Body parts quiz game state
 * @private
 */
var bodyScore = 0;
var bodyRound = 0;
var bodyTotal = 10;
var bodyCurrent = null;
var bodyAnswered = false;

/**
 * Initializes and starts the body parts quiz
 * @public
 * @param {HTMLElement} container - Container element for the quiz UI
 * @example
 * showBodyPartsQuiz(document.getElementById('gameContainer'));
 */
function showBodyPartsQuiz(container) {
    resetBodyQuizState();
    gameState.gamesPlayed++;
    saveProgress();
    nextBodyRound(container);
}

/**
 * Resets body quiz state to initial values
 * @private
 */
function resetBodyQuizState() {
    bodyScore = 0;
    bodyRound = 0;
    bodyAnswered = false;
}

/**
 * Gets body parts pool from global data or fallback
 * @private
 * @returns {Array<Object>} Array of body part objects
 */
function getBodyPartsPool() {
    return (typeof koreanBodyParts !== "undefined" && koreanBodyParts.length > 0)
        ? koreanBodyParts
        : defaultKoreanBodyParts;
}

/**
 * Generates SVG of a human body with optional highlight
 * @private
 * @param {string} highlightId - SVG part ID to highlight
 * @returns {string} SVG markup string
 */
function getBodySvg(highlightId) {
    var hl = highlightId || "";
    var hc = "rgba(255,45,149,0.6)";
    var nc = "rgba(255,255,255,0.15)";

    var svg = '<svg viewBox="0 0 200 400" width="180" height="360" style="display:block;margin:0 auto">';
    svg += buildHeadSvg(hl, hc, nc);
    svg += buildFaceSvg(hl, hc);
    svg += buildTorsoSvg(hl, hc, nc);
    svg += buildArmsSvg(hl, hc, nc);
    svg += buildLegsSvg(hl, hc, nc);
    svg += '</svg>';
    return svg;
}

/**
 * Builds SVG head element
 * @private
 * @param {string} hl - Highlighted part ID
 * @param {string} hc - Highlight color
 * @param {string} nc - Normal color
 * @returns {string} SVG markup
 */
function buildHeadSvg(hl, hc, nc) {
    var svg = '<circle cx="100" cy="50" r="30" fill="' + (hl === "head" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="2">';
    if (hl === "head") svg += '<animate attributeName="r" values="30;33;30" dur="1s" repeatCount="indefinite"/>';
    svg += '</circle>';
    svg += '<ellipse cx="68" cy="50" rx="6" ry="10" fill="' + (hl === "ears" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    svg += '<ellipse cx="132" cy="50" rx="6" ry="10" fill="' + (hl === "ears" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    return svg;
}

/**
 * Builds SVG face elements (eyes, nose, mouth)
 * @private
 * @param {string} hl - Highlighted part ID
 * @param {string} hc - Highlight color
 * @returns {string} SVG markup
 */
function buildFaceSvg(hl, hc) {
    var svg = '';
    svg += '<circle cx="88" cy="45" r="4" fill="' + (hl === "eyes" ? hc : "rgba(255,255,255,0.5)") + '"/>';
    svg += '<circle cx="112" cy="45" r="4" fill="' + (hl === "eyes" ? hc : "rgba(255,255,255,0.5)") + '"/>';
    svg += '<line x1="100" y1="48" x2="100" y2="58" stroke="' + (hl === "nose" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "nose" ? "4" : "2") + '"/>';
    svg += '<path d="M 90 65 Q 100 72 110 65" fill="none" stroke="' + (hl === "mouth" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "mouth" ? "4" : "2") + '"/>';
    return svg;
}

/**
 * Builds SVG torso and shoulder elements
 * @private
 * @param {string} hl - Highlighted part ID
 * @param {string} hc - Highlight color
 * @param {string} nc - Normal color
 * @returns {string} SVG markup
 */
function buildTorsoSvg(hl, hc, nc) {
    var svg = '';
    svg += '<rect x="75" y="82" width="50" height="80" rx="10" fill="' + (hl === "stomach" || hl === "back" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>';
    svg += '<line x1="50" y1="95" x2="75" y2="90" stroke="' + (hl === "shoulders" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "shoulders" ? "6" : "3") + '" stroke-linecap="round"/>';
    svg += '<line x1="125" y1="90" x2="150" y2="95" stroke="' + (hl === "shoulders" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "shoulders" ? "6" : "3") + '" stroke-linecap="round"/>';
    return svg;
}

/**
 * Builds SVG arm and hand elements
 * @private
 * @param {string} hl - Highlighted part ID
 * @param {string} hc - Highlight color
 * @param {string} nc - Normal color
 * @returns {string} SVG markup
 */
function buildArmsSvg(hl, hc, nc) {
    var svg = '';
    svg += '<line x1="50" y1="95" x2="35" y2="175" stroke="' + (hl === "arms" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "arms" ? "8" : "5") + '" stroke-linecap="round"/>';
    svg += '<line x1="150" y1="95" x2="165" y2="175" stroke="' + (hl === "arms" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "arms" ? "8" : "5") + '" stroke-linecap="round"/>';
    svg += '<circle cx="35" cy="180" r="8" fill="' + (hl === "hands" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    svg += '<circle cx="165" cy="180" r="8" fill="' + (hl === "hands" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    return svg;
}

/**
 * Builds SVG leg and foot elements
 * @private
 * @param {string} hl - Highlighted part ID
 * @param {string} hc - Highlight color
 * @param {string} nc - Normal color
 * @returns {string} SVG markup
 */
function buildLegsSvg(hl, hc, nc) {
    var svg = '';
    svg += '<line x1="85" y1="162" x2="75" y2="290" stroke="' + (hl === "legs" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "legs" ? "8" : "5") + '" stroke-linecap="round"/>';
    svg += '<line x1="115" y1="162" x2="125" y2="290" stroke="' + (hl === "legs" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "legs" ? "8" : "5") + '" stroke-linecap="round"/>';
    svg += '<ellipse cx="70" cy="298" rx="15" ry="8" fill="' + (hl === "feet" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    svg += '<ellipse cx="130" cy="298" rx="15" ry="8" fill="' + (hl === "feet" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    return svg;
}

/**
 * Advances to the next round or ends the quiz
 * @private
 * @param {HTMLElement} container - Container element
 */
function nextBodyRound(container) {
    if (bodyRound >= bodyTotal) {
        renderBodyEnd(container);
        return;
    }

    var pool = getBodyPartsPool();
    var available = shuffle(pool);
    bodyCurrent = available[bodyRound % available.length];
    bodyAnswered = false;
    bodyRound++;
    renderBodyQuestion(container);
}

/**
 * Creates wrong answer options for body quiz
 * @private
 * @param {Object} correct - Correct body part
 * @param {number} count - Number of wrong options
 * @returns {Array<Object>} Wrong body part options
 */
function createWrongBodyOptions(correct, count) {
    var pool = getBodyPartsPool();
    var wrongPool = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].korean !== correct.korean) wrongPool.push(pool[i]);
    }
    return shuffle(wrongPool).slice(0, count);
}

/**
 * Renders the body quiz question UI
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderBodyQuestion(container) {
    var q = bodyCurrent;
    var wrong = createWrongBodyOptions(q, 3);
    var allOptions = shuffle([q].concat(wrong));

    var h = '<h2 class="game-title">Body Parts Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + bodyRound + ' / ' + bodyTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:15px">';
    h += '<div class="level-bar" style="width:' + Math.round((bodyRound / bodyTotal) * 100) + '%"></div></div>';
    h += '<div style="text-align:center;margin-bottom:15px">' + getBodySvg(q.svgId) + '</div>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:10px">What is the highlighted body part in Korean?</p>';
    h += '<div class="quiz-options">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j].korean) + '">' + escapeHtml(allOptions[j].korean) + '</div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:10px;color:var(--gold)">Score: ' + bodyScore + '</div>';
    container.innerHTML = h;
    attachBodyQuizHandlers(container);
}

/**
 * Builds body part info element after answer
 * @private
 * @param {Object} part - Body part object
 * @returns {HTMLElement} Info element
 */
function buildBodyPartInfo(part) {
    var info = document.createElement('div');
    info.style.cssText = 'margin-top:12px;text-align:center;background:var(--glass);padding:12px;border-radius:12px';
    info.innerHTML = '<strong style="color:var(--neon-pink)">' + escapeHtml(part.korean) + '</strong>' +
        ' <span style="color:var(--neon-cyan)">(' + escapeHtml(part.romanization) + ')</span>' +
        ' = ' + escapeHtml(part.english);
    return info;
}

/**
 * Creates a listen button element
 * @private
 * @param {string} korean - Korean text to speak
 * @returns {HTMLElement} Button element
 */
function createListenButton(korean) {
    var btn = document.createElement('button');
    btn.className = 'game-btn secondary';
    btn.style.cssText = 'margin:10px auto;display:block;padding:8px 18px;font-size:0.85rem';
    btn.textContent = 'Listen';
    btn.onclick = function () { speakKorean(korean); };
    return btn;
}

/**
 * Attaches event handlers to body quiz options
 * @private
 * @param {HTMLElement} container - Container element
 */
function attachBodyQuizHandlers(container) {
    var opts = container.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (bodyAnswered) return;
            bodyAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === bodyCurrent.korean);

            if (isCorrect) {
                this.classList.add('correct');
                bodyScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                screenShake();
                var all = container.querySelectorAll('.quiz-option');
                for (var m = 0; m < all.length; m++) {
                    if (all[m].getAttribute('data-answer') === bodyCurrent.korean) {
                        all[m].classList.add('correct');
                    }
                }
            }

            container.appendChild(buildBodyPartInfo(bodyCurrent));
            container.appendChild(createListenButton(bodyCurrent.korean));
            setTimeout(function () { nextBodyRound(container); }, 2500);
        };
    }
}

/**
 * Renders the quiz completion screen
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderBodyEnd(container) {
    var pct = Math.round((bodyScore / (bodyTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(bodyScore / 10);

    var h = '<h2 class="game-title">Body Parts Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#129507;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + bodyScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="bodyAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="bodyBackBtn">Back</button>';
    h += '</div></div>';
    container.innerHTML = h;

    document.getElementById('bodyAgainBtn').onclick = function () { showBodyPartsQuiz(container); };
    document.getElementById('bodyBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}
