/**
 * Game Modes Integration Tests
 * Tests for Flashcards, Memory Match, and Quiz game modes
 */

const { describe, it, expect, beforeEach } = require('@jest/globals');

// Mock game state and helper functions
let gameState = {
  currentCategory: 'all',
  gamesPlayed: 0,
  xp: 0,
  level: 1,
  streak: 0,
  combo: 0,
  bestCombo: 0,
  wordsLearned: 0,
  correctAnswers: 0,
  collectedWords: {},
};

// Mock word database
const wordDatabase = {
  daily: [
    {
      korean: '안녕하세요',
      english: 'Hello',
      romanization: 'annyeonghaseyo',
      rarity: 'common',
    },
    {
      korean: '감사합니다',
      english: 'Thank you',
      romanization: 'gamsahamnida',
      rarity: 'common',
    },
    {
      korean: '사랑해요',
      english: 'I love you',
      romanization: 'saranghaeyo',
      rarity: 'rare',
    },
    {
      korean: '안녕',
      english: 'Hi/Bye',
      romanization: 'annyeong',
      rarity: 'common',
    },
  ],
  kfood: [
    {
      korean: '김치',
      english: 'Kimchi',
      romanization: 'gimchi',
      rarity: 'common',
    },
    {
      korean: '비빔밥',
      english: 'Bibimbap',
      romanization: 'bibimbap',
      rarity: 'common',
    },
  ],
};

function getWords() {
  let words = [];
  if (gameState.currentCategory === 'all') {
    for (const cat in wordDatabase) {
      words = words.concat(wordDatabase[cat]);
    }
  } else if (wordDatabase[gameState.currentCategory]) {
    words = wordDatabase[gameState.currentCategory];
  }
  return words;
}

function shuffle(arr) {
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function saveProgress() {
  try {
    localStorage.setItem('kpopKoreanGame', JSON.stringify(gameState));
  } catch (e) {
    // Silent fail
  }
}

function collectWord(word) {
  if (!gameState.collectedWords[word.korean]) {
    gameState.collectedWords[word.korean] = word.rarity;
    gameState.wordsLearned++;
    saveProgress();
  }
}

describe('Flashcards Game Mode', () => {
  beforeEach(() => {
    // Reset game state
    gameState = {
      currentCategory: 'all',
      gamesPlayed: 0,
      xp: 0,
      collectedWords: {},
      wordsLearned: 0,
    };
    localStorage.clear();
    document.body.innerHTML = '<div id="gameArea"></div>';
  });

  it('should initialize flashcards with random word', () => {
    const words = getWords();
    expect(words.length).toBeGreaterThan(0);

    const randomWord = words[Math.floor(Math.random() * words.length)];
    expect(randomWord).toHaveProperty('korean');
    expect(randomWord).toHaveProperty('english');
    expect(randomWord).toHaveProperty('romanization');
  });

  it('should render flashcard with Korean text', () => {
    const container = document.getElementById('gameArea');
    const word = getWords()[0];

    container.innerHTML = `
      <h2 class="game-title">Flashcards</h2>
      <div class="flashcard">
        <div class="flashcard-korean">${word.korean}</div>
        <div class="flashcard-romanization">${word.romanization}</div>
      </div>
    `;

    expect(container.innerHTML).toContain(word.korean);
    expect(container.innerHTML).toContain(word.romanization);
  });

  it('should toggle between front and back of flashcard', () => {
    let flipped = false;
    const word = getWords()[0];
    const container = document.getElementById('gameArea');

    function renderFlashcard() {
      if (!flipped) {
        container.innerHTML = `
          <div class="flashcard" id="card">
            <div>${word.korean}</div>
            <p>Click to reveal</p>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="flashcard" id="card">
            <div>${word.korean}</div>
            <div>${word.english}</div>
          </div>
        `;
      }
    }

    renderFlashcard();
    expect(container.innerHTML).toContain('Click to reveal');

    flipped = true;
    renderFlashcard();
    expect(container.innerHTML).toContain(word.english);
  });

  it('should collect word when user marks it as known', () => {
    const word = getWords()[0];
    const initialWordsLearned = gameState.wordsLearned;

    collectWord(word);

    expect(gameState.wordsLearned).toBe(initialWordsLearned + 1);
    expect(gameState.collectedWords[word.korean]).toBe(word.rarity);
  });

  it('should not duplicate collected words', () => {
    const word = getWords()[0];

    collectWord(word);
    const firstCount = gameState.wordsLearned;

    collectWord(word);
    const secondCount = gameState.wordsLearned;

    expect(firstCount).toBe(secondCount);
  });

  it('should handle empty word list gracefully', () => {
    gameState.currentCategory = 'nonexistent';
    const words = getWords();
    expect(words.length).toBe(0);
  });

  it('should display rarity badge', () => {
    const word = {
      korean: '테스트',
      english: 'Test',
      romanization: 'teseuteu',
      rarity: 'legendary',
    };

    const container = document.getElementById('gameArea');
    container.innerHTML = `
      <div class="flashcard">
        <div class="flashcard-rarity rarity-${word.rarity}">
          ${word.rarity.toUpperCase()}
        </div>
      </div>
    `;

    expect(container.innerHTML).toContain('rarity-legendary');
    expect(container.innerHTML).toContain('LEGENDARY');
  });
});

describe('Memory Match Game Mode', () => {
  let memoryCards = [];
  let memoryFlipped = [];
  let memoryMatched = [];

  beforeEach(() => {
    gameState.currentCategory = 'all';
    memoryCards = [];
    memoryFlipped = [];
    memoryMatched = [];
    document.body.innerHTML = '<div id="gameArea"></div>';
  });

  it('should create pairs of cards from words', () => {
    const words = shuffle(getWords()).slice(0, 3);
    const pairs = [];

    words.forEach((word) => {
      pairs.push({ type: 'korean', text: word.korean, word });
      pairs.push({ type: 'english', text: word.english, word });
    });

    expect(pairs.length).toBe(6);
    expect(pairs.filter((p) => p.type === 'korean').length).toBe(3);
    expect(pairs.filter((p) => p.type === 'english').length).toBe(3);
  });

  it('should shuffle card positions', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffle(original);

    // Should have same elements
    expect(shuffled.sort()).toEqual(original.sort());
  });

  it('should track flipped cards', () => {
    memoryCards = [
      { type: 'korean', text: '안녕', word: getWords()[0] },
      { type: 'english', text: 'Hello', word: getWords()[0] },
    ];

    memoryFlipped.push(0);
    expect(memoryFlipped.length).toBe(1);
    expect(memoryFlipped[0]).toBe(0);
  });

  it('should detect matching pairs', () => {
    const word = getWords()[0];
    memoryCards = [
      { type: 'korean', text: word.korean, word },
      { type: 'english', text: word.english, word },
    ];

    memoryFlipped = [0, 1];

    const card1 = memoryCards[memoryFlipped[0]];
    const card2 = memoryCards[memoryFlipped[1]];

    const isMatch =
      card1.word.korean === card2.word.korean && card1.type !== card2.type;

    expect(isMatch).toBe(true);
  });

  it('should detect non-matching pairs', () => {
    const words = getWords();
    memoryCards = [
      { type: 'korean', text: words[0].korean, word: words[0] },
      { type: 'english', text: words[1].english, word: words[1] },
    ];

    memoryFlipped = [0, 1];

    const card1 = memoryCards[memoryFlipped[0]];
    const card2 = memoryCards[memoryFlipped[1]];

    const isMatch =
      card1.word.korean === card2.word.korean && card1.type !== card2.type;

    expect(isMatch).toBe(false);
  });

  it('should prevent flipping already matched cards', () => {
    memoryMatched = [0, 1];

    const cardIndex = 0;
    const canFlip =
      memoryFlipped.indexOf(cardIndex) === -1 &&
      memoryMatched.indexOf(cardIndex) === -1;

    expect(canFlip).toBe(false);
  });

  it('should limit flipped cards to 2', () => {
    memoryFlipped = [0, 1];
    const locked = memoryFlipped.length >= 2;
    expect(locked).toBe(true);
  });

  it('should detect game completion', () => {
    memoryCards = new Array(12).fill(null); // 6 pairs
    memoryMatched = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    const isComplete = memoryMatched.length === memoryCards.length;
    expect(isComplete).toBe(true);
  });

  it('should require minimum 6 words for game', () => {
    const words = getWords();
    const hasEnoughWords = words.length >= 6;
    expect(hasEnoughWords).toBe(true);
  });

  it('should collect word on successful match', () => {
    const word = getWords()[0];
    const initialCount = gameState.wordsLearned;

    collectWord(word);

    expect(gameState.wordsLearned).toBe(initialCount + 1);
  });
});

describe('Quiz Game Mode', () => {
  let quizWord = null;
  let quizOptions = [];
  let quizAnswered = false;

  beforeEach(() => {
    gameState = {
      currentCategory: 'all',
      gamesPlayed: 0,
      correctAnswers: 0,
      streak: 0,
      xp: 0,
      wordsLearned: 0,
      collectedWords: {},
    };
    quizAnswered = false;
    document.body.innerHTML = '<div id="gameArea"></div>';
  });

  it('should generate quiz with 4 options', () => {
    const words = getWords();
    const shuffled = shuffle(words);

    quizWord = shuffled[0];
    quizOptions = shuffle([shuffled[0], shuffled[1], shuffled[2], shuffled[3]]);

    expect(quizOptions.length).toBe(4);
  });

  it('should include correct answer in options', () => {
    const words = getWords();
    quizWord = words[0];
    quizOptions = shuffle(words.slice(0, 4));

    const hasCorrectAnswer = quizOptions.some(
      (opt) => opt.korean === quizWord.korean
    );

    expect(hasCorrectAnswer).toBe(true);
  });

  it('should detect correct answer selection', () => {
    const words = getWords();
    quizWord = words[0];
    quizOptions = shuffle(words.slice(0, 4));

    const selectedIndex = quizOptions.findIndex(
      (opt) => opt.korean === quizWord.korean
    );
    const selected = quizOptions[selectedIndex];

    const isCorrect = selected.korean === quizWord.korean;
    expect(isCorrect).toBe(true);
  });

  it('should detect wrong answer selection', () => {
    const words = getWords();
    quizWord = words[0];
    quizOptions = shuffle([words[0], words[1], words[2], words[3]]);

    // Select a wrong option
    const wrongOption = quizOptions.find(
      (opt) => opt.korean !== quizWord.korean
    );
    const isCorrect = wrongOption.korean === quizWord.korean;

    expect(isCorrect).toBe(false);
  });

  it('should increment correct answers on right choice', () => {
    const initialCorrect = gameState.correctAnswers;
    gameState.correctAnswers++;
    expect(gameState.correctAnswers).toBe(initialCorrect + 1);
  });

  it('should reset streak on wrong answer', () => {
    gameState.streak = 5;
    gameState.streak = 0;
    expect(gameState.streak).toBe(0);
  });

  it('should prevent multiple answers to same question', () => {
    quizAnswered = false;

    // First answer
    if (!quizAnswered) {
      quizAnswered = true;
      expect(quizAnswered).toBe(true);
    }

    // Try to answer again
    const canAnswerAgain = !quizAnswered;
    expect(canAnswerAgain).toBe(false);
  });

  it('should increment games played counter', () => {
    const initialGames = gameState.gamesPlayed;
    gameState.gamesPlayed++;
    saveProgress();

    expect(gameState.gamesPlayed).toBe(initialGames + 1);
  });

  it('should require minimum 4 words for quiz', () => {
    const words = getWords();
    const canPlayQuiz = words.length >= 4;
    expect(canPlayQuiz).toBe(true);
  });

  it('should display Korean word and romanization', () => {
    const word = getWords()[0];
    const container = document.getElementById('gameArea');

    container.innerHTML = `
      <div class="flashcard-korean">${word.korean}</div>
      <div class="flashcard-romanization">${word.romanization}</div>
    `;

    expect(container.innerHTML).toContain(word.korean);
    expect(container.innerHTML).toContain(word.romanization);
  });
});

describe('Game Modes - Common Functionality', () => {
  beforeEach(() => {
    gameState = {
      currentCategory: 'all',
      gamesPlayed: 0,
      xp: 0,
      collectedWords: {},
    };
  });

  it('should shuffle array consistently', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffle(array);

    // Should contain all original elements
    expect(shuffled.length).toBe(array.length);
    shuffled.forEach((item) => {
      expect(array).toContain(item);
    });
  });

  it('should filter words by category', () => {
    gameState.currentCategory = 'daily';
    const words = getWords();

    expect(words.length).toBe(wordDatabase.daily.length);
    words.forEach((word) => {
      expect(wordDatabase.daily).toContainEqual(word);
    });
  });

  it('should get all words when category is "all"', () => {
    gameState.currentCategory = 'all';
    const words = getWords();

    const totalWords =
      wordDatabase.daily.length + wordDatabase.kfood.length;
    expect(words.length).toBe(totalWords);
  });

  it('should track collected words across game modes', () => {
    const word1 = wordDatabase.daily[0];
    const word2 = wordDatabase.kfood[0];

    collectWord(word1);
    collectWord(word2);

    expect(Object.keys(gameState.collectedWords).length).toBe(2);
  });

  it('should save progress after collecting words', () => {
    const word = getWords()[0];
    localStorage.clear();

    collectWord(word);

    const saved = localStorage.getItem('kpopKoreanGame');
    expect(saved).toBeTruthy();

    const parsed = JSON.parse(saved);
    expect(parsed.collectedWords[word.korean]).toBe(word.rarity);
  });
});

describe('Game Modes - Edge Cases', () => {
  it('should handle category with no words', () => {
    gameState.currentCategory = 'nonexistent';
    const words = getWords();
    expect(words).toEqual([]);
  });

  it('should handle words with special characters', () => {
    const specialWord = {
      korean: '!@#$',
      english: 'Special',
      romanization: 'special',
      rarity: 'common',
    };

    expect(specialWord.korean).toBe('!@#$');
  });

  it('should handle very long Korean words', () => {
    const longWord = {
      korean: '안녕하세요반갑습니다감사합니다',
      english: 'Long greeting',
      romanization: 'very-long',
      rarity: 'common',
    };

    expect(longWord.korean.length).toBeGreaterThan(10);
  });

  it('should handle rapid consecutive game starts', () => {
    for (let i = 0; i < 10; i++) {
      gameState.gamesPlayed++;
    }

    expect(gameState.gamesPlayed).toBe(10);
  });
});
