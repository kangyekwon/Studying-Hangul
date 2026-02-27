/**
 * color-quiz.js
 * Color recognition quiz game
 *
 * @module ColorQuiz
 * @requires game-data.js (defaultKoreanColors)
 * @requires game-engine.js (global functions: shuffle, addXP, addCombo, etc.)
 */

/**
 * Color quiz game state
 * @private
 */
var colorScore = 0;
var colorRound = 0;
var colorTotal = 10;
var colorCurrent = null;
var colorAnswered = false;

/**
 * Initializes and starts the color quiz game
 * @public
 * @param {HTMLElement} container - Container element for the quiz UI
 * @example
 * showColorQuiz(document.getElementById('gameContainer'));
 */
function showColorQuiz(container) {
    resetColorQuizState();
    gameState.gamesPlayed++;
    saveProgress();
    nextColorRound(container);
}

/**
 * Resets color quiz state to initial values
 * @private
 */
function resetColorQuizState() {
    colorScore = 0;
    colorRound = 0;
    colorAnswered = false;
}

/**
 * Gets color pool from global data or fallback
 * @private
 * @returns {Array<Object>} Array of color objects
 */
function getColorPool() {
    return (typeof koreanColors !== "undefined" && koreanColors.length > 0)
        ? koreanColors
        : defaultKoreanColors;
}

/**
 * Advances to next round or shows end screen
 * @private
 * @param {HTMLElement} container - Container element
 */
function nextColorRound(container) {
    if (colorRound >= colorTotal) {
        renderColorEnd(container);
        return;
    }

    var pool = getColorPool();
    var shuffledPool = shuffle(pool);

    colorCurrent = shuffledPool[colorRound % shuffledPool.length];
    colorAnswered = false;
    colorRound++;

    var isReverse = (colorRound % 2 === 0);
    renderColorQuestion(container, isReverse);
}

/**
 * Creates wrong answer options for the quiz
 * @private
 * @param {Object} correctColor - Correct color object
 * @param {number} count - Number of wrong options needed
 * @returns {Array<Object>} Array of wrong color options
 */
function createWrongColorOptions(correctColor, count) {
    var pool = getColorPool();
    var wrongPool = [];

    for (var i = 0; i < pool.length; i++) {
        if (pool[i].korean !== correctColor.korean) {
            wrongPool.push(pool[i]);
        }
    }

    return shuffle(wrongPool).slice(0, count);
}

/**
 * Builds the progress bar HTML
 * @private
 * @param {number} current - Current round number
 * @param {number} total - Total rounds
 * @returns {string} Progress bar HTML
 */
function buildProgressBar(current, total) {
    var percentage = Math.round((current / total) * 100);
    return '<div class="level-progress" style="margin-bottom:20px">' +
           '<div class="level-bar" style="width:' + percentage + '%"></div></div>';
}

/**
 * Builds normal mode question (show color, pick Korean name)
 * @private
 * @param {Object} color - Color object
 * @param {Array<Object>} allOptions - All answer options
 * @returns {string} Question HTML
 */
function buildNormalModeHTML(color, allOptions) {
    var html = '<div style="width:150px;height:150px;border-radius:20px;' +
               'margin:0 auto 20px;border:3px solid rgba(255,255,255,0.3);' +
               'background:' + escapeHtml(color.hex) + '"></div>';

    html += '<p style="text-align:center;color:rgba(255,255,255,0.6);' +
            'margin-bottom:15px">What is this color in Korean?</p>';

    html += '<div class="quiz-options">';
    for (var i = 0; i < allOptions.length; i++) {
        html += '<div class="quiz-option" data-answer="' +
                escapeHtml(allOptions[i].korean) + '">' +
                escapeHtml(allOptions[i].korean) + '</div>';
    }
    html += '</div>';

    return html;
}

/**
 * Builds reverse mode question (show Korean name, pick color)
 * @private
 * @param {Object} color - Color object
 * @param {Array<Object>} allOptions - All answer options
 * @returns {string} Question HTML
 */
function buildReverseModeHTML(color, allOptions) {
    var html = '<div style="font-size:2.5rem;text-align:center;' +
               'color:var(--neon-pink);margin-bottom:20px">' +
               escapeHtml(color.korean) + '</div>';

    html += '<p style="text-align:center;color:rgba(255,255,255,0.6);' +
            'margin-bottom:15px">Pick the correct color!</p>';

    html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">';
    for (var i = 0; i < allOptions.length; i++) {
        html += '<div class="quiz-option" data-answer="' +
                escapeHtml(allOptions[i].korean) + '" ' +
                'style="padding:30px;background:' + escapeHtml(allOptions[i].hex) +
                ';border-radius:15px;cursor:pointer;' +
                'border:3px solid rgba(255,255,255,0.2)">' +
                '<span style="background:rgba(0,0,0,0.6);padding:4px 10px;' +
                'border-radius:8px;font-size:0.8rem">' +
                escapeHtml(allOptions[i].english) + '</span></div>';
    }
    html += '</div>';

    return html;
}

/**
 * Renders the color question UI
 * @private
 * @param {HTMLElement} container - Container element
 * @param {boolean} isReverse - Whether to use reverse mode
 */
function renderColorQuestion(container, isReverse) {
    var wrongOptions = createWrongColorOptions(colorCurrent, 3);
    var allOptions = shuffle([colorCurrent].concat(wrongOptions));

    var html = '<h2 class="game-title">Color Quiz</h2>';
    html += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    html += 'Round ' + colorRound + ' / ' + colorTotal + '</p>';
    html += buildProgressBar(colorRound, colorTotal);

    if (isReverse) {
        html += buildReverseModeHTML(colorCurrent, allOptions);
    } else {
        html += buildNormalModeHTML(colorCurrent, allOptions);
    }

    html += '<div style="text-align:center;margin-top:15px;' +
            'color:var(--gold);font-size:1.2rem">Score: ' + colorScore + '</div>';

    container.innerHTML = html;
    attachColorQuizHandlers(container);
}

/**
 * Handles correct answer
 * @private
 * @param {HTMLElement} element - Selected option element
 */
function handleCorrectAnswer(element) {
    element.classList.add('correct');
    colorScore += 100;
    gameState.correctAnswers++;

    SoundEngine.correct();
    addCombo();
    addXP(15);

    if (typeof Haptic !== "undefined" && Haptic.success) {
        Haptic.success();
    }
}

/**
 * Handles wrong answer
 * @private
 * @param {HTMLElement} element - Selected option element
 * @param {HTMLElement} container - Container element
 */
function handleWrongAnswer(element, container) {
    element.classList.add('wrong');

    SoundEngine.wrong();
    resetCombo();
    screenShake();

    // Highlight correct answer
    var allOptions = container.querySelectorAll('.quiz-option');
    for (var i = 0; i < allOptions.length; i++) {
        if (allOptions[i].getAttribute('data-answer') === colorCurrent.korean) {
            allOptions[i].classList.add('correct');
        }
    }
}

/**
 * Builds color info display HTML
 * @private
 * @param {Object} color - Color object
 * @returns {HTMLElement} Info element
 */
function buildColorInfo(color) {
    var info = document.createElement('div');
    info.style.cssText = 'margin-top:15px;text-align:center;' +
                         'background:var(--glass);padding:15px;border-radius:12px';

    info.innerHTML =
        '<span style="display:inline-block;width:30px;height:30px;' +
        'border-radius:50%;background:' + escapeHtml(color.hex) +
        ';vertical-align:middle;margin-right:8px;' +
        'border:2px solid rgba(255,255,255,0.3)"></span>' +
        '<strong style="color:var(--neon-pink)">' + escapeHtml(color.korean) + '</strong>' +
        ' <span style="color:var(--neon-cyan)">(' + escapeHtml(color.romanization) + ')</span>' +
        ' = ' + escapeHtml(color.english) +
        ' <span style="color:rgba(255,255,255,0.5)">' + escapeHtml(color.hex) + '</span>';

    return info;
}

/**
 * Attaches event handlers to quiz options
 * @private
 * @param {HTMLElement} container - Container element
 */
function attachColorQuizHandlers(container) {
    var options = container.querySelectorAll('.quiz-option');

    for (var i = 0; i < options.length; i++) {
        options[i].onclick = function () {
            if (colorAnswered) return;
            colorAnswered = true;

            var selectedAnswer = this.getAttribute('data-answer');
            var isCorrect = (selectedAnswer === colorCurrent.korean);

            if (isCorrect) {
                handleCorrectAnswer(this);
            } else {
                handleWrongAnswer(this, container);
            }

            container.appendChild(buildColorInfo(colorCurrent));

            setTimeout(function () {
                nextColorRound(container);
            }, 2200);
        };
    }
}

/**
 * Calculates accuracy percentage
 * @private
 * @param {number} score - Total score
 * @param {number} total - Total rounds
 * @returns {number} Percentage (0-100)
 */
function calculateAccuracy(score, total) {
    return Math.round((score / (total * 100)) * 100);
}

/**
 * Renders the quiz completion screen
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderColorEnd(container) {
    var accuracy = calculateAccuracy(colorScore, colorTotal);

    if (accuracy >= 80) {
        createConfetti(80);
    }

    addXP(colorScore / 10);

    var html = '<h2 class="game-title">Color Quiz Complete!</h2>';
    html += '<div style="text-align:center">';
    html += '<div style="font-size:4rem;margin:20px 0">&#127912;</div>';
    html += '<div style="font-size:2.5rem;color:var(--gold);' +
            'margin:15px 0">' + colorScore + ' pts</div>';
    html += '<p style="color:rgba(255,255,255,0.7);' +
            'margin-bottom:25px">' + accuracy + '% correct</p>';
    html += '<div class="game-controls">';
    html += '<button class="game-btn" id="colorAgainBtn">Play Again</button>';
    html += '<button class="game-btn secondary" id="colorBackBtn">Back</button>';
    html += '</div></div>';

    container.innerHTML = html;

    attachColorEndHandlers(container);
}

/**
 * Attaches event handlers to end screen buttons
 * @private
 * @param {HTMLElement} container - Container element
 */
function attachColorEndHandlers(container) {
    document.getElementById('colorAgainBtn').onclick = function () {
        showColorQuiz(container);
    };

    document.getElementById('colorBackBtn').onclick = function () {
        if (typeof showMode === "function") {
            showMode(gameState.currentMode);
        }
    };
}
