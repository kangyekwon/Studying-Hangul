/**
 * New Game Modes for K-POP Korean Learning Game
 * Requires: content-data.js (loaded before this file)
 * Uses global functions: getWords, shuffle, addXP, addCombo, resetCombo,
 *   SoundEngine, createConfetti, showToast, saveProgress, gameState,
 *   escapeHtml, speakKorean, collectWord, trackWeakWord
 */

// ============================================================
// 1. MBTI Personality Quiz
// ============================================================

var mbtiAnswers = [];
var mbtiResult = "";
var mbtiStep = 0;

var mbtiQuestions = [
    {
        question: "How do you prefer to learn Korean?",
        optionA: "With friends, in a group study session",
        optionB: "Alone, at my own pace with apps",
        dimension: "EI"
    },
    {
        question: "When learning new vocabulary, you prefer...",
        optionA: "Memorizing practical everyday phrases",
        optionB: "Understanding grammar patterns and rules",
        dimension: "SN"
    },
    {
        question: "When you get an answer wrong, you...",
        optionA: "Analyze why and create a study plan",
        optionB: "Feel the emotion and use it as motivation",
        dimension: "TF"
    },
    {
        question: "Your study schedule is...",
        optionA: "Structured with daily goals and deadlines",
        optionB: "Flexible, studying whenever inspiration hits",
        dimension: "JP"
    }
];

function showMbtiQuiz(c) {
    mbtiAnswers = [];
    mbtiResult = "";
    mbtiStep = 0;
    gameState.gamesPlayed++;
    saveProgress();
    renderMbtiQuestion(c);
}

function renderMbtiQuestion(c) {
    if (mbtiStep >= mbtiQuestions.length) {
        computeMbtiResult();
        renderMbtiResult(c);
        return;
    }

    var q = mbtiQuestions[mbtiStep];
    var progress = Math.round((mbtiStep / mbtiQuestions.length) * 100);

    var h = '<h2 class="game-title">MBTI Korean Learner Type</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px">';
    h += 'Question ' + (mbtiStep + 1) + ' of ' + mbtiQuestions.length + '</p>';
    h += '<div class="level-progress" style="margin-bottom:25px">';
    h += '<div class="level-bar" style="width:' + progress + '%"></div></div>';
    h += '<div style="background:var(--glass);padding:25px;border-radius:15px;margin-bottom:25px">';
    h += '<p style="text-align:center;font-size:1.3rem;margin-bottom:5px">' + escapeHtml(q.question) + '</p></div>';
    h += '<div style="display:grid;gap:12px">';
    h += '<button class="game-btn" id="mbtiOptA" style="text-align:left;padding:18px 24px">';
    h += 'A. ' + escapeHtml(q.optionA) + '</button>';
    h += '<button class="game-btn secondary" id="mbtiOptB" style="text-align:left;padding:18px 24px">';
    h += 'B. ' + escapeHtml(q.optionB) + '</button>';
    h += '</div>';
    c.innerHTML = h;

    document.getElementById('mbtiOptA').onclick = function () {
        mbtiAnswers.push('A');
        mbtiStep++;
        SoundEngine.correct();
        renderMbtiQuestion(c);
    };
    document.getElementById('mbtiOptB').onclick = function () {
        mbtiAnswers.push('B');
        mbtiStep++;
        SoundEngine.correct();
        renderMbtiQuestion(c);
    };
}

function computeMbtiResult() {
    var type = "";
    type += mbtiAnswers[0] === "A" ? "E" : "I";
    type += mbtiAnswers[1] === "A" ? "S" : "N";
    type += mbtiAnswers[2] === "A" ? "T" : "F";
    type += mbtiAnswers[3] === "A" ? "J" : "P";
    mbtiResult = type;
}

function renderMbtiResult(c) {
    var typeDescriptions = {
        "ESTJ": { title: "The Disciplined Student", desc: "You love structure and efficiency in learning." },
        "ESTP": { title: "The Action Learner", desc: "You learn best by jumping into conversations." },
        "ESFJ": { title: "The Social Learner", desc: "You thrive in group study environments." },
        "ESFP": { title: "The K-POP Enthusiast", desc: "You learn Korean through music and entertainment." },
        "ENTJ": { title: "The Strategic Planner", desc: "You set ambitious goals and crush them." },
        "ENTP": { title: "The Creative Explorer", desc: "You love discovering patterns in grammar." },
        "ENFJ": { title: "The Motivator", desc: "You inspire others to learn Korean too." },
        "ENFP": { title: "The Passionate Fan", desc: "Your love for K-culture drives your learning." },
        "ISTJ": { title: "The Methodical Learner", desc: "You master Korean through consistent daily practice." },
        "ISTP": { title: "The Practical Learner", desc: "You focus on useful, real-world Korean." },
        "ISFJ": { title: "The Dedicated Student", desc: "You quietly and steadily build your skills." },
        "ISFP": { title: "The Artistic Soul", desc: "You learn Korean through drama and art." },
        "INTJ": { title: "The Master Planner", desc: "You approach Korean like a strategic challenge." },
        "INTP": { title: "The Language Analyst", desc: "You love dissecting grammar structures." },
        "INFJ": { title: "The Deep Learner", desc: "You seek deep cultural understanding." },
        "INFP": { title: "The Dreamer", desc: "You imagine yourself speaking fluently someday." }
    };

    var info = typeDescriptions[mbtiResult] || { title: "Korean Learner", desc: "You have a unique learning style!" };
    var expressions = [];

    if (typeof mbtiExpressions !== "undefined" && mbtiExpressions[mbtiResult]) {
        expressions = mbtiExpressions[mbtiResult];
    }

    createConfetti(60);
    addXP(30);

    var h = '<h2 class="game-title">Your MBTI Type: ' + mbtiResult + '</h2>';
    h += '<div class="flashcard" style="cursor:default">';
    h += '<div class="flashcard-korean" style="font-size:2.5rem">' + mbtiResult + '</div>';
    h += '<div class="flashcard-romanization" style="font-size:1.3rem">' + info.title + '</div>';
    h += '<div class="flashcard-english">' + info.desc + '</div></div>';

    if (expressions.length > 0) {
        h += '<h3 style="text-align:center;color:var(--neon-cyan);margin:20px 0 15px">Korean Expressions for ' + mbtiResult + ' Types</h3>';
        h += '<div style="display:grid;gap:10px">';
        for (var i = 0; i < expressions.length; i++) {
            var expr = expressions[i];
            var ek = escapeHtml(expr.korean || "");
            var er = escapeHtml(expr.romanization || "");
            var ee = escapeHtml(expr.english || "");
            h += '<div style="background:var(--glass);padding:15px;border-radius:12px;border:1px solid rgba(157,78,221,0.3)">';
            h += '<div style="font-size:1.4rem;color:var(--neon-pink)">' + ek + '</div>';
            h += '<div style="color:var(--neon-cyan);font-size:0.9rem">' + er + '</div>';
            h += '<div style="color:rgba(255,255,255,0.8)">' + ee + '</div>';
            h += '<button class="game-btn secondary" style="margin-top:8px;padding:6px 14px;font-size:0.85rem" onclick="speakKorean(\'' + ek.replace(/'/g, "\\'") + '\')">Listen</button>';
            h += '</div>';
        }
        h += '</div>';
    }

    h += '<div class="game-controls" style="margin-top:25px">';
    h += '<button class="game-btn" id="mbtiRetryBtn">Try Again</button></div>';
    c.innerHTML = h;

    document.getElementById('mbtiRetryBtn').onclick = function () {
        showMbtiQuiz(c);
    };
}


// ============================================================
// 2. Swipe/Scroll Learning (Short-Form Style)
// ============================================================

var swipeWords = [];
var swipeIndex = 0;
var swipeKnown = [];
var swipeStudy = [];

function showSwipeLearn(c) {
    var words = getWords();
    if (words.length < 5) {
        var allWords = [];
        for (var cat in wordDatabase) { allWords = allWords.concat(wordDatabase[cat]); }
        words = allWords;
    }
    swipeWords = shuffle(words).slice(0, 20);
    swipeIndex = 0;
    swipeKnown = [];
    swipeStudy = [];
    gameState.gamesPlayed++;
    saveProgress();
    renderSwipeCard(c);
}

function renderSwipeCard(c) {
    if (swipeIndex >= swipeWords.length) {
        renderSwipeResults(c);
        return;
    }

    var w = swipeWords[swipeIndex];
    var total = swipeWords.length;
    var current = swipeIndex + 1;
    var progress = Math.round((swipeIndex / total) * 100);

    var h = '<h2 class="game-title">Swipe Learn</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += current + ' / ' + total + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + progress + '%"></div></div>';

    h += '<div class="flashcard" id="swipeCard" style="cursor:default;position:relative">';
    h += '<div class="flashcard-rarity rarity-' + w.rarity + '">' + w.rarity.toUpperCase() + '</div>';
    h += '<div class="flashcard-korean">' + w.korean + '</div>';
    h += '<div class="flashcard-romanization">' + w.romanization + '</div>';
    h += '<div class="flashcard-english" id="swipeMeaning" style="display:none">' + w.english + '</div>';
    h += '<p id="swipeTapHint" style="opacity:0.5;margin-top:10px">Tap to reveal meaning</p>';
    h += '</div>';

    h += '<div class="game-controls">';
    h += '<button class="game-btn secondary" id="swipeStudyBtn" style="flex:1;max-width:180px">';
    h += 'Study More</button>';
    h += '<button class="game-btn" id="swipeGotBtn" style="flex:1;max-width:180px">';
    h += 'Got It!</button>';
    h += '</div>';

    h += '<div style="display:flex;justify-content:center;gap:15px;margin-top:15px">';
    h += '<button class="game-btn secondary" id="swipeListenBtn" style="padding:10px 18px">Listen</button>';
    h += '</div>';

    c.innerHTML = h;

    var revealed = false;
    document.getElementById('swipeCard').onclick = function () {
        if (!revealed) {
            revealed = true;
            document.getElementById('swipeMeaning').style.display = 'block';
            document.getElementById('swipeTapHint').style.display = 'none';
        }
    };

    document.getElementById('swipeGotBtn').onclick = function () {
        swipeKnown.push(swipeWords[swipeIndex]);
        collectWord(swipeWords[swipeIndex]);
        addXP(5);
        addCombo();
        SoundEngine.correct();
        swipeIndex++;
        renderSwipeCard(c);
    };

    document.getElementById('swipeStudyBtn').onclick = function () {
        swipeStudy.push(swipeWords[swipeIndex]);
        trackWeakWord(swipeWords[swipeIndex]);
        resetCombo();
        swipeIndex++;
        renderSwipeCard(c);
    };

    document.getElementById('swipeListenBtn').onclick = function () {
        speakKorean(w.korean);
    };
}

function renderSwipeResults(c) {
    var knownCount = swipeKnown.length;
    var studyCount = swipeStudy.length;
    var total = swipeWords.length;
    var pct = Math.round((knownCount / total) * 100);

    if (pct >= 80) { createConfetti(80); }
    addXP(knownCount * 3);

    var h = '<h2 class="game-title">Session Complete!</h2>';
    h += '<div style="text-align:center;margin:20px 0">';
    h += '<div style="font-size:3rem;color:var(--gold);font-weight:bold">' + pct + '%</div>';
    h += '<p style="color:rgba(255,255,255,0.7)">Words you know</p></div>';

    h += '<div style="display:flex;justify-content:center;gap:20px;margin:20px 0">';
    h += '<div class="stat-item" style="flex:1;max-width:130px">';
    h += '<div class="stat-value">' + knownCount + '</div>';
    h += '<div class="stat-label">Got It</div></div>';
    h += '<div class="stat-item" style="flex:1;max-width:130px">';
    h += '<div class="stat-value">' + studyCount + '</div>';
    h += '<div class="stat-label">Need Study</div></div></div>';

    if (studyCount > 0) {
        h += '<h3 style="text-align:center;color:var(--neon-cyan);margin:15px 0 10px">Words to Review</h3>';
        h += '<div style="display:grid;gap:8px;max-width:400px;margin:0 auto">';
        for (var i = 0; i < swipeStudy.length; i++) {
            var sw = swipeStudy[i];
            h += '<div style="background:var(--glass);padding:10px 15px;border-radius:10px;display:flex;justify-content:space-between;align-items:center">';
            h += '<span style="color:var(--neon-pink);font-size:1.2rem">' + sw.korean + '</span>';
            h += '<span style="color:rgba(255,255,255,0.7)">' + sw.english + '</span></div>';
        }
        h += '</div>';
    }

    h += '<div class="game-controls" style="margin-top:25px">';
    h += '<button class="game-btn" id="swipeAgainBtn">Practice Again</button></div>';
    c.innerHTML = h;

    document.getElementById('swipeAgainBtn').onclick = function () {
        showSwipeLearn(c);
    };
}


// ============================================================
// 3. K-POP Lyrics Fill-in-the-Blank
// ============================================================

var lyricsQuestion = null;
var lyricsOptions = [];
var lyricsAnswered = false;
var lyricsScore = 0;
var lyricsRound = 0;
var lyricsTotal = 5;

var defaultKpopLyrics = [
    { song: "Dynamite", artist: "BTS", koreanLine: "이 밤의 ___ 에 너를 담아", answer: "리듬", hint: "rhythm", options: ["리듬", "노래", "사랑", "꿈"] },
    { song: "How You Like That", artist: "BLACKPINK", koreanLine: "어떻게 ___ 날 버렸어", answer: "너는", hint: "you", options: ["너는", "우리", "내가", "그가"] },
    { song: "Love Dive", artist: "IVE", koreanLine: "___ 에 빠져 깊이", answer: "사랑", hint: "love", options: ["사랑", "바다", "꿈속", "하늘"] },
    { song: "Super Shy", artist: "NewJeans", koreanLine: "너무 ___ 숨고 싶어", answer: "부끄러워", hint: "shy/embarrassed", options: ["부끄러워", "슬퍼서", "행복해", "외로워"] },
    { song: "Next Level", artist: "aespa", koreanLine: "다음 ___ 로 가자", answer: "레벨", hint: "level", options: ["레벨", "세계", "무대", "노래"] },
    { song: "Hype Boy", artist: "NewJeans", koreanLine: "나는 ___ 소년을 좋아해", answer: "하이프", hint: "hype", options: ["하이프", "착한", "멋진", "웃긴"] },
    { song: "Butter", artist: "BTS", koreanLine: "___ 처럼 녹아내려", answer: "버터", hint: "butter", options: ["버터", "아이스", "초콜릿", "설탕"] },
    { song: "LATATA", artist: "(G)I-DLE", koreanLine: "라타타 ___ 가 흘러", answer: "눈물", hint: "tears", options: ["눈물", "시간", "음악", "바람"] }
];

function showLyricsFill(c) {
    lyricsScore = 0;
    lyricsRound = 0;
    lyricsAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextLyricsQuestion(c);
}

function nextLyricsQuestion(c) {
    if (lyricsRound >= lyricsTotal) {
        renderLyricsEnd(c);
        return;
    }

    var pool = (typeof kpopLyrics !== "undefined" && kpopLyrics.length > 0) ? kpopLyrics : defaultKpopLyrics;
    var available = shuffle(pool);
    lyricsQuestion = available[lyricsRound % available.length];
    lyricsAnswered = false;

    if (lyricsQuestion.options && lyricsQuestion.options.length >= 4) {
        lyricsOptions = shuffle(lyricsQuestion.options.slice(0, 4));
    } else {
        lyricsOptions = shuffle([lyricsQuestion.answer, "사랑", "하늘", "바다"]);
    }

    lyricsRound++;
    renderLyricsQuestion(c);
}

function renderLyricsQuestion(c) {
    var q = lyricsQuestion;
    var line = escapeHtml(q.koreanLine || "");
    var displayLine = line.replace("___", '<span style="color:var(--gold);font-weight:bold;border-bottom:3px solid var(--gold);padding:0 10px">___</span>');

    var h = '<h2 class="game-title">K-POP Lyrics Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px">';
    h += 'Round ' + lyricsRound + ' / ' + lyricsTotal + '</p>';

    h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.3),rgba(255,45,149,0.2));padding:25px;border-radius:15px;margin-bottom:20px;text-align:center">';
    h += '<div style="font-size:0.9rem;color:var(--neon-cyan);margin-bottom:8px">';
    h += escapeHtml(q.artist || "") + ' - ' + escapeHtml(q.song || "") + '</div>';
    h += '<div style="font-size:1.6rem;line-height:1.8">' + displayLine + '</div>';
    if (q.hint) {
        h += '<div style="margin-top:10px;font-size:0.85rem;color:rgba(255,255,255,0.5)">Hint: ' + escapeHtml(q.hint) + '</div>';
    }
    h += '</div>';

    h += '<div class="quiz-options">';
    for (var i = 0; i < lyricsOptions.length; i++) {
        var optClass = 'quiz-option';
        if (lyricsAnswered) {
            if (lyricsOptions[i] === q.answer) {
                optClass += ' correct';
            }
        }
        h += '<div class="' + optClass + '" data-answer="' + escapeHtml(lyricsOptions[i]) + '">';
        h += escapeHtml(lyricsOptions[i]) + '</div>';
    }
    h += '</div>';

    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">';
    h += 'Score: ' + lyricsScore + '</div>';

    c.innerHTML = h;

    if (!lyricsAnswered) {
        var opts = c.querySelectorAll('.quiz-option');
        for (var j = 0; j < opts.length; j++) {
            opts[j].onclick = function () {
                if (lyricsAnswered) return;
                lyricsAnswered = true;
                var selected = this.getAttribute('data-answer');
                if (selected === lyricsQuestion.answer) {
                    this.classList.add('correct');
                    lyricsScore += 100;
                    gameState.correctAnswers++;
                    SoundEngine.correct();
                    addCombo();
                    addXP(15);
                } else {
                    this.classList.add('wrong');
                    SoundEngine.wrong();
                    resetCombo();
                    var allOpts = c.querySelectorAll('.quiz-option');
                    for (var k = 0; k < allOpts.length; k++) {
                        if (allOpts[k].getAttribute('data-answer') === lyricsQuestion.answer) {
                            allOpts[k].classList.add('correct');
                        }
                    }
                }
                setTimeout(function () {
                    nextLyricsQuestion(c);
                }, 1200);
            };
        }
    }
}

function renderLyricsEnd(c) {
    if (lyricsScore >= 400) { createConfetti(80); }
    addXP(lyricsScore / 10);

    var h = '<h2 class="game-title">Lyrics Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">🎤</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + lyricsScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + lyricsRound + ' songs completed</p>';
    h += '<button class="game-btn" id="lyricsAgainBtn">Play Again</button></div>';
    c.innerHTML = h;

    document.getElementById('lyricsAgainBtn').onclick = function () {
        showLyricsFill(c);
    };
}


// ============================================================
// 4. Handwriting Practice with Canvas
// ============================================================

var hwCharacters = [
    "ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ",
    "ㅋ", "ㅌ", "ㅍ", "ㅎ", "ㅏ", "ㅓ", "ㅗ", "ㅜ", "ㅡ", "ㅣ",
    "ㅐ", "ㅔ"
];

var hwCharNames = {
    "ㄱ": "giyeok", "ㄴ": "nieun", "ㄷ": "digeut", "ㄹ": "rieul",
    "ㅁ": "mieum", "ㅂ": "bieup", "ㅅ": "siot", "ㅇ": "ieung",
    "ㅈ": "jieut", "ㅊ": "chieut", "ㅋ": "kieuk", "ㅌ": "tieut",
    "ㅍ": "pieup", "ㅎ": "hieut", "ㅏ": "a", "ㅓ": "eo",
    "ㅗ": "o", "ㅜ": "u", "ㅡ": "eu", "ㅣ": "i",
    "ㅐ": "ae", "ㅔ": "e"
};

var hwStrokeHints = {
    "ㄱ": "Horizontal stroke right, then vertical stroke down",
    "ㄴ": "Vertical stroke down, then horizontal stroke right",
    "ㄷ": "Horizontal stroke right, vertical down, horizontal right",
    "ㄹ": "4 strokes forming a zigzag pattern",
    "ㅁ": "Draw a rectangle (4 strokes)",
    "ㅂ": "Two vertical strokes down, then horizontal bars",
    "ㅅ": "Two strokes meeting at a point on top",
    "ㅇ": "Draw a circle",
    "ㅈ": "Horizontal stroke, then two diagonal strokes meeting",
    "ㅊ": "A dot on top, then horizontal, then two diagonals",
    "ㅋ": "Like ㄱ but with an extra horizontal stroke",
    "ㅌ": "Like ㄷ but with an extra horizontal stroke",
    "ㅍ": "Like ㅁ but with vertical lines inside",
    "ㅎ": "Horizontal stroke, circle below, then another stroke",
    "ㅏ": "Vertical line, then short horizontal line to the right",
    "ㅓ": "Short horizontal left, then vertical line",
    "ㅗ": "Short vertical up, then horizontal line",
    "ㅜ": "Horizontal line, then short vertical down",
    "ㅡ": "One horizontal stroke",
    "ㅣ": "One vertical stroke",
    "ㅐ": "Like ㅏ with an extra vertical line",
    "ㅔ": "Like ㅓ with an extra vertical line"
};

var hwCurrentChar = "";
var hwPracticeCount = 0;
var hwIsDrawing = false;

function showHandwriting(c) {
    hwCurrentChar = hwCharacters[Math.floor(Math.random() * hwCharacters.length)];
    hwPracticeCount = 0;
    gameState.gamesPlayed++;
    saveProgress();
    renderHandwriting(c);
}

function renderHandwriting(c) {
    var charName = hwCharNames[hwCurrentChar] || "";
    var hint = hwStrokeHints[hwCurrentChar] || "Practice writing this character";

    var h = '<h2 class="game-title">Handwriting Practice</h2>';
    h += '<div style="display:flex;justify-content:center;align-items:center;gap:30px;margin-bottom:20px;flex-wrap:wrap">';

    h += '<div style="text-align:center">';
    h += '<div style="font-size:7rem;color:var(--neon-pink);line-height:1;text-shadow:0 0 30px rgba(255,45,149,0.5)">' + hwCurrentChar + '</div>';
    h += '<div style="color:var(--neon-cyan);font-size:1.1rem;margin-top:5px">' + charName + '</div></div>';

    h += '<div style="text-align:center">';
    h += '<canvas id="hwCanvas" width="280" height="280" style="background:rgba(255,255,255,0.05);border:2px solid rgba(157,78,221,0.5);border-radius:15px;cursor:crosshair;touch-action:none"></canvas>';
    h += '</div></div>';

    h += '<div style="background:var(--glass);padding:12px 18px;border-radius:10px;margin-bottom:15px;text-align:center">';
    h += '<span style="color:var(--neon-cyan);font-size:0.85rem">Stroke Guide: </span>';
    h += '<span style="color:rgba(255,255,255,0.7);font-size:0.85rem">' + escapeHtml(hint) + '</span></div>';

    h += '<div style="text-align:center;margin-bottom:15px;color:rgba(255,255,255,0.5);font-size:0.85rem">';
    h += 'Practice count: ' + hwPracticeCount + '</div>';

    h += '<div class="game-controls">';
    h += '<button class="game-btn secondary" id="hwClearBtn">Clear</button>';
    h += '<button class="game-btn secondary" id="hwListenBtn">Listen</button>';
    h += '<button class="game-btn" id="hwNextBtn">Next Character</button>';
    h += '</div>';

    h += '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-top:15px">';
    for (var i = 0; i < hwCharacters.length; i++) {
        var isActive = hwCharacters[i] === hwCurrentChar ? 'background:var(--neon-purple);' : '';
        h += '<button class="hangul-key" style="width:40px;height:40px;font-size:1.2rem;' + isActive + '" data-hw-char="' + hwCharacters[i] + '">';
        h += hwCharacters[i] + '</button>';
    }
    h += '</div>';

    c.innerHTML = h;

    // Set up canvas drawing
    var canvas = document.getElementById('hwCanvas');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#ff2d95';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        hwIsDrawing = false;

        // Draw guide character faintly
        ctx.font = '180px sans-serif';
        ctx.fillStyle = 'rgba(157,78,221,0.1)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(hwCurrentChar, 140, 145);

        // Reset drawing style after guide
        ctx.strokeStyle = '#ff2d95';
        ctx.lineWidth = 4;

        function getCanvasPos(e) {
            var rect = canvas.getBoundingClientRect();
            var clientX, clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            return {
                x: (clientX - rect.left) * (canvas.width / rect.width),
                y: (clientY - rect.top) * (canvas.height / rect.height)
            };
        }

        function startDraw(e) {
            e.preventDefault();
            hwIsDrawing = true;
            var pos = getCanvasPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }

        function moveDraw(e) {
            e.preventDefault();
            if (!hwIsDrawing) return;
            var pos = getCanvasPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        }

        function endDraw(e) {
            e.preventDefault();
            hwIsDrawing = false;
        }

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', moveDraw);
        canvas.addEventListener('mouseup', endDraw);
        canvas.addEventListener('mouseleave', endDraw);
        canvas.addEventListener('touchstart', startDraw);
        canvas.addEventListener('touchmove', moveDraw);
        canvas.addEventListener('touchend', endDraw);
    }

    document.getElementById('hwClearBtn').onclick = function () {
        var cv = document.getElementById('hwCanvas');
        if (cv) {
            var ct = cv.getContext('2d');
            ct.clearRect(0, 0, cv.width, cv.height);
            ct.font = '180px sans-serif';
            ct.fillStyle = 'rgba(157,78,221,0.1)';
            ct.textAlign = 'center';
            ct.textBaseline = 'middle';
            ct.fillText(hwCurrentChar, 140, 145);
            ct.strokeStyle = '#ff2d95';
            ct.lineWidth = 4;
            ct.lineCap = 'round';
            ct.lineJoin = 'round';
        }
    };

    document.getElementById('hwListenBtn').onclick = function () {
        speakKorean(hwCurrentChar);
    };

    document.getElementById('hwNextBtn').onclick = function () {
        hwPracticeCount++;
        addXP(5);
        SoundEngine.correct();
        hwCurrentChar = hwCharacters[Math.floor(Math.random() * hwCharacters.length)];
        renderHandwriting(c);
    };

    var charBtns = c.querySelectorAll('[data-hw-char]');
    for (var j = 0; j < charBtns.length; j++) {
        charBtns[j].onclick = function () {
            hwCurrentChar = this.getAttribute('data-hw-char');
            renderHandwriting(c);
        };
    }
}


// ============================================================
// 5. Grammar Pattern Drills
// ============================================================

var grammarScore = 0;
var grammarRound = 0;
var grammarTotal = 5;
var grammarCurrent = null;
var grammarAnswered = false;

var defaultGrammarPatterns = [
    {
        pattern: "-아/어요 (polite present tense)",
        explanation: "Add -아요 to stems ending in ㅏ or ㅗ, -어요 to others",
        question: "What is the polite form of 가다 (to go)?",
        answer: "가요",
        options: ["가요", "갔어요", "갈게요", "가세요"]
    },
    {
        pattern: "-았/었어요 (past tense)",
        explanation: "Add -았어요 to stems with ㅏ/ㅗ, -었어요 to others",
        question: "What is the past tense of 먹다 (to eat)?",
        answer: "먹었어요",
        options: ["먹었어요", "먹어요", "먹을게요", "먹겠어요"]
    },
    {
        pattern: "-고 싶다 (want to)",
        explanation: "Attach -고 싶다 to the verb stem to express desire",
        question: "How do you say 'I want to go'?",
        answer: "가고 싶어요",
        options: ["가고 싶어요", "가야 해요", "가면 돼요", "갈 수 있어요"]
    },
    {
        pattern: "-ㄹ/을 수 있다 (can/able to)",
        explanation: "Attach -ㄹ 수 있다 (vowel stem) or -을 수 있다 (consonant stem)",
        question: "How do you say 'I can read' (읽다)?",
        answer: "읽을 수 있어요",
        options: ["읽을 수 있어요", "읽고 싶어요", "읽어야 해요", "읽을게요"]
    },
    {
        pattern: "-아/어서 (because/so)",
        explanation: "Attach to give reason or cause. 아서 after ㅏ/ㅗ, 어서 after others",
        question: "How do you say 'Because it is delicious' (맛있다)?",
        answer: "맛있어서",
        options: ["맛있어서", "맛있으면", "맛있지만", "맛있고"]
    },
    {
        pattern: "-(으)면 (if/when)",
        explanation: "Attach -면 to vowel stems, -으면 to consonant stems for conditional",
        question: "How do you say 'If it rains' (비가 오다)?",
        answer: "비가 오면",
        options: ["비가 오면", "비가 와서", "비가 오고", "비가 오지만"]
    },
    {
        pattern: "-지 마세요 (please don't)",
        explanation: "Attach -지 마세요 to verb stem for polite negative imperative",
        question: "How do you say 'Please don't worry' (걱정하다)?",
        answer: "걱정하지 마세요",
        options: ["걱정하지 마세요", "걱정해요", "걱정했어요", "걱정할게요"]
    }
];

function showGrammarDrill(c) {
    grammarScore = 0;
    grammarRound = 0;
    grammarAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextGrammarQuestion(c);
}

function nextGrammarQuestion(c) {
    if (grammarRound >= grammarTotal) {
        renderGrammarEnd(c);
        return;
    }

    var pool = (typeof grammarPatterns !== "undefined" && grammarPatterns.length > 0) ? grammarPatterns : defaultGrammarPatterns;
    var available = shuffle(pool);
    grammarCurrent = available[grammarRound % available.length];
    grammarAnswered = false;
    grammarRound++;
    renderGrammarQuestion(c);
}

function renderGrammarQuestion(c) {
    var g = grammarCurrent;
    var opts = g.options ? shuffle(g.options.slice()) : [g.answer, "Option B", "Option C", "Option D"];

    var h = '<h2 class="game-title">Grammar Drill</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px">';
    h += 'Round ' + grammarRound + ' / ' + grammarTotal + '</p>';

    h += '<div style="background:linear-gradient(135deg,rgba(0,212,255,0.15),rgba(0,245,212,0.1));padding:20px;border-radius:15px;margin-bottom:15px">';
    h += '<div style="color:var(--neon-cyan);font-weight:bold;font-size:1.2rem;margin-bottom:8px">';
    h += escapeHtml(g.pattern || "") + '</div>';
    h += '<div style="color:rgba(255,255,255,0.8);font-size:0.95rem">';
    h += escapeHtml(g.explanation || "") + '</div></div>';

    h += '<div style="background:var(--glass);padding:18px;border-radius:12px;margin-bottom:20px;text-align:center">';
    h += '<p style="font-size:1.2rem">' + escapeHtml(g.question || "") + '</p></div>';

    h += '<div class="quiz-options">';
    for (var i = 0; i < opts.length; i++) {
        var oc = 'quiz-option';
        if (grammarAnswered && opts[i] === g.answer) { oc += ' correct'; }
        h += '<div class="' + oc + '" data-ganswer="' + escapeHtml(opts[i]) + '">' + escapeHtml(opts[i]) + '</div>';
    }
    h += '</div>';

    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">';
    h += 'Score: ' + grammarScore + '</div>';

    c.innerHTML = h;

    if (!grammarAnswered) {
        var optEls = c.querySelectorAll('.quiz-option');
        for (var j = 0; j < optEls.length; j++) {
            optEls[j].onclick = function () {
                if (grammarAnswered) return;
                grammarAnswered = true;
                var sel = this.getAttribute('data-ganswer');
                if (sel === grammarCurrent.answer) {
                    this.classList.add('correct');
                    grammarScore += 100;
                    gameState.correctAnswers++;
                    SoundEngine.correct();
                    addCombo();
                    addXP(20);
                } else {
                    this.classList.add('wrong');
                    SoundEngine.wrong();
                    resetCombo();
                    var all = c.querySelectorAll('.quiz-option');
                    for (var k = 0; k < all.length; k++) {
                        if (all[k].getAttribute('data-ganswer') === grammarCurrent.answer) {
                            all[k].classList.add('correct');
                        }
                    }
                }
                setTimeout(function () {
                    nextGrammarQuestion(c);
                }, 1200);
            };
        }
    }
}

function renderGrammarEnd(c) {
    if (grammarScore >= 400) { createConfetti(80); }
    addXP(grammarScore / 10);

    var h = '<h2 class="game-title">Grammar Drill Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">📝</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + grammarScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + grammarRound + ' patterns practiced</p>';
    h += '<button class="game-btn" id="grammarAgainBtn">Practice Again</button></div>';
    c.innerHTML = h;

    document.getElementById('grammarAgainBtn').onclick = function () {
        showGrammarDrill(c);
    };
}


// ============================================================
// 6. Situational Conversation Practice
// ============================================================

var sitCurrentSituation = "";
var sitPhrases = [];
var sitIndex = 0;

var defaultSituationalPhrases = {
    cafe: [
        { korean: "아메리카노 한 잔 주세요", romanization: "amerikano han jan juseyo", english: "One Americano, please" },
        { korean: "여기 앉아도 될까요?", romanization: "yeogi anjado doelkkayo?", english: "Can I sit here?" },
        { korean: "와이파이 비밀번호가 뭐예요?", romanization: "waipai bimilbeonhoga mwoyeyo?", english: "What is the WiFi password?" },
        { korean: "얼마예요?", romanization: "eolmayeyo?", english: "How much is it?" },
        { korean: "영수증 주세요", romanization: "yeongsujeung juseyo", english: "Receipt, please" },
        { korean: "포장해 주세요", romanization: "pojanghae juseyo", english: "To go, please" }
    ],
    restaurant: [
        { korean: "메뉴판 좀 주세요", romanization: "menyupan jom juseyo", english: "Menu, please" },
        { korean: "추천 메뉴가 뭐예요?", romanization: "chucheon menyuga mwoyeyo?", english: "What do you recommend?" },
        { korean: "이거 하나 주세요", romanization: "igeo hana juseyo", english: "One of this, please" },
        { korean: "맵지 않게 해주세요", romanization: "maepji anke haejuseyo", english: "Not too spicy, please" },
        { korean: "계산해 주세요", romanization: "gyesanhae juseyo", english: "Check, please" },
        { korean: "잘 먹겠습니다", romanization: "jal meokgesseumnida", english: "I will eat well (before eating)" }
    ],
    shopping: [
        { korean: "이거 얼마예요?", romanization: "igeo eolmayeyo?", english: "How much is this?" },
        { korean: "좀 깎아 주세요", romanization: "jom kkakka juseyo", english: "Please give a discount" },
        { korean: "다른 색 있어요?", romanization: "dareun saek isseoyo?", english: "Do you have other colors?" },
        { korean: "입어 봐도 돼요?", romanization: "ibeo bwado dwaeyo?", english: "Can I try it on?" },
        { korean: "카드로 결제할게요", romanization: "kadeuro gyeoljehalgeyo", english: "I will pay by card" },
        { korean: "교환할 수 있어요?", romanization: "gyohwanhal su isseoyo?", english: "Can I exchange it?" }
    ],
    transport: [
        { korean: "이 버스 강남 가요?", romanization: "i beoseu gangnam gayo?", english: "Does this bus go to Gangnam?" },
        { korean: "지하철역이 어디예요?", romanization: "jihacheol yeogi eodiyeyo?", english: "Where is the subway station?" },
        { korean: "택시 불러 주세요", romanization: "taeksi bulleo juseyo", english: "Please call a taxi" },
        { korean: "여기서 내릴게요", romanization: "yeogiseo naerilgeyo", english: "I will get off here" },
        { korean: "얼마나 걸려요?", romanization: "eolmana geollyeoyo?", english: "How long does it take?" },
        { korean: "다음 정류장이 어디예요?", romanization: "daeum jeongnyujang-i eodiyeyo?", english: "What is the next stop?" }
    ],
    hotel: [
        { korean: "체크인 하고 싶어요", romanization: "chekeu-in hago sipeoyo", english: "I would like to check in" },
        { korean: "방이 있어요?", romanization: "bang-i isseoyo?", english: "Do you have a room available?" },
        { korean: "수건 더 주세요", romanization: "sugeon deo juseyo", english: "More towels, please" },
        { korean: "조식은 몇 시예요?", romanization: "josig-eun myeot siyeyo?", english: "What time is breakfast?" },
        { korean: "체크아웃은 몇 시예요?", romanization: "chekeu-aus-eun myeot siyeyo?", english: "What time is checkout?" },
        { korean: "짐을 맡겨도 될까요?", romanization: "jim-eul matgyeodo doelkkayo?", english: "Can I leave my luggage?" }
    ]
};

function showSituation(c) {
    sitCurrentSituation = "";
    sitPhrases = [];
    sitIndex = 0;
    renderSituationPicker(c);
}

function renderSituationPicker(c) {
    var situations = (typeof situationalPhrases !== "undefined" && Object.keys(situationalPhrases).length > 0)
        ? situationalPhrases : defaultSituationalPhrases;

    var sitIcons = {
        cafe: "☕", restaurant: "🍽️", shopping: "🛍️",
        transport: "🚌", hotel: "🏨", hospital: "🏥",
        school: "🏫", bank: "🏦", pharmacy: "💊"
    };

    var h = '<h2 class="game-title">Situational Practice</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">';
    h += 'Choose a situation to practice</p>';

    h += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px">';
    var keys = Object.keys(situations);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var icon = sitIcons[key] || "💬";
        var label = key.charAt(0).toUpperCase() + key.slice(1);
        h += '<div class="quiz-option" data-situation="' + escapeHtml(key) + '" style="padding:25px 15px">';
        h += '<div style="font-size:2.5rem;margin-bottom:8px">' + icon + '</div>';
        h += '<div style="font-weight:bold">' + escapeHtml(label) + '</div>';
        h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5)">';
        var phraseCount = Array.isArray(situations[key]) ? situations[key].length : (situations[key].phrases ? situations[key].phrases.length : 0);
        h += phraseCount + ' phrases</div></div>';
    }
    h += '</div>';

    c.innerHTML = h;

    var sitBtns = c.querySelectorAll('[data-situation]');
    for (var j = 0; j < sitBtns.length; j++) {
        sitBtns[j].onclick = function () {
            var sit = this.getAttribute('data-situation');
            sitCurrentSituation = sit;
            var source = (typeof situationalPhrases !== "undefined" && situationalPhrases[sit])
                ? situationalPhrases[sit] : defaultSituationalPhrases[sit];
            sitPhrases = Array.isArray(source) ? source : (source && source.phrases ? source.phrases : []);
            sitIndex = 0;
            gameState.gamesPlayed++;
            saveProgress();
            renderSituationPhrase(c);
        };
    }
}

function renderSituationPhrase(c) {
    if (sitIndex >= sitPhrases.length) {
        renderSituationEnd(c);
        return;
    }

    var phrase = sitPhrases[sitIndex];
    var total = sitPhrases.length;
    var current = sitIndex + 1;
    var label = sitCurrentSituation.charAt(0).toUpperCase() + sitCurrentSituation.slice(1);
    var progress = Math.round((sitIndex / total) * 100);

    var h = '<h2 class="game-title">' + escapeHtml(label) + ' Phrases</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += current + ' / ' + total + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + progress + '%"></div></div>';

    h += '<div class="flashcard" style="cursor:default">';
    h += '<div class="flashcard-korean" style="font-size:2rem">' + escapeHtml(phrase.korean || "") + '</div>';
    h += '<div class="flashcard-romanization">' + escapeHtml(phrase.romanization || "") + '</div>';
    h += '<div class="flashcard-english" style="margin-top:10px">' + escapeHtml(phrase.english || "") + '</div>';
    h += '</div>';

    h += '<div class="game-controls">';
    h += '<button class="game-btn secondary" id="sitListenBtn">Listen</button>';
    h += '<button class="game-btn" id="sitNextBtn">';
    h += (sitIndex < total - 1) ? 'Next Phrase' : 'Finish';
    h += '</button>';
    h += '<button class="game-btn secondary" id="sitBackBtn">Back to List</button>';
    h += '</div>';

    c.innerHTML = h;

    document.getElementById('sitListenBtn').onclick = function () {
        speakKorean(phrase.korean);
    };

    document.getElementById('sitNextBtn').onclick = function () {
        addXP(5);
        sitIndex++;
        renderSituationPhrase(c);
    };

    document.getElementById('sitBackBtn').onclick = function () {
        renderSituationPicker(c);
    };

    // Auto-play pronunciation
    setTimeout(function () {
        speakKorean(phrase.korean);
    }, 400);
}

function renderSituationEnd(c) {
    createConfetti(50);
    addXP(20);
    var label = sitCurrentSituation.charAt(0).toUpperCase() + sitCurrentSituation.slice(1);

    var h = '<h2 class="game-title">Practice Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">💬</div>';
    h += '<p style="font-size:1.3rem;color:var(--neon-cyan);margin:15px 0">';
    h += escapeHtml(label) + ' - All phrases reviewed!</p>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">';
    h += sitPhrases.length + ' phrases practiced</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="sitRetryBtn">Practice Again</button>';
    h += '<button class="game-btn secondary" id="sitOtherBtn">Other Situations</button>';
    h += '</div></div>';
    c.innerHTML = h;

    document.getElementById('sitRetryBtn').onclick = function () {
        sitIndex = 0;
        renderSituationPhrase(c);
    };

    document.getElementById('sitOtherBtn').onclick = function () {
        renderSituationPicker(c);
    };
}


// ============================================================
// 7. K-Drama Quotes Quiz
// ============================================================

var dramaScore = 0;
var dramaRound = 0;
var dramaTotal = 5;
var dramaCurrent = null;
var dramaAnswered = false;

var defaultKdramaQuotes = [
    {
        quote: "사랑이 어떻게 변하니",
        english: "How can love change?",
        drama: "Lovers in Paris",
        options: ["Lovers in Paris", "Goblin", "Boys Over Flowers", "Crash Landing on You"]
    },
    {
        quote: "도깨비 신부를 찾습니다",
        english: "Looking for the Goblin's bride",
        drama: "Goblin",
        options: ["Goblin", "My Love from the Star", "Descendants of the Sun", "Hotel Del Luna"]
    },
    {
        quote: "별에서 온 그대를 사랑합니다",
        english: "I love you who came from the stars",
        drama: "My Love from the Star",
        options: ["My Love from the Star", "Squid Game", "Itaewon Class", "Start-Up"]
    },
    {
        quote: "비상 착륙하겠습니다",
        english: "I will make an emergency landing",
        drama: "Crash Landing on You",
        options: ["Crash Landing on You", "Vincenzo", "All of Us Are Dead", "Sweet Home"]
    },
    {
        quote: "나의 해방일지를 쓰겠습니다",
        english: "I will write my liberation notes",
        drama: "My Liberation Notes",
        options: ["My Liberation Notes", "Reply 1988", "Signal", "Prison Playbook"]
    },
    {
        quote: "이태원에서 꿈을 이루겠습니다",
        english: "I will achieve my dream in Itaewon",
        drama: "Itaewon Class",
        options: ["Itaewon Class", "Extraordinary Attorney Woo", "Business Proposal", "Twenty-Five Twenty-One"]
    },
    {
        quote: "응답하라 1988",
        english: "Reply 1988",
        drama: "Reply 1988",
        options: ["Reply 1988", "Hospital Playlist", "Misaeng", "SKY Castle"]
    }
];

function showDramaQuiz(c) {
    dramaScore = 0;
    dramaRound = 0;
    dramaAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextDramaQuestion(c);
}

function nextDramaQuestion(c) {
    if (dramaRound >= dramaTotal) {
        renderDramaEnd(c);
        return;
    }

    var pool = (typeof kdramaQuotes !== "undefined" && kdramaQuotes.length > 0) ? kdramaQuotes : defaultKdramaQuotes;
    var available = shuffle(pool);
    dramaCurrent = available[dramaRound % available.length];
    dramaAnswered = false;
    dramaRound++;
    renderDramaQuestion(c);
}

function renderDramaQuestion(c) {
    var q = dramaCurrent;
    var opts = q.options ? shuffle(q.options.slice()) : [q.drama, "Drama B", "Drama C", "Drama D"];

    var h = '<h2 class="game-title">K-Drama Quotes Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px">';
    h += 'Round ' + dramaRound + ' / ' + dramaTotal + '</p>';

    h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.3),rgba(255,45,149,0.2));padding:30px;border-radius:15px;margin-bottom:20px;text-align:center">';
    h += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:10px">Which drama is this quote from?</div>';
    h += '<div style="font-size:1.8rem;color:var(--neon-pink);line-height:1.6;margin-bottom:10px">';
    h += '"' + escapeHtml(q.quote || "") + '"</div>';
    h += '<div style="font-size:1rem;color:rgba(255,255,255,0.7)">';
    h += escapeHtml(q.english || "") + '</div></div>';

    h += '<div class="quiz-options">';
    for (var i = 0; i < opts.length; i++) {
        var oc = 'quiz-option';
        if (dramaAnswered && opts[i] === q.drama) { oc += ' correct'; }
        h += '<div class="' + oc + '" data-drama="' + escapeHtml(opts[i]) + '">';
        h += escapeHtml(opts[i]) + '</div>';
    }
    h += '</div>';

    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">';
    h += 'Score: ' + dramaScore + '</div>';

    c.innerHTML = h;

    if (!dramaAnswered) {
        var optEls = c.querySelectorAll('.quiz-option');
        for (var j = 0; j < optEls.length; j++) {
            optEls[j].onclick = function () {
                if (dramaAnswered) return;
                dramaAnswered = true;
                var sel = this.getAttribute('data-drama');
                if (sel === dramaCurrent.drama) {
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
                    var all = c.querySelectorAll('.quiz-option');
                    for (var k = 0; k < all.length; k++) {
                        if (all[k].getAttribute('data-drama') === dramaCurrent.drama) {
                            all[k].classList.add('correct');
                        }
                    }
                }
                setTimeout(function () {
                    nextDramaQuestion(c);
                }, 1200);
            };
        }
    }
}

function renderDramaEnd(c) {
    if (dramaScore >= 400) { createConfetti(80); }
    addXP(dramaScore / 10);

    var h = '<h2 class="game-title">Drama Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">🎬</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + dramaScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + dramaRound + ' quotes completed</p>';
    h += '<button class="game-btn" id="dramaAgainBtn">Play Again</button></div>';
    c.innerHTML = h;

    document.getElementById('dramaAgainBtn').onclick = function () {
        showDramaQuiz(c);
    };
}


// ============================================================
// 8. KakaoTalk Emoticon/Expression Quiz
// ============================================================

var emoticonScore = 0;
var emoticonRound = 0;
var emoticonTotal = 8;
var emoticonCurrent = null;
var emoticonAnswered = false;

var defaultKakaotalkExpressions = [
    {
        expression: "ㅋㅋㅋ",
        meaning: "Haha (laughing)",
        context: "Used like 'lol' in English. More ㅋ's = funnier!",
        options: ["Haha (laughing)", "Crying", "Angry", "Surprised"]
    },
    {
        expression: "ㅠㅠ",
        meaning: "Crying / Sad",
        context: "The ㅠ shape looks like tears streaming down. Also written as ㅜㅜ",
        options: ["Crying / Sad", "Laughing", "Sleepy", "Confused"]
    },
    {
        expression: "ㅎㅎ",
        meaning: "Hehe (gentle laugh)",
        context: "Softer than ㅋㅋㅋ. Shows a gentle, friendly laugh",
        options: ["Hehe (gentle laugh)", "Crying hard", "Sighing", "Yawning"]
    },
    {
        expression: "ㄱㅅ",
        meaning: "Thanks (감사 abbreviation)",
        context: "Short for 감사 (gamsa). Quick way to say thanks in chat",
        options: ["Thanks (감사 abbreviation)", "Sorry", "Hello", "Goodbye"]
    },
    {
        expression: "ㅇㅇ",
        meaning: "Yes / Okay / Agreement",
        context: "Short for 응 (eung). Used to agree or acknowledge casually",
        options: ["Yes / Okay / Agreement", "No / Disagree", "Maybe", "Help me"]
    },
    {
        expression: "ㄴㄴ",
        meaning: "No no",
        context: "Short for 노노 (nono). Quick way to disagree or decline",
        options: ["No no", "Yes yes", "Haha", "Wait"]
    },
    {
        expression: "ㅇㅋ",
        meaning: "OK",
        context: "Short for 오케이 (okei). Quick acknowledgment in chat",
        options: ["OK", "Not okay", "I don't know", "Good night"]
    },
    {
        expression: "ㄷㄷ",
        meaning: "Shaking / Trembling (surprised or scared)",
        context: "Short for 덜덜 (deoldeol). Expresses shock, fear, or being impressed",
        options: ["Shaking / Trembling (surprised or scared)", "Dancing", "Sleeping", "Eating"]
    },
    {
        expression: "ㅁㅊ",
        meaning: "Crazy (informal)",
        context: "Abbreviation used in casual chat to express disbelief or amazement",
        options: ["Crazy (informal)", "Beautiful", "Delicious", "Boring"]
    },
    {
        expression: "ㄹㅇ",
        meaning: "For real / Really",
        context: "Short for 리얼 (rieal). Emphasizes something is genuine",
        options: ["For real / Really", "Fake / Lie", "Later", "Forget it"]
    },
    {
        expression: "ㅎㄷㄷ",
        meaning: "Wow / Incredible (shocked)",
        context: "Short for 후덜덜 (hudeoldeol). Stronger version of ㄷㄷ",
        options: ["Wow / Incredible (shocked)", "Boring", "Tired", "Hungry"]
    },
    {
        expression: "ㅂㅂ",
        meaning: "Bye bye",
        context: "Short for 바이바이 (baibai). Quick farewell in chat",
        options: ["Bye bye", "Hello", "Sorry", "Thank you"]
    }
];

function showEmoticonQuiz(c) {
    emoticonScore = 0;
    emoticonRound = 0;
    emoticonAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextEmoticonQuestion(c);
}

function nextEmoticonQuestion(c) {
    if (emoticonRound >= emoticonTotal) {
        renderEmoticonEnd(c);
        return;
    }

    var pool = (typeof kakaotalkExpressions !== "undefined" && kakaotalkExpressions.length > 0)
        ? kakaotalkExpressions : defaultKakaotalkExpressions;
    var available = shuffle(pool);
    emoticonCurrent = available[emoticonRound % available.length];
    emoticonAnswered = false;
    emoticonRound++;
    renderEmoticonQuestion(c);
}

function renderEmoticonQuestion(c) {
    var q = emoticonCurrent;
    var opts = q.options ? shuffle(q.options.slice()) : [q.meaning, "Option B", "Option C", "Option D"];

    var h = '<h2 class="game-title">KakaoTalk Expression Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px">';
    h += 'Round ' + emoticonRound + ' / ' + emoticonTotal + '</p>';

    h += '<div style="background:linear-gradient(135deg,rgba(255,215,0,0.15),rgba(255,165,0,0.1));padding:30px;border-radius:15px;margin-bottom:20px;text-align:center">';
    h += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:10px">What does this mean?</div>';
    h += '<div style="font-size:4rem;color:var(--gold);font-weight:bold;letter-spacing:5px">';
    h += escapeHtml(q.expression || "") + '</div></div>';

    h += '<div class="quiz-options">';
    for (var i = 0; i < opts.length; i++) {
        var oc = 'quiz-option';
        if (emoticonAnswered && opts[i] === q.meaning) { oc += ' correct'; }
        h += '<div class="' + oc + '" data-emote="' + escapeHtml(opts[i]) + '">';
        h += escapeHtml(opts[i]) + '</div>';
    }
    h += '</div>';

    if (emoticonAnswered && q.context) {
        h += '<div style="background:var(--glass);padding:15px;border-radius:12px;margin-top:15px;text-align:center">';
        h += '<span style="color:var(--neon-cyan);font-weight:bold">Usage: </span>';
        h += '<span style="color:rgba(255,255,255,0.8)">' + escapeHtml(q.context) + '</span></div>';
    }

    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">';
    h += 'Score: ' + emoticonScore + '</div>';

    c.innerHTML = h;

    if (!emoticonAnswered) {
        var optEls = c.querySelectorAll('.quiz-option');
        for (var j = 0; j < optEls.length; j++) {
            optEls[j].onclick = function () {
                if (emoticonAnswered) return;
                emoticonAnswered = true;
                var sel = this.getAttribute('data-emote');
                if (sel === emoticonCurrent.meaning) {
                    this.classList.add('correct');
                    emoticonScore += 100;
                    gameState.correctAnswers++;
                    SoundEngine.correct();
                    addCombo();
                    addXP(15);
                } else {
                    this.classList.add('wrong');
                    SoundEngine.wrong();
                    resetCombo();
                    var all = c.querySelectorAll('.quiz-option');
                    for (var k = 0; k < all.length; k++) {
                        if (all[k].getAttribute('data-emote') === emoticonCurrent.meaning) {
                            all[k].classList.add('correct');
                        }
                    }
                }
                // Re-render to show context, then proceed
                renderEmoticonQuestion(c);
                setTimeout(function () {
                    nextEmoticonQuestion(c);
                }, 2000);
            };
        }
    }
}

function renderEmoticonEnd(c) {
    if (emoticonScore >= 600) { createConfetti(80); }
    addXP(emoticonScore / 10);

    var h = '<h2 class="game-title">Expression Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">💬</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + emoticonScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:10px">' + emoticonRound + ' expressions learned</p>';
    h += '<p style="color:var(--neon-cyan);margin-bottom:25px">Now you can chat like a Korean!</p>';
    h += '<button class="game-btn" id="emoticonAgainBtn">Play Again</button></div>';
    c.innerHTML = h;

    document.getElementById('emoticonAgainBtn').onclick = function () {
        showEmoticonQuiz(c);
    };
}
