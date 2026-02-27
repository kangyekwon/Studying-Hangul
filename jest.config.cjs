/**
 * Jest Configuration for K-POP Korean Learning Game
 * Configures test environment and coverage thresholds
 */

module.exports = {
  // Use jsdom environment for browser API simulation
  testEnvironment: 'jsdom',

  // Collect coverage from these files
  collectCoverageFrom: [
    '*.js',
    '!sw.js',
    '!jest.config.js',
    '!*.test.js',
    '!node_modules/**',
  ],

  // Coverage thresholds (start with 50%, target 85%)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Coverage report formats
  coverageReporters: ['text', 'lcov', 'html'],

  // Test match patterns
  testMatch: ['**/*.test.js'],

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],

  // Verbose output for detailed test results
  verbose: true,
};
