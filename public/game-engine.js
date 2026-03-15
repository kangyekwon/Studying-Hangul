/**
 * Data-Analysis Game Modes for K-POP Korean Learning Game
 * Requires: content-data.js (loaded before this file)
 * Uses global functions: getWords, shuffle, addXP, addCombo, resetCombo,
 *   SoundEngine, createConfetti, showToast, saveProgress, gameState,
 *   escapeHtml, speakKorean, collectWord, showPopup, screenShake,
 *   wordDatabase
 */

// ============================================================
// 1. WORD WEB - Radial syllable connection explorer
// ============================================================

var wordWebCenter = null;
var wordWebConnections = [];
var wordWebHistory = [];

function findRelatedBySyllable(centerWord, allWords, maxCount) {
    var related = [];
    var centerK = centerWord.korean;
    var usedIndices = {};
    for (var ci = 0; ci < centerK.length; ci++) {
        var syllable = centerK.charAt(ci);
        for (var wi = 0; wi < allWords.length; wi++) {
            if (usedIndices[wi]) continue;
            var w = allWords[wi];
            if (w.korean === centerK) continue;
            if (w.korean.indexOf(syllable) !== -1) {
                related.push({ word: w, sharedChar: syllable });
                usedIndices[wi] = true;
                if (related.length >= maxCount) return related;
            }
        }
    }
    return related;
}

function showWordWeb(c) {
    var words = getWords();
    if (words.length < 10) {
        c.innerHTML = '<h2 class="game-title">Word Web</h2>' +
            '<p style="text-align:center;color:rgba(255,255,255,0.7)">Need at least 10 words. Add more categories!</p>';
        return;
    }
    wordWebHistory = [];
    var shuffled = shuffle(words);
    wordWebCenter = shuffled[0];
    gameState.gamesPlayed++;
    saveProgress();
    renderWordWeb(c, words);
}

function renderWordWeb(c, allWords) {
    var connections = findRelatedBySyllable(wordWebCenter, allWords, 8);
    wordWebConnections = connections;

    var h = '<h2 class="game-title">Word Web</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">';
    h += 'Click any outer word to explore connections</p>';

    if (wordWebHistory.length > 0) {
        h += '<div style="text-align:center;margin-bottom:15px">';
        h += '<button class="game-btn secondary" id="webBackBtn" style="padding:8px 16px;font-size:0.85rem">';
        h += 'Back</button></div>';
    }

    h += '<div style="position:relative;width:320px;height:320px;margin:0 auto 25px">';

    // Center word
    h += '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);';
    h += 'background:linear-gradient(135deg,var(--neon-pink),var(--neon-purple));';
    h += 'border-radius:50%;width:110px;height:110px;display:flex;flex-direction:column;';
    h += 'justify-content:center;align-items:center;z-index:2;box-shadow:0 0 30px rgba(255,45,149,0.5);';
    h += 'cursor:pointer" id="webCenterNode">';
    h += '<span style="font-size:1.5rem;font-weight:bold">' + escapeHtml(wordWebCenter.korean) + '</span>';
    h += '<span style="font-size:0.65rem;color:rgba(255,255,255,0.8)">' + escapeHtml(wordWebCenter.english) + '</span>';
    h += '</div>';

    // SVG lines
    h += '<svg style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:0" viewBox="0 0 320 320">';
    var cx = 160, cy = 160;
    for (var li = 0; li < connections.length; li++) {
        var angle = (li / Math.max(connections.length, 1)) * 2 * Math.PI - Math.PI / 2;
        var ox = cx + Math.cos(angle) * 120;
        var oy = cy + Math.sin(angle) * 120;
        h += '<line x1="' + cx + '" y1="' + cy + '" x2="' + Math.round(ox) + '" y2="' + Math.round(oy) + '" ';
        h += 'stroke="rgba(157,78,221,0.4)" stroke-width="2" stroke-dasharray="4,4"/>';
    }
    h += '</svg>';

    // Outer nodes
    for (var ni = 0; ni < connections.length; ni++) {
        var conn = connections[ni];
        var a2 = (ni / Math.max(connections.length, 1)) * 2 * Math.PI - Math.PI / 2;
        var nx = 160 + Math.cos(a2) * 120 - 42;
        var ny = 160 + Math.sin(a2) * 120 - 32;
        h += '<div class="web-outer-node" data-idx="' + ni + '" style="position:absolute;';
        h += 'left:' + Math.round(nx) + 'px;top:' + Math.round(ny) + 'px;';
        h += 'background:var(--glass);backdrop-filter:blur(10px);border:1px solid rgba(0,212,255,0.4);';
        h += 'border-radius:12px;width:84px;height:64px;display:flex;flex-direction:column;';
        h += 'justify-content:center;align-items:center;cursor:pointer;transition:all 0.3s ease;z-index:1">';
        h += '<span style="font-size:1rem;font-weight:bold">' + escapeHtml(conn.word.korean) + '</span>';
        h += '<span style="font-size:0.55rem;color:rgba(255,255,255,0.6)">' + escapeHtml(conn.word.english) + '</span>';
        h += '<span style="font-size:0.5rem;color:var(--neon-cyan);margin-top:2px">';
        h += 'shared: ' + escapeHtml(conn.sharedChar) + '</span>';
        h += '</div>';
    }
    h += '</div>';

    if (connections.length === 0) {
        h += '<p style="text-align:center;color:rgba(255,255,255,0.5)">No syllable connections found. Try another word!</p>';
    }

    h += '<div style="text-align:center;margin-top:10px">';
    h += '<p style="color:rgba(255,255,255,0.5);font-size:0.8rem">Explored: ' + (wordWebHistory.length + 1) + ' words</p>';
    h += '</div>';

    c.innerHTML = h;

    // Attach events to outer nodes
    var outerNodes = c.querySelectorAll('.web-outer-node');
    for (var ei = 0; ei < outerNodes.length; ei++) {
        outerNodes[ei].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'), 10);
            var conn = wordWebConnections[idx];
            if (conn) {
                wordWebHistory.push(wordWebCenter);
                wordWebCenter = conn.word;
                collectWord(conn.word);
                addXP(5);
                speakKorean(conn.word.korean);
                SoundEngine.correct();
                renderWordWeb(c, allWords);
            }
        });
    }

    var centerNode = document.getElementById('webCenterNode');
    if (centerNode) {
        centerNode.addEventListener('click', function () {
            speakKorean(wordWebCenter.korean);
        });
    }

    var backBtn = document.getElementById('webBackBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function () {
            if (wordWebHistory.length > 0) {
                wordWebCenter = wordWebHistory.pop();
                renderWordWeb(c, allWords);
            }
        });
    }
}

// ============================================================
// 2. MIX BATTLE - Cross-category quiz
// ============================================================

var mixBattleRound = 0;
var mixBattleScore = 0;
var mixBattleTotal = 10;

function showMixBattle(c) {
    mixBattleRound = 0;
    mixBattleScore = 0;
    gameState.gamesPlayed++;
    saveProgress();
    runMixBattleRound(c);
}

function getMixCategories() {
    var cats = [];
    for (var cat in wordDatabase) {
        if (wordDatabase[cat] && wordDatabase[cat].length >= 2) {
            cats.push(cat);
        }
    }
    return cats;
}

function runMixBattleRound(c) {
    if (mixBattleRound >= mixBattleTotal) {
        renderMixBattleEnd(c);
        return;
    }

    var cats = getMixCategories();
    if (cats.length < 2) {
        c.innerHTML = '<h2 class="game-title">Mix Battle</h2>' +
            '<p style="text-align:center">Need at least 2 categories with 2+ words each.</p>';
        return;
    }

    var shuffledCats = shuffle(cats);
    var catA = shuffledCats[0];
    var catB = shuffledCats[1];
    var wordsA = shuffle(wordDatabase[catA]);
    var wordsB = shuffle(wordDatabase[catB]);
    var wordFromA = wordsA[0];
    var wordFromB = wordsB[0];

    // Randomly decide question type
    var questionType = Math.random() < 0.6 ? 'category' : 'syllable';
    var questionWord, correctAnswer, wrongAnswer, questionText;

    if (questionType === 'category') {
        // Which category does this word belong to?
        var pickA = Math.random() < 0.5;
        questionWord = pickA ? wordFromA : wordFromB;
        correctAnswer = pickA ? catA : catB;
        wrongAnswer = pickA ? catB : catA;
        questionText = 'Which category does "' + escapeHtml(questionWord.korean) +
            '" (' + escapeHtml(questionWord.english) + ') belong to?';
    } else {
        // Syllable sharing - true or false
        var charA = wordFromA.korean.charAt(0);
        var hasShared = wordFromB.korean.indexOf(charA) !== -1;
        var coinFlip = Math.random() < 0.5;
        if (coinFlip) {
            questionText = '"' + escapeHtml(wordFromA.korean) + '" and "' +
                escapeHtml(wordFromB.korean) + '" share the syllable "' +
                escapeHtml(charA) + '" - True or False?';
            correctAnswer = hasShared ? 'True' : 'False';
            wrongAnswer = hasShared ? 'False' : 'True';
        } else {
            questionText = '"' + escapeHtml(wordFromA.korean) + '" and "' +
                escapeHtml(wordFromB.korean) + '" share the syllable "' +
                escapeHtml(charA) + '" - True or False?';
            correctAnswer = hasShared ? 'True' : 'False';
            wrongAnswer = hasShared ? 'False' : 'True';
        }
    }

    var progress = Math.round((mixBattleRound / mixBattleTotal) * 100);

    var h = '<h2 class="game-title">Mix Battle</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + (mixBattleRound + 1) + ' / ' + mixBattleTotal;
    h += ' | Score: ' + mixBattleScore + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + progress + '%"></div></div>';
    h += '<div style="text-align:center;margin-bottom:10px">';
    h += '<span style="background:rgba(0,212,255,0.2);padding:4px 12px;border-radius:10px;font-size:0.8rem">';
    h += escapeHtml(catA) + '</span>';
    h += ' <span style="color:var(--neon-pink);font-weight:bold"> VS </span> ';
    h += '<span style="background:rgba(255,45,149,0.2);padding:4px 12px;border-radius:10px;font-size:0.8rem">';
    h += escapeHtml(catB) + '</span></div>';
    h += '<div style="background:var(--glass);padding:25px;border-radius:15px;margin-bottom:20px;text-align:center">';
    h += '<p style="font-size:1.15rem">' + questionText + '</p></div>';

    var options;
    if (questionType === 'category') {
        options = shuffle([
            { label: correctAnswer, isCorrect: true },
            { label: wrongAnswer, isCorrect: false }
        ]);
    } else {
        options = [
            { label: 'True', isCorrect: correctAnswer === 'True' },
            { label: 'False', isCorrect: correctAnswer === 'False' }
        ];
    }

    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">';
    for (var oi = 0; oi < options.length; oi++) {
        h += '<button class="quiz-option mix-opt" data-correct="' +
            (options[oi].isCorrect ? '1' : '0') + '">' +
            escapeHtml(options[oi].label) + '</button>';
    }
    h += '</div>';

    c.innerHTML = h;

    var opts = c.querySelectorAll('.mix-opt');
    for (var bi = 0; bi < opts.length; bi++) {
        opts[bi].addEventListener('click', function () {
            var allOpts = c.querySelectorAll('.mix-opt');
            for (var d = 0; d < allOpts.length; d++) {
                allOpts[d].style.pointerEvents = 'none';
                if (allOpts[d].getAttribute('data-correct') === '1') {
                    allOpts[d].classList.add('correct');
                }
            }
            if (this.getAttribute('data-correct') === '1') {
                mixBattleScore++;
                addXP(10);
                addCombo();
                SoundEngine.correct();
            } else {
                this.classList.add('wrong');
                resetCombo();
                SoundEngine.wrong();
                screenShake();
            }
            mixBattleRound++;
            setTimeout(function () { runMixBattleRound(c); }, 1200);
        });
    }
}

function renderMixBattleEnd(c) {
    var pct = Math.round((mixBattleScore / mixBattleTotal) * 100);
    var bonus = mixBattleScore * 5;
    addXP(bonus);
    if (pct >= 80) createConfetti(60);

    var h = '<h2 class="game-title">Mix Battle Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:15px 0">' + (pct >= 80 ? '&#127942;' : '&#128170;') + '</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:10px 0">' + mixBattleScore + ' / ' + mixBattleTotal + '</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:5px">Accuracy: ' + pct + '%</p>';
    h += '<p style="color:var(--gold);margin-bottom:20px">+' + bonus + ' XP bonus</p>';
    h += '<button class="game-btn" id="mixAgainBtn">Play Again</button></div>';
    c.innerHTML = h;

    document.getElementById('mixAgainBtn').addEventListener('click', function () {
        showMixBattle(c);
    });
}

// ============================================================
// 3. PATTERN HUNT - Find the shared pattern
// ============================================================

var patternHuntRound = 0;
var patternHuntScore = 0;
var patternHuntTotal = 8;

function showPatternHunt(c) {
    patternHuntRound = 0;
    patternHuntScore = 0;
    gameState.gamesPlayed++;
    saveProgress();
    runPatternHuntRound(c);
}

function generatePatternRound(allWords) {
    // Possible pattern types
    var patternTypes = ['first_char', 'last_char', 'length', 'category'];
    var chosenType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    var matchingWords = [];
    var patternLabel = '';
    var wrongLabels = [];
    var attempts = 0;

    if (chosenType === 'first_char' && allWords.length >= 4) {
        // Find 4 words with same first character
        var charMap = {};
        for (var fi = 0; fi < allWords.length; fi++) {
            var fc = allWords[fi].korean.charAt(0);
            if (!charMap[fc]) charMap[fc] = [];
            charMap[fc].push(allWords[fi]);
        }
        for (var ch in charMap) {
            if (charMap[ch].length >= 4) {
                matchingWords = shuffle(charMap[ch]).slice(0, 4);
                patternLabel = 'Same first syllable: ' + ch;
                wrongLabels = ['Same word length', 'Same last syllable', 'Same category'];
                break;
            }
        }
    }

    if (chosenType === 'last_char' && matchingWords.length === 0 && allWords.length >= 4) {
        var lastMap = {};
        for (var li = 0; li < allWords.length; li++) {
            var k = allWords[li].korean;
            var lc = k.charAt(k.length - 1);
            if (!lastMap[lc]) lastMap[lc] = [];
            lastMap[lc].push(allWords[li]);
        }
        for (var lch in lastMap) {
            if (lastMap[lch].length >= 4) {
                matchingWords = shuffle(lastMap[lch]).slice(0, 4);
                patternLabel = 'Same last syllable: ' + lch;
                wrongLabels = ['Same first syllable', 'Same word length', 'Same category'];
                break;
            }
        }
    }

    if (chosenType === 'length' && matchingWords.length === 0 && allWords.length >= 4) {
        var lenMap = {};
        for (var lni = 0; lni < allWords.length; lni++) {
            var ln = allWords[lni].korean.length;
            if (!lenMap[ln]) lenMap[ln] = [];
            lenMap[ln].push(allWords[lni]);
        }
        for (var lenK in lenMap) {
            if (lenMap[lenK].length >= 4) {
                matchingWords = shuffle(lenMap[lenK]).slice(0, 4);
                patternLabel = 'Same length: ' + lenK + ' syllables';
                wrongLabels = ['Same first syllable', 'Same last syllable', 'Same category'];
                break;
            }
        }
    }

    if (chosenType === 'category' && matchingWords.length === 0) {
        for (var cat in wordDatabase) {
            if (wordDatabase[cat] && wordDatabase[cat].length >= 4) {
                matchingWords = shuffle(wordDatabase[cat]).slice(0, 4);
                patternLabel = 'Same category: ' + cat;
                wrongLabels = ['Same first syllable', 'Same word length', 'Same last syllable'];
                break;
            }
        }
    }

    // Fallback: pick any 4 from same category
    if (matchingWords.length < 4) {
        for (var fcat in wordDatabase) {
            if (wordDatabase[fcat] && wordDatabase[fcat].length >= 4) {
                matchingWords = shuffle(wordDatabase[fcat]).slice(0, 4);
                patternLabel = 'Same category: ' + fcat;
                wrongLabels = ['Same first syllable', 'Same word length', 'Same last syllable'];
                break;
            }
        }
    }

    if (matchingWords.length < 4) {
        return null;
    }

    var allOptions = shuffle([patternLabel].concat(wrongLabels));
    return {
        words: matchingWords,
        correctLabel: patternLabel,
        options: allOptions
    };
}

function runPatternHuntRound(c) {
    if (patternHuntRound >= patternHuntTotal) {
        renderPatternHuntEnd(c);
        return;
    }

    var allWords = getWords();
    var round = generatePatternRound(allWords);
    if (!round) {
        c.innerHTML = '<h2 class="game-title">Pattern Hunt</h2>' +
            '<p style="text-align:center">Not enough words to generate patterns.</p>';
        return;
    }

    var progress = Math.round((patternHuntRound / patternHuntTotal) * 100);

    var h = '<h2 class="game-title">Pattern Hunt</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + (patternHuntRound + 1) + ' / ' + patternHuntTotal;
    h += ' | Score: ' + patternHuntScore + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + progress + '%"></div></div>';

    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px">';
    h += 'What pattern do these 4 words share?</p>';

    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:25px">';
    for (var wi = 0; wi < round.words.length; wi++) {
        var w = round.words[wi];
        h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.3),rgba(0,212,255,0.2));';
        h += 'border-radius:12px;padding:15px;text-align:center">';
        h += '<div style="font-size:1.4rem;font-weight:bold">' + escapeHtml(w.korean) + '</div>';
        h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.6)">' + escapeHtml(w.english) + '</div>';
        h += '</div>';
    }
    h += '</div>';

    h += '<div style="display:grid;gap:10px">';
    for (var pi = 0; pi < round.options.length; pi++) {
        var isCorrect = round.options[pi] === round.correctLabel;
        h += '<button class="quiz-option pattern-opt" data-correct="' + (isCorrect ? '1' : '0') + '">';
        h += escapeHtml(round.options[pi]) + '</button>';
    }
    h += '</div>';

    c.innerHTML = h;

    var patOpts = c.querySelectorAll('.pattern-opt');
    for (var pe = 0; pe < patOpts.length; pe++) {
        patOpts[pe].addEventListener('click', function () {
            var allPOpts = c.querySelectorAll('.pattern-opt');
            for (var d = 0; d < allPOpts.length; d++) {
                allPOpts[d].style.pointerEvents = 'none';
                if (allPOpts[d].getAttribute('data-correct') === '1') {
                    allPOpts[d].classList.add('correct');
                }
            }
            if (this.getAttribute('data-correct') === '1') {
                patternHuntScore++;
                addXP(15);
                addCombo();
                SoundEngine.correct();
            } else {
                this.classList.add('wrong');
                resetCombo();
                SoundEngine.wrong();
            }
            patternHuntRound++;
            setTimeout(function () { runPatternHuntRound(c); }, 1200);
        });
    }
}

function renderPatternHuntEnd(c) {
    var pct = Math.round((patternHuntScore / patternHuntTotal) * 100);
    var bonus = patternHuntScore * 8;
    addXP(bonus);
    if (pct >= 80) createConfetti(60);

    var h = '<h2 class="game-title">Pattern Hunt Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:15px 0">' + (pct >= 80 ? '&#128269;' : '&#129300;') + '</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:10px 0">' + patternHuntScore + ' / ' + patternHuntTotal + '</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:5px">Accuracy: ' + pct + '%</p>';
    h += '<p style="color:var(--gold);margin-bottom:20px">+' + bonus + ' XP bonus</p>';
    h += '<button class="game-btn" id="patternAgainBtn">Play Again</button></div>';
    c.innerHTML = h;

    document.getElementById('patternAgainBtn').addEventListener('click', function () {
        showPatternHunt(c);
    });
}

// ============================================================
// 4. REVERSE QUIZ - Type Korean from English + romanization
// ============================================================

var reverseQuizWords = [];
var reverseQuizIdx = 0;
var reverseQuizScore = 0;
var reverseQuizTotal = 10;
var reverseQuizHints = 0;

function showReverseQuiz(c) {
    var words = getWords();
    if (words.length < 10) {
        c.innerHTML = '<h2 class="game-title">Reverse Quiz</h2>' +
            '<p style="text-align:center">Need at least 10 words.</p>';
        return;
    }
    reverseQuizWords = shuffle(words).slice(0, reverseQuizTotal);
    reverseQuizIdx = 0;
    reverseQuizScore = 0;
    reverseQuizHints = 0;
    gameState.gamesPlayed++;
    saveProgress();
    renderReverseQuizQuestion(c);
}

function renderReverseQuizQuestion(c) {
    if (reverseQuizIdx >= reverseQuizTotal) {
        renderReverseQuizEnd(c);
        return;
    }

    var w = reverseQuizWords[reverseQuizIdx];
    var progress = Math.round((reverseQuizIdx / reverseQuizTotal) * 100);

    var h = '<h2 class="game-title">Reverse Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Question ' + (reverseQuizIdx + 1) + ' / ' + reverseQuizTotal;
    h += ' | Score: ' + reverseQuizScore + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + progress + '%"></div></div>';

    h += '<div style="text-align:center;margin-bottom:25px">';
    h += '<p style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin-bottom:8px">English meaning:</p>';
    h += '<div style="font-size:2rem;font-weight:bold;color:var(--neon-cyan);margin-bottom:12px">';
    h += escapeHtml(w.english) + '</div>';
    h += '<p style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin-bottom:5px">Romanization hint:</p>';
    h += '<div style="font-size:1.2rem;color:var(--neon-pink)">' + escapeHtml(w.romanization) + '</div>';
    h += '</div>';

    h += '<div style="text-align:center;margin-bottom:15px">';
    h += '<div id="reverseHintArea" style="min-height:30px;margin-bottom:10px;color:var(--gold);font-size:1.1rem"></div>';
    h += '<input type="text" class="speed-input" id="reverseInput" placeholder="Type Korean here..." autocomplete="off">';
    h += '</div>';

    h += '<div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap">';
    h += '<button class="game-btn" id="reverseSubmitBtn">Check Answer</button>';
    h += '<button class="game-btn secondary" id="reverseHintBtn">Hint</button>';
    h += '<button class="game-btn secondary" id="reverseSkipBtn">Skip</button>';
    h += '</div>';

    h += '<div id="reverseFeedback" style="text-align:center;margin-top:15px;min-height:30px"></div>';

    c.innerHTML = h;

    var input = document.getElementById('reverseInput');
    var hintBtn = document.getElementById('reverseHintBtn');
    var submitBtn = document.getElementById('reverseSubmitBtn');
    var skipBtn = document.getElementById('reverseSkipBtn');
    var hintArea = document.getElementById('reverseHintArea');
    var feedback = document.getElementById('reverseFeedback');
    var localHintLevel = 0;

    if (input) input.focus();

    function checkAnswer() {
        var answer = input.value.trim();
        if (answer === '') return;
        submitBtn.style.pointerEvents = 'none';
        hintBtn.style.pointerEvents = 'none';
        skipBtn.style.pointerEvents = 'none';
        input.disabled = true;

        if (answer === w.korean) {
            reverseQuizScore++;
            addXP(localHintLevel === 0 ? 20 : 10);
            addCombo();
            collectWord(w);
            SoundEngine.correct();
            speakKorean(w.korean);
            feedback.innerHTML = '<span style="color:#00f5d4;font-size:1.2rem">Correct! ' +
                escapeHtml(w.korean) + '</span>';
        } else {
            resetCombo();
            SoundEngine.wrong();
            feedback.innerHTML = '<span style="color:#ff6b81">Wrong! The answer was: ' +
                escapeHtml(w.korean) + '</span>';
        }
        reverseQuizIdx++;
        setTimeout(function () { renderReverseQuizQuestion(c); }, 1800);
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', checkAnswer);
    }
    if (input) {
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') checkAnswer();
        });
    }

    if (hintBtn) {
        hintBtn.addEventListener('click', function () {
            localHintLevel++;
            reverseQuizHints++;
            var hintText = w.korean.substring(0, Math.min(localHintLevel, w.korean.length));
            var remaining = w.korean.length - localHintLevel;
            if (remaining <= 0) {
                hintArea.textContent = 'Full answer: ' + w.korean;
            } else {
                hintArea.textContent = 'Starts with: ' + hintText + ' (' + remaining + ' more)';
            }
        });
    }

    if (skipBtn) {
        skipBtn.addEventListener('click', function () {
            resetCombo();
            feedback.innerHTML = '<span style="color:rgba(255,255,255,0.6)">Skipped. Answer: ' +
                escapeHtml(w.korean) + '</span>';
            reverseQuizIdx++;
            setTimeout(function () { renderReverseQuizQuestion(c); }, 1500);
        });
    }
}

function renderReverseQuizEnd(c) {
    var pct = Math.round((reverseQuizScore / reverseQuizTotal) * 100);
    var bonus = reverseQuizScore * 10;
    addXP(bonus);
    if (pct >= 80) createConfetti(60);

    var h = '<h2 class="game-title">Reverse Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:15px 0">' + (pct >= 80 ? '&#127775;' : '&#9997;') + '</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:10px 0">' + reverseQuizScore + ' / ' + reverseQuizTotal + '</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:3px">Accuracy: ' + pct + '%</p>';
    h += '<p style="color:rgba(255,255,255,0.5);margin-bottom:5px">Hints used: ' + reverseQuizHints + '</p>';
    h += '<p style="color:var(--gold);margin-bottom:20px">+' + bonus + ' XP bonus</p>';
    h += '<button class="game-btn" id="reverseAgainBtn">Play Again</button></div>';
    c.innerHTML = h;

    document.getElementById('reverseAgainBtn').addEventListener('click', function () {
        showReverseQuiz(c);
    });
}

// ============================================================
// 5. WORD STORY - Fill-in-the-blank story builder
// ============================================================

var storyTemplates = [
    { text: "I went to ___[place] and ate ___[food].", blanks: [{ tag: "place", cats: ["travel", "daily"] }, { tag: "food", cats: ["kfood", "daily"] }] },
    { text: "My friend said ___[greeting] and I replied ___[response].", blanks: [{ tag: "greeting", cats: ["sentences", "daily"] }, { tag: "response", cats: ["sentences", "daily"] }] },
    { text: "Today I feel ___[emotion] because I learned ___[word].", blanks: [{ tag: "emotion", cats: ["emotions"] }, { tag: "word", cats: ["all"] }] },
    { text: "At the ___[place], I heard someone say ___[phrase].", blanks: [{ tag: "place", cats: ["travel", "daily"] }, { tag: "phrase", cats: ["sentences", "kdrama"] }] },
    { text: "The ___[food] at the restaurant was ___[feeling]!", blanks: [{ tag: "food", cats: ["kfood", "daily"] }, { tag: "feeling", cats: ["emotions"] }] },
    { text: "During ___[holiday], families enjoy ___[activity].", blanks: [{ tag: "holiday", cats: ["holidays", "kculture"] }, { tag: "activity", cats: ["daily", "kculture"] }] },
    { text: "I told my ___[person] that I would ___[action].", blanks: [{ tag: "person", cats: ["familyterms", "daily"] }, { tag: "action", cats: ["daily", "sentences"] }] },
    { text: "On ___[day], I went to ___[place] with friends.", blanks: [{ tag: "day", cats: ["weekdays", "daily"] }, { tag: "place", cats: ["travel", "daily"] }] },
    { text: "The K-Drama character said ___[quote] and everyone was ___[emotion].", blanks: [{ tag: "quote", cats: ["dramaquotes", "kdrama", "sentences"] }, { tag: "emotion", cats: ["emotions"] }] },
    { text: "I want to learn ___[topic] and practice ___[skill].", blanks: [{ tag: "topic", cats: ["topik", "daily"] }, { tag: "skill", cats: ["daily", "sentences"] }] },
    { text: "In Korea, people greet with ___[greeting] on ___[occasion].", blanks: [{ tag: "greeting", cats: ["sentences", "daily"] }, { tag: "occasion", cats: ["holidays", "kculture"] }] },
    { text: "My favorite Korean ___[food] is served at ___[place].", blanks: [{ tag: "food", cats: ["kfood", "daily"] }, { tag: "place", cats: ["travel", "daily"] }] },
    { text: "When I am ___[emotion], I listen to ___[genre] music.", blanks: [{ tag: "emotion", cats: ["emotions"] }, { tag: "genre", cats: ["kculture", "daily"] }] },
    { text: "___[person] always says ___[expression] to cheer me up.", blanks: [{ tag: "person", cats: ["familyterms", "daily"] }, { tag: "expression", cats: ["sentences", "slang"] }] },
    { text: "Travel to ___[destination] and try ___[local food]!", blanks: [{ tag: "destination", cats: ["travel"] }, { tag: "local food", cats: ["kfood", "daily"] }] }
];

var wordStoryTemplate = null;
var wordStoryBlanks = [];
var wordStoryOptions = [];
var wordStorySelections = [];

function getWordsForCats(cats) {
    var words = [];
    for (var ci = 0; ci < cats.length; ci++) {
        var cat = cats[ci];
        if (cat === 'all') {
            return getWords();
        }
        if (wordDatabase[cat]) {
            words = words.concat(wordDatabase[cat]);
        }
    }
    if (words.length === 0) {
        return getWords();
    }
    return words;
}

function showWordStory(c) {
    var tpl = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];
    wordStoryTemplate = tpl;
    wordStoryBlanks = [];
    wordStoryOptions = [];
    wordStorySelections = [];

    for (var bi = 0; bi < tpl.blanks.length; bi++) {
        var blankDef = tpl.blanks[bi];
        var available = shuffle(getWordsForCats(blankDef.cats));
        var optionSet = available.slice(0, Math.min(4, available.length));
        wordStoryOptions.push(optionSet);
        wordStorySelections.push(0);
    }

    gameState.gamesPlayed++;
    saveProgress();
    renderWordStory(c);
}

function renderWordStory(c) {
    var tpl = wordStoryTemplate;
    var h = '<h2 class="game-title">Word Story</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">';
    h += 'Click the blanks to cycle through word options, then complete the story!</p>';

    // Build story display with clickable blanks
    var storyParts = tpl.text.split(/___\[[^\]]+\]/);
    var blankMatches = tpl.text.match(/___\[[^\]]+\]/g) || [];

    h += '<div style="background:var(--glass);padding:25px;border-radius:15px;margin-bottom:25px;';
    h += 'font-size:1.2rem;line-height:2.2;text-align:center">';

    for (var si = 0; si < storyParts.length; si++) {
        h += escapeHtml(storyParts[si]);
        if (si < blankMatches.length) {
            var selIdx = wordStorySelections[si];
            var opts = wordStoryOptions[si];
            var selectedWord = opts[selIdx];
            h += '<span class="story-blank" data-blank="' + si + '" style="display:inline-block;';
            h += 'background:linear-gradient(135deg,var(--neon-pink),var(--neon-purple));';
            h += 'padding:4px 14px;border-radius:10px;cursor:pointer;margin:0 4px;';
            h += 'transition:all 0.2s ease;font-weight:bold">';
            h += escapeHtml(selectedWord.korean);
            h += '<span style="font-size:0.7rem;display:block;opacity:0.8">';
            h += escapeHtml(selectedWord.english) + '</span>';
            h += '</span>';
        }
    }
    h += '</div>';

    // Word options reference
    h += '<div style="margin-bottom:20px">';
    for (var ri = 0; ri < wordStoryOptions.length; ri++) {
        var blankTag = tpl.blanks[ri].tag;
        h += '<div style="margin-bottom:10px">';
        h += '<span style="color:var(--neon-cyan);font-size:0.85rem">' + escapeHtml(blankTag) + ' options: </span>';
        for (var owi = 0; owi < wordStoryOptions[ri].length; owi++) {
            var isSelected = owi === wordStorySelections[ri];
            h += '<span style="display:inline-block;padding:3px 10px;margin:2px;border-radius:8px;';
            h += 'font-size:0.85rem;';
            if (isSelected) {
                h += 'background:var(--neon-purple);color:#fff">';
            } else {
                h += 'background:var(--glass);color:rgba(255,255,255,0.6)">';
            }
            h += escapeHtml(wordStoryOptions[ri][owi].korean) + '</span>';
        }
        h += '</div>';
    }
    h += '</div>';

    h += '<div style="text-align:center">';
    h += '<button class="game-btn" id="storyCompleteBtn">Complete Story</button></div>';

    c.innerHTML = h;

    // Attach click events to blanks
    var blanks = c.querySelectorAll('.story-blank');
    for (var be = 0; be < blanks.length; be++) {
        blanks[be].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-blank'), 10);
            wordStorySelections[idx] = (wordStorySelections[idx] + 1) % wordStoryOptions[idx].length;
            SoundEngine.correct();
            var selectedW = wordStoryOptions[idx][wordStorySelections[idx]];
            speakKorean(selectedW.korean);
            renderWordStory(c);
        });
    }

    var completeBtn = document.getElementById('storyCompleteBtn');
    if (completeBtn) {
        completeBtn.addEventListener('click', function () {
            // Collect all selected words
            var totalXP = 0;
            for (var cw = 0; cw < wordStoryOptions.length; cw++) {
                var sw = wordStoryOptions[cw][wordStorySelections[cw]];
                collectWord(sw);
                totalXP += 10;
            }
            addXP(totalXP);
            createConfetti(40);
            SoundEngine.correct();

            var finH = '<h2 class="game-title">Story Complete!</h2>';
            finH += '<div style="text-align:center">';
            finH += '<div style="font-size:3rem;margin:15px 0">&#128214;</div>';
            finH += '<div style="background:var(--glass);padding:20px;border-radius:15px;';
            finH += 'margin-bottom:20px;font-size:1.1rem;line-height:2">';

            for (var fsi = 0; fsi < storyParts.length; fsi++) {
                finH += escapeHtml(storyParts[fsi]);
                if (fsi < blankMatches.length) {
                    var fWord = wordStoryOptions[fsi][wordStorySelections[fsi]];
                    finH += '<strong style="color:var(--neon-pink)">' + escapeHtml(fWord.korean) + '</strong>';
                }
            }
            finH += '</div>';
            finH += '<p style="color:var(--gold);margin-bottom:20px">+' + totalXP + ' XP earned!</p>';
            finH += '<button class="game-btn" id="storyAgainBtn">New Story</button></div>';
            c.innerHTML = finH;

            document.getElementById('storyAgainBtn').addEventListener('click', function () {
                showWordStory(c);
            });
        });
    }
}

// ============================================================
// 6. DIFFICULTY TOWER - 10 floors of increasing challenge
// ============================================================

var towerFloor = 0;
var towerMaxFloor = 10;
var towerScore = 0;
var towerTimerInterval = null;
var towerTimeLeft = 0;

function getWordDifficulty(word) {
    var rarityScore = 0;
    if (word.rarity === 'common') rarityScore = 1;
    else if (word.rarity === 'rare') rarityScore = 2;
    else if (word.rarity === 'epic') rarityScore = 3;
    else if (word.rarity === 'legendary') rarityScore = 4;
    else rarityScore = 1;
    return word.korean.length + rarityScore;
}

function showDifficultyTower(c) {
    towerFloor = 0;
    towerScore = 0;
    if (towerTimerInterval) clearInterval(towerTimerInterval);
    gameState.gamesPlayed++;
    saveProgress();
    renderTowerFloor(c);
}

function renderTowerFloor(c) {
    if (towerFloor >= towerMaxFloor) {
        renderTowerVictory(c);
        return;
    }

    var allWords = getWords();
    if (allWords.length < 4) {
        c.innerHTML = '<h2 class="game-title">Difficulty Tower</h2>' +
            '<p style="text-align:center">Need at least 4 words.</p>';
        return;
    }

    // Sort by difficulty and pick word for this floor
    var targetDifficulty = towerFloor + 2;
    var scored = [];
    for (var sw = 0; sw < allWords.length; sw++) {
        scored.push({ word: allWords[sw], diff: getWordDifficulty(allWords[sw]) });
    }
    scored.sort(function (a, b) { return a.diff - b.diff; });

    // Pick word closest to target difficulty
    var bestIdx = 0;
    var bestDist = 9999;
    for (var bi = 0; bi < scored.length; bi++) {
        var dist = Math.abs(scored[bi].diff - targetDifficulty);
        if (dist < bestDist) {
            bestDist = dist;
            bestIdx = bi;
        }
    }
    var chosenWord = scored[bestIdx].word;

    // Generate wrong options
    var wrongPool = shuffle(allWords.filter(function (w) { return w.korean !== chosenWord.korean; }));
    var wrongWords = wrongPool.slice(0, 3);
    var options = shuffle([chosenWord].concat(wrongWords));

    // Timer: decreases with floor (15s floor 1, down to 6s floor 10)
    var timerSeconds = Math.max(6, 15 - towerFloor);
    towerTimeLeft = timerSeconds;

    var floorColors = [
        'rgba(0,212,255,0.3)', 'rgba(0,245,212,0.3)', 'rgba(157,78,221,0.3)',
        'rgba(255,45,149,0.3)', 'rgba(255,215,0,0.3)', 'rgba(255,107,53,0.3)',
        'rgba(255,45,149,0.4)', 'rgba(157,78,221,0.4)', 'rgba(255,215,0,0.4)',
        'rgba(255,0,0,0.4)'
    ];
    var bgColor = floorColors[towerFloor] || 'rgba(157,78,221,0.3)';

    var h = '<h2 class="game-title">Difficulty Tower</h2>';

    // Tower visualization
    h += '<div style="display:flex;justify-content:center;gap:4px;margin-bottom:15px">';
    for (var fi = towerMaxFloor - 1; fi >= 0; fi--) {
        var floorStyle = 'width:28px;height:18px;border-radius:4px;display:inline-block;';
        if (fi < towerFloor) {
            floorStyle += 'background:var(--neon-cyan);';
        } else if (fi === towerFloor) {
            floorStyle += 'background:var(--neon-pink);animation:pulse 0.8s infinite;';
        } else {
            floorStyle += 'background:rgba(255,255,255,0.1);';
        }
        h += '<div style="' + floorStyle + '" title="Floor ' + (fi + 1) + '"></div>';
    }
    h += '</div>';

    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:5px">';
    h += 'Floor ' + (towerFloor + 1) + ' / ' + towerMaxFloor + '</p>';
    h += '<div class="speed-timer" id="towerTimer">' + towerTimeLeft + '</div>';

    h += '<div style="background:' + bgColor + ';padding:30px;border-radius:15px;text-align:center;margin-bottom:20px">';
    h += '<div style="font-size:2.8rem;font-weight:bold;margin-bottom:8px">' + escapeHtml(chosenWord.korean) + '</div>';
    h += '<div style="font-size:1rem;color:rgba(255,255,255,0.7)">' + escapeHtml(chosenWord.romanization) + '</div>';
    h += '</div>';

    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:12px;font-size:0.9rem">';
    h += 'Choose the correct English meaning:</p>';

    h += '<div class="quiz-options">';
    for (var oi = 0; oi < options.length; oi++) {
        var isCorrect = options[oi].korean === chosenWord.korean;
        h += '<button class="quiz-option tower-opt" data-correct="' + (isCorrect ? '1' : '0') + '">';
        h += escapeHtml(options[oi].english) + '</button>';
    }
    h += '</div>';

    c.innerHTML = h;

    // Start timer
    if (towerTimerInterval) clearInterval(towerTimerInterval);
    var timerEl = document.getElementById('towerTimer');
    towerTimerInterval = setInterval(function () {
        towerTimeLeft--;
        if (timerEl) {
            timerEl.textContent = towerTimeLeft;
            if (towerTimeLeft <= 3) {
                timerEl.classList.add('urgent');
            }
        }
        if (towerTimeLeft <= 0) {
            clearInterval(towerTimerInterval);
            towerTimerInterval = null;
            renderTowerGameOver(c, 'Time ran out!');
        }
    }, 1000);

    // Attach events
    var towerOpts = c.querySelectorAll('.tower-opt');
    for (var te = 0; te < towerOpts.length; te++) {
        towerOpts[te].addEventListener('click', function () {
            clearInterval(towerTimerInterval);
            towerTimerInterval = null;

            var allTOpts = c.querySelectorAll('.tower-opt');
            for (var d = 0; d < allTOpts.length; d++) {
                allTOpts[d].style.pointerEvents = 'none';
                if (allTOpts[d].getAttribute('data-correct') === '1') {
                    allTOpts[d].classList.add('correct');
                }
            }

            if (this.getAttribute('data-correct') === '1') {
                towerScore++;
                towerFloor++;
                addXP(10 + towerFloor * 3);
                addCombo();
                collectWord(chosenWord);
                SoundEngine.correct();
                speakKorean(chosenWord.korean);
                setTimeout(function () { renderTowerFloor(c); }, 1000);
            } else {
                this.classList.add('wrong');
                resetCombo();
                SoundEngine.wrong();
                screenShake();
                setTimeout(function () {
                    renderTowerGameOver(c, 'Wrong answer!');
                }, 800);
            }
        });
    }
}

function renderTowerGameOver(c, reason) {
    if (towerTimerInterval) clearInterval(towerTimerInterval);
    towerTimerInterval = null;
    var bonus = towerFloor * 8;
    addXP(bonus);
    if (towerFloor >= 5) createConfetti(30);

    var h = '<h2 class="game-title">Tower Over!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:3rem;margin:15px 0">&#127960;</div>';
    h += '<p style="color:#ff6b81;font-size:1.1rem;margin-bottom:10px">' + escapeHtml(reason) + '</p>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:10px 0">';
    h += 'Floor ' + towerFloor + ' / ' + towerMaxFloor + '</div>';
    h += '<p style="color:var(--gold);margin-bottom:5px">+' + bonus + ' XP earned</p>';

    // Floor progress visual
    h += '<div style="display:flex;justify-content:center;gap:6px;margin:15px 0">';
    for (var vi = 0; vi < towerMaxFloor; vi++) {
        var vStyle = 'width:24px;height:24px;border-radius:6px;display:inline-flex;';
        vStyle += 'align-items:center;justify-content:center;font-size:0.7rem;';
        if (vi < towerFloor) {
            vStyle += 'background:var(--neon-cyan);color:#000;';
        } else if (vi === towerFloor) {
            vStyle += 'background:#ff4757;color:#fff;';
        } else {
            vStyle += 'background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.3);';
        }
        h += '<div style="' + vStyle + '">' + (vi + 1) + '</div>';
    }
    h += '</div>';

    h += '<button class="game-btn" id="towerAgainBtn" style="margin-top:15px">Try Again</button></div>';
    c.innerHTML = h;

    document.getElementById('towerAgainBtn').addEventListener('click', function () {
        showDifficultyTower(c);
    });
}

function renderTowerVictory(c) {
    if (towerTimerInterval) clearInterval(towerTimerInterval);
    towerTimerInterval = null;
    var bonus = towerMaxFloor * 15;
    addXP(bonus);
    createConfetti(100);

    var h = '<h2 class="game-title">Tower Conquered!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:15px 0">&#127942;</div>';
    h += '<div style="font-size:2rem;color:var(--gold);margin:10px 0">All ' + towerMaxFloor + ' floors cleared!</div>';
    h += '<p style="color:var(--gold);font-size:1.2rem;margin-bottom:20px">+' + bonus + ' XP bonus</p>';
    h += '<button class="game-btn" id="towerAgainBtn">Play Again</button></div>';
    c.innerHTML = h;

    document.getElementById('towerAgainBtn').addEventListener('click', function () {
        showDifficultyTower(c);
    });
}
