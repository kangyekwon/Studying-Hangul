/**
 * More Game Modes for K-POP Korean Learning Game
 * Requires: content-data.js (loaded before this file)
 * Uses global functions: getWords, shuffle, addXP, addCombo, resetCombo,
 *   SoundEngine, createConfetti, showToast, saveProgress, gameState,
 *   escapeHtml, speakKorean, collectWord, showPopup, screenShake,
 *   wordDatabase, Haptic (optional)
 */

// ============================================================
// FALLBACK DATA
// Loaded from more-content.js when available; fallback defaults below
// ============================================================

var defaultProverbs = [
    { korean: "낮말은 새가 듣고 밤말은 쥐가 듣는다", english: "What you say during the day, the birds hear; what you say at night, the mice hear", meaning: "Be careful what you say because someone is always listening.", difficulty: "intermediate" },
    { korean: "고생 끝에 낙이 온다", english: "After hardship comes happiness", meaning: "Good things come after going through difficult times. Similar to 'No pain, no gain'.", difficulty: "beginner" },
    { korean: "원숭이도 나무에서 떨어진다", english: "Even monkeys fall from trees", meaning: "Even experts can make mistakes sometimes.", difficulty: "beginner" },
    { korean: "가는 말이 고와야 오는 말이 곱다", english: "If the outgoing words are beautiful, the incoming words will be beautiful", meaning: "If you speak kindly to others, they will speak kindly to you.", difficulty: "advanced" },
    { korean: "콩 심은 데 콩 나고 팥 심은 데 팥 난다", english: "Plant beans and you get beans; plant red beans and you get red beans", meaning: "You reap what you sow.", difficulty: "intermediate" }
];

var defaultHonorificPairs = [
    { context: "Asking someone's age", casual: "몇 살이야?", polite: "몇 살이에요?", formal: "연세가 어떻게 되세요?", meaning: "How old are you?" },
    { context: "Saying thank you", casual: "고마워", polite: "감사해요", formal: "감사합니다", meaning: "Thank you" },
    { context: "Eating a meal", casual: "밥 먹자", polite: "밥 먹어요", formal: "식사하시겠습니까?", meaning: "Let's eat" },
    { context: "Saying goodbye (to someone leaving)", casual: "잘 가", polite: "잘 가세요", formal: "안녕히 가십시오", meaning: "Goodbye (to the one leaving)" },
    { context: "Asking for a name", casual: "이름이 뭐야?", polite: "이름이 뭐예요?", formal: "성함이 어떻게 되십니까?", meaning: "What is your name?" }
];

var defaultParticles = [
    { sentence: "나___ 학생이에요", blank: "는", options: ["는", "를", "에", "도"], explanation: "'는' is the topic marker particle used after a consonant-ending noun. '나' ends in 'ㅏ' (vowel), but '나는' is a fixed common form." },
    { sentence: "사과___ 먹었어요", blank: "를", options: ["를", "은", "의", "에서"], explanation: "'를' is the object marker used after a vowel-ending noun. It marks 'apple' as the object being eaten." },
    { sentence: "학교___ 갔어요", blank: "에", options: ["에", "를", "은", "와"], explanation: "'에' indicates direction or destination. It marks 'school' as the place you went to." },
    { sentence: "친구___ 같이 갔어요", blank: "와", options: ["와", "에", "을", "는"], explanation: "'와' means 'with/and' and is used after vowel-ending nouns. Here it means 'went with a friend'." },
    { sentence: "서울___ 살아요", blank: "에서", options: ["에서", "에", "를", "의"], explanation: "'에서' indicates a location where an action takes place. Here it means 'living in Seoul'." }
];

var defaultSentencePatterns = [
    { english: "I go to school.", words: ["나는", "학교에", "가요"], hint: "Subject + Place + Verb" },
    { english: "I eat rice.", words: ["나는", "밥을", "먹어요"], hint: "Subject + Object + Verb" },
    { english: "The weather is good.", words: ["날씨가", "좋아요"], hint: "Subject + Adjective" },
    { english: "I like Korea.", words: ["나는", "한국을", "좋아해요"], hint: "Subject + Object + Verb" },
    { english: "I study Korean.", words: ["나는", "한국어를", "공부해요"], hint: "Subject + Object + Verb" }
];

var defaultHanjaBasics = [
    { hanja: "山", korean: "산", meaning: "mountain", derivatives: ["산책 (walk)", "등산 (hiking)", "산림 (forest)"] },
    { hanja: "水", korean: "수", meaning: "water", derivatives: ["수영 (swimming)", "홍수 (flood)", "수도 (water supply)"] },
    { hanja: "火", korean: "화", meaning: "fire", derivatives: ["화재 (fire disaster)", "화요일 (Tuesday)", "화산 (volcano)"] },
    { hanja: "人", korean: "인", meaning: "person", derivatives: ["인간 (human)", "인구 (population)", "외국인 (foreigner)"] },
    { hanja: "大", korean: "대", meaning: "big/great", derivatives: ["대학 (university)", "대회 (competition)", "위대 (great)"] },
    { hanja: "學", korean: "학", meaning: "study/learn", derivatives: ["학교 (school)", "학생 (student)", "과학 (science)"] },
    { hanja: "日", korean: "일", meaning: "day/sun", derivatives: ["일요일 (Sunday)", "생일 (birthday)", "매일 (every day)"] },
    { hanja: "月", korean: "월", meaning: "moon/month", derivatives: ["월요일 (Monday)", "정월 (January)", "월급 (salary)"] }
];

var defaultSoundWords = [
    { context: "What sound does a dog make?", answer: "멍멍", romanization: "meongmeong", english: "woof woof", category: "animals" },
    { context: "What sound does a cat make?", answer: "야옹", romanization: "yaong", english: "meow", category: "animals" },
    { context: "What sound does rain make?", answer: "주룩주룩", romanization: "jurukjuruk", english: "pitter-patter", category: "weather" },
    { context: "What sound does your heart make when nervous?", answer: "두근두근", romanization: "dugeundugeun", english: "thump thump", category: "emotions" },
    { context: "What sound does a door make when knocking?", answer: "똑똑", romanization: "ttokttok", english: "knock knock", category: "actions" },
    { context: "What sound does a chick make?", answer: "삐약삐약", romanization: "ppiyakppiyak", english: "peep peep", category: "animals" },
    { context: "What sound do you make when laughing?", answer: "하하하", romanization: "hahaha", english: "hahaha", category: "emotions" },
    { context: "What sound does thunder make?", answer: "우르르 쾅쾅", romanization: "ureuru kwangkwang", english: "rumble boom", category: "weather" }
];

var defaultKoreanCalendar = [
    { name: "설날", englishName: "Lunar New Year", date: "1st day of 1st lunar month (Jan/Feb)", description: "The most important traditional Korean holiday. Families gather, perform ancestral rites (charye), eat tteokguk (rice cake soup), play yunnori, and wear hanbok.", vocabulary: ["떡국 (rice cake soup)", "세배 (New Year's bow)", "한복 (traditional clothes)", "윷놀이 (yut game)"] },
    { name: "추석", englishName: "Chuseok (Korean Thanksgiving)", date: "15th day of 8th lunar month (Sep/Oct)", description: "Korean harvest festival. Families reunite, visit ancestral graves, share songpyeon (rice cakes), and celebrate the harvest under the full moon.", vocabulary: ["송편 (rice cake)", "보름달 (full moon)", "성묘 (grave visit)", "차례 (ancestral rites)"] },
    { name: "어린이날", englishName: "Children's Day", date: "May 5", description: "A national holiday celebrating children. Parents take kids to amusement parks, buy gifts, and spend quality family time together.", vocabulary: ["어린이 (children)", "선물 (gift)", "놀이공원 (amusement park)", "가족 (family)"] },
    { name: "한글날", englishName: "Hangul Day", date: "October 9", description: "Celebrates the creation of the Korean alphabet by King Sejong the Great in 1443. A day to appreciate the beauty and scientific design of Hangul.", vocabulary: ["한글 (Korean alphabet)", "세종대왕 (King Sejong)", "훈민정음 (original name)", "자음 (consonant)"] },
    { name: "삼일절", englishName: "Independence Movement Day", date: "March 1", description: "Commemorates the March 1st Movement of 1919, when Koreans protested for independence from Japanese colonial rule.", vocabulary: ["독립 (independence)", "만세 (hooray/long live)", "태극기 (Korean flag)", "역사 (history)"] },
    { name: "광복절", englishName: "Liberation Day", date: "August 15", description: "Celebrates Korea's liberation from Japanese colonial rule in 1945. National ceremonies and flag displays mark this important day.", vocabulary: ["광복 (liberation)", "자유 (freedom)", "해방 (emancipation)", "기념 (commemoration)"] }
];


// ============================================================
// 1. PROVERB QUIZ (showProverbQuiz)
// ============================================================

var proverbScore = 0;
var proverbRound = 0;
var proverbTotal = 10;
var proverbCurrent = null;
var proverbAnswered = false;

function showProverbQuiz(c) {
    proverbScore = 0;
    proverbRound = 0;
    proverbAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextProverb(c);
}

function nextProverb(c) {
    if (proverbRound >= proverbTotal) {
        renderProverbEnd(c);
        return;
    }

    var pool = (typeof koreanProverbs !== "undefined" && koreanProverbs.length > 0) ? koreanProverbs : defaultProverbs;
    var available = shuffle(pool);
    proverbCurrent = available[proverbRound % available.length];
    proverbAnswered = false;
    proverbRound++;
    renderProverbQuestion(c);
}

function renderProverbQuestion(c) {
    var q = proverbCurrent;
    var diffColor = q.difficulty === "beginner" ? "#00f5d4" : (q.difficulty === "advanced" ? "#ff2d95" : "#9d4edd");
    var diffLabel = q.difficulty ? q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1) : "Intermediate";

    // Build wrong answers from other proverbs
    var pool = (typeof koreanProverbs !== "undefined" && koreanProverbs.length > 0) ? koreanProverbs : defaultProverbs;
    var wrongAnswers = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].english !== q.english) {
            wrongAnswers.push(pool[i].english);
        }
    }
    wrongAnswers = shuffle(wrongAnswers).slice(0, 3);
    var allOptions = shuffle([q.english].concat(wrongAnswers));

    var h = '<h2 class="game-title">Proverb Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + proverbRound + ' / ' + proverbTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((proverbRound / proverbTotal) * 100) + '%"></div></div>';

    h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.3),rgba(255,45,149,0.2));padding:25px;border-radius:15px;margin-bottom:20px;text-align:center;position:relative">';
    h += '<span style="position:absolute;top:10px;right:10px;background:' + diffColor + ';color:#000;padding:3px 10px;border-radius:10px;font-size:0.75rem;font-weight:bold">' + escapeHtml(diffLabel) + '</span>';
    h += '<div style="font-size:1.5rem;line-height:1.6;color:var(--neon-pink)">' + escapeHtml(q.korean) + '</div>';
    h += '<button class="game-btn secondary" style="margin-top:12px;padding:6px 14px;font-size:0.85rem" id="proverbListenBtn">Listen</button>';
    h += '</div>';

    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">What does this proverb mean?</p>';
    h += '<div class="quiz-options" style="grid-template-columns:1fr">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j]) + '" style="text-align:left;font-size:0.95rem">';
        h += escapeHtml(allOptions[j]) + '</div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">Score: ' + proverbScore + '</div>';

    c.innerHTML = h;

    document.getElementById('proverbListenBtn').onclick = function () {
        speakKorean(q.korean);
    };

    var opts = c.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (proverbAnswered) return;
            proverbAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === proverbCurrent.english);

            if (isCorrect) {
                this.classList.add('correct');
                proverbScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
                if (typeof Haptic !== "undefined" && Haptic.success) { Haptic.success(); }
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                screenShake();
                // Highlight correct answer
                var allOpts = c.querySelectorAll('.quiz-option');
                for (var m = 0; m < allOpts.length; m++) {
                    if (allOpts[m].getAttribute('data-answer') === proverbCurrent.english) {
                        allOpts[m].classList.add('correct');
                    }
                }
            }

            // Show meaning explanation
            var explanationDiv = document.createElement('div');
            explanationDiv.className = 'learning-tip';
            explanationDiv.style.marginTop = '15px';
            explanationDiv.innerHTML = '<strong style="color:var(--neon-cyan)">Meaning:</strong> ' + escapeHtml(proverbCurrent.meaning || proverbCurrent.english);
            c.appendChild(explanationDiv);

            setTimeout(function () {
                nextProverb(c);
            }, 2500);
        };
    }
}

function renderProverbEnd(c) {
    var pct = Math.round((proverbScore / (proverbTotal * 100)) * 100);
    if (pct >= 80) { createConfetti(80); }
    addXP(proverbScore / 10);

    var h = '<h2 class="game-title">Proverb Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#128218;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + proverbScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:5px">' + pct + '% correct</p>';
    h += '<p style="color:rgba(255,255,255,0.5);margin-bottom:25px">' + proverbRound + ' proverbs studied</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="proverbAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="proverbBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;

    document.getElementById('proverbAgainBtn').onclick = function () {
        showProverbQuiz(c);
    };
    document.getElementById('proverbBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}


// ============================================================
// 2. HONORIFIC DRILL (showHonorificDrill)
// ============================================================

var honorificScore = 0;
var honorificRound = 0;
var honorificTotal = 10;
var honorificCurrent = null;
var honorificAnswered = false;

function showHonorificDrill(c) {
    honorificScore = 0;
    honorificRound = 0;
    honorificAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextHonorific(c);
}

function nextHonorific(c) {
    if (honorificRound >= honorificTotal) {
        renderHonorificEnd(c);
        return;
    }

    var pool = (typeof honorificPairs !== "undefined" && honorificPairs.length > 0) ? honorificPairs : defaultHonorificPairs;
    var available = shuffle(pool);
    honorificCurrent = available[honorificRound % available.length];
    honorificAnswered = false;
    honorificRound++;
    renderHonorificQuestion(c);
}

function renderHonorificQuestion(c) {
    var q = honorificCurrent;

    // Randomly pick which level to ask (polite or formal)
    var askLevel = Math.random() < 0.5 ? "polite" : "formal";
    var correctAnswer = askLevel === "polite" ? q.polite : q.formal;
    var askLabel = askLevel === "polite" ? "Polite Form" : "Formal Form";
    var askColor = askLevel === "polite" ? "#00f5d4" : "#9d4edd";

    // Build wrong answers from other pairs
    var pool = (typeof honorificPairs !== "undefined" && honorificPairs.length > 0) ? honorificPairs : defaultHonorificPairs;
    var wrongAnswers = [];
    for (var i = 0; i < pool.length; i++) {
        var candidate = askLevel === "polite" ? pool[i].polite : pool[i].formal;
        if (candidate !== correctAnswer) {
            wrongAnswers.push(candidate);
        }
    }
    wrongAnswers = shuffle(wrongAnswers).slice(0, 3);
    var allOptions = shuffle([correctAnswer].concat(wrongAnswers));

    var h = '<h2 class="game-title">Honorific Drill</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + honorificRound + ' / ' + honorificTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((honorificRound / honorificTotal) * 100) + '%"></div></div>';

    h += '<div style="background:var(--glass);padding:25px;border-radius:15px;margin-bottom:20px;text-align:center">';
    h += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:8px">' + escapeHtml(q.context) + '</div>';
    h += '<div style="font-size:0.9rem;color:rgba(255,255,255,0.6);margin-bottom:12px">' + escapeHtml(q.meaning) + '</div>';
    h += '<div style="display:inline-block;background:rgba(0,148,255,0.2);border:1px solid rgba(0,148,255,0.4);padding:8px 20px;border-radius:12px;margin-bottom:10px">';
    h += '<span style="font-size:0.75rem;color:#00d4ff;display:block;margin-bottom:4px">Casual</span>';
    h += '<span style="font-size:1.4rem;color:#00d4ff">' + escapeHtml(q.casual) + '</span></div>';
    h += '<p style="margin-top:12px;font-size:0.9rem">Select the <span style="color:' + askColor + ';font-weight:bold">' + askLabel + '</span>:</p>';
    h += '</div>';

    h += '<div class="quiz-options" style="grid-template-columns:1fr">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j]) + '" style="font-size:1.1rem">';
        h += escapeHtml(allOptions[j]) + '</div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">Score: ' + honorificScore + '</div>';

    c.innerHTML = h;

    var opts = c.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (honorificAnswered) return;
            honorificAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === correctAnswer);

            if (isCorrect) {
                this.classList.add('correct');
                honorificScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                var allOpts = c.querySelectorAll('.quiz-option');
                for (var m = 0; m < allOpts.length; m++) {
                    if (allOpts[m].getAttribute('data-answer') === correctAnswer) {
                        allOpts[m].classList.add('correct');
                    }
                }
            }

            // Show all three forms after answering
            var formsDiv = document.createElement('div');
            formsDiv.style.cssText = 'margin-top:15px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center';
            formsDiv.innerHTML =
                '<div style="background:rgba(0,148,255,0.15);padding:12px;border-radius:12px;border:1px solid rgba(0,148,255,0.3)">' +
                '<div style="font-size:0.7rem;color:#00d4ff;margin-bottom:4px">CASUAL</div>' +
                '<div style="color:#00d4ff;font-size:1.1rem">' + escapeHtml(q.casual) + '</div></div>' +
                '<div style="background:rgba(0,245,212,0.15);padding:12px;border-radius:12px;border:1px solid rgba(0,245,212,0.3)">' +
                '<div style="font-size:0.7rem;color:#00f5d4;margin-bottom:4px">POLITE</div>' +
                '<div style="color:#00f5d4;font-size:1.1rem">' + escapeHtml(q.polite) + '</div></div>' +
                '<div style="background:rgba(157,78,221,0.15);padding:12px;border-radius:12px;border:1px solid rgba(157,78,221,0.3)">' +
                '<div style="font-size:0.7rem;color:#9d4edd;margin-bottom:4px">FORMAL</div>' +
                '<div style="color:#9d4edd;font-size:1.1rem">' + escapeHtml(q.formal) + '</div></div>';
            c.appendChild(formsDiv);

            setTimeout(function () {
                nextHonorific(c);
            }, 2800);
        };
    }
}

function renderHonorificEnd(c) {
    var pct = Math.round((honorificScore / (honorificTotal * 100)) * 100);
    if (pct >= 80) { createConfetti(80); }
    addXP(honorificScore / 10);

    var h = '<h2 class="game-title">Honorific Drill Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#128588;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + honorificScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="honorificAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="honorificBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;

    document.getElementById('honorificAgainBtn').onclick = function () {
        showHonorificDrill(c);
    };
    document.getElementById('honorificBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}


// ============================================================
// 3. PARTICLE PRACTICE (showParticlePractice)
// ============================================================

var particleScore = 0;
var particleRound = 0;
var particleTotal = 10;
var particleCurrent = null;
var particleAnswered = false;

function showParticlePractice(c) {
    particleScore = 0;
    particleRound = 0;
    particleAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextParticle(c);
}

function nextParticle(c) {
    if (particleRound >= particleTotal) {
        renderParticleEnd(c);
        return;
    }

    var pool = (typeof koreanParticles !== "undefined" && koreanParticles.length > 0) ? koreanParticles : defaultParticles;
    var available = shuffle(pool);
    particleCurrent = available[particleRound % available.length];
    particleAnswered = false;
    particleRound++;
    renderParticleQuestion(c);
}

function renderParticleQuestion(c) {
    var q = particleCurrent;
    var displaySentence = escapeHtml(q.sentence).replace("___", '<span style="color:var(--gold);font-weight:bold;border-bottom:3px dashed var(--gold);padding:0 8px;font-size:1.3rem">?</span>');

    var options = q.options ? shuffle(q.options.slice()) : shuffle([q.blank, "은", "를", "에"]);

    var h = '<h2 class="game-title">Particle Practice</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + particleRound + ' / ' + particleTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((particleRound / particleTotal) * 100) + '%"></div></div>';

    h += '<div style="background:var(--glass);padding:30px;border-radius:15px;margin-bottom:20px;text-align:center">';
    h += '<p style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:10px">Fill in the correct particle:</p>';
    h += '<div style="font-size:1.6rem;line-height:1.8">' + displaySentence + '</div>';
    h += '</div>';

    h += '<div class="quiz-options">';
    for (var i = 0; i < options.length; i++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(options[i]) + '" style="font-size:1.4rem;font-weight:bold">';
        h += escapeHtml(options[i]) + '</div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">Score: ' + particleScore + '</div>';

    c.innerHTML = h;

    var opts = c.querySelectorAll('.quiz-option');
    for (var j = 0; j < opts.length; j++) {
        opts[j].onclick = function () {
            if (particleAnswered) return;
            particleAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === particleCurrent.blank);

            if (isCorrect) {
                this.classList.add('correct');
                particleScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                var allOpts = c.querySelectorAll('.quiz-option');
                for (var m = 0; m < allOpts.length; m++) {
                    if (allOpts[m].getAttribute('data-answer') === particleCurrent.blank) {
                        allOpts[m].classList.add('correct');
                    }
                }
            }

            // Show explanation
            var explanationDiv = document.createElement('div');
            explanationDiv.className = 'learning-tip';
            explanationDiv.style.marginTop = '15px';
            var fullSentence = particleCurrent.sentence.replace("___", particleCurrent.blank);
            explanationDiv.innerHTML = '<div style="font-size:1.2rem;color:var(--neon-pink);margin-bottom:8px">' + escapeHtml(fullSentence) + '</div>' +
                '<p style="color:rgba(255,255,255,0.8)">' + escapeHtml(particleCurrent.explanation || "") + '</p>';
            c.appendChild(explanationDiv);

            setTimeout(function () {
                nextParticle(c);
            }, 2500);
        };
    }
}

function renderParticleEnd(c) {
    var pct = Math.round((particleScore / (particleTotal * 100)) * 100);
    if (pct >= 80) { createConfetti(80); }
    addXP(particleScore / 10);

    var h = '<h2 class="game-title">Particle Practice Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#128221;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + particleScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="particleAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="particleBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;

    document.getElementById('particleAgainBtn').onclick = function () {
        showParticlePractice(c);
    };
    document.getElementById('particleBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}


// ============================================================
// 4. SENTENCE BUILDER (showSentenceBuilder)
// ============================================================

var sentenceBuilderCurrent = null;
var sentenceBuilderSelected = [];
var sentenceBuilderScore = 0;
var sentenceBuilderRound = 0;
var sentenceBuilderTotal = 10;

function showSentenceBuilder(c) {
    sentenceBuilderScore = 0;
    sentenceBuilderRound = 0;
    sentenceBuilderSelected = [];
    gameState.gamesPlayed++;
    saveProgress();
    nextSentenceBuilder(c);
}

function nextSentenceBuilder(c) {
    if (sentenceBuilderRound >= sentenceBuilderTotal) {
        renderSentenceBuilderEnd(c);
        return;
    }

    var pool = (typeof sentencePatterns !== "undefined" && sentencePatterns.length > 0) ? sentencePatterns : defaultSentencePatterns;
    var available = shuffle(pool);
    sentenceBuilderCurrent = available[sentenceBuilderRound % available.length];
    sentenceBuilderSelected = [];
    sentenceBuilderRound++;
    renderSentenceBuilder(c);
}

function renderSentenceBuilder(c) {
    var q = sentenceBuilderCurrent;
    var scrambled = shuffle(q.words.slice());

    var h = '<h2 class="game-title">Sentence Builder</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + sentenceBuilderRound + ' / ' + sentenceBuilderTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((sentenceBuilderRound / sentenceBuilderTotal) * 100) + '%"></div></div>';

    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:20px;text-align:center">';
    h += '<p style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:8px">Translate to Korean (SOV order):</p>';
    h += '<div style="font-size:1.3rem;color:var(--neon-cyan)">' + escapeHtml(q.english) + '</div>';
    if (q.hint) {
        h += '<div style="margin-top:8px;font-size:0.8rem;color:rgba(255,255,255,0.4)">Hint: ' + escapeHtml(q.hint) + '</div>';
    }
    h += '</div>';

    // Selected words area
    h += '<div id="sbSelectedArea" style="background:rgba(255,255,255,0.03);border:2px dashed rgba(157,78,221,0.4);border-radius:15px;padding:20px;min-height:70px;margin-bottom:20px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center">';
    h += '<span id="sbPlaceholder" style="color:rgba(255,255,255,0.3);font-size:0.9rem">Tap words below to build the sentence</span>';
    h += '</div>';

    // Scrambled word buttons
    h += '<div id="sbWordBank" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:20px">';
    for (var i = 0; i < scrambled.length; i++) {
        h += '<button class="game-btn secondary sb-word-btn" data-word="' + escapeHtml(scrambled[i]) + '" data-idx="' + i + '" style="font-size:1.1rem;padding:12px 20px">';
        h += escapeHtml(scrambled[i]) + '</button>';
    }
    h += '</div>';

    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="sbSubmitBtn" style="opacity:0.5" disabled>Submit</button>';
    h += '<button class="game-btn secondary" id="sbResetBtn">Reset</button>';
    h += '</div>';
    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">Score: ' + sentenceBuilderScore + '</div>';

    c.innerHTML = h;

    // State for this render
    var selectedWords = [];
    var usedIndices = {};

    function updateSelectedDisplay() {
        var area = document.getElementById('sbSelectedArea');
        var placeholder = document.getElementById('sbPlaceholder');
        var submitBtn = document.getElementById('sbSubmitBtn');
        if (!area) return;

        if (selectedWords.length === 0) {
            area.innerHTML = '<span style="color:rgba(255,255,255,0.3);font-size:0.9rem">Tap words below to build the sentence</span>';
            if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.5'; }
            return;
        }

        var inner = '';
        for (var i = 0; i < selectedWords.length; i++) {
            inner += '<button class="game-btn sb-selected-word" data-selidx="' + i + '" style="font-size:1.1rem;padding:10px 18px;background:linear-gradient(135deg,var(--neon-purple),var(--neon-pink))">';
            inner += escapeHtml(selectedWords[i].word) + '</button>';
        }
        area.innerHTML = inner;

        if (submitBtn) {
            var ready = selectedWords.length === sentenceBuilderCurrent.words.length;
            submitBtn.disabled = !ready;
            submitBtn.style.opacity = ready ? '1' : '0.5';
        }

        // Add click to remove from selected
        var selBtns = area.querySelectorAll('.sb-selected-word');
        for (var j = 0; j < selBtns.length; j++) {
            selBtns[j].onclick = function () {
                var idx = parseInt(this.getAttribute('data-selidx'));
                var removed = selectedWords.splice(idx, 1)[0];
                delete usedIndices[removed.bankIdx];
                // Re-show the word bank button
                var bankBtn = document.querySelector('.sb-word-btn[data-idx="' + removed.bankIdx + '"]');
                if (bankBtn) { bankBtn.style.display = ''; }
                updateSelectedDisplay();
            };
        }
    }

    // Word bank button clicks
    var wordBtns = c.querySelectorAll('.sb-word-btn');
    for (var w = 0; w < wordBtns.length; w++) {
        wordBtns[w].onclick = function () {
            var bankIdx = this.getAttribute('data-idx');
            if (usedIndices[bankIdx]) return;
            usedIndices[bankIdx] = true;
            selectedWords.push({ word: this.getAttribute('data-word'), bankIdx: bankIdx });
            this.style.display = 'none';
            updateSelectedDisplay();
        };
    }

    // Reset button
    document.getElementById('sbResetBtn').onclick = function () {
        selectedWords = [];
        usedIndices = {};
        var allBankBtns = c.querySelectorAll('.sb-word-btn');
        for (var r = 0; r < allBankBtns.length; r++) {
            allBankBtns[r].style.display = '';
        }
        updateSelectedDisplay();
    };

    // Submit button
    document.getElementById('sbSubmitBtn').onclick = function () {
        var userOrder = [];
        for (var s = 0; s < selectedWords.length; s++) {
            userOrder.push(selectedWords[s].word);
        }

        var correctOrder = sentenceBuilderCurrent.words;
        var isCorrect = true;
        if (userOrder.length !== correctOrder.length) {
            isCorrect = false;
        } else {
            for (var t = 0; t < correctOrder.length; t++) {
                if (userOrder[t] !== correctOrder[t]) {
                    isCorrect = false;
                    break;
                }
            }
        }

        // Visual feedback on selected words
        var area = document.getElementById('sbSelectedArea');
        var selBtns = area.querySelectorAll('.sb-selected-word');
        for (var u = 0; u < selBtns.length; u++) {
            if (u < correctOrder.length && userOrder[u] === correctOrder[u]) {
                selBtns[u].style.background = 'linear-gradient(135deg, #00d4ff, #00f5d4)';
            } else {
                selBtns[u].style.background = 'linear-gradient(135deg, #ff4757, #ff6b81)';
            }
        }

        if (isCorrect) {
            sentenceBuilderScore += 100;
            gameState.correctAnswers++;
            SoundEngine.correct();
            addCombo();
            addXP(20);
            if (typeof Haptic !== "undefined" && Haptic.success) { Haptic.success(); }
        } else {
            SoundEngine.wrong();
            resetCombo();
            // Show correct order
            var correctDiv = document.createElement('div');
            correctDiv.className = 'learning-tip';
            correctDiv.style.marginTop = '15px';
            correctDiv.innerHTML = '<strong style="color:var(--neon-cyan)">Correct order:</strong> ' + escapeHtml(correctOrder.join(' '));
            c.appendChild(correctDiv);
        }

        setTimeout(function () {
            nextSentenceBuilder(c);
        }, 2200);
    };
}

function renderSentenceBuilderEnd(c) {
    var pct = Math.round((sentenceBuilderScore / (sentenceBuilderTotal * 100)) * 100);
    if (pct >= 80) { createConfetti(80); }
    addXP(sentenceBuilderScore / 10);

    var h = '<h2 class="game-title">Sentence Builder Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#128295;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + sentenceBuilderScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="sbAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="sbBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;

    document.getElementById('sbAgainBtn').onclick = function () {
        showSentenceBuilder(c);
    };
    document.getElementById('sbBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}


// ============================================================
// 5. PRONUNCIATION RECORDER (showPronunciationPractice)
// ============================================================

var pronRecorder = null;
var pronChunks = [];
var pronAudioUrl = null;
var pronWord = null;

function showPronunciationPractice(c) {
    pronRecorder = null;
    pronChunks = [];
    pronAudioUrl = null;
    gameState.gamesPlayed++;
    saveProgress();

    var words = getWords();
    if (words.length < 3) {
        var allWords = [];
        for (var cat in wordDatabase) { allWords = allWords.concat(wordDatabase[cat]); }
        words = allWords;
    }
    pronWord = shuffle(words)[0];
    renderPronunciationPractice(c);
}

function renderPronunciationPractice(c) {
    var w = pronWord;
    var hasMediaRecorder = (typeof MediaRecorder !== "undefined");

    var h = '<h2 class="game-title">Pronunciation Practice</h2>';
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<div style="font-size:4rem;color:var(--neon-pink);margin:20px 0">' + escapeHtml(w.korean) + '</div>';
    h += '<div style="font-size:1.2rem;color:var(--neon-cyan);margin-bottom:5px">' + escapeHtml(w.romanization) + '</div>';
    h += '<div style="font-size:1rem;color:rgba(255,255,255,0.7);margin-bottom:20px">' + escapeHtml(w.english) + '</div>';
    h += '</div>';

    h += '<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:25px">';
    h += '<button class="game-btn" id="pronListenBtn" style="padding:14px 28px">&#128266; Listen</button>';

    if (hasMediaRecorder) {
        h += '<button class="game-btn secondary" id="pronRecordBtn" style="padding:14px 28px">&#127908; Record</button>';
        h += '<button class="game-btn secondary" id="pronPlaybackBtn" style="padding:14px 28px;display:none">&#9654; Play Recording</button>';
    } else {
        h += '<div style="background:rgba(255,75,75,0.2);padding:12px 20px;border-radius:12px;color:#ff4b4b;font-size:0.85rem">';
        h += 'Recording not supported in this browser. Try Chrome or Firefox.</div>';
    }
    h += '</div>';

    // Recording status
    h += '<div id="pronStatus" style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px"></div>';

    // Pronunciation guide
    h += '<div class="learning-tip">';
    h += '<strong style="color:var(--neon-cyan)">Pronunciation Guide:</strong>';
    h += '<div style="margin-top:8px;font-size:1.1rem;letter-spacing:2px;color:var(--neon-pink)">' + escapeHtml(w.romanization) + '</div>';
    h += '<p style="margin-top:8px;color:rgba(255,255,255,0.6);font-size:0.85rem">Tip: Listen carefully, then try to match the rhythm and tone.</p>';
    h += '</div>';

    h += '<div class="game-controls" style="margin-top:20px">';
    h += '<button class="game-btn secondary" id="pronNextBtn">Next Word</button>';
    h += '<button class="game-btn secondary" id="pronBackBtn">Back</button>';
    h += '</div>';

    c.innerHTML = h;

    // Listen button
    document.getElementById('pronListenBtn').onclick = function () {
        speakKorean(w.korean);
    };

    // Record button (if available)
    if (hasMediaRecorder && document.getElementById('pronRecordBtn')) {
        var recording = false;

        document.getElementById('pronRecordBtn').onclick = function () {
            var recordBtn = document.getElementById('pronRecordBtn');
            var statusDiv = document.getElementById('pronStatus');
            var playbackBtn = document.getElementById('pronPlaybackBtn');

            if (!recording) {
                // Start recording
                navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
                    pronChunks = [];
                    pronRecorder = new MediaRecorder(stream);
                    pronRecorder.ondataavailable = function (e) {
                        if (e.data.size > 0) { pronChunks.push(e.data); }
                    };
                    pronRecorder.onstop = function () {
                        var blob = new Blob(pronChunks, { type: 'audio/webm' });
                        if (pronAudioUrl) { URL.revokeObjectURL(pronAudioUrl); }
                        pronAudioUrl = URL.createObjectURL(blob);
                        if (playbackBtn) { playbackBtn.style.display = ''; }
                        if (statusDiv) { statusDiv.textContent = 'Recording saved! Click Play to compare.'; }
                        // Stop all tracks
                        stream.getTracks().forEach(function (track) { track.stop(); });
                    };
                    pronRecorder.start();
                    recording = true;
                    recordBtn.innerHTML = '&#9724; Stop';
                    recordBtn.style.background = 'linear-gradient(135deg, #ff4757, #ff6b81)';
                    recordBtn.style.color = '#fff';
                    recordBtn.style.border = 'none';
                    if (statusDiv) { statusDiv.innerHTML = '<span style="color:#ff4757">&#9679;</span> Recording...'; }
                }).catch(function (err) {
                    if (statusDiv) { statusDiv.textContent = 'Microphone access denied. Please allow microphone permission.'; }
                });
            } else {
                // Stop recording
                if (pronRecorder && pronRecorder.state === 'recording') {
                    pronRecorder.stop();
                }
                recording = false;
                recordBtn.innerHTML = '&#127908; Record Again';
                recordBtn.style.background = '';
                recordBtn.style.color = '';
                recordBtn.style.border = '';
            }
        };

        // Playback button
        if (document.getElementById('pronPlaybackBtn')) {
            document.getElementById('pronPlaybackBtn').onclick = function () {
                if (pronAudioUrl) {
                    var audio = new Audio(pronAudioUrl);
                    audio.play();
                }
            };
        }
    }

    // Next word
    document.getElementById('pronNextBtn').onclick = function () {
        addXP(5);
        showPronunciationPractice(c);
    };

    // Back
    document.getElementById('pronBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}


// ============================================================
// 6. MINI DICTIONARY (showMiniDictionary)
// ============================================================

var dictSearchTimeout = null;

function showMiniDictionary(c) {
    gameState.gamesPlayed++;
    saveProgress();
    renderMiniDictionary(c, "");
}

function renderMiniDictionary(c, query) {
    var h = '<h2 class="game-title">Mini Dictionary</h2>';

    // Search bar
    h += '<div style="margin-bottom:20px">';
    h += '<input type="text" id="dictSearchInput" class="speed-input" placeholder="Search Korean or English..." value="' + escapeHtml(query) + '" style="margin-bottom:10px">';
    h += '</div>';

    // Get all words
    var allWords = [];
    for (var cat in wordDatabase) {
        if (wordDatabase.hasOwnProperty(cat)) {
            for (var i = 0; i < wordDatabase[cat].length; i++) {
                var w = wordDatabase[cat][i];
                w._category = cat;
                allWords.push(w);
            }
        }
    }

    // Filter
    var results = [];
    var lowerQuery = query.toLowerCase().trim();
    if (lowerQuery.length > 0) {
        for (var j = 0; j < allWords.length; j++) {
            var word = allWords[j];
            if (
                word.korean.indexOf(lowerQuery) !== -1 ||
                word.english.toLowerCase().indexOf(lowerQuery) !== -1 ||
                (word.romanization && word.romanization.toLowerCase().indexOf(lowerQuery) !== -1)
            ) {
                results.push(word);
            }
        }
    } else {
        results = allWords.slice(0, 50); // Show first 50 by default
    }

    // Result count
    h += '<p style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:15px">';
    if (lowerQuery.length > 0) {
        h += results.length + ' result' + (results.length !== 1 ? 's' : '') + ' found';
    } else {
        h += 'Showing first 50 of ' + allWords.length + ' words. Type to search.';
    }
    h += '</p>';

    // Results list
    h += '<div id="dictResults" style="max-height:400px;overflow-y:auto;display:grid;gap:8px">';
    for (var k = 0; k < results.length; k++) {
        var r = results[k];
        var catName = r._category || "general";
        h += '<div class="dict-result-item" data-korean="' + escapeHtml(r.korean) + '" data-english="' + escapeHtml(r.english) + '" data-roman="' + escapeHtml(r.romanization || "") + '" data-cat="' + escapeHtml(catName) + '" style="background:var(--glass);padding:12px 16px;border-radius:12px;border:1px solid rgba(157,78,221,0.2);cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:all 0.2s ease">';
        h += '<div>';
        h += '<span style="font-size:1.2rem;color:var(--neon-pink);margin-right:10px">' + escapeHtml(r.korean) + '</span>';
        h += '<span style="color:rgba(255,255,255,0.7)">' + escapeHtml(r.english) + '</span>';
        if (r.romanization) {
            h += '<span style="color:var(--neon-cyan);font-size:0.8rem;margin-left:8px">' + escapeHtml(r.romanization) + '</span>';
        }
        h += '</div>';
        h += '<div style="display:flex;align-items:center;gap:8px">';
        h += '<span style="background:rgba(157,78,221,0.2);padding:2px 8px;border-radius:8px;font-size:0.7rem;color:var(--neon-purple)">' + escapeHtml(catName) + '</span>';
        h += '<button class="dict-add-btn" data-korean="' + escapeHtml(r.korean) + '" style="background:rgba(0,245,212,0.2);border:1px solid rgba(0,245,212,0.3);color:#00f5d4;padding:4px 10px;border-radius:8px;cursor:pointer;font-size:0.75rem">+ Study</button>';
        h += '</div>';
        h += '</div>';
    }
    h += '</div>';

    h += '<div class="game-controls" style="margin-top:20px">';
    h += '<button class="game-btn secondary" id="dictBackBtn">Back</button>';
    h += '</div>';

    c.innerHTML = h;

    // Search input handler
    var searchInput = document.getElementById('dictSearchInput');
    if (searchInput) {
        searchInput.focus();
        searchInput.oninput = function () {
            var val = this.value;
            clearTimeout(dictSearchTimeout);
            dictSearchTimeout = setTimeout(function () {
                renderMiniDictionary(c, val);
                // Re-focus and set cursor position
                var inp = document.getElementById('dictSearchInput');
                if (inp) { inp.focus(); inp.setSelectionRange(val.length, val.length); }
            }, 200);
        };
    }

    // Click on word to hear it
    var resultItems = c.querySelectorAll('.dict-result-item');
    for (var m = 0; m < resultItems.length; m++) {
        resultItems[m].onclick = function (e) {
            if (e.target.classList.contains('dict-add-btn')) return;
            var korean = this.getAttribute('data-korean');
            speakKorean(korean);
        };
    }

    // Add to Study buttons
    var addBtns = c.querySelectorAll('.dict-add-btn');
    for (var n = 0; n < addBtns.length; n++) {
        addBtns[n].onclick = function (e) {
            e.stopPropagation();
            var korean = this.getAttribute('data-korean');
            var reviewList = [];
            try {
                var stored = localStorage.getItem('koreanReviewList');
                if (stored) { reviewList = JSON.parse(stored); }
            } catch (err) { reviewList = []; }

            // Check if already in list
            var found = false;
            for (var p = 0; p < reviewList.length; p++) {
                if (reviewList[p] === korean) { found = true; break; }
            }

            if (!found) {
                reviewList.push(korean);
                try { localStorage.setItem('koreanReviewList', JSON.stringify(reviewList)); } catch (err) {}
                this.textContent = 'Added!';
                this.style.background = 'rgba(0,245,212,0.4)';
                if (typeof showToast === "function") { showToast(korean + ' added to study list!'); }
            } else {
                this.textContent = 'Already added';
            }
        };
    }

    // Back button
    document.getElementById('dictBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}


// ============================================================
// 7. HANJA EXPLORER (showHanjaExplorer)
// ============================================================

var hanjaQuizMode = false;
var hanjaQuizScore = 0;
var hanjaQuizRound = 0;
var hanjaQuizCurrent = null;

function showHanjaExplorer(c) {
    hanjaQuizMode = false;
    hanjaQuizScore = 0;
    hanjaQuizRound = 0;
    gameState.gamesPlayed++;
    saveProgress();
    renderHanjaGrid(c);
}

function renderHanjaGrid(c) {
    var data = (typeof hanjaBasics !== "undefined" && hanjaBasics.length > 0) ? hanjaBasics : defaultHanjaBasics;

    var h = '<h2 class="game-title">Hanja Explorer</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:20px">Click a character to explore its meaning and derivatives</p>';

    h += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:12px;margin-bottom:25px">';
    for (var i = 0; i < data.length; i++) {
        h += '<div class="hanja-card" data-idx="' + i + '" style="background:var(--glass);border:2px solid rgba(157,78,221,0.3);border-radius:15px;padding:15px;text-align:center;cursor:pointer;transition:all 0.3s ease">';
        h += '<div style="font-size:2.5rem;margin-bottom:5px">' + escapeHtml(data[i].hanja) + '</div>';
        h += '<div style="font-size:0.75rem;color:var(--neon-cyan)">' + escapeHtml(data[i].korean) + '</div>';
        h += '</div>';
    }
    h += '</div>';

    // Detail panel
    h += '<div id="hanjaDetail" style="display:none;background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:25px;margin-bottom:20px"></div>';

    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="hanjaQuizBtn">Start Quiz</button>';
    h += '<button class="game-btn secondary" id="hanjaBackBtn">Back</button>';
    h += '</div>';

    c.innerHTML = h;

    // Card click handlers
    var cards = c.querySelectorAll('.hanja-card');
    for (var j = 0; j < cards.length; j++) {
        cards[j].onclick = function () {
            var idx = parseInt(this.getAttribute('data-idx'));
            var item = data[idx];
            var detail = document.getElementById('hanjaDetail');
            if (!detail) return;

            var dh = '<div style="text-align:center;margin-bottom:15px">';
            dh += '<div style="font-size:5rem;margin-bottom:10px">' + escapeHtml(item.hanja) + '</div>';
            dh += '<div style="font-size:1.3rem;color:var(--neon-cyan)">' + escapeHtml(item.korean) + '</div>';
            dh += '<div style="font-size:1.1rem;color:var(--neon-pink)">' + escapeHtml(item.meaning) + '</div>';
            dh += '</div>';

            if (item.derivatives && item.derivatives.length > 0) {
                dh += '<div style="margin-top:15px">';
                dh += '<h4 style="color:var(--gold);margin-bottom:10px">Derivative Words:</h4>';
                dh += '<div style="display:flex;flex-wrap:wrap;gap:8px">';
                for (var k = 0; k < item.derivatives.length; k++) {
                    dh += '<span style="background:rgba(157,78,221,0.2);padding:6px 14px;border-radius:10px;font-size:0.9rem;border:1px solid rgba(157,78,221,0.3)">' + escapeHtml(item.derivatives[k]) + '</span>';
                }
                dh += '</div></div>';
            }

            detail.innerHTML = dh;
            detail.style.display = 'block';

            // Highlight selected card
            var allCards = c.querySelectorAll('.hanja-card');
            for (var m = 0; m < allCards.length; m++) {
                allCards[m].style.borderColor = 'rgba(157,78,221,0.3)';
            }
            this.style.borderColor = 'var(--neon-pink)';
        };
    }

    // Quiz button
    document.getElementById('hanjaQuizBtn').onclick = function () {
        startHanjaQuiz(c);
    };

    // Back button
    document.getElementById('hanjaBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}

function startHanjaQuiz(c) {
    hanjaQuizMode = true;
    hanjaQuizScore = 0;
    hanjaQuizRound = 0;
    nextHanjaQuiz(c);
}

function nextHanjaQuiz(c) {
    var data = (typeof hanjaBasics !== "undefined" && hanjaBasics.length > 0) ? hanjaBasics : defaultHanjaBasics;
    if (hanjaQuizRound >= Math.min(data.length, 10)) {
        renderHanjaQuizEnd(c);
        return;
    }

    var shuffled = shuffle(data);
    hanjaQuizCurrent = shuffled[0];

    // Build options
    var wrongOptions = [];
    for (var i = 1; i < shuffled.length && wrongOptions.length < 3; i++) {
        wrongOptions.push(shuffled[i].meaning);
    }
    var allOptions = shuffle([hanjaQuizCurrent.meaning].concat(wrongOptions));
    hanjaQuizRound++;

    var h = '<h2 class="game-title">Hanja Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px">Round ' + hanjaQuizRound + '</p>';
    h += '<div style="text-align:center;margin-bottom:25px">';
    h += '<div style="font-size:6rem;margin:20px 0">' + escapeHtml(hanjaQuizCurrent.hanja) + '</div>';
    h += '<p style="color:rgba(255,255,255,0.6)">What does this Hanja mean?</p>';
    h += '</div>';

    h += '<div class="quiz-options">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j]) + '">' + escapeHtml(allOptions[j]) + '</div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">Score: ' + hanjaQuizScore + '</div>';

    c.innerHTML = h;

    var answered = false;
    var opts = c.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (answered) return;
            answered = true;
            var selected = this.getAttribute('data-answer');
            if (selected === hanjaQuizCurrent.meaning) {
                this.classList.add('correct');
                hanjaQuizScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                var allOpts = c.querySelectorAll('.quiz-option');
                for (var m = 0; m < allOpts.length; m++) {
                    if (allOpts[m].getAttribute('data-answer') === hanjaQuizCurrent.meaning) {
                        allOpts[m].classList.add('correct');
                    }
                }
            }
            setTimeout(function () { nextHanjaQuiz(c); }, 1200);
        };
    }
}

function renderHanjaQuizEnd(c) {
    var data = (typeof hanjaBasics !== "undefined" && hanjaBasics.length > 0) ? hanjaBasics : defaultHanjaBasics;
    var total = Math.min(data.length, 10);
    var pct = Math.round((hanjaQuizScore / (total * 100)) * 100);
    if (pct >= 80) { createConfetti(80); }
    addXP(hanjaQuizScore / 10);

    var h = '<h2 class="game-title">Hanja Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#23383;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + hanjaQuizScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="hanjaQuizAgainBtn">Quiz Again</button>';
    h += '<button class="game-btn secondary" id="hanjaExploreBtn">Explore</button>';
    h += '</div></div>';
    c.innerHTML = h;

    document.getElementById('hanjaQuizAgainBtn').onclick = function () {
        startHanjaQuiz(c);
    };
    document.getElementById('hanjaExploreBtn').onclick = function () {
        renderHanjaGrid(c);
    };
}


// ============================================================
// 8. SOUND WORDS GAME (showSoundWordsGame)
// ============================================================

var soundWordScore = 0;
var soundWordRound = 0;
var soundWordTotal = 8;
var soundWordCurrent = null;
var soundWordAnswered = false;

function showSoundWordsGame(c) {
    soundWordScore = 0;
    soundWordRound = 0;
    soundWordAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextSoundWord(c);
}

function nextSoundWord(c) {
    if (soundWordRound >= soundWordTotal) {
        renderSoundWordEnd(c);
        return;
    }

    var pool = (typeof koreanSoundWords !== "undefined" && koreanSoundWords.length > 0) ? koreanSoundWords : defaultSoundWords;
    var available = shuffle(pool);
    soundWordCurrent = available[soundWordRound % available.length];
    soundWordAnswered = false;
    soundWordRound++;
    renderSoundWordQuestion(c);
}

function renderSoundWordQuestion(c) {
    var q = soundWordCurrent;
    var catColors = {
        animals: "#00f5d4",
        weather: "#00d4ff",
        emotions: "#ff2d95",
        actions: "#9d4edd"
    };
    var catColor = catColors[q.category] || "#ffd700";

    // Build options
    var pool = (typeof koreanSoundWords !== "undefined" && koreanSoundWords.length > 0) ? koreanSoundWords : defaultSoundWords;
    var wrongAnswers = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].answer !== q.answer) {
            wrongAnswers.push(pool[i].answer);
        }
    }
    wrongAnswers = shuffle(wrongAnswers).slice(0, 3);
    var allOptions = shuffle([q.answer].concat(wrongAnswers));

    var h = '<h2 class="game-title">Sound Words Game</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + soundWordRound + ' / ' + soundWordTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((soundWordRound / soundWordTotal) * 100) + '%"></div></div>';

    h += '<div style="background:var(--glass);padding:25px;border-radius:15px;margin-bottom:20px;text-align:center">';
    h += '<span style="display:inline-block;background:' + catColor + ';color:#000;padding:3px 12px;border-radius:10px;font-size:0.75rem;font-weight:bold;margin-bottom:12px">' + escapeHtml(q.category.toUpperCase()) + '</span>';
    h += '<div style="font-size:1.3rem;line-height:1.6">' + escapeHtml(q.context) + '</div>';
    h += '</div>';

    h += '<div class="quiz-options">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option sound-word-option" data-answer="' + escapeHtml(allOptions[j]) + '" style="font-size:1.4rem;font-weight:bold">';
        h += escapeHtml(allOptions[j]) + '</div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">Score: ' + soundWordScore + '</div>';

    c.innerHTML = h;

    var opts = c.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (soundWordAnswered) return;
            soundWordAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === soundWordCurrent.answer);

            if (isCorrect) {
                this.classList.add('correct');
                soundWordScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);

                // Bounce animation
                this.style.transition = 'transform 0.1s ease';
                var btn = this;
                setTimeout(function () { btn.style.transform = 'scale(1.15)'; }, 0);
                setTimeout(function () { btn.style.transform = 'scale(0.95)'; }, 100);
                setTimeout(function () { btn.style.transform = 'scale(1.05)'; }, 200);
                setTimeout(function () { btn.style.transform = 'scale(1)'; }, 300);
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                var allOpts = c.querySelectorAll('.quiz-option');
                for (var m = 0; m < allOpts.length; m++) {
                    if (allOpts[m].getAttribute('data-answer') === soundWordCurrent.answer) {
                        allOpts[m].classList.add('correct');
                    }
                }
            }

            // Show info
            var infoDiv = document.createElement('div');
            infoDiv.className = 'learning-tip';
            infoDiv.style.marginTop = '15px';
            infoDiv.innerHTML = '<div style="font-size:1.5rem;color:var(--neon-pink);margin-bottom:5px">' + escapeHtml(soundWordCurrent.answer) + '</div>' +
                '<div style="color:var(--neon-cyan);font-size:0.9rem">' + escapeHtml(soundWordCurrent.romanization || "") + '</div>' +
                '<div style="color:rgba(255,255,255,0.7);margin-top:5px">' + escapeHtml(soundWordCurrent.english || "") + '</div>';
            c.appendChild(infoDiv);

            setTimeout(function () {
                nextSoundWord(c);
            }, 2000);
        };
    }
}

function renderSoundWordEnd(c) {
    var pct = Math.round((soundWordScore / (soundWordTotal * 100)) * 100);
    if (pct >= 80) { createConfetti(80); }
    addXP(soundWordScore / 10);

    var h = '<h2 class="game-title">Sound Words Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#128266;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + soundWordScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="soundWordAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="soundWordBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;

    document.getElementById('soundWordAgainBtn').onclick = function () {
        showSoundWordsGame(c);
    };
    document.getElementById('soundWordBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}


// ============================================================
// 9. CULTURAL CALENDAR (showCulturalCalendar)
// ============================================================

function showCulturalCalendar(c) {
    gameState.gamesPlayed++;
    saveProgress();
    renderCulturalCalendar(c);
}

function renderCulturalCalendar(c) {
    var data = (typeof koreanCalendar !== "undefined" && koreanCalendar.length > 0) ? koreanCalendar : defaultKoreanCalendar;

    // Determine current month for highlighting
    var now = new Date();
    var currentMonth = now.getMonth(); // 0-indexed

    var h = '<h2 class="game-title">Korean Cultural Calendar</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:25px">Explore Korean holidays and learn related vocabulary</p>';

    h += '<div style="display:grid;gap:15px">';
    for (var i = 0; i < data.length; i++) {
        var holiday = data[i];

        // Simple highlight heuristic based on date text containing month keywords
        var isUpcoming = false;
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var dateStr = holiday.date || "";
        if (dateStr.indexOf(monthNames[currentMonth]) !== -1 || dateStr.indexOf(monthNames[(currentMonth + 1) % 12]) !== -1) {
            isUpcoming = true;
        }
        // Check for numeric months too
        var monthNum = currentMonth + 1;
        var monthStr = monthNum < 10 ? "0" + monthNum : "" + monthNum;
        if (dateStr.indexOf("" + monthNum + "/") !== -1 || dateStr.indexOf(monthStr + "/") !== -1) {
            isUpcoming = true;
        }

        var borderStyle = isUpcoming ? 'border:2px solid var(--gold);box-shadow:0 0 20px rgba(255,215,0,0.2)' : 'border:1px solid rgba(157,78,221,0.3)';

        h += '<div style="background:var(--glass);' + borderStyle + ';border-radius:15px;padding:20px;transition:all 0.3s ease">';
        h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:12px">';
        h += '<div>';
        h += '<div style="font-size:1.5rem;color:var(--neon-pink);font-weight:bold">' + escapeHtml(holiday.name) + '</div>';
        h += '<div style="font-size:1rem;color:var(--neon-cyan)">' + escapeHtml(holiday.englishName) + '</div>';
        h += '</div>';
        h += '<div style="display:flex;align-items:center;gap:8px">';
        if (isUpcoming) {
            h += '<span style="background:var(--gold);color:#000;padding:3px 10px;border-radius:8px;font-size:0.7rem;font-weight:bold">UPCOMING</span>';
        }
        h += '<span style="background:rgba(157,78,221,0.2);padding:4px 12px;border-radius:8px;font-size:0.8rem;color:var(--neon-purple)">' + escapeHtml(holiday.date) + '</span>';
        h += '</div></div>';

        h += '<p style="color:rgba(255,255,255,0.7);font-size:0.9rem;line-height:1.5;margin-bottom:12px">' + escapeHtml(holiday.description) + '</p>';

        // Vocabulary section
        if (holiday.vocabulary && holiday.vocabulary.length > 0) {
            h += '<div style="border-top:1px solid rgba(157,78,221,0.2);padding-top:12px">';
            h += '<div style="font-size:0.8rem;color:var(--gold);margin-bottom:8px;font-weight:bold">Related Vocabulary:</div>';
            h += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
            for (var j = 0; j < holiday.vocabulary.length; j++) {
                h += '<span class="cal-vocab-btn" data-word="' + escapeHtml(holiday.vocabulary[j]) + '" style="background:rgba(0,245,212,0.1);border:1px solid rgba(0,245,212,0.3);padding:4px 12px;border-radius:10px;font-size:0.85rem;color:#00f5d4;cursor:pointer;transition:all 0.2s ease">' + escapeHtml(holiday.vocabulary[j]) + '</span>';
            }
            h += '</div></div>';
        }
        h += '</div>';
    }
    h += '</div>';

    h += '<div class="game-controls" style="margin-top:25px">';
    h += '<button class="game-btn secondary" id="calBackBtn">Back</button>';
    h += '</div>';

    c.innerHTML = h;

    // Click vocabulary to hear Korean part
    var vocabBtns = c.querySelectorAll('.cal-vocab-btn');
    for (var k = 0; k < vocabBtns.length; k++) {
        vocabBtns[k].onclick = function () {
            var word = this.getAttribute('data-word');
            // Extract Korean part before parenthesis
            var koreanPart = word.split('(')[0].trim();
            if (koreanPart) {
                speakKorean(koreanPart);
                addXP(2);
            }
        };
    }

    // Back button
    document.getElementById('calBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}


// ============================================================
// 10. SRS REVIEW (showSRSReview)
// Spaced Repetition System using Leitner box algorithm
// ============================================================

var srsBoxIntervals = {
    1: 1,    // Box 1: 1 day
    2: 3,    // Box 2: 3 days
    3: 7,    // Box 3: 7 days
    4: 14,   // Box 4: 14 days
    5: 30    // Box 5: 30 days
};

var srsReviewQueue = [];
var srsReviewIndex = 0;

function getSRSData() {
    try {
        var stored = localStorage.getItem('srsData');
        if (stored) { return JSON.parse(stored); }
    } catch (e) {}
    return {};
}

function saveSRSData(data) {
    try { localStorage.setItem('srsData', JSON.stringify(data)); } catch (e) {}
}

function showSRSReview(c) {
    gameState.gamesPlayed++;
    saveProgress();
    renderSRSDashboard(c);
}

function renderSRSDashboard(c) {
    var srsData = getSRSData();
    var now = Date.now();
    var totalWords = 0;
    var dueToday = 0;
    var boxCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (var word in srsData) {
        if (srsData.hasOwnProperty(word)) {
            totalWords++;
            var entry = srsData[word];
            var box = entry.box || 1;
            if (box >= 1 && box <= 5) { boxCounts[box]++; }
            if (!entry.nextReview || entry.nextReview <= now) {
                dueToday++;
            }
        }
    }

    var h = '<h2 class="game-title">SRS Review</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:20px">Spaced Repetition System - Review words at optimal intervals</p>';

    // Dashboard stats
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:25px">';
    h += '<div class="stat-item"><div class="stat-value">' + totalWords + '</div><div class="stat-label">TOTAL WORDS</div></div>';
    h += '<div class="stat-item" style="border-color:' + (dueToday > 0 ? 'var(--fire)' : 'rgba(0,245,212,0.3)') + '">';
    h += '<div class="stat-value" style="' + (dueToday > 0 ? 'background:linear-gradient(135deg,var(--fire),#ff4500);-webkit-background-clip:text;-webkit-text-fill-color:transparent' : '') + '">' + dueToday + '</div>';
    h += '<div class="stat-label">DUE TODAY</div></div>';
    h += '<div class="stat-item"><div class="stat-value">' + boxCounts[5] + '</div><div class="stat-label">MASTERED</div></div>';
    h += '</div>';

    // Box distribution
    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:25px">';
    h += '<h3 style="color:var(--neon-cyan);margin-bottom:15px;text-align:center">Leitner Box Distribution</h3>';
    h += '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;text-align:center">';
    var boxColors = ["#ff4757", "#ff6b35", "#ffd700", "#00d4ff", "#00f5d4"];
    var boxLabels = ["1 day", "3 days", "7 days", "14 days", "30 days"];
    for (var b = 1; b <= 5; b++) {
        var barHeight = totalWords > 0 ? Math.max(5, Math.round((boxCounts[b] / totalWords) * 100)) : 5;
        h += '<div>';
        h += '<div style="height:80px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:5px">';
        h += '<div style="width:100%;max-width:40px;height:' + barHeight + '%;background:' + boxColors[b - 1] + ';border-radius:5px 5px 0 0;transition:height 0.3s ease"></div></div>';
        h += '<div style="font-size:0.85rem;font-weight:bold;color:' + boxColors[b - 1] + '">' + boxCounts[b] + '</div>';
        h += '<div style="font-size:0.65rem;color:rgba(255,255,255,0.5)">Box ' + b + '</div>';
        h += '<div style="font-size:0.6rem;color:rgba(255,255,255,0.3)">' + boxLabels[b - 1] + '</div>';
        h += '</div>';
    }
    h += '</div></div>';

    // Action buttons
    h += '<div class="game-controls" style="flex-direction:column;gap:12px">';
    if (dueToday > 0) {
        h += '<button class="game-btn" id="srsStartReviewBtn" style="width:100%">Start Review (' + dueToday + ' words due)</button>';
    } else if (totalWords > 0) {
        h += '<button class="game-btn" id="srsStartReviewBtn" style="width:100%;opacity:0.6" disabled>No words due today! Come back later.</button>';
    }
    h += '<button class="game-btn secondary" id="srsAddAllBtn" style="width:100%">Add Category Words to SRS</button>';
    h += '<button class="game-btn secondary" id="srsBackBtn" style="width:100%">Back</button>';
    h += '</div>';

    c.innerHTML = h;

    // Start Review
    if (document.getElementById('srsStartReviewBtn') && dueToday > 0) {
        document.getElementById('srsStartReviewBtn').onclick = function () {
            startSRSSession(c);
        };
    }

    // Add All Words
    document.getElementById('srsAddAllBtn').onclick = function () {
        var words = getWords();
        if (words.length === 0) {
            var allW = [];
            for (var cat in wordDatabase) { allW = allW.concat(wordDatabase[cat]); }
            words = allW;
        }

        var srsData = getSRSData();
        var added = 0;
        var now = Date.now();
        for (var i = 0; i < words.length; i++) {
            var key = words[i].korean;
            if (!srsData[key]) {
                srsData[key] = {
                    box: 1,
                    nextReview: now,
                    reviews: 0,
                    word: words[i]
                };
                added++;
            }
        }
        saveSRSData(srsData);
        if (typeof showToast === "function") {
            showToast(added + ' words added to SRS!');
        }
        renderSRSDashboard(c);
    };

    // Back
    document.getElementById('srsBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}

function startSRSSession(c) {
    var srsData = getSRSData();
    var now = Date.now();
    srsReviewQueue = [];

    for (var word in srsData) {
        if (srsData.hasOwnProperty(word)) {
            var entry = srsData[word];
            if (!entry.nextReview || entry.nextReview <= now) {
                srsReviewQueue.push({ key: word, entry: entry });
            }
        }
    }

    srsReviewQueue = shuffle(srsReviewQueue);
    srsReviewIndex = 0;

    if (srsReviewQueue.length === 0) {
        renderSRSDashboard(c);
        return;
    }

    nextSRSCard(c);
}

function nextSRSCard(c) {
    if (srsReviewIndex >= srsReviewQueue.length) {
        renderSRSSessionEnd(c);
        return;
    }

    var item = srsReviewQueue[srsReviewIndex];
    var wordData = item.entry.word || {};
    var korean = item.key;
    var english = wordData.english || "";
    var romanization = wordData.romanization || "";
    var box = item.entry.box || 1;

    var boxColors = ["#ff4757", "#ff6b35", "#ffd700", "#00d4ff", "#00f5d4"];
    var boxColor = boxColors[Math.min(box, 5) - 1];

    var remaining = srsReviewQueue.length - srsReviewIndex;

    var h = '<h2 class="game-title">SRS Review</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += remaining + ' word' + (remaining !== 1 ? 's' : '') + ' remaining</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((srsReviewIndex / srsReviewQueue.length) * 100) + '%"></div></div>';

    h += '<div class="flashcard" id="srsCard" style="cursor:pointer;position:relative">';
    h += '<span style="position:absolute;top:10px;right:10px;background:' + boxColor + ';color:#000;padding:3px 10px;border-radius:8px;font-size:0.7rem;font-weight:bold">Box ' + box + '</span>';
    h += '<div class="flashcard-korean">' + escapeHtml(korean) + '</div>';
    h += '<div class="flashcard-romanization">' + escapeHtml(romanization) + '</div>';
    h += '<div class="flashcard-english" id="srsAnswer" style="display:none">' + escapeHtml(english) + '</div>';
    h += '<p id="srsTapHint" style="opacity:0.5;margin-top:10px;font-size:0.9rem">Tap to reveal answer</p>';
    h += '</div>';

    h += '<div id="srsButtons" style="display:none">';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:12px">How well did you know this?</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="srsCorrectBtn" style="background:linear-gradient(135deg,#00d4ff,#00f5d4)">Got It!</button>';
    h += '<button class="game-btn" id="srsWrongBtn" style="background:linear-gradient(135deg,#ff4757,#ff6b81)">Need Practice</button>';
    h += '</div></div>';

    h += '<div style="text-align:center;margin-top:15px">';
    h += '<button class="game-btn secondary" id="srsListenBtn" style="padding:8px 18px;font-size:0.85rem">Listen</button>';
    h += '</div>';

    c.innerHTML = h;

    var revealed = false;

    // Tap card to reveal
    document.getElementById('srsCard').onclick = function () {
        if (!revealed) {
            revealed = true;
            document.getElementById('srsAnswer').style.display = 'block';
            document.getElementById('srsTapHint').style.display = 'none';
            document.getElementById('srsButtons').style.display = 'block';
        }
    };

    // Listen
    document.getElementById('srsListenBtn').onclick = function () {
        speakKorean(korean);
    };

    // Got It - move up a box
    document.getElementById('srsCorrectBtn').onclick = function () {
        var srsData = getSRSData();
        var entry = srsData[korean];
        if (entry) {
            var newBox = Math.min((entry.box || 1) + 1, 5);
            var intervalDays = srsBoxIntervals[newBox];
            entry.box = newBox;
            entry.nextReview = Date.now() + (intervalDays * 24 * 60 * 60 * 1000);
            entry.reviews = (entry.reviews || 0) + 1;
            srsData[korean] = entry;
            saveSRSData(srsData);
        }
        SoundEngine.correct();
        addCombo();
        addXP(10);
        collectWord(wordData);
        srsReviewIndex++;
        nextSRSCard(c);
    };

    // Need Practice - move to box 1
    document.getElementById('srsWrongBtn').onclick = function () {
        var srsData = getSRSData();
        var entry = srsData[korean];
        if (entry) {
            entry.box = 1;
            entry.nextReview = Date.now() + (srsBoxIntervals[1] * 24 * 60 * 60 * 1000);
            entry.reviews = (entry.reviews || 0) + 1;
            srsData[korean] = entry;
            saveSRSData(srsData);
        }
        SoundEngine.wrong();
        resetCombo();
        srsReviewIndex++;
        nextSRSCard(c);
    };
}

function renderSRSSessionEnd(c) {
    var total = srsReviewQueue.length;
    createConfetti(60);
    addXP(total * 5);

    var h = '<h2 class="game-title">Review Session Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#127891;</div>';
    h += '<div style="font-size:1.5rem;color:var(--gold);margin:15px 0">Reviewed ' + total + ' word' + (total !== 1 ? 's' : '') + '!</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">Great job! Come back tomorrow for more practice.</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="srsDashBtn">Dashboard</button>';
    h += '<button class="game-btn secondary" id="srsEndBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;

    document.getElementById('srsDashBtn').onclick = function () {
        renderSRSDashboard(c);
    };
    document.getElementById('srsEndBackBtn').onclick = function () {
        if (typeof showMode === "function") { showMode(gameState.currentMode); }
    };
}
