
module.exports = exports = {
  extends: "twipped/react",
  rules: {
    'import/no-named-as-default-member': 0,
    'import/no-named-as-default': 0,
  },
  overrides: [
    {
      files: [
        './*.js',
        './**/*.cjs',
      ],
      extends: 'twipped/node',
    },
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          [ 'common', './src/common' ],
        ],
        extensions: [ '.mjs', '.js', '.jsx', '.json' ],
      },
    },
  },
};
