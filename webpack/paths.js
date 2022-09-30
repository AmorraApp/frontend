
const path = require('path');

function resolve (...args) {
  return path.resolve(__dirname, '..', ...args);
}

module.exports = exports = {
  resolve,
  root: resolve(),
  src: resolve('src'),
  public: resolve('public'),
  input: resolve('src/index.js'),
  output: resolve('dist'),
  appHtml: resolve('assets/index.html'),
};
