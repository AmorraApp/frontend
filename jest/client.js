const { ROOT_DIR } = require('../for-client');

module.exports = {
  roots: [
    `${ROOT_DIR}/src`
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts'
  ],
  testSequencer: `${ROOT_DIR}/config/jest/sequencer.js`,
  setupFilesAfterEnv: [
    '@zenbusiness/react-testing/setup'
  ],
  testMatch: [
    `${ROOT_DIR}/src/**/*.{spec,test}.{js,jsx}`
  ],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://local.zenbusiness.com/'
  },
  transform: {
    '\\.[jt]sx?$': `${ROOT_DIR}/config/jest/babelTransform.js`,
    '^.+\\.css$': `${ROOT_DIR}/config/jest/cssTransform.js`,
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': `${ROOT_DIR}/config/jest/fileTransform.js`
  },
  transformIgnorePatterns: [
    'node_modules/(?!@zenbusiness/common-components)'
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy'
  },
  modulePaths: [
    `${ROOT_DIR}/node_modules`
  ],
  moduleFileExtensions: [
    'js',
    'cjs',
    'mjs',
    'json',
    'node'
  ],
  resolver: '@zenbusiness/jest-resolver',
  resetMocks: true
};
