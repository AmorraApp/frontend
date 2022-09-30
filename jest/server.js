const path = require('path');
const { ROOT_DIR } = require('../for-client');

module.exports = {
  rootDir: path.join(ROOT_DIR, 'server'),
  testEnvironment: 'node',
  testSequencer: `${ROOT_DIR}/config/jest/sequencer.js`,
  testMatch: [
    `${ROOT_DIR}/server/**/*.{spec,test}.{js,jsx}`
  ],
  automock: false,
  clearMocks: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  moduleFileExtensions: [
    'js',
    'cjs',
    'mjs',
    'json',
    'node'
  ],
  moduleNameMapper: {
    '^#client/(.*)': path.join(ROOT_DIR, 'src/$1'),
    '^#(.*)': path.join(ROOT_DIR, '$1')
  }
};
