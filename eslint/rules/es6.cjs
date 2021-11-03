var { resolve } = require('path');

module.exports = exports = {
  env: { es6: true },
  plugins: [ 'node' ],

  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'script',
    ecmaFeatures: {
      generators: false,
      objectLiteralDuplicateProperties: false,
    },
  },

  rules: {
    // enforces no braces where they can be omitted
    'arrow-body-style': [ 'error', 'as-needed', {
      requireReturnForObjectLiteral: false,
    } ],

    // require parens in arrow function arguments
    'arrow-parens': [ 'error', 'always' ],

    // require space before/after arrow function's arrow
    // http://eslint.org/docs/rules/arrow-spacing
    'arrow-spacing': [ 'error', { before: true, after: true } ],

    // verify super() callings in constructors
    'constructor-super': 'error',

    // enforce the spacing around the * in generator functions
    // http://eslint.org/docs/rules/generator-star-spacing
    'generator-star-spacing': [ 'error', { before: false, after: true } ],

    // disallow modifying variables of class declarations
    // http://eslint.org/docs/rules/no-class-assign
    'no-class-assign': 'error',

    // disallow arrow functions where they could be confused with comparisons
    // http://eslint.org/docs/rules/no-confusing-arrow
    'no-confusing-arrow': [ 'error', {
      allowParens: true,
    } ],

    // disallow modifying variables that are declared using const
    'no-const-assign': 'error',

    // disallow duplicate class members
    // http://eslint.org/docs/rules/no-dupe-class-members
    'no-dupe-class-members': 'error',

    // disallow importing from the same path more than once
    // http://eslint.org/docs/rules/no-duplicate-imports
    'no-duplicate-imports': 'error',

    // disallow symbol constructor
    // http://eslint.org/docs/rules/no-new-symbol
    'no-new-symbol': 'error',

    // disallow to use this/super before super() calling in constructors.
    // http://eslint.org/docs/rules/no-this-before-super
    'no-this-before-super': 'error',

    // disallow useless computed property keys
    // http://eslint.org/docs/rules/no-useless-computed-key
    'no-useless-computed-key': 'error',

    // disallow unnecessary constructor
    // http://eslint.org/docs/rules/no-useless-constructor
    'no-useless-constructor': 'error',

    // disallow renaming import, export, and destructured assignments to the same name
    // http://eslint.org/docs/rules/no-useless-rename
    'no-useless-rename': [ 'error', {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false,
    } ],

    // you can pry var from my cold dead hands
    'no-var': 'off',

    // require method and property shorthand syntax for object literals
    // http://eslint.org/docs/rules/object-shorthand
    'object-shorthand': [ 'error', 'always', {
      ignoreConstructors: false,
      avoidQuotes: true,
    } ],

    // suggest using arrow functions as callbacks
    'prefer-arrow-callback': [ 'warn', {
      allowNamedFunctions: true,
      allowUnboundThis: true,
    } ],

    // suggest using of const declaration for variables that are never modified after declared
    'prefer-const': [ 'warn', {
      destructuring: 'all',
      ignoreReadBeforeAssign: true,
    } ],

    // disallow parseInt() in favor of binary, octal, and hexadecimal literals
    'prefer-numeric-literals': 'error',

    // use rest parameters instead of arguments
    'prefer-rest-params': 'warn',

    // suggest using the spread operator instead of .apply()
    'prefer-spread': 'warn',

    // suggest using template literals instead of string concatenation
    'prefer-template': 'off',

    // disallow generator functions that do not have yield
    'require-yield': 'error',

    // enforce spacing between object rest-spread
    'rest-spread-spacing': [ 'error', 'never' ],

    // import sorting
    'sort-imports': [ 'off', {
      ignoreCase: false,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: [ 'none', 'all', 'multiple', 'single' ],
    } ],

    // require a Symbol description
    'symbol-description': 'error',

    // enforce spacing around the * in yield* expressions
    'yield-star-spacing': [ 'error', 'after' ],

    'node/no-missing-import': [ 'error', {
      allowModules: [],
      tryExtensions: [ '.js', '.jsx', '.json', '.node' ],
      resolvePaths: [ resolve(__dirname, '../../') ],
    } ],
  },
};
