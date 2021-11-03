module.exports = exports = {
  plugins: [ 'promise' ],
  rules: {
    'promise/no-return-wrap': 'error',
    'promise/param-names': 'error',
    'promise/catch-or-return': [ 'error', {
      allowThen: true,
      terminationMethod: [ 'catch', 'asCallback', 'finally' ],
    } ],
    // 'promise/no-native': 'error',
  },
};
