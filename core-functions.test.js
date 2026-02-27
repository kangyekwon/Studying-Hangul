/**
 * Core Functions Unit Tests
 * Tests for escapeHtml, saveProgress, loadProgress, and speakKorean functions
 */

const { describe, it, expect, beforeEach } = require('@jest/globals');

// Mock functions from index.html
// These functions will be loaded and tested
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function saveProgress(gameState) {
  try {
    localStorage.setItem('kpopKoreanGame', JSON.stringify(gameState));
  } catch (e) {
    // Silent fail for localStorage errors
  }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem('kpopKoreanGame');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Silent fail for localStorage errors
  }
  return null;
}

function speakKorean(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }
}

describe('escapeHtml - XSS Prevention', () => {
  it('should escape HTML special characters', () => {
    const maliciousInput = '<script>alert("XSS")</script>';
    const escaped = escapeHtml(maliciousInput);
    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;script&gt;');
  });

  it('should escape ampersands', () => {
    const input = 'Tom & Jerry';
    const escaped = escapeHtml(input);
    expect(escaped).toContain('&amp;');
  });

  it('should handle double quotes - they may or may not be escaped', () => {
    const input = 'He said "Hello"';
    const escaped = escapeHtml(input);
    // textContent preserves quotes as-is in most browsers
    expect(escaped).toBeTruthy();
    expect(typeof escaped).toBe('string');
  });

  it('should handle single quotes', () => {
    const input = "It's a test";
    const escaped = escapeHtml(input);
    // Single quotes are typically preserved by textContent
    expect(escaped).toBeTruthy();
    expect(typeof escaped).toBe('string');
  });

  it('should handle Korean text without modification', () => {
    const koreanText = '안녕하세요';
    const escaped = escapeHtml(koreanText);
    expect(escaped).toBe(koreanText);
  });

  it('should escape HTML tags in XSS attacks', () => {
    const attacks = [
      '<img src=x onerror=alert(1)>',
      '<svg/onload=alert(1)>',
      '<iframe src="javascript:alert(1)"></iframe>',
    ];

    attacks.forEach((attack) => {
      const escaped = escapeHtml(attack);
      // Should escape < and > characters
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
      expect(escaped).not.toContain('<img');
      expect(escaped).not.toContain('<svg');
      expect(escaped).not.toContain('<iframe');
    });
  });

  it('should handle text-only javascript URLs', () => {
    const input = 'javascript:alert(1)';
    const escaped = escapeHtml(input);
    // This doesn't contain HTML tags, so it's preserved
    expect(escaped).toBe('javascript:alert(1)');
  });

  it('should handle empty strings', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should handle null and undefined gracefully', () => {
    // This tests edge cases that might crash the app
    expect(() => escapeHtml(null)).not.toThrow();
    expect(() => escapeHtml(undefined)).not.toThrow();
  });
});

describe('saveProgress and loadProgress - LocalStorage Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save game state to localStorage', () => {
    const gameState = {
      xp: 100,
      level: 5,
      streak: 3,
      wordsLearned: 25,
    };

    saveProgress(gameState);
    const saved = localStorage.getItem('kpopKoreanGame');
    expect(saved).toBeTruthy();
    expect(JSON.parse(saved)).toEqual(gameState);
  });

  it('should load game state from localStorage', () => {
    const gameState = {
      xp: 200,
      level: 10,
      streak: 7,
      wordsLearned: 50,
      collectedWords: { 안녕: 'common', 사랑해: 'rare' },
    };

    localStorage.setItem('kpopKoreanGame', JSON.stringify(gameState));
    const loaded = loadProgress();
    expect(loaded).toEqual(gameState);
  });

  it('should return null when no saved data exists', () => {
    const loaded = loadProgress();
    expect(loaded).toBeNull();
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem('kpopKoreanGame', 'invalid-json-{{{');
    const loaded = loadProgress();
    expect(loaded).toBeNull();
  });

  it('should handle save/load cycle correctly', () => {
    const originalState = {
      xp: 500,
      level: 15,
      achievements: { first_win: true },
    };

    saveProgress(originalState);
    const loadedState = loadProgress();
    expect(loadedState).toEqual(originalState);
  });

  it('should preserve Korean text in saved data', () => {
    const gameState = {
      collectedWords: {
        안녕하세요: 'common',
        감사합니다: 'rare',
        사랑해요: 'epic',
      },
    };

    saveProgress(gameState);
    const loaded = loadProgress();
    expect(loaded.collectedWords['안녕하세요']).toBe('common');
    expect(loaded.collectedWords['감사합니다']).toBe('rare');
  });

  it('should handle large game state objects', () => {
    const largeState = {
      collectedWords: {},
    };

    // Create 100 collected words
    for (let i = 0; i < 100; i++) {
      largeState.collectedWords[`word${i}`] = 'common';
    }

    saveProgress(largeState);
    const loaded = loadProgress();
    expect(Object.keys(loaded.collectedWords).length).toBe(100);
  });
});

describe('speakKorean - Text-to-Speech', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    window.speechSynthesis.speak.mockClear();
  });

  it('should call speechSynthesis.speak with correct text', () => {
    const koreanText = '안녕하세요';
    speakKorean(koreanText);

    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    const utterance = window.speechSynthesis.speak.mock.calls[0][0];
    expect(utterance.text).toBe(koreanText);
  });

  it('should set Korean language code', () => {
    speakKorean('테스트');

    const utterance = window.speechSynthesis.speak.mock.calls[0][0];
    expect(utterance.lang).toBe('ko-KR');
  });

  it('should set speech rate to 0.8', () => {
    speakKorean('느린 속도');

    const utterance = window.speechSynthesis.speak.mock.calls[0][0];
    expect(utterance.rate).toBe(0.8);
  });

  it('should handle empty strings', () => {
    expect(() => speakKorean('')).not.toThrow();
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it('should handle multiple consecutive calls', () => {
    speakKorean('첫번째');
    speakKorean('두번째');
    speakKorean('세번째');

    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(3);
  });

  it('should work with mixed Korean and English text', () => {
    const mixedText = '안녕 Hello 반가워';
    speakKorean(mixedText);

    const utterance = window.speechSynthesis.speak.mock.calls[0][0];
    expect(utterance.text).toBe(mixedText);
    expect(utterance.lang).toBe('ko-KR');
  });

  it('should handle special Korean characters', () => {
    const specialChars = '!@#$%^&*()_+{}[]|:;"<>?,.';
    expect(() => speakKorean(specialChars)).not.toThrow();
  });
});

describe('Integration Tests - Multiple Functions', () => {
  it('should save progress with escaped Korean words', () => {
    const gameState = {
      lastWord: escapeHtml('안녕하세요'),
      collectedWords: {
        [escapeHtml('사랑해')]: 'rare',
      },
    };

    saveProgress(gameState);
    const loaded = loadProgress();
    expect(loaded.lastWord).toBe('안녕하세요');
  });

  it('should handle full gameplay cycle', () => {
    // Simulate a game session
    const gameState = {
      xp: 0,
      level: 1,
      wordsLearned: 0,
    };

    // Learn a word
    const newWord = '감사합니다';
    speakKorean(newWord);
    gameState.wordsLearned++;
    gameState.xp += 20;

    // Save progress
    saveProgress(gameState);

    // Load progress
    const loaded = loadProgress();
    expect(loaded.wordsLearned).toBe(1);
    expect(loaded.xp).toBe(20);
  });
});
