import path from 'path';

module.exports = {
  roots: ['<rootDir>', '<rootDir>/src'],
  reporters: ['default', 'jest-junit'],
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    'polyfill-object.fromentries'
  ],
  collectCoverage: true,
  verbose: true,
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  setupFiles: [path.join(__dirname, './jest/setupTests.js')],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/helpers/'],
  moduleNameMapper: {
    '\\.(css|md)$': 'identity-obj-proxy'
  },
  transform: {
    '\\.(js|jsx|ts|tsx)$': path.join(__dirname, './jest/transform.js')
  },
  coverageDirectory: 'target/coverage',
  coverageReporters: ['text', 'cobertura', 'html', 'lcov', 'json-summary'],
  collectCoverageFrom: [
    '**/src/**',
    '!**/*.json',
    '!**/theme.*',
    '!**/*.stories.*',
    '!**/*.snippet.*',
    '!**/__tests__/**',
    '!**/*.snap',
    '!**/dist/**'
  ]
};
