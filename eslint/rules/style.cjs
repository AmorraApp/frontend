
const constants = require('./constants.cjs');

module.exports = exports = {
  rules: {
    // enforce spacing inside array brackets
    'array-bracket-spacing': [ 'error', 'always' ],

    // enforce spacing inside single-line blocks
    'block-spacing': [ 'error', 'always' ],

    // enforce one true brace style
    'brace-style': [ 'error', '1tbs', { allowSingleLine: true } ],

    // require trailing commas in multiline object literals
    'comma-dangle': [ 'error', 'always-multiline' ],

    // enforce spacing before and after comma
    'comma-spacing': [ 'error', {
      before: false,
      after: true,
    } ],

    'comma-style': [ 'error', 'last' ],

    // always use `self` when capturing the current context
    'consistent-this': [ 'error', 'self' ],

    // enforce newline at the end of file, with no multiple empty lines
    'eol-last': [ 'error', 'always' ],

    // enforce spacing between function name and invocation arguments: foo() vs foo ()
    'func-call-spacing': [ 'error', 'never' ],

    'func-style': [ 'off' ],

    // use tabs, enforce indentation for chained functions
    'indent': [ 2, constants.INDENTATION, {
      'MemberExpression': 1,
    } ],

    'key-spacing': [ 'error', {
      'singleLine': {
        'beforeColon': false,
        'afterColon': true,
      },
      'multiLine': {
        'mode': 'minimum',
        'beforeColon': false,
        'afterColon': true,
      },
    } ],

    // require a space before & after certain keywords
    'keyword-spacing': [ 'error', {
      before: true,
      after: true,
      overrides: {
        return: { after: true },
        throw: { after: true },
        case: { after: true },
      },
    } ],

    // require or disallow newlines around directives
    'lines-around-directive': [ 'error', {
      before: 'never',
      after: 'always',
    } ],

    // specify the maximum length of a line in your program
    'max-len': [ 'error', 160, 4, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    } ],

    // disallow if as the only statement in an else block
    'no-lonely-if': 'error',

    // disallow un-paren'd mixes of different operators
    'no-mixed-operators': [ 'error', {
      groups: [
        [ '+', '-', '*', '/', '%', '**' ],
        [ '&', '|', '^', '~', '<<', '>>', '>>>' ],
        [ '==', '!=', '===', '!==', '>', '>=', '<', '<=' ],
        // ['&&', '||'],
        [ 'in', 'instanceof' ],
      ],
      allowSamePrecedence: true,
    } ],

    // disallow mixed spaces and tabs for indentation
    'no-mixed-spaces-and-tabs': 'warn',

    // disallow multiple empty lines and only one newline at the end
    'no-multiple-empty-lines': [ 'error', { max: 3, maxEOF: 1 } ],

    // disallow negated conditions
    // http://eslint.org/docs/rules/no-negated-condition
    'no-negated-condition': 'off',

    // disallow nested ternary expressions
    'no-nested-ternary': 'error',

    // disallow certain syntax forms
    // http://eslint.org/docs/rules/no-restricted-syntax
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ],

    // disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 'error',

    // disallow the use of Boolean literals in conditional expressions
    // also, prefer `a || b` over `a ? a : b`
    'no-unneeded-ternary': [ 'error', { defaultAssignment: false } ],

    // disallow unneeded computed key values
    'no-useless-computed-key': 2,

    // disallow pointless constructor functions
    'no-useless-constructor': 2,

    // disallow whitespace before properties
    'no-whitespace-before-property': 'error',

    // require padding inside curly braces
    'object-curly-spacing': [ 'error', 'always' ],

    // enforce line breaks between braces
    // http://eslint.org/docs/rules/object-curly-newline
    // TODO: enable once https://github.com/eslint/eslint/issues/6488 is resolved
    // 'object-curly-newline': ['off', {
    //   ObjectExpression: { minProperties: 3, multiline: true, either: true },
    //   ObjectPattern: { minProperties: 3, multiline: true, either: true }
    // }],

    // enforce "same line" or "multiple line" on object properties.
    // http://eslint.org/docs/rules/object-property-newline
    'object-property-newline': [ 'error', {
      allowMultiplePropertiesPerLine: true,
    } ],

    // allow just one var statement per function
    'one-var': [ 'error', {
      initialized: 'never',
      uninitialized: 'consecutive',
    } ],

    // specify whether double or single quotes should be used
    quotes: 'off', // [ 'error', 'single', { avoidEscape: true } ],

    // require or disallow use of semicolons instead of ASI
    semi: [ 'error', 'always' ],

    // enforce spacing before and after semicolons
    'semi-spacing': [ 'error', { before: false, after: true } ],

    // require or disallow space before blocks
    'space-before-blocks': [ 'error', 'always' ],

    // require or disallow space before function opening parenthesis
    // http://eslint.org/docs/rules/space-before-function-paren
    'space-before-function-paren': [ 'error', { anonymous: 'always', named: 'always' } ],

    // require spaces around operators
    'space-infix-ops': 'error',

    // Require or disallow spaces before/after unary operators
    // http://eslint.org/docs/rules/space-unary-ops
    'space-unary-ops': [ 'error', {
      words: true,
      nonwords: false,
      overrides: {
      },
    } ],

    // require or disallow a space immediately following the // or /* in a comment
    'spaced-comment': [ 'error', 'always', {
      exceptions: [ '-', '+' ],
      markers: [ '=', '!' ],           // space here to support sprockets directives
    } ],

  },
};
