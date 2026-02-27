/**
 * Logger Utility Tests
 * Tests for all logging levels and functionality
 */

const { describe, it, expect, beforeEach } = require('@jest/globals');

// Load the logger module
const logger = require('./logger.js');

describe('Logger - Basic Functionality', () => {
  beforeEach(() => {
    // Clear console mocks
    console.log.mockClear();
    console.warn.mockClear();
    console.error.mockClear();
  });

  it('should have debug method', () => {
    expect(logger.debug).toBeDefined();
    expect(typeof logger.debug).toBe('function');
  });

  it('should have info method', () => {
    expect(logger.info).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('should have warn method', () => {
    expect(logger.warn).toBeDefined();
    expect(typeof logger.warn).toBe('function');
  });

  it('should have error method', () => {
    expect(logger.error).toBeDefined();
    expect(typeof logger.error).toBe('function');
  });

  it('should have gameEvent method', () => {
    expect(logger.gameEvent).toBeDefined();
    expect(typeof logger.gameEvent).toBe('function');
  });

  it('should have performance method', () => {
    expect(logger.performance).toBeDefined();
    expect(typeof logger.performance).toBe('function');
  });

  it('should have userAction method', () => {
    expect(logger.userAction).toBeDefined();
    expect(typeof logger.userAction).toBe('function');
  });
});

describe('Logger - Message Logging', () => {
  beforeEach(() => {
    console.log.mockClear();
    console.warn.mockClear();
    console.error.mockClear();
  });

  it('should call console methods when logging', () => {
    logger.info('Test message');
    // Logger will call console.log for info level
    expect(console.log).toHaveBeenCalled();
  });

  it('should log warning messages', () => {
    logger.warn('Warning message');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    logger.error('Error message', new Error('Test error'));
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle messages without data', () => {
    expect(() => logger.info('Simple message')).not.toThrow();
    expect(console.log).toHaveBeenCalled();
  });

  it('should handle data objects', () => {
    const testData = { userId: 123, action: 'click' };
    expect(() => logger.info('User action', testData)).not.toThrow();
  });

  it('should handle null data gracefully', () => {
    expect(() => logger.info('Null data', null)).not.toThrow();
  });

  it('should handle undefined data gracefully', () => {
    expect(() => logger.info('Undefined data', undefined)).not.toThrow();
  });
});

describe('Logger - Game Events', () => {
  beforeEach(() => {
    console.log.mockClear();
  });

  it('should log game events', () => {
    logger.gameEvent('level_up', { level: 5, xp: 500 });
    expect(console.log).toHaveBeenCalled();
  });

  it('should handle game events without data', () => {
    expect(() => logger.gameEvent('game_start')).not.toThrow();
  });

  it('should log multiple game events', () => {
    logger.gameEvent('word_learned', { word: '안녕' });
    logger.gameEvent('quiz_completed', { score: 80 });
    logger.gameEvent('achievement_unlocked', { id: 'first_win' });

    expect(console.log).toHaveBeenCalled();
    expect(console.log.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  it('should accept Korean text in game events', () => {
    expect(() =>
      logger.gameEvent('word_learned', {
        korean: '감사합니다',
        english: 'Thank you',
      })
    ).not.toThrow();
  });
});

describe('Logger - Performance Metrics', () => {
  beforeEach(() => {
    console.log.mockClear();
  });

  it('should log performance metrics', () => {
    expect(() => logger.performance('page_load', 1234, 'ms')).not.toThrow();
  });

  it('should handle different units', () => {
    expect(() => logger.performance('api_call', 500, 'ms')).not.toThrow();
    expect(() => logger.performance('file_size', 2.5, 'MB')).not.toThrow();
    expect(() => logger.performance('fps', 60, 'fps')).not.toThrow();
  });

  it('should handle missing unit parameter', () => {
    expect(() => logger.performance('metric', 100)).not.toThrow();
  });

  it('should log at least once for performance metrics', () => {
    logger.performance('test_metric', 123);
    expect(console.log).toHaveBeenCalled();
  });
});

describe('Logger - User Actions', () => {
  beforeEach(() => {
    console.log.mockClear();
  });

  it('should log user actions', () => {
    logger.userAction('button_click', { buttonId: 'startGame' });
    expect(console.log).toHaveBeenCalled();
  });

  it('should handle actions without details', () => {
    expect(() => logger.userAction('page_view')).not.toThrow();
  });

  it('should log navigation actions', () => {
    expect(() =>
      logger.userAction('navigate', { from: 'home', to: 'quiz' })
    ).not.toThrow();
  });

  it('should log user interactions', () => {
    logger.userAction('word_clicked', { word: '안녕하세요' });
    expect(console.log).toHaveBeenCalled();
  });
});

describe('Logger - Error Handling', () => {
  beforeEach(() => {
    console.error.mockClear();
  });

  it('should log Error objects', () => {
    const error = new Error('Test error');
    logger.error('Something went wrong', error);
    expect(console.error).toHaveBeenCalled();
  });

  it('should log errors with context', () => {
    const context = {
      userId: 123,
      action: 'save_progress',
      timestamp: Date.now(),
    };
    logger.error('Save failed', new Error('Network error'), context);
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle non-Error objects', () => {
    expect(() =>
      logger.error('Custom error', 'Error string')
    ).not.toThrow();
  });

  it('should handle errors without context', () => {
    expect(() => logger.error('Simple error')).not.toThrow();
  });

  it('should log errors about Korean input', () => {
    expect(() =>
      logger.error('Invalid Korean input', new Error('Parse error'), {
        input: '테스트',
      })
    ).not.toThrow();
  });
});

describe('Logger - Korean Text Support', () => {
  beforeEach(() => {
    console.log.mockClear();
    console.error.mockClear();
  });

  it('should log Korean text in messages', () => {
    expect(() =>
      logger.info('사용자가 게임을 시작했습니다')
    ).not.toThrow();
  });

  it('should log Korean text in data objects', () => {
    expect(() =>
      logger.info('Word learned', {
        korean: '안녕하세요',
        english: 'Hello',
        romanization: 'annyeonghaseyo',
      })
    ).not.toThrow();
  });

  it('should handle mixed Korean and English', () => {
    expect(() =>
      logger.gameEvent('quiz_answered', {
        question: '안녕하세요',
        answer: 'Hello',
        correct: true,
      })
    ).not.toThrow();
  });

  it('should handle various Korean characters', () => {
    const koreanWords = [
      '한글',
      '감사합니다',
      '사랑해요',
      '반갑습니다',
      '안녕히가세요',
    ];

    koreanWords.forEach((word) => {
      expect(() => logger.info(`Testing: ${word}`)).not.toThrow();
    });
  });
});

describe('Logger - Edge Cases', () => {
  beforeEach(() => {
    console.log.mockClear();
    console.warn.mockClear();
    console.error.mockClear();
  });

  it('should handle very long messages', () => {
    const longMessage = 'A'.repeat(1000);
    expect(() => logger.info(longMessage)).not.toThrow();
  });

  it('should handle special characters', () => {
    const specialChars = '!@#$%^&*()_+{}[]|:;"<>?,./~`';
    expect(() => logger.info(specialChars)).not.toThrow();
  });

  it('should handle empty strings', () => {
    expect(() => logger.info('')).not.toThrow();
    expect(() => logger.warn('')).not.toThrow();
  });

  it('should handle concurrent logging', () => {
    // Simulate multiple rapid log calls
    for (let i = 0; i < 10; i++) {
      logger.info(`Message ${i}`);
    }
    expect(console.log.mock.calls.length).toBeGreaterThanOrEqual(10);
  });

  it('should handle objects with special properties', () => {
    const obj = {
      null: null,
      undefined: undefined,
      number: 123,
      string: 'test',
      boolean: true,
      array: [1, 2, 3],
    };
    expect(() => logger.info('Complex object', obj)).not.toThrow();
  });

  it('should handle deeply nested objects', () => {
    const nested = {
      level1: {
        level2: {
          level3: {
            value: 'deep',
          },
        },
      },
    };
    expect(() => logger.info('Nested object', nested)).not.toThrow();
  });
});

describe('Logger - Integration Scenarios', () => {
  beforeEach(() => {
    console.log.mockClear();
    console.error.mockClear();
  });

  it('should handle a complete game session log flow', () => {
    // Game starts
    logger.info('Game session started');
    logger.gameEvent('session_start', { timestamp: Date.now() });

    // User plays
    logger.userAction('word_selected', { word: '안녕' });
    logger.performance('tts_load', 120, 'ms');

    // Error occurs
    logger.error('TTS failed', new Error('Audio error'));

    // Session ends
    logger.gameEvent('session_end', { duration: 300, wordsLearned: 5 });

    // Verify all logs were made
    expect(console.log.mock.calls.length).toBeGreaterThan(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should handle error recovery logging', () => {
    logger.error('Initial error', new Error('Failed'));
    logger.info('Retrying operation');
    logger.info('Operation succeeded');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.log.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('should log complete gameplay analytics', () => {
    const gameSession = {
      start: Date.now(),
      mode: 'flashcards',
      category: 'daily',
      wordsShown: 10,
      wordsLearned: 7,
      accuracy: 70,
    };

    logger.gameEvent('session_start', gameSession);
    logger.performance('session_duration', 300, 's');
    logger.gameEvent('session_complete', {
      ...gameSession,
      end: Date.now(),
    });

    expect(console.log.mock.calls.length).toBeGreaterThanOrEqual(3);
  });
});
