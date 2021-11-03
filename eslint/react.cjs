const { resolve } = require('path');

module.exports = exports = {
  "env": {
    "browser": true,
    "es6": true,
  },
  "globals": {
    "__ENV_PROD__": "readonly",
    "__ENV_DEV__": "readonly",
    "event": "off",
    "open": "off",
    "find": "off",
    "parent": "off",
    "isNan": "readonly",
    "fetch": "off",
    "name": "off",
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    './rules/best-practices.cjs',
    './rules/es6.cjs',
    './rules/promises.cjs',
    './rules/react.cjs',
    './rules/style.cjs',
  ],
  rules: {
    'node/no-unsupported-features/es-syntax': 0,
    'node/no-unpublished-import': 0,
    "node/no-missing-import": [ 2, {
      "resolvePaths": [
        resolve(__dirname, '../src'),
      ],
    } ],
  },
};
