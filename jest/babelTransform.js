const babelJest = require('babel-jest');

module.exports = babelJest.default.createTransformer({
  presets: [
    ['react-app', {
      runtime: 'automatic',
      helpers: process.env.NODE_ENV !== 'test'
    }]
  ],
  plugins: [
    ['babel-plugin-transform-import-meta', { module: 'ES6' }]
  ],
  babelrc: false,
  configFile: false
});
