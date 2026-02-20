/**
 * Social & Competitive Features for K-POP Korean Learning Game
 * Requires: index.html globals (wordDatabase, gameState, getWords, shuffle,
 *   addXP, createConfetti, SoundEngine, escapeHtml, saveProgress, showToast,
 *   collectWord, addCombo, resetCombo, screenShake, speakKorean, createSparkle)
 */

// ============================================================
// 1. DAILY CHALLENGE SYSTEM
// ============================================================

var dailyChallengeState = {
    round: 0,
    phase: 'menu',
    score: 0,
    speedWords: [],
    speedIndex: 0,
    speedCorrect: 0,
    speedTimer: null,
    speedTimeLeft: 0,
    accuracyWords: [],
    accuracyIndex: 0,
    accuracyMistakes: 0,
    chainWords: [],
    chainCurrent: '',
    chainScore: 0,
    chainUsed: []
};

function getDailySeed() {
    var dateStr = new Date().toDateString();
    var hash = 0;
    for (var i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function seededShuffle(arr, seed) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        seed++;
        var j = Math.floor(seededRandom(seed) * (i + 1));
        var t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    return a;
}

function isDailyChallengeCompleted() {
    var key = 'kpop_daily_' + new Date().toDateString();
    return localStorage.getItem(key) !== null;
}

function saveDailyChallengeResult(score) {
    var key = 'kpop_daily_' + new Date().toDateString();
    localStorage.setItem(key, JSON.stringify({ score: score, time: Date.now() }));
}

function getDailyLeaderboard() {
    var seed = getDailySeed();
    var names = ['MinJi', 'TaeHyun', 'SooYeon', 'JiHoon', 'HaNa',
        'DongWoo', 'YuNa', 'SungMin', 'EunBi', 'JaeWon',
        'SoHee', 'HyunWoo', 'MiRan', 'KiBum', 'BoRa'];
    var board = [];
    for (var i = 0; i < 10; i++) {
        seed++;
        var aiScore = Math.floor(seededRandom(seed) * 200) + 100 + (10 - i) * 20;
        board.push({
            name: names[Math.floor(seededRandom(seed + 99) * names.length)],
            score: aiScore,
            isAI: true
        });
    }
    board.sort(function (a, b) { return b.score - a.score; });
    return board;
}

function showDailyChallenge(c) {
    dailyChallengeState.round = 0;
    dailyChallengeState.phase = 'menu';
    dailyChallengeState.score = 0;
    gameState.gamesPlayed++;
    saveProgress();
    renderDailyChallengeMenu(c);
}

function renderDailyChallengeMenu(c) {
    var completed = isDailyChallengeCompleted();
    var saved = completed ? JSON.parse(localStorage.getItem('kpop_daily_' + new Date().toDateString())) : null;
    var board = getDailyLeaderboard();
    var today = new Date();
    var dateDisplay = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

    var h = '<div class="game-title">Daily Challenge</div>';
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<div style="font-size:0.9rem;color:rgba(255,255,255,0.6);">' + escapeHtml(dateDisplay) + '</div>';
    if (completed) {
        h += '<div style="margin:15px auto;display:inline-block;background:linear-gradient(135deg,var(--gold),#ffaa00);color:#000;padding:10px 25px;border-radius:20px;font-weight:bold;">';
        h += 'Completed Today! Score: ' + saved.score + '</div>';
    }
    h += '</div>';

    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-bottom:25px;">';
    var rounds = [
        { icon: 'R1', title: 'Speed Round', desc: '10 words, beat the clock!' },
        { icon: 'R2', title: 'Accuracy Round', desc: '5 hard words, no mistakes!' },
        { icon: 'R3', title: 'Bonus Round', desc: 'Word chain challenge!' }
    ];
    for (var i = 0; i < rounds.length; i++) {
        h += '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:15px;text-align:center;">';
        h += '<div style="font-size:1.5rem;margin-bottom:8px;background:linear-gradient(135deg,var(--neon-pink),var(--neon-purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:bold;">' + rounds[i].icon + '</div>';
        h += '<div style="font-weight:bold;margin-bottom:5px;">' + escapeHtml(rounds[i].title) + '</div>';
        h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.6);">' + escapeHtml(rounds[i].desc) + '</div>';
        h += '</div>';
    }
    h += '</div>';

    if (!completed) {
        h += '<div style="text-align:center;margin-bottom:25px;">';
        h += '<button class="game-btn" id="dcStart">Begin Challenge</button>';
        h += '</div>';
    }

    h += '<div style="background:var(--glass);border:1px solid rgba(0,212,255,0.3);border-radius:15px;padding:20px;">';
    h += '<div style="text-align:center;font-weight:bold;margin-bottom:15px;color:var(--neon-cyan);">Today\'s Leaderboard</div>';
    var userRank = -1;
    if (completed) {
        board.push({ name: 'You', score: saved.score, isAI: false });
        board.sort(function (a, b) { return b.score - a.score; });
    }
    for (var j = 0; j < Math.min(board.length, 10); j++) {
        var entry = board[j];
        var isUser = !entry.isAI;
        if (isUser) userRank = j + 1;
        var bg = isUser ? 'background:rgba(255,45,149,0.2);border:1px solid var(--neon-pink);' : '';
        var medal = j === 0 ? ' [1st]' : j === 1 ? ' [2nd]' : j === 2 ? ' [3rd]' : '';
        h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-radius:10px;margin-bottom:4px;' + bg + '">';
        h += '<span style="color:rgba(255,255,255,0.5);width:30px;">#' + (j + 1) + '</span>';
        h += '<span style="flex:1;">' + escapeHtml(entry.name) + escapeHtml(medal) + '</span>';
        h += '<span style="font-weight:bold;color:var(--neon-cyan);">' + entry.score + '</span>';
        h += '</div>';
    }
    h += '</div>';

    c.innerHTML = h;

    var startBtn = document.getElementById('dcStart');
    if (startBtn) {
        startBtn.addEventListener('click', function () {
            startDailySpeedRound(c);
        });
    }
}

function startDailySpeedRound(c) {
    var seed = getDailySeed();
    var allWords = getWords();
    if (allWords.length < 10) {
        showToast('Not enough words loaded');
        return;
    }
    var selected = seededShuffle(allWords, seed).slice(0, 10);
    dailyChallengeState.speedWords = selected;
    dailyChallengeState.speedIndex = 0;
    dailyChallengeState.speedCorrect = 0;
    dailyChallengeState.speedTimeLeft = 60;
    dailyChallengeState.phase = 'speed';
    renderDailySpeed(c);
    dailyChallengeState.speedTimer = setInterval(function () {
        dailyChallengeState.speedTimeLeft--;
        var timerEl = document.getElementById('dcSpeedTimer');
        if (timerEl) timerEl.textContent = dailyChallengeState.speedTimeLeft + 's';
        if (dailyChallengeState.speedTimeLeft <= 0) {
            clearInterval(dailyChallengeState.speedTimer);
            dailyChallengeState.score += dailyChallengeState.speedCorrect * 20;
            startDailyAccuracyRound(c);
        }
    }, 1000);
}

function renderDailySpeed(c) {
    if (dailyChallengeState.speedIndex >= dailyChallengeState.speedWords.length) {
        clearInterval(dailyChallengeState.speedTimer);
        dailyChallengeState.score += dailyChallengeState.speedCorrect * 20;
        var bonus = Math.max(0, dailyChallengeState.speedTimeLeft) * 2;
        dailyChallengeState.score += bonus;
        startDailyAccuracyRound(c);
        return;
    }
    var word = dailyChallengeState.speedWords[dailyChallengeState.speedIndex];
    var allWords = getWords();
    var wrongAnswers = shuffle(allWords.filter(function (w) {
        return w.english !== word.english;
    })).slice(0, 3);
    var options = shuffle([word].concat(wrongAnswers));

    var h = '<div class="game-title">Speed Round</div>';
    h += '<div style="display:flex;justify-content:space-between;margin-bottom:15px;">';
    h += '<div style="color:var(--neon-cyan);">Word ' + (dailyChallengeState.speedIndex + 1) + '/10</div>';
    h += '<div id="dcSpeedTimer" style="color:var(--fire);font-weight:bold;font-size:1.2rem;">' + dailyChallengeState.speedTimeLeft + 's</div>';
    h += '<div style="color:var(--gold);">Correct: ' + dailyChallengeState.speedCorrect + '</div>';
    h += '</div>';
    h += '<div style="text-align:center;margin-bottom:25px;">';
    h += '<div style="font-size:3rem;margin-bottom:10px;">' + escapeHtml(word.korean) + '</div>';
    if (word.romanization) {
        h += '<div style="color:rgba(255,255,255,0.6);font-size:1rem;">' + escapeHtml(word.romanization) + '</div>';
    }
    h += '</div>';
    h += '<div class="quiz-options">';
    for (var i = 0; i < options.length; i++) {
        h += '<button class="quiz-option dcSpeedOpt" data-idx="' + i + '">' + escapeHtml(options[i].english) + '</button>';
    }
    h += '</div>';
    c.innerHTML = h;

    var btns = c.querySelectorAll('.dcSpeedOpt');
    for (var j = 0; j < btns.length; j++) {
        btns[j].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            if (options[idx].english === word.english) {
                dailyChallengeState.speedCorrect++;
                SoundEngine.correct();
                addCombo();
                this.style.background = 'linear-gradient(135deg,#00d4ff,#00f5d4)';
            } else {
                SoundEngine.wrong();
                resetCombo();
                this.style.background = 'linear-gradient(135deg,#ff4757,#ff6b81)';
            }
            dailyChallengeState.speedIndex++;
            setTimeout(function () { renderDailySpeed(c); }, 400);
        });
    }
}

function startDailyAccuracyRound(c) {
    var seed = getDailySeed() + 1000;
    var allWords = getWords();
    var selected = seededShuffle(allWords, seed).slice(0, 5);
    dailyChallengeState.accuracyWords = selected;
    dailyChallengeState.accuracyIndex = 0;
    dailyChallengeState.accuracyMistakes = 0;
    dailyChallengeState.phase = 'accuracy';
    renderDailyAccuracy(c);
}

function renderDailyAccuracy(c) {
    if (dailyChallengeState.accuracyIndex >= dailyChallengeState.accuracyWords.length) {
        var perfect = dailyChallengeState.accuracyMistakes === 0;
        dailyChallengeState.score += perfect ? 100 : Math.max(0, 60 - dailyChallengeState.accuracyMistakes * 20);
        startDailyChainRound(c);
        return;
    }
    var word = dailyChallengeState.accuracyWords[dailyChallengeState.accuracyIndex];
    var allWords = getWords();
    var wrongAnswers = shuffle(allWords.filter(function (w) {
        return w.english !== word.english;
    })).slice(0, 3);
    var options = shuffle([word].concat(wrongAnswers));

    var h = '<div class="game-title">Accuracy Round</div>';
    h += '<div style="text-align:center;margin-bottom:10px;color:var(--fire);font-weight:bold;">';
    h += 'No mistakes allowed! (' + dailyChallengeState.accuracyMistakes + ' errors)</div>';
    h += '<div style="text-align:center;margin-bottom:10px;color:rgba(255,255,255,0.5);">';
    h += 'Word ' + (dailyChallengeState.accuracyIndex + 1) + '/5</div>';
    h += '<div style="text-align:center;margin-bottom:25px;">';
    h += '<div style="font-size:3rem;margin-bottom:10px;">' + escapeHtml(word.korean) + '</div>';
    if (word.romanization) {
        h += '<div style="color:rgba(255,255,255,0.6);">' + escapeHtml(word.romanization) + '</div>';
    }
    h += '</div>';
    h += '<div class="quiz-options">';
    for (var i = 0; i < options.length; i++) {
        h += '<button class="quiz-option dcAccOpt" data-idx="' + i + '">' + escapeHtml(options[i].english) + '</button>';
    }
    h += '</div>';
    c.innerHTML = h;

    var btns = c.querySelectorAll('.dcAccOpt');
    for (var j = 0; j < btns.length; j++) {
        btns[j].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            if (options[idx].english === word.english) {
                SoundEngine.correct();
                addCombo();
                this.style.background = 'linear-gradient(135deg,#00d4ff,#00f5d4)';
            } else {
                dailyChallengeState.accuracyMistakes++;
                SoundEngine.wrong();
                resetCombo();
                screenShake();
                this.style.background = 'linear-gradient(135deg,#ff4757,#ff6b81)';
            }
            dailyChallengeState.accuracyIndex++;
            setTimeout(function () { renderDailyAccuracy(c); }, 500);
        });
    }
}

function startDailyChainRound(c) {
    var allWords = getWords().filter(function (w) {
        return w.korean && w.korean.length >= 2;
    });
    dailyChallengeState.chainWords = allWords;
    dailyChallengeState.chainUsed = [];
    dailyChallengeState.chainScore = 0;
    var seed = getDailySeed() + 2000;
    var startWord = allWords[Math.floor(seededRandom(seed) * allWords.length)];
    dailyChallengeState.chainCurrent = startWord.korean;
    dailyChallengeState.chainUsed.push(startWord.korean);
    dailyChallengeState.phase = 'chain';
    renderDailyChain(c);
}

function getChainMatches(lastChar, used, allWords) {
    var matches = [];
    for (var i = 0; i < allWords.length; i++) {
        var w = allWords[i];
        if (w.korean.charAt(0) === lastChar && used.indexOf(w.korean) === -1) {
            matches.push(w);
        }
    }
    return matches;
}

function renderDailyChain(c) {
    var lastChar = dailyChallengeState.chainCurrent.charAt(dailyChallengeState.chainCurrent.length - 1);
    var matches = getChainMatches(lastChar, dailyChallengeState.chainUsed, dailyChallengeState.chainWords);

    if (matches.length === 0) {
        dailyChallengeState.score += dailyChallengeState.chainScore * 15;
        finishDailyChallenge(c);
        return;
    }

    var displayMatches = shuffle(matches).slice(0, 6);

    var h = '<div class="game-title">Word Chain Bonus</div>';
    h += '<div style="text-align:center;margin-bottom:10px;color:var(--neon-cyan);">';
    h += 'Chain length: ' + dailyChallengeState.chainUsed.length + ' | Bonus: +' + (dailyChallengeState.chainScore * 15) + '</div>';
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<div style="font-size:1rem;color:rgba(255,255,255,0.5);margin-bottom:5px;">Current word:</div>';
    h += '<div style="font-size:2.5rem;margin-bottom:5px;">' + escapeHtml(dailyChallengeState.chainCurrent) + '</div>';
    h += '<div style="font-size:1.2rem;color:var(--neon-pink);">Next word must start with: <strong>' + escapeHtml(lastChar) + '</strong></div>';
    h += '</div>';

    h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px;">';
    for (var i = 0; i < displayMatches.length; i++) {
        var m = displayMatches[i];
        h += '<button class="quiz-option dcChainOpt" data-korean="' + escapeHtml(m.korean) + '">';
        h += escapeHtml(m.korean) + ' <span style="font-size:0.8rem;color:rgba(255,255,255,0.5);">(' + escapeHtml(m.english) + ')</span></button>';
    }
    h += '</div>';
    h += '<div style="text-align:center;">';
    h += '<button class="game-btn secondary" id="dcChainEnd">End Chain & Finish</button>';
    h += '</div>';
    c.innerHTML = h;

    var chainBtns = c.querySelectorAll('.dcChainOpt');
    for (var j = 0; j < chainBtns.length; j++) {
        chainBtns[j].addEventListener('click', function () {
            var chosen = this.getAttribute('data-korean');
            dailyChallengeState.chainCurrent = chosen;
            dailyChallengeState.chainUsed.push(chosen);
            dailyChallengeState.chainScore++;
            SoundEngine.correct();
            addCombo();
            addXP(5);
            renderDailyChain(c);
        });
    }
    var endBtn = document.getElementById('dcChainEnd');
    if (endBtn) {
        endBtn.addEventListener('click', function () {
            dailyChallengeState.score += dailyChallengeState.chainScore * 15;
            finishDailyChallenge(c);
        });
    }
}

function finishDailyChallenge(c) {
    saveDailyChallengeResult(dailyChallengeState.score);
    addXP(dailyChallengeState.score);
    createConfetti(60);

    var h = '<div class="game-title">Challenge Complete!</div>';
    h += '<div style="text-align:center;">';
    h += '<div style="font-size:4rem;margin:20px 0;background:linear-gradient(135deg,var(--gold),#ffaa00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">' + dailyChallengeState.score + '</div>';
    h += '<div style="color:rgba(255,255,255,0.6);margin-bottom:20px;">Total Score</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:25px;">';
    h += '<div style="background:var(--glass);padding:12px;border-radius:12px;"><div style="font-size:1.5rem;color:var(--neon-cyan);">' + dailyChallengeState.speedCorrect + '/10</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5);">Speed</div></div>';
    h += '<div style="background:var(--glass);padding:12px;border-radius:12px;"><div style="font-size:1.5rem;color:var(--neon-pink);">' + (dailyChallengeState.accuracyMistakes === 0 ? 'Perfect' : dailyChallengeState.accuracyMistakes + ' err') + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5);">Accuracy</div></div>';
    h += '<div style="background:var(--glass);padding:12px;border-radius:12px;"><div style="font-size:1.5rem;color:var(--gold);">' + dailyChallengeState.chainUsed.length + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5);">Chain</div></div>';
    h += '</div>';
    h += '<button class="game-btn" id="dcViewBoard">View Leaderboard</button>';
    h += '</div>';
    c.innerHTML = h;

    var boardBtn = document.getElementById('dcViewBoard');
    if (boardBtn) {
        boardBtn.addEventListener('click', function () {
            renderDailyChallengeMenu(c);
        });
    }
}


// ============================================================
// 2. WORD DUEL (1v1 vs AI)
// ============================================================

var duelState = {
    round: 0,
    maxRounds: 10,
    playerHP: 100,
    aiHP: 100,
    playerScore: 0,
    aiScore: 0,
    currentWord: null,
    options: [],
    correctIdx: -1,
    aiTimer: null,
    aiDelay: 0,
    answered: false,
    aiDifficulty: 1,
    aiName: '',
    words: []
};

var duelAINames = ['ShadowLearner', 'NeonScholar', 'HangulBot', 'KoreanSensei',
    'WordMaster_AI', 'StudyRival', 'LexiconX', 'VocabStorm'];

function showWordDuel(c) {
    duelState.round = 0;
    duelState.playerHP = 100;
    duelState.aiHP = 100;
    duelState.playerScore = 0;
    duelState.aiScore = 0;
    duelState.answered = false;
    duelState.aiDifficulty = Math.min(3, Math.max(1, Math.floor(gameState.level / 3)));
    duelState.aiName = duelAINames[Math.floor(Math.random() * duelAINames.length)];
    var allWords = getWords();
    if (allWords.length < 15) {
        showToast('Not enough words loaded');
        return;
    }
    duelState.words = shuffle(allWords).slice(0, 10);
    gameState.gamesPlayed++;
    saveProgress();
    renderDuelIntro(c);
}

function renderDuelIntro(c) {
    var h = '<div class="game-title">Word Duel</div>';
    h += '<div style="display:flex;justify-content:space-around;align-items:center;margin:30px 0;">';
    // Player avatar
    h += '<div style="text-align:center;">';
    h += '<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--neon-pink),var(--neon-purple));display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin:0 auto 10px;">P</div>';
    h += '<div style="font-weight:bold;">' + escapeHtml(gameState.username || 'Player') + '</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5);">Lv.' + gameState.level + '</div>';
    h += '</div>';
    // VS
    h += '<div style="font-size:2.5rem;font-weight:900;background:linear-gradient(135deg,var(--fire),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;">VS</div>';
    // AI avatar
    h += '<div style="text-align:center;">';
    h += '<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--neon-blue),var(--neon-cyan));display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin:0 auto 10px;">AI</div>';
    h += '<div style="font-weight:bold;">' + escapeHtml(duelState.aiName) + '</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5);">Difficulty: ' + duelState.aiDifficulty + '/3</div>';
    h += '</div>';
    h += '</div>';
    h += '<div style="text-align:center;margin-bottom:20px;color:rgba(255,255,255,0.6);">Best of 10 rounds. Pick the correct English meaning first!</div>';
    h += '<div style="text-align:center;"><button class="game-btn" id="duelStartBtn">Fight!</button></div>';
    c.innerHTML = h;

    document.getElementById('duelStartBtn').addEventListener('click', function () {
        nextDuelRound(c);
    });
}

function nextDuelRound(c) {
    if (duelState.round >= duelState.maxRounds || duelState.playerHP <= 0 || duelState.aiHP <= 0) {
        renderDuelResult(c);
        return;
    }
    duelState.answered = false;
    duelState.currentWord = duelState.words[duelState.round];
    var allWords = getWords();
    var wrongs = shuffle(allWords.filter(function (w) {
        return w.english !== duelState.currentWord.english;
    })).slice(0, 3);
    duelState.options = shuffle([duelState.currentWord].concat(wrongs));
    duelState.correctIdx = -1;
    for (var i = 0; i < duelState.options.length; i++) {
        if (duelState.options[i].english === duelState.currentWord.english) {
            duelState.correctIdx = i;
            break;
        }
    }

    // AI response time: harder difficulty = faster
    var minTime = 4000 - (duelState.aiDifficulty * 800);
    var maxTime = 5000 - (duelState.aiDifficulty * 600);
    duelState.aiDelay = minTime + Math.floor(Math.random() * (maxTime - minTime));
    // AI sometimes gets it wrong
    var aiAccuracy = 0.5 + (duelState.aiDifficulty * 0.15);

    duelState.round++;
    renderDuelBattle(c, aiAccuracy);
}

function renderDuelBattle(c, aiAccuracy) {
    var word = duelState.currentWord;
    var playerPct = Math.max(0, duelState.playerHP);
    var aiPct = Math.max(0, duelState.aiHP);

    var h = '<div class="game-title">Round ' + duelState.round + '/' + duelState.maxRounds + '</div>';
    // Health bars
    h += '<div style="display:flex;justify-content:space-between;gap:15px;margin-bottom:20px;">';
    h += '<div style="flex:1;">';
    h += '<div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.85rem;">' + escapeHtml(gameState.username || 'Player') + '</span><span style="color:var(--neon-pink);">' + playerPct + ' HP</span></div>';
    h += '<div style="background:rgba(255,255,255,0.1);border-radius:10px;height:14px;overflow:hidden;"><div style="width:' + playerPct + '%;height:100%;background:linear-gradient(90deg,var(--neon-pink),var(--neon-purple));border-radius:10px;transition:width 0.5s;"></div></div>';
    h += '</div>';
    h += '<div style="flex:1;">';
    h += '<div style="display:flex;justify-content:space-between;margin-bottom:5px;"><span style="font-size:0.85rem;">' + escapeHtml(duelState.aiName) + '</span><span style="color:var(--neon-cyan);">' + aiPct + ' HP</span></div>';
    h += '<div style="background:rgba(255,255,255,0.1);border-radius:10px;height:14px;overflow:hidden;"><div style="width:' + aiPct + '%;height:100%;background:linear-gradient(90deg,var(--neon-cyan),var(--neon-blue));border-radius:10px;transition:width 0.5s;"></div></div>';
    h += '</div>';
    h += '</div>';

    // Word display
    h += '<div style="text-align:center;margin-bottom:25px;">';
    h += '<div style="font-size:3.5rem;margin-bottom:10px;">' + escapeHtml(word.korean) + '</div>';
    if (word.romanization) {
        h += '<div style="color:rgba(255,255,255,0.6);">' + escapeHtml(word.romanization) + '</div>';
    }
    h += '</div>';

    // Options
    h += '<div class="quiz-options">';
    for (var i = 0; i < duelState.options.length; i++) {
        h += '<button class="quiz-option duelOpt" data-idx="' + i + '">' + escapeHtml(duelState.options[i].english) + '</button>';
    }
    h += '</div>';
    h += '<div id="duelStatus" style="text-align:center;margin-top:15px;min-height:30px;color:rgba(255,255,255,0.6);font-size:0.9rem;">AI is thinking...</div>';

    c.innerHTML = h;

    // AI timer
    duelState.aiTimer = setTimeout(function () {
        if (duelState.answered) return;
        var aiCorrect = Math.random() < aiAccuracy;
        duelState.answered = true;
        if (aiCorrect) {
            duelState.aiScore++;
            duelState.playerHP -= 15;
            SoundEngine.wrong();
            screenShake();
            var statusEl = document.getElementById('duelStatus');
            if (statusEl) statusEl.innerHTML = '<span style="color:var(--neon-cyan);">' + escapeHtml(duelState.aiName) + ' answered first! -15 HP</span>';
        } else {
            var statusEl2 = document.getElementById('duelStatus');
            if (statusEl2) statusEl2.innerHTML = '<span style="color:var(--gold);">AI guessed wrong! Your chance!</span>';
            duelState.answered = false;
            return;
        }
        disableDuelOptions();
        setTimeout(function () { nextDuelRound(c); }, 1500);
    }, duelState.aiDelay);

    // Player click
    var btns = c.querySelectorAll('.duelOpt');
    for (var j = 0; j < btns.length; j++) {
        btns[j].addEventListener('click', function () {
            if (duelState.answered) return;
            duelState.answered = true;
            clearTimeout(duelState.aiTimer);
            var idx = parseInt(this.getAttribute('data-idx'));
            if (idx === duelState.correctIdx) {
                duelState.playerScore++;
                duelState.aiHP -= 15;
                SoundEngine.correct();
                addCombo();
                addXP(10);
                collectWord(word);
                this.style.background = 'linear-gradient(135deg,#00d4ff,#00f5d4)';
                createSparkle(window.innerWidth / 2, 300);
                var statusEl3 = document.getElementById('duelStatus');
                if (statusEl3) statusEl3.innerHTML = '<span style="color:var(--neon-pink);">You answered first! -15 HP to AI!</span>';
            } else {
                duelState.playerHP -= 10;
                SoundEngine.wrong();
                resetCombo();
                this.style.background = 'linear-gradient(135deg,#ff4757,#ff6b81)';
                var statusEl4 = document.getElementById('duelStatus');
                if (statusEl4) statusEl4.innerHTML = '<span style="color:var(--fire);">Wrong answer! -10 HP to you</span>';
            }
            disableDuelOptions();
            setTimeout(function () { nextDuelRound(c); }, 1500);
        });
    }
}

function disableDuelOptions() {
    var btns = document.querySelectorAll('.duelOpt');
    for (var i = 0; i < btns.length; i++) {
        btns[i].style.pointerEvents = 'none';
        btns[i].style.opacity = '0.5';
    }
}

function renderDuelResult(c) {
    var won = duelState.playerScore > duelState.aiScore;
    var tied = duelState.playerScore === duelState.aiScore;
    if (won) {
        createConfetti(80);
        addXP(100);
    }

    var h = '<div class="game-title">Duel ' + (won ? 'Victory!' : tied ? 'Draw!' : 'Defeat!') + '</div>';
    h += '<div style="text-align:center;margin:20px 0;">';
    h += '<div style="font-size:5rem;margin-bottom:10px;">' + (won ? 'W' : tied ? 'D' : 'L') + '</div>';
    h += '</div>';
    // Score cards
    h += '<div style="display:flex;justify-content:space-around;margin:25px 0;">';
    h += '<div style="text-align:center;background:var(--glass);padding:20px 30px;border-radius:15px;border:1px solid ' + (won ? 'var(--neon-pink)' : 'rgba(255,255,255,0.1)') + ';">';
    h += '<div style="font-size:2.5rem;font-weight:bold;color:var(--neon-pink);">' + duelState.playerScore + '</div>';
    h += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);">' + escapeHtml(gameState.username || 'Player') + '</div>';
    h += '</div>';
    h += '<div style="display:flex;align-items:center;font-size:1.5rem;color:rgba(255,255,255,0.3);">-</div>';
    h += '<div style="text-align:center;background:var(--glass);padding:20px 30px;border-radius:15px;border:1px solid ' + (!won && !tied ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.1)') + ';">';
    h += '<div style="font-size:2.5rem;font-weight:bold;color:var(--neon-cyan);">' + duelState.aiScore + '</div>';
    h += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);">' + escapeHtml(duelState.aiName) + '</div>';
    h += '</div>';
    h += '</div>';
    if (won) {
        h += '<div style="text-align:center;color:var(--gold);margin-bottom:15px;">+100 XP bonus for winning!</div>';
    }
    h += '<div style="text-align:center;"><button class="game-btn" id="duelRematch">Rematch</button> <button class="game-btn secondary" id="duelExit">Exit</button></div>';
    c.innerHTML = h;

    document.getElementById('duelRematch').addEventListener('click', function () {
        showWordDuel(c);
    });
    document.getElementById('duelExit').addEventListener('click', function () {
        renderDuelIntro(c);
    });
}


// ============================================================
// 3. VIRTUAL CLASSROOM
// ============================================================

var classroomState = {
    rooms: [],
    currentRoom: null,
    flashIndex: 0,
    flashShowAnswer: false
};

function loadClassrooms() {
    try {
        var saved = localStorage.getItem('kpop_classrooms');
        if (saved) classroomState.rooms = JSON.parse(saved);
    } catch (e) {
        classroomState.rooms = [];
    }
}

function saveClassrooms() {
    try {
        localStorage.setItem('kpop_classrooms', JSON.stringify(classroomState.rooms));
    } catch (e) { }
}

function showClassroom(c) {
    loadClassrooms();
    classroomState.currentRoom = null;
    renderClassroomList(c);
}

function renderClassroomList(c) {
    var h = '<div class="game-title">Virtual Classroom</div>';
    h += '<div style="text-align:center;margin-bottom:20px;color:rgba(255,255,255,0.6);">Create or join study rooms to learn together</div>';

    // Create room form
    h += '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:20px;margin-bottom:20px;">';
    h += '<div style="font-weight:bold;margin-bottom:12px;">Create New Room</div>';
    h += '<div style="display:flex;gap:10px;flex-wrap:wrap;">';
    h += '<input type="text" id="crRoomName" placeholder="Room name..." style="flex:1;min-width:150px;background:rgba(255,255,255,0.05);border:1px solid rgba(157,78,221,0.3);color:#fff;padding:10px 15px;border-radius:12px;font-size:0.95rem;" maxlength="30">';
    h += '<select id="crCategory" style="background:rgba(255,255,255,0.05);border:1px solid rgba(157,78,221,0.3);color:#fff;padding:10px 15px;border-radius:12px;font-size:0.9rem;">';
    h += '<option value="all">All Categories</option>';
    for (var cat in wordDatabase) {
        if (wordDatabase.hasOwnProperty(cat)) {
            h += '<option value="' + escapeHtml(cat) + '">' + escapeHtml(cat) + '</option>';
        }
    }
    h += '</select>';
    h += '<button class="game-btn" id="crCreateBtn">Create</button>';
    h += '</div></div>';

    // Room list
    if (classroomState.rooms.length === 0) {
        h += '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.4);">No rooms yet. Create one above!</div>';
    } else {
        h += '<div style="display:grid;gap:12px;">';
        for (var i = 0; i < classroomState.rooms.length; i++) {
            var room = classroomState.rooms[i];
            var wordCount = room.words ? room.words.length : 0;
            var masteredCount = 0;
            if (room.mastered) {
                for (var k in room.mastered) {
                    if (room.mastered.hasOwnProperty(k)) masteredCount++;
                }
            }
            h += '<div style="background:var(--glass);border:1px solid rgba(0,212,255,0.3);border-radius:15px;padding:18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">';
            h += '<div>';
            h += '<div style="font-weight:bold;font-size:1.1rem;">' + escapeHtml(room.name) + '</div>';
            h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5);">' + escapeHtml(room.category) + ' | ' + wordCount + ' words | ' + masteredCount + ' mastered</div>';
            h += '</div>';
            h += '<div style="display:flex;gap:8px;">';
            h += '<button class="game-btn crJoinBtn" data-idx="' + i + '" style="padding:8px 16px;font-size:0.85rem;">Enter</button>';
            h += '<button class="game-btn secondary crDelBtn" data-idx="' + i + '" style="padding:8px 16px;font-size:0.85rem;">Delete</button>';
            h += '</div></div>';
        }
        h += '</div>';
    }

    c.innerHTML = h;

    // Create room
    document.getElementById('crCreateBtn').addEventListener('click', function () {
        var nameEl = document.getElementById('crRoomName');
        var catEl = document.getElementById('crCategory');
        var roomName = nameEl.value.trim();
        if (!roomName) { showToast('Enter a room name'); return; }
        var category = catEl.value;
        var words = [];
        if (category === 'all') {
            for (var ct in wordDatabase) {
                if (wordDatabase.hasOwnProperty(ct)) {
                    words = words.concat(wordDatabase[ct]);
                }
            }
            words = shuffle(words).slice(0, 30);
        } else if (wordDatabase[category]) {
            words = wordDatabase[category].slice(0, 30);
        }
        classroomState.rooms.push({
            name: roomName,
            category: category,
            words: words,
            mastered: {},
            created: Date.now()
        });
        saveClassrooms();
        SoundEngine.correct();
        renderClassroomList(c);
    });

    // Join room buttons
    var joinBtns = c.querySelectorAll('.crJoinBtn');
    for (var jj = 0; jj < joinBtns.length; jj++) {
        joinBtns[jj].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            classroomState.currentRoom = idx;
            classroomState.flashIndex = 0;
            classroomState.flashShowAnswer = false;
            renderClassroomRoom(c);
        });
    }

    // Delete room buttons
    var delBtns = c.querySelectorAll('.crDelBtn');
    for (var dd = 0; dd < delBtns.length; dd++) {
        delBtns[dd].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            classroomState.rooms.splice(idx, 1);
            saveClassrooms();
            renderClassroomList(c);
        });
    }
}

function renderClassroomRoom(c) {
    var room = classroomState.rooms[classroomState.currentRoom];
    if (!room || !room.words || room.words.length === 0) {
        showToast('Room has no words');
        renderClassroomList(c);
        return;
    }

    var word = room.words[classroomState.flashIndex];
    var isMastered = room.mastered && room.mastered[word.korean];
    var total = room.words.length;
    var masteredCount = 0;
    if (room.mastered) {
        for (var k in room.mastered) {
            if (room.mastered.hasOwnProperty(k)) masteredCount++;
        }
    }
    var pct = total > 0 ? Math.round((masteredCount / total) * 100) : 0;

    var h = '<div class="game-title">' + escapeHtml(room.name) + '</div>';
    // Progress bar
    h += '<div style="margin-bottom:15px;">';
    h += '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:5px;"><span>Mastered: ' + masteredCount + '/' + total + '</span><span>' + pct + '%</span></div>';
    h += '<div class="level-progress"><div class="level-bar" style="width:' + pct + '%;"></div></div>';
    h += '</div>';

    // Flashcard
    h += '<div id="crFlashcard" class="flashcard" style="position:relative;cursor:pointer;min-height:200px;">';
    if (classroomState.flashShowAnswer) {
        h += '<div style="font-size:1rem;color:rgba(255,255,255,0.5);margin-bottom:5px;">English</div>';
        h += '<div style="font-size:2rem;">' + escapeHtml(word.english) + '</div>';
        if (word.romanization) {
            h += '<div style="font-size:1rem;color:rgba(255,255,255,0.7);margin-top:10px;">' + escapeHtml(word.romanization) + '</div>';
        }
    } else {
        h += '<div style="font-size:1rem;color:rgba(255,255,255,0.5);margin-bottom:5px;">Korean</div>';
        h += '<div style="font-size:3rem;">' + escapeHtml(word.korean) + '</div>';
    }
    if (isMastered) {
        h += '<div style="position:absolute;top:15px;right:15px;background:linear-gradient(135deg,#00d4ff,#00f5d4);padding:4px 12px;border-radius:12px;font-size:0.75rem;color:#000;font-weight:bold;">Mastered</div>';
    }
    h += '</div>';

    // Card number
    h += '<div style="text-align:center;color:rgba(255,255,255,0.4);font-size:0.85rem;margin-bottom:15px;">';
    h += 'Card ' + (classroomState.flashIndex + 1) + ' of ' + total + ' (tap card to flip)</div>';

    // Controls
    h += '<div class="game-controls" style="margin-bottom:15px;">';
    h += '<button class="game-btn secondary" id="crPrev">Previous</button>';
    h += '<button class="game-btn" id="crMaster" style="background:' + (isMastered ? 'linear-gradient(135deg,#ff4757,#ff6b81)' : 'linear-gradient(135deg,#00d4ff,#00f5d4)') + ';color:' + (isMastered ? '#fff' : '#000') + ';">' + (isMastered ? 'Unmaster' : 'Mark Mastered') + '</button>';
    h += '<button class="game-btn secondary" id="crNext">Next</button>';
    h += '</div>';

    // Bottom controls
    h += '<div class="game-controls">';
    h += '<button class="game-btn secondary" id="crExport">Export List (JSON)</button>';
    h += '<button class="game-btn secondary" id="crBack">Back to Rooms</button>';
    h += '</div>';

    c.innerHTML = h;

    // Flip card
    document.getElementById('crFlashcard').addEventListener('click', function () {
        classroomState.flashShowAnswer = !classroomState.flashShowAnswer;
        renderClassroomRoom(c);
    });

    // Navigate
    document.getElementById('crPrev').addEventListener('click', function () {
        classroomState.flashIndex = (classroomState.flashIndex - 1 + total) % total;
        classroomState.flashShowAnswer = false;
        renderClassroomRoom(c);
    });
    document.getElementById('crNext').addEventListener('click', function () {
        classroomState.flashIndex = (classroomState.flashIndex + 1) % total;
        classroomState.flashShowAnswer = false;
        renderClassroomRoom(c);
    });

    // Master toggle
    document.getElementById('crMaster').addEventListener('click', function () {
        if (!room.mastered) room.mastered = {};
        if (room.mastered[word.korean]) {
            delete room.mastered[word.korean];
        } else {
            room.mastered[word.korean] = true;
            collectWord(word);
            addXP(5);
            SoundEngine.correct();
        }
        saveClassrooms();
        renderClassroomRoom(c);
    });

    // Export
    document.getElementById('crExport').addEventListener('click', function () {
        var exportData = room.words.map(function (w) {
            return { korean: w.korean, english: w.english, romanization: w.romanization || '' };
        });
        var jsonStr = JSON.stringify(exportData, null, 2);
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(jsonStr).then(function () {
                showToast('Word list copied to clipboard!');
            });
        } else {
            // Fallback
            var ta = document.createElement('textarea');
            ta.value = jsonStr;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showToast('Word list copied to clipboard!');
        }
    });

    // Back
    document.getElementById('crBack').addEventListener('click', function () {
        classroomState.currentRoom = null;
        renderClassroomList(c);
    });
}


// ============================================================
// 4. WEEKLY TOURNAMENT
// ============================================================

var tournamentState = {
    bracket: [],
    currentMatch: 0,
    currentRound: 0,
    playerSlot: -1,
    matchQuestion: 0,
    matchScore: 0,
    matchAIScore: 0,
    matchWords: [],
    phase: 'bracket'
};

var tournamentNames = [
    'StarLearner', 'HangulHero', 'KimchiKing', 'SeoulScholar',
    'NeonStudent', 'KwaveAce', 'BibiMaster', 'DramaFan',
    'BubblyPop', 'MoonlitOwl', 'RamenSage', 'PandaCoder',
    'JejuRider', 'PixelSamurai', 'CloudDancer', 'ThunderFox'
];

function getWeekNumber() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 1);
    var diff = now - start;
    var oneWeek = 604800000;
    return Math.floor(diff / oneWeek);
}

function showWeeklyTournament(c) {
    var weekSeed = getWeekNumber() * 7919;
    var saved = localStorage.getItem('kpop_tournament_' + getWeekNumber());
    if (saved) {
        try {
            var data = JSON.parse(saved);
            tournamentState = data;
            renderTournamentBracket(c);
            return;
        } catch (e) { }
    }
    // Generate 8-player bracket
    var names = seededShuffle(tournamentNames, weekSeed).slice(0, 7);
    var players = [];
    var playerIdx = Math.floor(seededRandom(weekSeed + 1) * 8);
    for (var i = 0; i < 8; i++) {
        if (i === playerIdx) {
            players.push({ name: gameState.username || 'Player', isPlayer: true, eliminated: false });
        } else {
            players.push({ name: names.shift() || 'Bot' + i, isPlayer: false, eliminated: false });
        }
    }
    tournamentState.bracket = players;
    tournamentState.playerSlot = playerIdx;
    tournamentState.currentRound = 0;
    tournamentState.phase = 'bracket';
    gameState.gamesPlayed++;
    saveProgress();
    saveTournament();
    renderTournamentBracket(c);
}

function saveTournament() {
    try {
        localStorage.setItem('kpop_tournament_' + getWeekNumber(), JSON.stringify(tournamentState));
    } catch (e) { }
}

function renderTournamentBracket(c) {
    var h = '<div class="game-title">Weekly Tournament</div>';
    h += '<div style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:15px;">Week #' + getWeekNumber() + ' | Single Elimination</div>';

    // Determine rounds
    var roundNames = ['Quarterfinals', 'Semifinals', 'Finals', 'Champion!'];
    var players = tournamentState.bracket;
    var rounds = [];
    var current = [];
    for (var i = 0; i < players.length; i++) {
        current.push(players[i]);
    }
    rounds.push(current.slice());

    // Simulate AI matches for past rounds
    var tempBracket = current.slice();
    for (var r = 0; r < tournamentState.currentRound; r++) {
        var next = [];
        for (var m = 0; m < tempBracket.length; m += 2) {
            var p1 = tempBracket[m];
            var p2 = tempBracket[m + 1];
            if (!p2) { next.push(p1); continue; }
            if (p1.eliminated) { next.push(p2); continue; }
            if (p2.eliminated) { next.push(p1); continue; }
            next.push(p1.isPlayer ? p1 : p2.isPlayer ? p2 : (Math.random() > 0.5 ? p1 : p2));
        }
        rounds.push(next.slice());
        tempBracket = next;
    }

    // Draw bracket
    h += '<div style="overflow-x:auto;padding-bottom:10px;">';
    h += '<div style="display:flex;gap:20px;min-width:600px;justify-content:center;">';
    for (var ri = 0; ri < rounds.length && ri <= tournamentState.currentRound; ri++) {
        var rnd = rounds[ri];
        h += '<div style="display:flex;flex-direction:column;gap:10px;justify-content:center;">';
        h += '<div style="text-align:center;font-size:0.75rem;color:var(--neon-cyan);margin-bottom:5px;">' + (roundNames[ri] || 'Round ' + (ri + 1)) + '</div>';
        for (var pi = 0; pi < rnd.length; pi++) {
            var p = rnd[pi];
            var bgStyle = p.isPlayer ? 'background:linear-gradient(135deg,var(--neon-pink),var(--neon-purple));' :
                p.eliminated ? 'background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.3);text-decoration:line-through;' :
                    'background:var(--glass);';
            h += '<div style="padding:8px 14px;border-radius:10px;font-size:0.85rem;text-align:center;min-width:100px;border:1px solid rgba(157,78,221,0.2);' + bgStyle + '">';
            h += escapeHtml(p.name);
            h += '</div>';
        }
        h += '</div>';
    }
    h += '</div></div>';

    // Check if player is still in
    var playerAlive = !players[tournamentState.playerSlot].eliminated;
    var totalRounds = 3; // quarters, semis, finals

    if (tournamentState.currentRound > totalRounds || !playerAlive) {
        // Tournament over
        if (playerAlive && tournamentState.currentRound > totalRounds) {
            h += '<div style="text-align:center;margin:20px 0;">';
            h += '<div style="font-size:2rem;color:var(--gold);font-weight:bold;animation:pulse 1s infinite;">Champion!</div>';
            h += '<div style="color:rgba(255,255,255,0.6);margin-top:10px;">+200 XP earned as tournament champion!</div>';
            h += '</div>';
        } else if (!playerAlive) {
            h += '<div style="text-align:center;margin:20px 0;color:var(--fire);">Eliminated in ' + (roundNames[tournamentState.currentRound] || 'this round') + '</div>';
        }
        h += '<div style="text-align:center;"><button class="game-btn secondary" id="tReset">Next week\'s tournament available soon</button></div>';
    } else {
        h += '<div style="text-align:center;margin:20px 0;">';
        h += '<button class="game-btn" id="tStartMatch">Start ' + (roundNames[tournamentState.currentRound] || 'Next Match') + '</button>';
        h += '</div>';
    }

    c.innerHTML = h;

    var matchBtn = document.getElementById('tStartMatch');
    if (matchBtn) {
        matchBtn.addEventListener('click', function () {
            startTournamentMatch(c);
        });
    }
    var resetBtn = document.getElementById('tReset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            renderTournamentBracket(c);
        });
    }
}

function getPlayerOpponent() {
    var slot = tournamentState.playerSlot;
    var round = tournamentState.currentRound;
    // In round 0: pairs are (0,1),(2,3),(4,5),(6,7)
    // In round 1: winners of pair groups
    // Simplified: find opponent in current bracket grouping
    var groupSize = Math.pow(2, round + 1);
    var groupStart = Math.floor(slot / groupSize) * groupSize;
    var bracket = tournamentState.bracket;
    for (var i = groupStart; i < groupStart + groupSize && i < bracket.length; i++) {
        if (i !== slot && !bracket[i].eliminated && !bracket[i].isPlayer) {
            return i;
        }
    }
    // Fallback: pick any non-eliminated AI
    for (var j = 0; j < bracket.length; j++) {
        if (!bracket[j].isPlayer && !bracket[j].eliminated) return j;
    }
    return -1;
}

function startTournamentMatch(c) {
    var oppIdx = getPlayerOpponent();
    if (oppIdx === -1) {
        // Auto-win (bye)
        tournamentState.currentRound++;
        saveTournament();
        renderTournamentBracket(c);
        return;
    }
    tournamentState.matchQuestion = 0;
    tournamentState.matchScore = 0;
    tournamentState.matchAIScore = 0;
    var allWords = getWords();
    tournamentState.matchWords = shuffle(allWords).slice(0, 5);
    tournamentState.currentMatch = oppIdx;
    tournamentState.phase = 'match';
    renderTournamentQuestion(c);
}

function renderTournamentQuestion(c) {
    if (tournamentState.matchQuestion >= 5) {
        // Match result
        var won = tournamentState.matchScore > tournamentState.matchAIScore;
        var oppIdx = tournamentState.currentMatch;
        if (won) {
            tournamentState.bracket[oppIdx].eliminated = true;
            addXP(50);
            SoundEngine.correct();
            createConfetti(40);
            if (tournamentState.currentRound >= 3) {
                // Won the finals - champion!
                addXP(200);
                createConfetti(100);
            }
        } else {
            tournamentState.bracket[tournamentState.playerSlot].eliminated = true;
            SoundEngine.wrong();
        }
        tournamentState.currentRound++;
        tournamentState.phase = 'bracket';
        saveTournament();

        var h = '<div class="game-title">Match ' + (won ? 'Won!' : 'Lost!') + '</div>';
        h += '<div style="text-align:center;margin:20px 0;">';
        h += '<div style="font-size:3rem;margin-bottom:15px;">' + tournamentState.matchScore + ' - ' + tournamentState.matchAIScore + '</div>';
        h += '<div style="color:rgba(255,255,255,0.6);">vs ' + escapeHtml(tournamentState.bracket[oppIdx].name) + '</div>';
        h += '</div>';
        h += '<div style="text-align:center;"><button class="game-btn" id="tBackBracket">Back to Bracket</button></div>';
        c.innerHTML = h;
        document.getElementById('tBackBracket').addEventListener('click', function () {
            renderTournamentBracket(c);
        });
        return;
    }

    var word = tournamentState.matchWords[tournamentState.matchQuestion];
    var allWords = getWords();
    var wrongs = shuffle(allWords.filter(function (w) { return w.english !== word.english; })).slice(0, 3);
    var options = shuffle([word].concat(wrongs));
    var oppName = tournamentState.bracket[tournamentState.currentMatch].name;

    var h = '<div class="game-title">' + escapeHtml(oppName) + ' Match</div>';
    h += '<div style="display:flex;justify-content:space-between;margin-bottom:15px;">';
    h += '<div style="color:var(--neon-pink);font-weight:bold;">You: ' + tournamentState.matchScore + '</div>';
    h += '<div style="color:rgba(255,255,255,0.5);">Q' + (tournamentState.matchQuestion + 1) + '/5</div>';
    h += '<div style="color:var(--neon-cyan);font-weight:bold;">' + escapeHtml(oppName) + ': ' + tournamentState.matchAIScore + '</div>';
    h += '</div>';
    h += '<div style="text-align:center;margin-bottom:25px;"><div style="font-size:3rem;">' + escapeHtml(word.korean) + '</div>';
    if (word.romanization) h += '<div style="color:rgba(255,255,255,0.6);">' + escapeHtml(word.romanization) + '</div>';
    h += '</div>';
    h += '<div class="quiz-options">';
    for (var i = 0; i < options.length; i++) {
        h += '<button class="quiz-option tMatchOpt" data-idx="' + i + '">' + escapeHtml(options[i].english) + '</button>';
    }
    h += '</div>';
    c.innerHTML = h;

    var btns = c.querySelectorAll('.tMatchOpt');
    for (var j = 0; j < btns.length; j++) {
        btns[j].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            var correct = options[idx].english === word.english;
            // AI answer (simulated)
            var aiCorrect = Math.random() < (0.4 + tournamentState.currentRound * 0.15);
            if (correct) {
                tournamentState.matchScore++;
                SoundEngine.correct();
                addCombo();
                collectWord(word);
                this.style.background = 'linear-gradient(135deg,#00d4ff,#00f5d4)';
            } else {
                SoundEngine.wrong();
                resetCombo();
                this.style.background = 'linear-gradient(135deg,#ff4757,#ff6b81)';
            }
            if (aiCorrect) tournamentState.matchAIScore++;
            tournamentState.matchQuestion++;
            // Disable all options
            var allBtns = document.querySelectorAll('.tMatchOpt');
            for (var b = 0; b < allBtns.length; b++) {
                allBtns[b].style.pointerEvents = 'none';
            }
            setTimeout(function () { renderTournamentQuestion(c); }, 600);
        });
    }
}


// ============================================================
// 5. STUDY GROUP - Collaborative Word Collection
// ============================================================

var studyGroupState = {
    lists: [],
    currentList: null
};

function loadStudyGroups() {
    try {
        var saved = localStorage.getItem('kpop_study_groups');
        if (saved) studyGroupState.lists = JSON.parse(saved);
    } catch (e) {
        studyGroupState.lists = [];
    }
}

function saveStudyGroups() {
    try {
        localStorage.setItem('kpop_study_groups', JSON.stringify(studyGroupState.lists));
    } catch (e) { }
}

function showStudyGroup(c) {
    loadStudyGroups();
    // Check if URL has a shared challenge
    var hash = window.location.hash;
    if (hash && hash.indexOf('#challenge=') === 0) {
        var encoded = hash.substring(11);
        try {
            var decoded = atob(encoded);
            var challengeData = JSON.parse(decoded);
            window.location.hash = '';
            startSharedChallenge(c, challengeData);
            return;
        } catch (e) {
            window.location.hash = '';
        }
    }
    studyGroupState.currentList = null;
    renderStudyGroupMenu(c);
}

function renderStudyGroupMenu(c) {
    var h = '<div class="game-title">Study Group</div>';
    h += '<div style="text-align:center;margin-bottom:20px;color:rgba(255,255,255,0.6);">Create themed word lists and challenge friends!</div>';

    // Quick create from categories
    h += '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:20px;margin-bottom:20px;">';
    h += '<div style="font-weight:bold;margin-bottom:12px;">Create Themed Collection</div>';
    h += '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">';
    h += '<input type="text" id="sgListName" placeholder="Collection name..." style="flex:1;min-width:150px;background:rgba(255,255,255,0.05);border:1px solid rgba(157,78,221,0.3);color:#fff;padding:10px 15px;border-radius:12px;" maxlength="30">';
    h += '<input type="number" id="sgWordCount" value="10" min="5" max="30" style="width:70px;background:rgba(255,255,255,0.05);border:1px solid rgba(157,78,221,0.3);color:#fff;padding:10px;border-radius:12px;text-align:center;">';
    h += '</div>';
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">';
    for (var cat in wordDatabase) {
        if (wordDatabase.hasOwnProperty(cat)) {
            h += '<button class="cat-btn sgCatBtn" data-cat="' + escapeHtml(cat) + '">' + escapeHtml(cat) + '</button>';
        }
    }
    h += '</div>';
    h += '<button class="game-btn" id="sgCreateRandom">Create Random Mix</button>';
    h += '</div>';

    // Existing lists
    if (studyGroupState.lists.length > 0) {
        h += '<div style="margin-bottom:15px;font-weight:bold;color:var(--neon-cyan);">Your Collections (' + studyGroupState.lists.length + ')</div>';
        h += '<div style="display:grid;gap:12px;">';
        for (var i = 0; i < studyGroupState.lists.length; i++) {
            var list = studyGroupState.lists[i];
            var bestScore = list.bestScore || 0;
            var totalWords = list.words.length;
            var pct = totalWords > 0 ? Math.round((bestScore / totalWords) * 100) : 0;
            h += '<div style="background:var(--glass);border:1px solid rgba(0,212,255,0.2);border-radius:15px;padding:15px;">';
            h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
            h += '<div style="font-weight:bold;">' + escapeHtml(list.name) + '</div>';
            h += '<div style="font-size:0.8rem;color:var(--gold);">Best: ' + bestScore + '/' + totalWords + ' (' + pct + '%)</div>';
            h += '</div>';
            // Progress bar
            h += '<div style="background:rgba(255,255,255,0.1);border-radius:8px;height:6px;margin-bottom:10px;overflow:hidden;">';
            h += '<div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,var(--neon-pink),var(--neon-purple));border-radius:8px;"></div></div>';
            h += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
            h += '<button class="game-btn sgPlayBtn" data-idx="' + i + '" style="padding:6px 14px;font-size:0.85rem;">Practice</button>';
            h += '<button class="game-btn secondary sgShareBtn" data-idx="' + i + '" style="padding:6px 14px;font-size:0.85rem;">Share Challenge</button>';
            h += '<button class="game-btn secondary sgDelBtn" data-idx="' + i + '" style="padding:6px 14px;font-size:0.85rem;">Delete</button>';
            h += '</div></div>';
        }
        h += '</div>';
    } else {
        h += '<div style="text-align:center;padding:30px;color:rgba(255,255,255,0.4);">No collections yet. Create one above!</div>';
    }

    c.innerHTML = h;

    // Category-based creation
    var catBtns = c.querySelectorAll('.sgCatBtn');
    for (var cb = 0; cb < catBtns.length; cb++) {
        catBtns[cb].addEventListener('click', function () {
            var cat = this.getAttribute('data-cat');
            var nameEl = document.getElementById('sgListName');
            var countEl = document.getElementById('sgWordCount');
            var name = nameEl.value.trim() || (cat + ' Collection');
            var count = parseInt(countEl.value) || 10;
            var words = wordDatabase[cat] ? shuffle(wordDatabase[cat]).slice(0, count) : [];
            if (words.length === 0) { showToast('No words in this category'); return; }
            studyGroupState.lists.push({ name: name, words: words, bestScore: 0, created: Date.now() });
            saveStudyGroups();
            SoundEngine.correct();
            renderStudyGroupMenu(c);
        });
    }

    // Random mix creation
    document.getElementById('sgCreateRandom').addEventListener('click', function () {
        var nameEl = document.getElementById('sgListName');
        var countEl = document.getElementById('sgWordCount');
        var name = nameEl.value.trim() || 'Random Mix';
        var count = parseInt(countEl.value) || 10;
        var allWords = getWords();
        var words = shuffle(allWords).slice(0, count);
        if (words.length === 0) { showToast('No words available'); return; }
        studyGroupState.lists.push({ name: name, words: words, bestScore: 0, created: Date.now() });
        saveStudyGroups();
        SoundEngine.correct();
        renderStudyGroupMenu(c);
    });

    // Play buttons
    var playBtns = c.querySelectorAll('.sgPlayBtn');
    for (var pb = 0; pb < playBtns.length; pb++) {
        playBtns[pb].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            studyGroupState.currentList = idx;
            startStudyGroupQuiz(c);
        });
    }

    // Share buttons
    var shareBtns = c.querySelectorAll('.sgShareBtn');
    for (var sb = 0; sb < shareBtns.length; sb++) {
        shareBtns[sb].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            var list = studyGroupState.lists[idx];
            var shareData = {
                name: list.name,
                words: list.words.map(function (w) {
                    return { korean: w.korean, english: w.english, romanization: w.romanization || '' };
                })
            };
            var encoded = btoa(JSON.stringify(shareData));
            var url = window.location.origin + window.location.pathname + '#challenge=' + encoded;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(function () {
                    showToast('Challenge link copied! Share with friends!');
                });
            } else {
                var ta = document.createElement('textarea');
                ta.value = url;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                showToast('Challenge link copied!');
            }
        });
    }

    // Delete buttons
    var delBtns = c.querySelectorAll('.sgDelBtn');
    for (var db = 0; db < delBtns.length; db++) {
        delBtns[db].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            studyGroupState.lists.splice(idx, 1);
            saveStudyGroups();
            renderStudyGroupMenu(c);
        });
    }
}

function startStudyGroupQuiz(c) {
    var list = studyGroupState.lists[studyGroupState.currentList];
    if (!list) { renderStudyGroupMenu(c); return; }
    var quizState = { index: 0, score: 0, words: shuffle(list.words.slice()) };
    renderStudyGroupQuestion(c, quizState, list);
}

function renderStudyGroupQuestion(c, quizState, list) {
    if (quizState.index >= quizState.words.length) {
        // Quiz complete
        if (quizState.score > list.bestScore) {
            list.bestScore = quizState.score;
            saveStudyGroups();
        }
        addXP(quizState.score * 5);
        if (quizState.score === quizState.words.length) createConfetti(60);

        var pct = Math.round((quizState.score / quizState.words.length) * 100);
        var h = '<div class="game-title">Quiz Complete!</div>';
        h += '<div style="text-align:center;margin:20px 0;">';
        h += '<div style="font-size:4rem;margin-bottom:10px;background:linear-gradient(135deg,var(--neon-pink),var(--neon-cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;">' + pct + '%</div>';
        h += '<div style="font-size:1.2rem;margin-bottom:10px;">' + quizState.score + ' / ' + quizState.words.length + ' correct</div>';
        h += '<div style="color:rgba(255,255,255,0.5);">+' + (quizState.score * 5) + ' XP earned</div>';
        h += '</div>';
        h += '<div class="game-controls">';
        h += '<button class="game-btn" id="sgRetry">Try Again</button>';
        h += '<button class="game-btn secondary" id="sgBackList">Back to Collections</button>';
        h += '</div>';
        c.innerHTML = h;

        document.getElementById('sgRetry').addEventListener('click', function () {
            startStudyGroupQuiz(c);
        });
        document.getElementById('sgBackList').addEventListener('click', function () {
            renderStudyGroupMenu(c);
        });
        return;
    }

    var word = quizState.words[quizState.index];
    var allWords = getWords();
    var wrongs = shuffle(allWords.filter(function (w) { return w.english !== word.english; })).slice(0, 3);
    var options = shuffle([word].concat(wrongs));

    var h = '<div class="game-title">' + escapeHtml(list.name) + '</div>';
    h += '<div style="display:flex;justify-content:space-between;margin-bottom:15px;">';
    h += '<div style="color:rgba(255,255,255,0.5);">Q' + (quizState.index + 1) + '/' + quizState.words.length + '</div>';
    h += '<div style="color:var(--neon-cyan);font-weight:bold;">Score: ' + quizState.score + '</div>';
    h += '</div>';
    h += '<div style="text-align:center;margin-bottom:25px;">';
    h += '<div style="font-size:3rem;margin-bottom:8px;">' + escapeHtml(word.korean) + '</div>';
    if (word.romanization) h += '<div style="color:rgba(255,255,255,0.6);">' + escapeHtml(word.romanization) + '</div>';
    h += '</div>';
    h += '<div class="quiz-options">';
    for (var i = 0; i < options.length; i++) {
        h += '<button class="quiz-option sgQuizOpt" data-idx="' + i + '">' + escapeHtml(options[i].english) + '</button>';
    }
    h += '</div>';
    c.innerHTML = h;

    var btns = c.querySelectorAll('.sgQuizOpt');
    for (var j = 0; j < btns.length; j++) {
        btns[j].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            if (options[idx].english === word.english) {
                quizState.score++;
                SoundEngine.correct();
                addCombo();
                collectWord(word);
                this.style.background = 'linear-gradient(135deg,#00d4ff,#00f5d4)';
            } else {
                SoundEngine.wrong();
                resetCombo();
                this.style.background = 'linear-gradient(135deg,#ff4757,#ff6b81)';
            }
            var allBtns2 = document.querySelectorAll('.sgQuizOpt');
            for (var b = 0; b < allBtns2.length; b++) allBtns2[b].style.pointerEvents = 'none';
            quizState.index++;
            setTimeout(function () { renderStudyGroupQuestion(c, quizState, list); }, 500);
        });
    }
}

function startSharedChallenge(c, challengeData) {
    var words = challengeData.words || [];
    if (words.length === 0) { showToast('Invalid challenge data'); renderStudyGroupMenu(c); return; }

    // Create a temporary list for the challenge
    var tempList = { name: challengeData.name || 'Shared Challenge', words: words, bestScore: 0 };

    // Check if we already have a best score for this challenge
    var challengeKey = 'kpop_challenge_' + btoa(JSON.stringify(words.map(function (w) { return w.korean; })));
    var savedBest = localStorage.getItem(challengeKey);
    if (savedBest) tempList.bestScore = parseInt(savedBest) || 0;

    var quizState = { index: 0, score: 0, words: shuffle(words.slice()) };

    var h = '<div class="game-title">Friend Challenge!</div>';
    h += '<div style="text-align:center;margin-bottom:20px;">';
    h += '<div style="font-size:1.2rem;color:var(--neon-cyan);">' + escapeHtml(tempList.name) + '</div>';
    h += '<div style="color:rgba(255,255,255,0.5);">' + words.length + ' words | Best: ' + tempList.bestScore + '/' + words.length + '</div>';
    h += '</div>';
    h += '<div style="text-align:center;"><button class="game-btn" id="sgStartShared">Start Challenge!</button></div>';
    c.innerHTML = h;

    document.getElementById('sgStartShared').addEventListener('click', function () {
        renderSharedChallengeQuestion(c, quizState, tempList, challengeKey);
    });
}

function renderSharedChallengeQuestion(c, quizState, list, challengeKey) {
    if (quizState.index >= quizState.words.length) {
        if (quizState.score > list.bestScore) {
            list.bestScore = quizState.score;
            try { localStorage.setItem(challengeKey, String(quizState.score)); } catch (e) { }
        }
        addXP(quizState.score * 8);
        if (quizState.score === quizState.words.length) createConfetti(80);

        var pct = Math.round((quizState.score / quizState.words.length) * 100);
        var h = '<div class="game-title">Challenge Complete!</div>';
        h += '<div style="text-align:center;margin:20px 0;">';
        h += '<div style="font-size:4rem;margin-bottom:10px;background:linear-gradient(135deg,var(--gold),#ffaa00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">' + pct + '%</div>';
        h += '<div style="font-size:1.2rem;margin-bottom:10px;">' + quizState.score + ' / ' + quizState.words.length + '</div>';
        h += '<div style="color:var(--gold);">+' + (quizState.score * 8) + ' XP earned!</div>';
        h += '</div>';
        h += '<div style="text-align:center;"><button class="game-btn" id="sgSharedBack">Back to Study Group</button></div>';
        c.innerHTML = h;

        document.getElementById('sgSharedBack').addEventListener('click', function () {
            renderStudyGroupMenu(c);
        });
        return;
    }

    var word = quizState.words[quizState.index];
    var allWords = getWords();
    if (allWords.length < 4) allWords = quizState.words;
    var wrongs = shuffle(allWords.filter(function (w) { return w.english !== word.english; })).slice(0, 3);
    // Make sure we have 3 wrong answers
    while (wrongs.length < 3 && quizState.words.length > 1) {
        var extra = quizState.words.filter(function (w) {
            return w.english !== word.english && wrongs.indexOf(w) === -1;
        });
        if (extra.length > 0) wrongs.push(extra[0]);
        else break;
    }
    var options = shuffle([word].concat(wrongs));

    var h = '<div class="game-title">' + escapeHtml(list.name) + '</div>';
    h += '<div style="text-align:center;margin-bottom:15px;color:rgba(255,255,255,0.5);">Q' + (quizState.index + 1) + '/' + quizState.words.length + ' | Score: ' + quizState.score + '</div>';
    h += '<div style="text-align:center;margin-bottom:25px;">';
    h += '<div style="font-size:3rem;margin-bottom:8px;">' + escapeHtml(word.korean) + '</div>';
    if (word.romanization) h += '<div style="color:rgba(255,255,255,0.6);">' + escapeHtml(word.romanization) + '</div>';
    h += '</div>';
    h += '<div class="quiz-options">';
    for (var i = 0; i < options.length; i++) {
        h += '<button class="quiz-option sgSharedOpt" data-idx="' + i + '">' + escapeHtml(options[i].english) + '</button>';
    }
    h += '</div>';
    c.innerHTML = h;

    var btns = c.querySelectorAll('.sgSharedOpt');
    for (var j = 0; j < btns.length; j++) {
        btns[j].addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            if (options[idx].english === word.english) {
                quizState.score++;
                SoundEngine.correct();
                addCombo();
                this.style.background = 'linear-gradient(135deg,#00d4ff,#00f5d4)';
            } else {
                SoundEngine.wrong();
                resetCombo();
                this.style.background = 'linear-gradient(135deg,#ff4757,#ff6b81)';
            }
            var allBtns3 = document.querySelectorAll('.sgSharedOpt');
            for (var b = 0; b < allBtns3.length; b++) allBtns3[b].style.pointerEvents = 'none';
            quizState.index++;
            setTimeout(function () { renderSharedChallengeQuestion(c, quizState, list, challengeKey); }, 500);
        });
    }
}
