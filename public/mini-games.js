/**
 * Mini-Games for K-POP Korean Learning Game
 * Requires: content-data.js (loaded before this file)
 * Uses global functions: getWords, shuffle, addXP, addCombo, resetCombo,
 *   SoundEngine, createConfetti, showToast, saveProgress, gameState,
 *   escapeHtml, speakKorean, collectWord, wordDatabase
 */

// ============================================================
// 1. FALLING WORDS
// ============================================================

var fallingWordsLives = 3;
var fallingWordsScore = 0;
var fallingWordsActive = false;
var fallingWordsItems = [];
var fallingWordsAnimFrame = null;
var fallingWordsSpeed = 0.5;
var fallingWordsSpawnTimer = null;
var fallingWordsLevel = 1;
var fallingWordsContainer = null;
var fallingWordsInputRef = null;

function showFallingWords(c) {
    fallingWordsLives = 3;
    fallingWordsScore = 0;
    fallingWordsActive = false;
    fallingWordsItems = [];
    fallingWordsLevel = 1;
    fallingWordsSpeed = 0.5;
    if (fallingWordsAnimFrame) { cancelAnimationFrame(fallingWordsAnimFrame); fallingWordsAnimFrame = null; }
    if (fallingWordsSpawnTimer) { clearInterval(fallingWordsSpawnTimer); fallingWordsSpawnTimer = null; }
    gameState.gamesPlayed++;
    saveProgress();
    renderFallingWordsStart(c);
}

function renderFallingWordsStart(c) {
    var best = parseInt(localStorage.getItem('fallingWordsBest') || '0', 10);
    var h = '<h2 class="game-title">Falling Words</h2>';
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<p style="font-size:5rem;margin-bottom:10px">&#127782;&#65039;</p>';
    h += '<p style="color:rgba(255,255,255,0.8);font-size:1.1rem;margin-bottom:15px">';
    h += 'Korean words fall from the sky!<br>Type the <strong>English meaning</strong> before they hit the ground.</p>';
    h += '<p style="color:var(--gold);font-size:0.95rem;margin-bottom:20px">';
    h += 'Best Score: <strong>' + best + '</strong></p>';
    h += '<button class="game-btn" id="fwStartBtn">Start Game</button>';
    h += '</div>';
    c.innerHTML = h;
    document.getElementById('fwStartBtn').onclick = function() {
        fallingWordsActive = true;
        renderFallingWordsGame(c);
    };
}

function renderFallingWordsGame(c) {
    var h = '<h2 class="game-title">Falling Words</h2>';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">';
    h += '<div id="fwHearts" style="font-size:1.5rem">';
    for (var i = 0; i < fallingWordsLives; i++) { h += '&#10084;&#65039; '; }
    h += '</div>';
    h += '<div style="text-align:right">';
    h += '<span style="color:var(--gold);font-weight:bold;font-size:1.3rem" id="fwScore">' + fallingWordsScore + '</span>';
    h += '<br><span style="color:rgba(255,255,255,0.5);font-size:0.75rem">Level ' + fallingWordsLevel + '</span>';
    h += '</div></div>';
    h += '<div id="fwField" style="position:relative;width:100%;height:320px;background:rgba(0,0,0,0.3);border-radius:15px;overflow:hidden;border:1px solid rgba(157,78,221,0.3);margin-bottom:15px">';
    h += '<div id="fwDangerLine" style="position:absolute;bottom:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,#ff2d95,#ff4757);box-shadow:0 0 10px #ff2d95"></div>';
    h += '</div>';
    h += '<input type="text" class="speed-input" id="fwInput" placeholder="Type the English meaning..." autocomplete="off" autocapitalize="off" spellcheck="false">';
    c.innerHTML = h;

    fallingWordsContainer = document.getElementById('fwField');
    fallingWordsInputRef = document.getElementById('fwInput');
    fallingWordsInputRef.focus();

    fallingWordsInputRef.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            fallingWordsCheckAnswer();
        }
    });

    fallingWordsSpawnWord();
    var spawnInterval = Math.max(1200, 3000 - (fallingWordsLevel * 200));
    fallingWordsSpawnTimer = setInterval(function() {
        if (!fallingWordsActive) return;
        fallingWordsSpawnWord();
        fallingWordsLevel = Math.floor(fallingWordsScore / 5) + 1;
        fallingWordsSpeed = 0.5 + (fallingWordsLevel - 1) * 0.15;
    }, spawnInterval);

    fallingWordsAnimFrame = requestAnimationFrame(fallingWordsLoop);
}

function fallingWordsSpawnWord() {
    var words = getWords();
    if (words.length === 0) return;
    var word = words[Math.floor(Math.random() * words.length)];
    var el = document.createElement('div');
    el.style.cssText = 'position:absolute;top:-40px;padding:8px 14px;border-radius:12px;font-size:1.2rem;font-weight:bold;white-space:nowrap;background:linear-gradient(135deg,var(--neon-purple),var(--neon-pink));box-shadow:0 4px 15px rgba(157,78,221,0.5);transition:opacity 0.3s;cursor:default;';
    var maxLeft = fallingWordsContainer ? (fallingWordsContainer.offsetWidth - 120) : 300;
    el.style.left = Math.floor(Math.random() * Math.max(maxLeft, 50)) + 'px';
    el.textContent = word.korean;
    if (fallingWordsContainer) {
        fallingWordsContainer.appendChild(el);
    }
    fallingWordsItems.push({
        el: el,
        word: word,
        y: -40,
        speed: fallingWordsSpeed + Math.random() * 0.3
    });
}

function fallingWordsLoop() {
    if (!fallingWordsActive) return;
    var fieldHeight = fallingWordsContainer ? fallingWordsContainer.offsetHeight : 320;
    for (var i = fallingWordsItems.length - 1; i >= 0; i--) {
        var item = fallingWordsItems[i];
        item.y += item.speed;
        item.el.style.top = item.y + 'px';
        if (item.y > fieldHeight - 10) {
            item.el.style.opacity = '0';
            setTimeout(function(el) { if (el.parentNode) el.parentNode.removeChild(el); }, 300, item.el);
            fallingWordsItems.splice(i, 1);
            fallingWordsLives--;
            resetCombo();
            SoundEngine.wrong();
            if (fallingWordsLives <= 0) {
                fallingWordsGameOver();
                return;
            }
            fallingWordsUpdateHearts();
        }
    }
    fallingWordsAnimFrame = requestAnimationFrame(fallingWordsLoop);
}

function fallingWordsCheckAnswer() {
    if (!fallingWordsInputRef || !fallingWordsActive) return;
    var val = fallingWordsInputRef.value.trim().toLowerCase();
    if (!val) return;
    var matched = false;
    for (var i = 0; i < fallingWordsItems.length; i++) {
        var item = fallingWordsItems[i];
        if (item.word.english.toLowerCase() === val) {
            matched = true;
            item.el.style.background = 'linear-gradient(135deg,#00d4ff,#00f5d4)';
            item.el.style.transform = 'scale(1.3)';
            item.el.style.opacity = '0';
            setTimeout(function(el) { if (el.parentNode) el.parentNode.removeChild(el); }, 400, item.el);
            fallingWordsItems.splice(i, 1);
            fallingWordsScore++;
            addXP(15);
            addCombo();
            collectWord(item.word);
            SoundEngine.correct();
            var scoreEl = document.getElementById('fwScore');
            if (scoreEl) scoreEl.textContent = fallingWordsScore;
            break;
        }
    }
    if (!matched && val.length > 1) {
        fallingWordsInputRef.style.borderColor = '#ff4757';
        setTimeout(function() {
            if (fallingWordsInputRef) fallingWordsInputRef.style.borderColor = 'var(--neon-purple)';
        }, 300);
    }
    fallingWordsInputRef.value = '';
}

function fallingWordsUpdateHearts() {
    var el = document.getElementById('fwHearts');
    if (!el) return;
    var h = '';
    for (var i = 0; i < 3; i++) {
        if (i < fallingWordsLives) { h += '&#10084;&#65039; '; }
        else { h += '&#128420; '; }
    }
    el.innerHTML = h;
}

function fallingWordsGameOver() {
    fallingWordsActive = false;
    if (fallingWordsAnimFrame) { cancelAnimationFrame(fallingWordsAnimFrame); fallingWordsAnimFrame = null; }
    if (fallingWordsSpawnTimer) { clearInterval(fallingWordsSpawnTimer); fallingWordsSpawnTimer = null; }
    var best = parseInt(localStorage.getItem('fallingWordsBest') || '0', 10);
    var newBest = fallingWordsScore > best;
    if (newBest) { localStorage.setItem('fallingWordsBest', String(fallingWordsScore)); }
    if (newBest) { createConfetti(40); }
    var parent = fallingWordsContainer ? fallingWordsContainer.parentElement : null;
    if (!parent) return;
    var h = '<h2 class="game-title">Game Over!</h2>';
    h += '<div style="text-align:center">';
    h += '<p style="font-size:4rem;margin-bottom:10px">&#128165;</p>';
    h += '<p style="font-size:2.5rem;font-weight:bold;background:linear-gradient(135deg,var(--neon-pink),var(--neon-cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:10px">' + fallingWordsScore + ' Points</p>';
    if (newBest) {
        h += '<p style="color:var(--gold);font-size:1.2rem;margin-bottom:15px">New High Score!</p>';
    }
    h += '<p style="color:rgba(255,255,255,0.6);margin-bottom:5px">Level Reached: ' + fallingWordsLevel + '</p>';
    h += '<p style="color:rgba(255,255,255,0.6);margin-bottom:25px">Best: ' + Math.max(best, fallingWordsScore) + '</p>';
    h += '<button class="game-btn" id="fwRetry">Play Again</button>';
    h += '</div>';
    parent.innerHTML = h;
    document.getElementById('fwRetry').onclick = function() { showFallingWords(parent); };
}


// ============================================================
// 2. WORD TETRIS
// ============================================================

var tetrisBoard = [];
var tetrisCols = 4;
var tetrisRows = 8;
var tetrisScore = 0;
var tetrisActive = false;
var tetrisCurrent = null;
var tetrisCurrentCol = 1;
var tetrisDropTimer = null;
var tetrisWordPool = [];
var tetrisTargetWords = [];

function showWordTetris(c) {
    tetrisBoard = [];
    for (var r = 0; r < tetrisRows; r++) {
        tetrisBoard[r] = [];
        for (var cl = 0; cl < tetrisCols; cl++) {
            tetrisBoard[r][cl] = null;
        }
    }
    tetrisScore = 0;
    tetrisActive = false;
    tetrisCurrent = null;
    tetrisCurrentCol = 1;
    if (tetrisDropTimer) { clearInterval(tetrisDropTimer); tetrisDropTimer = null; }
    gameState.gamesPlayed++;
    saveProgress();
    renderWordTetrisStart(c);
}

function renderWordTetrisStart(c) {
    var h = '<h2 class="game-title">Word Tetris</h2>';
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<p style="font-size:5rem;margin-bottom:10px">&#129513;</p>';
    h += '<p style="color:rgba(255,255,255,0.8);font-size:1.1rem;margin-bottom:15px">';
    h += 'Korean syllable blocks fall down!<br>Arrange them to spell valid words from the word bank.</p>';
    h += '<p style="color:rgba(255,255,255,0.6);font-size:0.9rem;margin-bottom:20px">';
    h += 'Use <strong>arrow keys</strong> or buttons to move blocks.<br>Complete a word to clear the row!</p>';
    h += '<button class="game-btn" id="wtStartBtn">Start Game</button>';
    h += '</div>';
    c.innerHTML = h;
    document.getElementById('wtStartBtn').onclick = function() {
        tetrisActive = true;
        tetrisBuildWordPool();
        renderWordTetrisGame(c);
    };
}

function tetrisBuildWordPool() {
    var words = getWords();
    tetrisWordPool = [];
    tetrisTargetWords = [];
    var filtered = [];
    for (var i = 0; i < words.length; i++) {
        var kLen = words[i].korean.length;
        if (kLen >= 2 && kLen <= tetrisCols) {
            filtered.push(words[i]);
        }
    }
    filtered = shuffle(filtered).slice(0, 8);
    for (var j = 0; j < filtered.length; j++) {
        tetrisTargetWords.push(filtered[j]);
        var chars = filtered[j].korean.split('');
        for (var k = 0; k < chars.length; k++) {
            tetrisWordPool.push({ char: chars[k], wordIdx: j });
        }
    }
    tetrisWordPool = shuffle(tetrisWordPool);
}

function renderWordTetrisGame(c) {
    var h = '<h2 class="game-title">Word Tetris</h2>';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">';
    h += '<span style="color:var(--gold);font-weight:bold;font-size:1.3rem" id="wtScore">Score: ' + tetrisScore + '</span>';
    h += '</div>';

    // Word bank
    h += '<div style="margin-bottom:12px;text-align:center">';
    h += '<span style="color:rgba(255,255,255,0.5);font-size:0.8rem">WORD BANK: </span>';
    for (var w = 0; w < tetrisTargetWords.length; w++) {
        var tw = tetrisTargetWords[w];
        h += '<span id="wtTarget' + w + '" style="display:inline-block;padding:4px 10px;margin:2px;border-radius:10px;font-size:0.85rem;background:rgba(157,78,221,0.3);border:1px solid rgba(157,78,221,0.5)">';
        h += escapeHtml(tw.korean) + ' <span style="color:rgba(255,255,255,0.5)">(' + escapeHtml(tw.english) + ')</span></span>';
    }
    h += '</div>';

    // Board
    h += '<div id="wtBoard" style="display:grid;grid-template-columns:repeat(' + tetrisCols + ',1fr);gap:3px;max-width:320px;margin:0 auto 15px;background:rgba(0,0,0,0.4);padding:8px;border-radius:12px;border:1px solid rgba(157,78,221,0.3)">';
    for (var r = 0; r < tetrisRows; r++) {
        for (var cl = 0; cl < tetrisCols; cl++) {
            h += '<div id="wtCell' + r + '_' + cl + '" style="aspect-ratio:1;background:rgba(255,255,255,0.03);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:bold;transition:all 0.2s"></div>';
        }
    }
    h += '</div>';

    // Controls
    h += '<div style="display:flex;justify-content:center;gap:10px">';
    h += '<button class="game-btn secondary" id="wtLeft" style="padding:12px 20px;font-size:1.3rem">&#9664;</button>';
    h += '<button class="game-btn" id="wtDrop" style="padding:12px 20px;font-size:1.3rem">&#9660;</button>';
    h += '<button class="game-btn secondary" id="wtRight" style="padding:12px 20px;font-size:1.3rem">&#9654;</button>';
    h += '</div>';
    c.innerHTML = h;

    document.getElementById('wtLeft').onclick = function() { tetrisMoveBlock(-1); };
    document.getElementById('wtRight').onclick = function() { tetrisMoveBlock(1); };
    document.getElementById('wtDrop').onclick = function() { tetrisHardDrop(); };

    document.addEventListener('keydown', tetrisKeyHandler);

    tetrisSpawnBlock();
    tetrisDropTimer = setInterval(function() {
        if (!tetrisActive) return;
        tetrisDropBlock(c);
    }, 1200);
}

function tetrisKeyHandler(e) {
    if (!tetrisActive) return;
    if (e.key === 'ArrowLeft') { tetrisMoveBlock(-1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { tetrisMoveBlock(1); e.preventDefault(); }
    else if (e.key === 'ArrowDown') { tetrisHardDrop(); e.preventDefault(); }
}

function tetrisSpawnBlock() {
    if (tetrisWordPool.length === 0) {
        tetrisBuildWordPool();
    }
    var piece = tetrisWordPool.pop();
    tetrisCurrent = { char: piece.char, row: 0, col: Math.floor(tetrisCols / 2) };
    tetrisCurrentCol = tetrisCurrent.col;
    if (tetrisBoard[0][tetrisCurrent.col] !== null) {
        tetrisGameOver();
        return;
    }
    tetrisRenderBoard();
}

function tetrisMoveBlock(dir) {
    if (!tetrisCurrent || !tetrisActive) return;
    var newCol = tetrisCurrent.col + dir;
    if (newCol < 0 || newCol >= tetrisCols) return;
    if (tetrisBoard[tetrisCurrent.row][newCol] !== null) return;
    tetrisCurrent.col = newCol;
    tetrisRenderBoard();
}

function tetrisDropBlock(c) {
    if (!tetrisCurrent || !tetrisActive) return;
    var nextRow = tetrisCurrent.row + 1;
    if (nextRow >= tetrisRows || tetrisBoard[nextRow][tetrisCurrent.col] !== null) {
        tetrisBoard[tetrisCurrent.row][tetrisCurrent.col] = tetrisCurrent.char;
        tetrisCheckRows(c);
        tetrisSpawnBlock();
        return;
    }
    tetrisCurrent.row = nextRow;
    tetrisRenderBoard();
}

function tetrisHardDrop() {
    if (!tetrisCurrent || !tetrisActive) return;
    while (tetrisCurrent.row + 1 < tetrisRows && tetrisBoard[tetrisCurrent.row + 1][tetrisCurrent.col] === null) {
        tetrisCurrent.row++;
    }
    tetrisRenderBoard();
}

function tetrisCheckRows(c) {
    for (var r = tetrisRows - 1; r >= 0; r--) {
        var rowStr = '';
        var full = true;
        for (var cl = 0; cl < tetrisCols; cl++) {
            if (tetrisBoard[r][cl] === null) { full = false; break; }
            rowStr += tetrisBoard[r][cl];
        }
        if (!full) continue;

        // Check if any substring matches a target word
        var matched = false;
        for (var w = 0; w < tetrisTargetWords.length; w++) {
            if (rowStr.indexOf(tetrisTargetWords[w].korean) !== -1) {
                matched = true;
                tetrisScore += 100;
                addXP(25);
                addCombo();
                collectWord(tetrisTargetWords[w]);
                SoundEngine.correct();
                createConfetti(15);
                var targetEl = document.getElementById('wtTarget' + w);
                if (targetEl) {
                    targetEl.style.background = 'linear-gradient(135deg,#00d4ff,#00f5d4)';
                    targetEl.style.textDecoration = 'line-through';
                }
                break;
            }
        }

        if (full) {
            // Clear row
            for (var cl2 = 0; cl2 < tetrisCols; cl2++) {
                tetrisBoard[r][cl2] = null;
            }
            // Drop rows above
            for (var above = r - 1; above >= 0; above--) {
                for (var cl3 = 0; cl3 < tetrisCols; cl3++) {
                    tetrisBoard[above + 1][cl3] = tetrisBoard[above][cl3];
                    tetrisBoard[above][cl3] = null;
                }
            }
            if (!matched) {
                tetrisScore += 20;
                resetCombo();
            }
            r++; // recheck same row
        }
    }
    var scoreEl = document.getElementById('wtScore');
    if (scoreEl) scoreEl.textContent = 'Score: ' + tetrisScore;
}

function tetrisRenderBoard() {
    for (var r = 0; r < tetrisRows; r++) {
        for (var cl = 0; cl < tetrisCols; cl++) {
            var cell = document.getElementById('wtCell' + r + '_' + cl);
            if (!cell) continue;
            var val = tetrisBoard[r][cl];
            var isCurrent = tetrisCurrent && tetrisCurrent.row === r && tetrisCurrent.col === cl;
            if (isCurrent) {
                cell.textContent = tetrisCurrent.char;
                cell.style.background = 'linear-gradient(135deg,var(--neon-pink),var(--neon-purple))';
                cell.style.boxShadow = '0 0 12px rgba(255,45,149,0.5)';
            } else if (val) {
                cell.textContent = val;
                cell.style.background = 'rgba(157,78,221,0.4)';
                cell.style.boxShadow = 'none';
            } else {
                cell.textContent = '';
                cell.style.background = 'rgba(255,255,255,0.03)';
                cell.style.boxShadow = 'none';
            }
        }
    }
}

function tetrisGameOver() {
    tetrisActive = false;
    if (tetrisDropTimer) { clearInterval(tetrisDropTimer); tetrisDropTimer = null; }
    document.removeEventListener('keydown', tetrisKeyHandler);
    showToast('Tetris Over! Score: ' + tetrisScore);
}


// ============================================================
// 3. KOREAN CROSSWORD
// ============================================================

var crosswordGrid = [];
var crosswordClues = [];
var crosswordSize = 5;
var crosswordPlacedWords = [];
var crosswordDifficulty = 'easy';

function showKoreanCrossword(c) {
    crosswordGrid = [];
    crosswordClues = [];
    crosswordPlacedWords = [];
    gameState.gamesPlayed++;
    saveProgress();
    renderCrosswordDifficulty(c);
}

function renderCrosswordDifficulty(c) {
    var h = '<h2 class="game-title">Korean Crossword</h2>';
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<p style="font-size:5rem;margin-bottom:10px">&#128221;</p>';
    h += '<p style="color:rgba(255,255,255,0.8);font-size:1.1rem;margin-bottom:20px">';
    h += 'Fill in the Korean words using English clues!</p>';
    h += '<p style="color:rgba(255,255,255,0.6);margin-bottom:20px">Choose difficulty:</p>';
    h += '<div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap">';
    h += '<button class="game-btn" id="cwEasy" style="padding:12px 24px">Easy (3 words)</button>';
    h += '<button class="game-btn" id="cwMed" style="padding:12px 24px">Medium (4 words)</button>';
    h += '<button class="game-btn" id="cwHard" style="padding:12px 24px">Hard (5 words)</button>';
    h += '</div></div>';
    c.innerHTML = h;
    document.getElementById('cwEasy').onclick = function() { crosswordDifficulty = 'easy'; crosswordGenerate(c, 3); };
    document.getElementById('cwMed').onclick = function() { crosswordDifficulty = 'medium'; crosswordGenerate(c, 4); };
    document.getElementById('cwHard').onclick = function() { crosswordDifficulty = 'hard'; crosswordGenerate(c, 5); };
}

function crosswordGenerate(c, wordCount) {
    var words = getWords();
    if (words.length < wordCount) {
        c.innerHTML = '<p style="text-align:center">Not enough words for crossword.</p>';
        return;
    }

    // Filter to short Korean words (2-4 chars) for crossword fit
    var candidates = [];
    for (var i = 0; i < words.length; i++) {
        var kLen = words[i].korean.length;
        if (kLen >= 2 && kLen <= 4) {
            candidates.push(words[i]);
        }
    }
    candidates = shuffle(candidates);

    crosswordSize = 5;
    crosswordGrid = [];
    crosswordClues = [];
    crosswordPlacedWords = [];

    for (var r = 0; r < crosswordSize; r++) {
        crosswordGrid[r] = [];
        for (var cl = 0; cl < crosswordSize; cl++) {
            crosswordGrid[r][cl] = { answer: '', input: '', isCell: false, clueNum: 0 };
        }
    }

    // Place words in grid (simple placement: alternate horizontal and vertical)
    var placed = 0;
    var clueNum = 1;
    var attempts = 0;
    var used = {};

    while (placed < wordCount && attempts < candidates.length) {
        var word = candidates[attempts];
        attempts++;
        if (used[word.korean]) continue;
        var kChars = word.korean.split('');
        var success = false;

        if (placed % 2 === 0) {
            // Horizontal
            var maxStartCol = crosswordSize - kChars.length;
            if (maxStartCol < 0) continue;
            var row = Math.min(placed, crosswordSize - 1);
            var startCol = 0;
            if (placed > 0) startCol = Math.floor(Math.random() * (maxStartCol + 1));
            success = true;
            for (var k = 0; k < kChars.length; k++) {
                var cell = crosswordGrid[row][startCol + k];
                if (cell.isCell && cell.answer !== kChars[k]) { success = false; break; }
            }
            if (success) {
                for (var k2 = 0; k2 < kChars.length; k2++) {
                    crosswordGrid[row][startCol + k2].answer = kChars[k2];
                    crosswordGrid[row][startCol + k2].isCell = true;
                }
                crosswordGrid[row][startCol].clueNum = clueNum;
                crosswordClues.push({ num: clueNum, dir: 'Across', english: word.english, word: word });
                crosswordPlacedWords.push(word);
                used[word.korean] = true;
                clueNum++;
                placed++;
            }
        } else {
            // Vertical
            var maxStartRow = crosswordSize - kChars.length;
            if (maxStartRow < 0) continue;
            var col = Math.min(placed, crosswordSize - 1);
            var startRow = 0;
            if (placed > 1) startRow = Math.floor(Math.random() * (maxStartRow + 1));
            success = true;
            for (var k3 = 0; k3 < kChars.length; k3++) {
                var cell2 = crosswordGrid[startRow + k3][col];
                if (cell2.isCell && cell2.answer !== kChars[k3]) { success = false; break; }
            }
            if (success) {
                for (var k4 = 0; k4 < kChars.length; k4++) {
                    crosswordGrid[startRow + k4][col].answer = kChars[k4];
                    crosswordGrid[startRow + k4][col].isCell = true;
                }
                crosswordGrid[startRow][col].clueNum = clueNum;
                crosswordClues.push({ num: clueNum, dir: 'Down', english: word.english, word: word });
                crosswordPlacedWords.push(word);
                used[word.korean] = true;
                clueNum++;
                placed++;
            }
        }
    }

    if (placed === 0) {
        c.innerHTML = '<p style="text-align:center">Could not generate crossword. Try a different category.</p>';
        return;
    }

    renderCrosswordGame(c);
}

function renderCrosswordGame(c) {
    var h = '<h2 class="game-title">Korean Crossword</h2>';

    // Grid
    h += '<div style="display:grid;grid-template-columns:repeat(' + crosswordSize + ',1fr);gap:3px;max-width:300px;margin:0 auto 20px">';
    for (var r = 0; r < crosswordSize; r++) {
        for (var cl = 0; cl < crosswordSize; cl++) {
            var cell = crosswordGrid[r][cl];
            if (cell.isCell) {
                h += '<div style="position:relative;aspect-ratio:1;background:rgba(255,255,255,0.1);border-radius:6px;border:1px solid rgba(157,78,221,0.4)">';
                if (cell.clueNum > 0) {
                    h += '<span style="position:absolute;top:1px;left:3px;font-size:0.55rem;color:var(--neon-cyan)">' + cell.clueNum + '</span>';
                }
                h += '<input type="text" maxlength="1" id="cwIn' + r + '_' + cl + '" data-row="' + r + '" data-col="' + cl + '" ';
                h += 'style="width:100%;height:100%;background:transparent;border:none;color:#fff;text-align:center;font-size:1.3rem;font-weight:bold;outline:none;caret-color:var(--neon-pink)" ';
                h += 'autocomplete="off">';
                h += '</div>';
            } else {
                h += '<div style="aspect-ratio:1;background:rgba(0,0,0,0.3);border-radius:6px"></div>';
            }
        }
    }
    h += '</div>';

    // Clues
    h += '<div style="margin-bottom:20px">';
    h += '<h3 style="color:var(--neon-cyan);font-size:1rem;margin-bottom:8px">Clues</h3>';
    for (var i = 0; i < crosswordClues.length; i++) {
        var clue = crosswordClues[i];
        h += '<p style="color:rgba(255,255,255,0.8);font-size:0.95rem;margin-bottom:4px" id="cwClue' + i + '">';
        h += '<strong>' + clue.num + ' ' + clue.dir + ':</strong> ' + escapeHtml(clue.english) + '</p>';
    }
    h += '</div>';

    h += '<div style="display:flex;justify-content:center;gap:10px">';
    h += '<button class="game-btn" id="cwCheck">Check Answers</button>';
    h += '<button class="game-btn secondary" id="cwHint">Hint</button>';
    h += '</div>';
    c.innerHTML = h;

    // Auto-advance inputs
    var inputs = c.querySelectorAll('input[id^="cwIn"]');
    for (var j = 0; j < inputs.length; j++) {
        inputs[j].addEventListener('input', function(e) {
            var inp = e.target;
            if (inp.value.length === 1) {
                // Find next input
                var allInputs = c.querySelectorAll('input[id^="cwIn"]');
                for (var k = 0; k < allInputs.length; k++) {
                    if (allInputs[k] === inp && k + 1 < allInputs.length) {
                        allInputs[k + 1].focus();
                        break;
                    }
                }
            }
        });
    }

    document.getElementById('cwCheck').onclick = function() { crosswordCheck(c); };
    document.getElementById('cwHint').onclick = function() { crosswordHint(); };
}

function crosswordCheck(c) {
    var allCorrect = true;
    var correctCount = 0;
    var totalCells = 0;

    for (var r = 0; r < crosswordSize; r++) {
        for (var cl = 0; cl < crosswordSize; cl++) {
            var cell = crosswordGrid[r][cl];
            if (!cell.isCell) continue;
            totalCells++;
            var inp = document.getElementById('cwIn' + r + '_' + cl);
            if (!inp) continue;
            var val = inp.value.trim();
            if (val === cell.answer) {
                inp.style.color = '#00f5d4';
                inp.style.background = 'rgba(0,245,212,0.15)';
                correctCount++;
            } else {
                inp.style.color = '#ff4757';
                inp.style.background = 'rgba(255,71,87,0.15)';
                allCorrect = false;
            }
        }
    }

    if (allCorrect && totalCells > 0) {
        SoundEngine.correct();
        createConfetti(30);
        addXP(50);
        for (var w = 0; w < crosswordPlacedWords.length; w++) {
            collectWord(crosswordPlacedWords[w]);
        }
        showToast('Crossword complete! +50 XP');
    } else {
        SoundEngine.wrong();
        showToast(correctCount + ' / ' + totalCells + ' correct');
    }
}

function crosswordHint() {
    // Reveal one random unanswered cell
    var emptyCells = [];
    for (var r = 0; r < crosswordSize; r++) {
        for (var cl = 0; cl < crosswordSize; cl++) {
            var cell = crosswordGrid[r][cl];
            if (!cell.isCell) continue;
            var inp = document.getElementById('cwIn' + r + '_' + cl);
            if (inp && inp.value.trim() !== cell.answer) {
                emptyCells.push({ r: r, cl: cl, cell: cell, inp: inp });
            }
        }
    }
    if (emptyCells.length === 0) return;
    var pick = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    pick.inp.value = pick.cell.answer;
    pick.inp.style.color = 'var(--gold)';
    showToast('Hint revealed!');
}


// ============================================================
// 4. SPEED MATCH
// ============================================================

var speedMatchPairs = [];
var speedMatchSelected = null;
var speedMatchMatched = 0;
var speedMatchPenalty = 0;
var speedMatchStartTime = 0;
var speedMatchTimerInterval = null;
var speedMatchTotal = 10;

function showSpeedMatch(c) {
    var words = getWords();
    if (words.length < speedMatchTotal) {
        c.innerHTML = '<p style="text-align:center">Need at least ' + speedMatchTotal + ' words.</p>';
        return;
    }
    speedMatchPairs = shuffle(words).slice(0, speedMatchTotal);
    speedMatchSelected = null;
    speedMatchMatched = 0;
    speedMatchPenalty = 0;
    speedMatchStartTime = 0;
    if (speedMatchTimerInterval) { clearInterval(speedMatchTimerInterval); speedMatchTimerInterval = null; }
    gameState.gamesPlayed++;
    saveProgress();
    renderSpeedMatchStart(c);
}

function renderSpeedMatchStart(c) {
    var h = '<h2 class="game-title">Speed Match</h2>';
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<p style="font-size:5rem;margin-bottom:10px">&#9889;</p>';
    h += '<p style="color:rgba(255,255,255,0.8);font-size:1.1rem;margin-bottom:15px">';
    h += 'Match Korean words with their English meanings!<br>Click matching pairs as fast as you can.</p>';
    h += '<p style="color:rgba(255,255,255,0.6);font-size:0.9rem;margin-bottom:20px">';
    h += 'Wrong matches add <strong style="color:#ff4757">+3 seconds</strong> penalty!</p>';
    h += '<button class="game-btn" id="smStartBtn">Start!</button>';
    h += '</div>';
    c.innerHTML = h;
    document.getElementById('smStartBtn').onclick = function() {
        speedMatchStartTime = Date.now();
        speedMatchTimerInterval = setInterval(function() { speedMatchUpdateTimer(); }, 100);
        renderSpeedMatchGame(c);
    };
}

function renderSpeedMatchGame(c) {
    var leftItems = shuffle(speedMatchPairs.slice());
    var rightItems = shuffle(speedMatchPairs.slice());

    var h = '<h2 class="game-title">Speed Match</h2>';
    h += '<div style="text-align:center;margin-bottom:15px">';
    h += '<span class="speed-timer" id="smTimer" style="font-size:2.5rem">0.0s</span>';
    h += '<br><span style="color:rgba(255,255,255,0.5);font-size:0.85rem" id="smProgress">' + speedMatchMatched + ' / ' + speedMatchTotal + ' matched</span>';
    if (speedMatchPenalty > 0) {
        h += '<br><span style="color:#ff4757;font-size:0.8rem" id="smPenalty">+' + speedMatchPenalty + 's penalty</span>';
    }
    h += '</div>';

    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">';

    // Left column: Korean
    h += '<div>';
    h += '<p style="text-align:center;color:var(--neon-cyan);font-size:0.85rem;margin-bottom:8px;font-weight:bold">KOREAN</p>';
    for (var i = 0; i < leftItems.length; i++) {
        var w = leftItems[i];
        h += '<div class="quiz-option" id="smL' + i + '" data-korean="' + escapeHtml(w.korean) + '" data-side="left" ';
        h += 'style="padding:12px;font-size:1.1rem;margin-bottom:6px;transition:all 0.3s">';
        h += escapeHtml(w.korean);
        h += '</div>';
    }
    h += '</div>';

    // Right column: English
    h += '<div>';
    h += '<p style="text-align:center;color:var(--neon-pink);font-size:0.85rem;margin-bottom:8px;font-weight:bold">ENGLISH</p>';
    for (var j = 0; j < rightItems.length; j++) {
        var w2 = rightItems[j];
        h += '<div class="quiz-option" id="smR' + j + '" data-korean="' + escapeHtml(w2.korean) + '" data-side="right" ';
        h += 'style="padding:12px;font-size:1rem;margin-bottom:6px;transition:all 0.3s">';
        h += escapeHtml(w2.english);
        h += '</div>';
    }
    h += '</div>';
    h += '</div>';
    c.innerHTML = h;

    // Attach click events
    var allCards = c.querySelectorAll('[data-side]');
    for (var k = 0; k < allCards.length; k++) {
        allCards[k].addEventListener('click', function(e) {
            speedMatchHandleClick(e.currentTarget, c);
        });
    }
}

function speedMatchHandleClick(el, c) {
    if (el.style.opacity === '0.2') return; // Already matched

    var side = el.getAttribute('data-side');
    var korean = el.getAttribute('data-korean');

    if (!speedMatchSelected) {
        speedMatchSelected = { el: el, side: side, korean: korean };
        el.style.borderColor = 'var(--gold)';
        el.style.boxShadow = '0 0 15px rgba(255,215,0,0.4)';
        return;
    }

    // Second click
    if (speedMatchSelected.side === side) {
        // Same side: swap selection
        speedMatchSelected.el.style.borderColor = 'rgba(157,78,221,0.3)';
        speedMatchSelected.el.style.boxShadow = 'none';
        speedMatchSelected = { el: el, side: side, korean: korean };
        el.style.borderColor = 'var(--gold)';
        el.style.boxShadow = '0 0 15px rgba(255,215,0,0.4)';
        return;
    }

    // Different sides: check match
    if (speedMatchSelected.korean === korean) {
        // Correct match
        speedMatchSelected.el.style.background = 'linear-gradient(135deg,#00d4ff,#00f5d4)';
        speedMatchSelected.el.style.opacity = '0.2';
        speedMatchSelected.el.style.pointerEvents = 'none';
        el.style.background = 'linear-gradient(135deg,#00d4ff,#00f5d4)';
        el.style.opacity = '0.2';
        el.style.pointerEvents = 'none';
        speedMatchMatched++;
        addCombo();
        SoundEngine.correct();

        // Find the word object
        for (var i = 0; i < speedMatchPairs.length; i++) {
            if (speedMatchPairs[i].korean === korean) {
                collectWord(speedMatchPairs[i]);
                break;
            }
        }

        var prog = document.getElementById('smProgress');
        if (prog) prog.textContent = speedMatchMatched + ' / ' + speedMatchTotal + ' matched';

        if (speedMatchMatched >= speedMatchTotal) {
            speedMatchFinish(c);
        }
    } else {
        // Wrong match
        speedMatchPenalty += 3;
        resetCombo();
        SoundEngine.wrong();
        speedMatchSelected.el.style.animation = 'shake 0.4s';
        el.style.animation = 'shake 0.4s';
        var penEl = document.getElementById('smPenalty');
        if (!penEl) {
            var timerArea = document.getElementById('smTimer');
            if (timerArea && timerArea.parentNode) {
                var penSpan = document.createElement('br');
                timerArea.parentNode.appendChild(penSpan);
                var penSpan2 = document.createElement('span');
                penSpan2.id = 'smPenalty';
                penSpan2.style.cssText = 'color:#ff4757;font-size:0.8rem';
                penSpan2.textContent = '+' + speedMatchPenalty + 's penalty';
                timerArea.parentNode.appendChild(penSpan2);
            }
        } else {
            penEl.textContent = '+' + speedMatchPenalty + 's penalty';
        }
        setTimeout(function(el1, el2) {
            el1.style.animation = '';
            el2.style.animation = '';
        }, 400, speedMatchSelected.el, el);
    }

    speedMatchSelected.el.style.borderColor = 'rgba(157,78,221,0.3)';
    speedMatchSelected.el.style.boxShadow = 'none';
    speedMatchSelected = null;
}

function speedMatchUpdateTimer() {
    var elapsed = ((Date.now() - speedMatchStartTime) / 1000) + speedMatchPenalty;
    var timerEl = document.getElementById('smTimer');
    if (timerEl) timerEl.textContent = elapsed.toFixed(1) + 's';
}

function speedMatchFinish(c) {
    if (speedMatchTimerInterval) { clearInterval(speedMatchTimerInterval); speedMatchTimerInterval = null; }
    var finalTime = ((Date.now() - speedMatchStartTime) / 1000 + speedMatchPenalty).toFixed(1);
    createConfetti(40);
    addXP(Math.max(10, 60 - Math.floor(parseFloat(finalTime))));

    var h = '<h2 class="game-title">Speed Match Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<p style="font-size:4rem;margin-bottom:10px">&#127942;</p>';
    h += '<p style="font-size:2.5rem;font-weight:bold;background:linear-gradient(135deg,var(--neon-pink),var(--neon-cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:10px">' + finalTime + ' seconds</p>';
    if (speedMatchPenalty > 0) {
        h += '<p style="color:#ff4757;margin-bottom:10px">Includes ' + speedMatchPenalty + 's penalty</p>';
    }
    var rating = parseFloat(finalTime) < 15 ? 'Lightning Fast!' : parseFloat(finalTime) < 30 ? 'Great Speed!' : parseFloat(finalTime) < 45 ? 'Good Job!' : 'Keep Practicing!';
    h += '<p style="color:var(--gold);font-size:1.2rem;margin-bottom:25px">' + rating + '</p>';
    h += '<button class="game-btn" id="smRetry">Play Again</button>';
    h += '</div>';
    c.innerHTML = h;
    document.getElementById('smRetry').onclick = function() { showSpeedMatch(c); };
}


// ============================================================
// 5. WORD ROULETTE
// ============================================================

var rouletteWords = [];
var rouletteAngle = 0;
var rouletteSpinning = false;
var rouletteStrikes = 0;
var rouletteScore = 0;
var rouletteSliceCount = 8;
var rouletteSelectedIdx = -1;

function showWordRoulette(c) {
    var words = getWords();
    if (words.length < rouletteSliceCount) {
        c.innerHTML = '<p style="text-align:center">Need at least ' + rouletteSliceCount + ' words.</p>';
        return;
    }
    rouletteWords = shuffle(words).slice(0, rouletteSliceCount);
    rouletteAngle = 0;
    rouletteSpinning = false;
    rouletteStrikes = 0;
    rouletteScore = 0;
    rouletteSelectedIdx = -1;
    gameState.gamesPlayed++;
    saveProgress();
    renderWordRoulette(c);
}

function renderWordRoulette(c) {
    var h = '<h2 class="game-title">Word Roulette</h2>';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">';
    h += '<div id="wrStrikes" style="font-size:1.3rem">';
    for (var s = 0; s < 3; s++) {
        h += s < rouletteStrikes ? '&#10060; ' : '&#11093; ';
    }
    h += '</div>';
    h += '<span style="color:var(--gold);font-weight:bold;font-size:1.2rem" id="wrScore">Score: ' + rouletteScore + '</span>';
    h += '</div>';

    // Wheel
    h += '<div style="position:relative;width:260px;height:260px;margin:0 auto 20px">';
    // Pointer
    h += '<div style="position:absolute;top:-15px;left:50%;transform:translateX(-50%);z-index:10;font-size:1.8rem">&#9660;</div>';
    h += '<div id="wrWheel" style="width:260px;height:260px;border-radius:50%;position:relative;transition:transform 4s cubic-bezier(0.17,0.67,0.12,0.99);transform:rotate(' + rouletteAngle + 'deg);overflow:hidden;border:3px solid var(--neon-pink);box-shadow:0 0 30px rgba(255,45,149,0.4)">';

    // Create slices using CSS conic gradient
    var colors = ['#ff2d95', '#9d4edd', '#00d4ff', '#00f5d4', '#ffd700', '#ff6b35', '#7b2cbf', '#0099ff'];
    var sliceAngle = 360 / rouletteSliceCount;

    for (var i = 0; i < rouletteSliceCount; i++) {
        var angle = i * sliceAngle;
        var textAngle = angle + sliceAngle / 2;
        h += '<div style="position:absolute;width:100%;height:100%;top:0;left:0">';
        h += '<div style="position:absolute;top:50%;left:50%;transform:rotate(' + textAngle + 'deg) translateY(-85px);transform-origin:center center;';
        h += 'font-size:0.85rem;font-weight:bold;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,0.5)">';
        h += escapeHtml(rouletteWords[i].korean) + '</div></div>';
    }

    // Conic gradient background
    var gradientStr = '';
    for (var g = 0; g < rouletteSliceCount; g++) {
        var startPct = (g / rouletteSliceCount) * 100;
        var endPct = ((g + 1) / rouletteSliceCount) * 100;
        gradientStr += colors[g % colors.length] + ' ' + startPct + '% ' + endPct + '%';
        if (g < rouletteSliceCount - 1) gradientStr += ', ';
    }

    h += '</div>'; // End wheel
    h += '<style>#wrWheel { background: conic-gradient(' + gradientStr + '); }</style>';
    h += '</div>';

    // Spin button
    h += '<div style="text-align:center;margin-bottom:15px">';
    h += '<button class="game-btn" id="wrSpin" style="padding:15px 40px;font-size:1.2rem">' + (rouletteSpinning ? 'Spinning...' : 'SPIN!') + '</button>';
    h += '</div>';

    // Answer area
    h += '<div id="wrAnswer" style="text-align:center;min-height:80px"></div>';

    c.innerHTML = h;

    document.getElementById('wrSpin').onclick = function() { rouletteSpin(c); };
}

function rouletteSpin(c) {
    if (rouletteSpinning) return;
    rouletteSpinning = true;

    var extraSpins = 3 + Math.floor(Math.random() * 3); // 3-5 full spins
    var stopAngle = Math.floor(Math.random() * 360);
    var totalAngle = rouletteAngle + (extraSpins * 360) + stopAngle;

    var wheel = document.getElementById('wrWheel');
    var btn = document.getElementById('wrSpin');
    if (btn) btn.textContent = 'Spinning...';
    if (wheel) {
        wheel.style.transform = 'rotate(' + totalAngle + 'deg)';
    }

    // Determine which slice the pointer lands on
    var normalizedAngle = (360 - (totalAngle % 360)) % 360;
    var sliceAngle = 360 / rouletteSliceCount;
    rouletteSelectedIdx = Math.floor(normalizedAngle / sliceAngle) % rouletteSliceCount;
    rouletteAngle = totalAngle;

    setTimeout(function() {
        rouletteSpinning = false;
        if (btn) btn.textContent = 'SPIN!';
        rouletteShowChallenge(c);
    }, 4200);
}

function rouletteShowChallenge(c) {
    var word = rouletteWords[rouletteSelectedIdx];
    var tasks = ['meaning', 'category', 'speak'];
    var task = tasks[Math.floor(Math.random() * tasks.length)];
    var answerArea = document.getElementById('wrAnswer');
    if (!answerArea) return;

    var h = '';
    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;border:1px solid rgba(157,78,221,0.4)">';
    h += '<p style="font-size:1.5rem;margin-bottom:10px;color:var(--neon-cyan)">' + escapeHtml(word.korean) + '</p>';

    if (task === 'meaning') {
        h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:12px">What does this word mean in English?</p>';
        h += '<input type="text" class="speed-input" id="wrInput" placeholder="Type meaning..." autocomplete="off" style="margin-bottom:10px">';
        h += '<br><button class="game-btn" id="wrSubmit" style="margin-top:5px">Submit</button>';
    } else if (task === 'category') {
        h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:12px">Which category does this word belong to?</p>';
        var cats = [];
        for (var cat in wordDatabase) { cats.push(cat); }
        cats = shuffle(cats).slice(0, 4);
        // Ensure correct category is included
        var correctCat = '';
        for (var cat2 in wordDatabase) {
            for (var w = 0; w < wordDatabase[cat2].length; w++) {
                if (wordDatabase[cat2][w].korean === word.korean) { correctCat = cat2; break; }
            }
            if (correctCat) break;
        }
        if (correctCat && cats.indexOf(correctCat) === -1) { cats[0] = correctCat; }
        cats = shuffle(cats);
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
        for (var i = 0; i < cats.length; i++) {
            h += '<button class="quiz-option wrCatBtn" data-cat="' + escapeHtml(cats[i]) + '" style="padding:12px;font-size:0.9rem">' + escapeHtml(cats[i]) + '</button>';
        }
        h += '</div>';
    } else {
        h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:12px">Listen and repeat! Click to hear, then say the meaning.</p>';
        h += '<button class="game-btn secondary" id="wrListen" style="margin-bottom:12px;font-size:1.3rem">&#128266; Listen</button>';
        h += '<br><input type="text" class="speed-input" id="wrInput" placeholder="Type the English meaning..." autocomplete="off" style="margin-bottom:10px">';
        h += '<br><button class="game-btn" id="wrSubmit" style="margin-top:5px">Submit</button>';
    }
    h += '</div>';

    answerArea.innerHTML = h;

    if (task === 'meaning' || task === 'speak') {
        var submitBtn = document.getElementById('wrSubmit');
        var inputEl = document.getElementById('wrInput');
        if (inputEl) inputEl.focus();
        if (submitBtn) {
            submitBtn.onclick = function() {
                var val = inputEl ? inputEl.value.trim().toLowerCase() : '';
                if (val === word.english.toLowerCase()) {
                    rouletteCorrect(c, word);
                } else {
                    rouletteWrong(c, word);
                }
            };
        }
        if (inputEl) {
            inputEl.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    var val2 = inputEl.value.trim().toLowerCase();
                    if (val2 === word.english.toLowerCase()) {
                        rouletteCorrect(c, word);
                    } else {
                        rouletteWrong(c, word);
                    }
                }
            });
        }
        var listenBtn = document.getElementById('wrListen');
        if (listenBtn) {
            listenBtn.onclick = function() { speakKorean(word.korean); };
            speakKorean(word.korean);
        }
    } else if (task === 'category') {
        var catBtns = document.querySelectorAll('.wrCatBtn');
        for (var b = 0; b < catBtns.length; b++) {
            catBtns[b].addEventListener('click', function(e) {
                var chosen = e.currentTarget.getAttribute('data-cat');
                if (chosen === correctCat) {
                    rouletteCorrect(c, word);
                } else {
                    rouletteWrong(c, word);
                }
            });
        }
    }
}

function rouletteCorrect(c, word) {
    rouletteScore += 10;
    addXP(20);
    addCombo();
    collectWord(word);
    SoundEngine.correct();
    createConfetti(10);
    var scoreEl = document.getElementById('wrScore');
    if (scoreEl) scoreEl.textContent = 'Score: ' + rouletteScore;
    var answerArea = document.getElementById('wrAnswer');
    if (answerArea) {
        answerArea.innerHTML = '<p style="color:#00f5d4;font-size:1.3rem;text-align:center;padding:20px">Correct! ' + escapeHtml(word.korean) + ' = ' + escapeHtml(word.english) + '</p>';
    }
    setTimeout(function() {
        // Refresh words for variety
        var words = getWords();
        if (words.length >= rouletteSliceCount) {
            rouletteWords = shuffle(words).slice(0, rouletteSliceCount);
        }
        renderWordRoulette(c);
    }, 1500);
}

function rouletteWrong(c, word) {
    rouletteStrikes++;
    resetCombo();
    SoundEngine.wrong();
    var strikesEl = document.getElementById('wrStrikes');
    if (strikesEl) {
        var sh = '';
        for (var s = 0; s < 3; s++) {
            sh += s < rouletteStrikes ? '&#10060; ' : '&#11093; ';
        }
        strikesEl.innerHTML = sh;
    }
    var answerArea = document.getElementById('wrAnswer');
    if (answerArea) {
        answerArea.innerHTML = '<p style="color:#ff4757;font-size:1.1rem;text-align:center;padding:20px">Wrong! The answer was: <strong>' + escapeHtml(word.english) + '</strong></p>';
    }

    if (rouletteStrikes >= 3) {
        setTimeout(function() { rouletteGameOver(c); }, 1500);
    } else {
        setTimeout(function() { renderWordRoulette(c); }, 1500);
    }
}

function rouletteGameOver(c) {
    var h = '<h2 class="game-title">Roulette Over!</h2>';
    h += '<div style="text-align:center">';
    h += '<p style="font-size:4rem;margin-bottom:10px">&#127922;</p>';
    h += '<p style="font-size:2rem;font-weight:bold;color:var(--gold);margin-bottom:15px">Final Score: ' + rouletteScore + '</p>';
    h += '<p style="color:rgba(255,255,255,0.6);margin-bottom:25px">3 strikes and you\'re out!</p>';
    h += '<button class="game-btn" id="wrRetry">Play Again</button>';
    h += '</div>';
    c.innerHTML = h;
    document.getElementById('wrRetry').onclick = function() { showWordRoulette(c); };
}


// ============================================================
// 6. KOREAN BINGO
// ============================================================

var bingoCard = [];
var bingoMarked = [];
var bingoCallList = [];
var bingoCallIndex = 0;
var bingoCols = 4;
var bingoRows = 4;
var bingoWon = false;
var bingoCallTimer = null;

function showKoreanBingo(c) {
    var words = getWords();
    if (words.length < bingoCols * bingoRows) {
        c.innerHTML = '<p style="text-align:center">Need at least ' + (bingoCols * bingoRows) + ' words for Bingo.</p>';
        return;
    }
    bingoWon = false;
    bingoCallIndex = 0;
    if (bingoCallTimer) { clearInterval(bingoCallTimer); bingoCallTimer = null; }

    // Pick 16 words for the card
    var selected = shuffle(words).slice(0, bingoCols * bingoRows);
    bingoCard = [];
    bingoMarked = [];
    for (var i = 0; i < selected.length; i++) {
        bingoCard.push(selected[i]);
        bingoMarked.push(false);
    }

    // Call list: shuffled version of the same words (all will be called eventually)
    bingoCallList = shuffle(selected.slice());

    gameState.gamesPlayed++;
    saveProgress();
    renderBingoGame(c);
}

function renderBingoGame(c) {
    var h = '<h2 class="game-title">Korean Bingo</h2>';

    // Call area
    h += '<div style="text-align:center;margin-bottom:15px">';
    if (bingoCallIndex > 0 && bingoCallIndex <= bingoCallList.length) {
        var currentCall = bingoCallList[bingoCallIndex - 1];
        h += '<div style="background:linear-gradient(135deg,var(--neon-pink),var(--neon-purple));padding:15px 25px;border-radius:15px;display:inline-block;margin-bottom:10px">';
        h += '<p style="font-size:0.85rem;color:rgba(255,255,255,0.7)">Find this word:</p>';
        h += '<p style="font-size:1.5rem;font-weight:bold">' + escapeHtml(currentCall.english) + '</p>';
        if (currentCall.romanization) {
            h += '<p style="font-size:0.85rem;color:rgba(255,255,255,0.6)">(' + escapeHtml(currentCall.romanization) + ')</p>';
        }
        h += '</div>';
    } else if (bingoCallIndex === 0) {
        h += '<div style="background:var(--glass);padding:15px 25px;border-radius:15px;display:inline-block;margin-bottom:10px">';
        h += '<p style="font-size:1.1rem;color:rgba(255,255,255,0.8)">Press "Next Call" to start!</p>';
        h += '</div>';
    }
    h += '<br><span style="color:rgba(255,255,255,0.5);font-size:0.85rem">';
    h += 'Calls: ' + bingoCallIndex + ' / ' + bingoCallList.length + '</span>';
    h += '</div>';

    // Bingo card
    h += '<div id="bingoGrid" style="display:grid;grid-template-columns:repeat(' + bingoCols + ',1fr);gap:6px;max-width:360px;margin:0 auto 20px">';
    for (var i = 0; i < bingoCard.length; i++) {
        var w = bingoCard[i];
        var marked = bingoMarked[i];
        var bgStyle = marked
            ? 'background:linear-gradient(135deg,#00d4ff,#00f5d4);border-color:transparent;color:#000'
            : 'background:var(--glass);border:1px solid rgba(157,78,221,0.4);color:#fff';
        h += '<div class="bingoCell" data-idx="' + i + '" style="aspect-ratio:1;' + bgStyle + ';border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s;padding:5px;text-align:center">';
        h += '<span style="font-size:1.2rem;font-weight:bold">' + escapeHtml(w.korean) + '</span>';
        h += '<span style="font-size:0.6rem;opacity:0.7">' + escapeHtml(w.english.length > 12 ? w.english.substring(0, 10) + '..' : w.english) + '</span>';
        if (marked) {
            h += '<span style="font-size:0.7rem;margin-top:2px">&#10004;</span>';
        }
        h += '</div>';
    }
    h += '</div>';

    // Controls
    h += '<div style="display:flex;justify-content:center;gap:10px">';
    h += '<button class="game-btn" id="bingoCall">Next Call</button>';
    h += '<button class="game-btn secondary" id="bingoAuto">Auto Call</button>';
    h += '</div>';
    c.innerHTML = h;

    // Attach cell click events
    var cells = c.querySelectorAll('.bingoCell');
    for (var j = 0; j < cells.length; j++) {
        cells[j].addEventListener('click', function(e) {
            var idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
            bingoMarkCell(idx, c);
        });
    }

    document.getElementById('bingoCall').onclick = function() { bingoNextCall(c); };
    document.getElementById('bingoAuto').onclick = function() { bingoAutoCall(c); };
}

function bingoNextCall(c) {
    if (bingoWon || bingoCallIndex >= bingoCallList.length) return;
    bingoCallIndex++;
    var currentCall = bingoCallList[bingoCallIndex - 1];
    speakKorean(currentCall.korean);
    renderBingoGame(c);
}

function bingoAutoCall(c) {
    if (bingoCallTimer) { clearInterval(bingoCallTimer); bingoCallTimer = null; return; }
    bingoCallTimer = setInterval(function() {
        if (bingoWon || bingoCallIndex >= bingoCallList.length) {
            clearInterval(bingoCallTimer);
            bingoCallTimer = null;
            return;
        }
        bingoNextCall(c);
    }, 3000);
}

function bingoMarkCell(idx, c) {
    if (bingoWon || bingoMarked[idx]) return;
    if (bingoCallIndex === 0) return;

    // Check if the clicked word matches the current call
    var currentCall = bingoCallList[bingoCallIndex - 1];
    if (bingoCard[idx].korean === currentCall.korean) {
        bingoMarked[idx] = true;
        SoundEngine.correct();
        addCombo();
        collectWord(bingoCard[idx]);
        addXP(10);
        renderBingoGame(c);
        bingoCheckWin(c);
    } else {
        // Also allow marking previously called words
        var wasCalled = false;
        for (var i = 0; i < bingoCallIndex; i++) {
            if (bingoCallList[i].korean === bingoCard[idx].korean) {
                wasCalled = true;
                break;
            }
        }
        if (wasCalled) {
            bingoMarked[idx] = true;
            SoundEngine.correct();
            collectWord(bingoCard[idx]);
            renderBingoGame(c);
            bingoCheckWin(c);
        } else {
            SoundEngine.wrong();
            resetCombo();
            showToast('That word hasn\'t been called yet!');
        }
    }
}

function bingoCheckWin(c) {
    // Check rows
    for (var r = 0; r < bingoRows; r++) {
        var rowWin = true;
        for (var cl = 0; cl < bingoCols; cl++) {
            if (!bingoMarked[r * bingoCols + cl]) { rowWin = false; break; }
        }
        if (rowWin) { bingoVictory(c); return; }
    }

    // Check columns
    for (var cl2 = 0; cl2 < bingoCols; cl2++) {
        var colWin = true;
        for (var r2 = 0; r2 < bingoRows; r2++) {
            if (!bingoMarked[r2 * bingoCols + cl2]) { colWin = false; break; }
        }
        if (colWin) { bingoVictory(c); return; }
    }

    // Check diagonals
    var diag1 = true;
    var diag2 = true;
    for (var d = 0; d < Math.min(bingoRows, bingoCols); d++) {
        if (!bingoMarked[d * bingoCols + d]) diag1 = false;
        if (!bingoMarked[d * bingoCols + (bingoCols - 1 - d)]) diag2 = false;
    }
    if (diag1 || diag2) { bingoVictory(c); return; }
}

function bingoVictory(c) {
    bingoWon = true;
    if (bingoCallTimer) { clearInterval(bingoCallTimer); bingoCallTimer = null; }
    createConfetti(60);
    addXP(80);

    setTimeout(function() {
        var h = '<h2 class="game-title">BINGO!</h2>';
        h += '<div style="text-align:center">';
        h += '<p style="font-size:5rem;margin-bottom:10px">&#127881;</p>';
        h += '<p style="font-size:2.5rem;font-weight:bold;background:linear-gradient(135deg,var(--gold),#ff8c00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:10px">You got BINGO!</p>';
        h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:5px">Completed in ' + bingoCallIndex + ' calls</p>';
        h += '<p style="color:var(--gold);margin-bottom:25px">+80 XP earned!</p>';
        h += '<button class="game-btn" id="bingoRetry">Play Again</button>';
        h += '</div>';
        c.innerHTML = h;
        document.getElementById('bingoRetry').onclick = function() { showKoreanBingo(c); };
    }, 1000);
}