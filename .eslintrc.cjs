
module.exports = exports = {
  extends: "./eslint/react.cjs",

  overrides: [
    {
      files: [
        './*.js',
        './eslint/**/*.js',
        './**/*.cjs',
      ],
      extends: './eslint/node.cjs',
    },
  ],
};
