/**
 * Global Test Setup for K-POP Korean Learning Game
 * Configures test environment and mocks browser APIs
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock speechSynthesis API for TTS testing
const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
};

Object.defineProperty(window, 'speechSynthesis', {
  value: mockSpeechSynthesis,
  writable: true,
});

global.SpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
  text,
  lang: 'ko-KR',
  rate: 0.8,
  pitch: 1,
  volume: 1,
}));

// Mock AudioContext for sound effects
class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.destination = {};
  }

  createOscillator() {
    return {
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      frequency: { value: 0 },
      type: 'sine',
    };
  }

  createGain() {
    return {
      connect: jest.fn(),
      gain: {
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
    };
  }
}

window.AudioContext = MockAudioContext;
window.webkitAudioContext = MockAudioContext;

// Mock console methods for clean test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});
