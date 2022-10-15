
const path = require('path');
const ROOT_DIR = path.resolve(__dirname, '..');

exports.roots = [
  `${ROOT_DIR}/src`,
];

exports.collectCoverageFrom = [
  'src/**/*.{js,jsx}',
  '!src/**/*.d.ts',
];

exports.testSequencer = `${ROOT_DIR}/jest/sequencer.js`;

exports.setupFilesAfterEnv = [
  '@zenbusiness/react-testing/setup',
];

exports.snapshotSerializers = [
  '@emotion/jest/serializer', /* if needed other snapshotSerializers should go here */
];

exports.testMatch = [
  `${ROOT_DIR}/src/**/*.test.js`,
];

exports.testEnvironment = 'jsdom';

exports.testEnvironmentOptions = {
  url: 'http://amorra.local/',
};

exports.transform = {
  '\\.[jt]sx?$': `${ROOT_DIR}/jest/babelTransform.js`,
  '^.+\\.css$': `${ROOT_DIR}/jest/cssTransform.js`,
  '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': `${ROOT_DIR}/jest/fileTransform.js`,
};

exports.transformIgnorePatterns = [
  'node_modules/(?!@twipped)',
];

exports.moduleNameMapper = {
  '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
};

exports.modulePaths = [
  `${ROOT_DIR}/node_modules`,
];

exports.moduleFileExtensions = [
  'js',
  'cjs',
  'mjs',
  'json',
  'node',
];

exports.resolver = '@twipped/jest-resolver';

exports.resetMocks = true;
