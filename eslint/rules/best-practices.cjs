module.exports = exports = {
  rules: {
    // enforces getter/setter pairs in objects
    'accessor-pairs': 'off',

    // enforces return statements in callbacks of array's methods
    // http://eslint.org/docs/rules/array-callback-return
    'array-callback-return': 'error',

    // treat var statements as if they were block scoped
    'block-scoped-var': 'error',

    // specify curly brace conventions for all control statements
    curly: [ 'error', 'multi-line' ],

    // require default case in switch statements
    'default-case': [ 'error', { commentPattern: '^no default$' } ],

    // encourages use of dot notation whenever possible
    'dot-notation': [ 'warn', { allowKeywords: true } ],

    // enforces consistent newlines before or after dots
    // http://eslint.org/docs/rules/dot-location
    'dot-location': [ 'error', 'property' ],

    // require the use of === and !==
    // http://eslint.org/docs/rules/eqeqeq
    eqeqeq: [ 'error', 'smart' ],

    // make sure for-in loops have an if statement
    'guard-for-in': 'error',

    'new-cap': [ 'error', {
      newIsCap: true,
      capIsNew: true,
      properties: false,
    } ],

    // disallow the use of alert, confirm, and prompt
    'no-alert': 'warn',

    // disallow use of the Array constructor
    'no-array-constructor': 'error',

    // disallow use of arguments.caller or arguments.callee
    'no-caller': 'error',

    // disallow lexical declarations in case/default clauses
    // http://eslint.org/docs/rules/no-case-declarations.html
    'no-case-declarations': 'error',

    // don't leave any console.log statements around
    'no-console': 'warn',

    // disallow conditions that evaluate based on constants
    'no-constant-condition': [ 'error', { 'checkLoops': false } ],

    // disallow division operators explicitly at beginning of regular expression
    // http://eslint.org/docs/rules/no-div-regex
    'no-div-regex': 'off',

    // don't leave any debugger statements behind
    'no-debugger': 'error',

    // disallow duplicate argument names in a function definition
    'no-dupe-args': 'error',

    // disallow duplicate switch cases
    'no-duplicate-case': 'error',

    // disallow else after a return in an if
    'no-else-return': 'error',

    // disallow empty destructuring patterns
    // http://eslint.org/docs/rules/no-empty-pattern
    'no-empty-pattern': 'error',

    // disallow comparisons to null without a type-checking operator
    'no-eq-null': 'warn',

    // disallow use of eval()
    'no-eval': 'error',

    // disallow adding to native types
    'no-extend-native': 'error',

    // disallow unnecessary function binding
    'no-extra-bind': 'error',

    // disallow Unnecessary Labels
    // http://eslint.org/docs/rules/no-extra-label
    'no-extra-label': 'error',

    // disallow fallthrough of case statements
    'no-fallthrough': 'warn',

    // disallow the use of leading or trailing decimal points in numeric literals
    'no-floating-decimal': 'error',

    // disallow overwriting a function declaration
    'no-func-assign': 'error',

    // disallow reassignments of native objects or read-only globals
    // http://eslint.org/docs/rules/no-global-assign
    'no-global-assign': [ 'error', { exceptions: [] } ],
    // deprecated in favor of no-global-assign
    'no-native-reassign': 'off',

    // disallow invalid regexp patterns
    'no-invalid-regexp': 'error',

    // disallow implicit type conversions
    // http://eslint.org/docs/rules/no-implicit-coercion
    'no-implicit-coercion': [ 'off', {
      boolean: false,
      number: true,
      string: true,
      allow: [],
    } ],

    // disallow var and named functions in global scope
    // http://eslint.org/docs/rules/no-implicit-globals
    'no-implicit-globals': 'warn',

    // disallow use of eval()-like methods
    'no-implied-eval': 'error',

    // disallow non-ascii whitespace
    'no-irregular-whitespace': 'error',

    // disallow usage of __iterator__ property
    'no-iterator': 'error',

    // disallow use of labels for anything other then loops and switches
    'no-labels': [ 'error', { allowLoop: false, allowSwitch: false } ],

    // disallow unnecessary nested blocks
    'no-lone-blocks': 'error',

    // disallow creation of functions within loops
    'no-loop-func': 'warn',

    // disallow magic numbers
    // http://eslint.org/docs/rules/no-magic-numbers
    'no-magic-numbers': [ 'off', {
      ignore: [],
      ignoreArrayIndexes: true,
      enforceConst: true,
      detectObjects: false,
    } ],

    // disallow use of multiline strings
    'no-multi-str': 'error',

    // disallow use of new operator when not part of the assignment or comparison
    'no-new': 'error',

    // disallow use of new operator for Function object
    'no-new-func': 'error',

    // disallow use of the Object constructor
    'no-new-object': 'error',

    // disallows creating new instances of String, Number, and Boolean
    'no-new-wrappers': 'error',

    // disallow use of (old style) octal literals
    'no-octal': 'error',

    // disallow use of octal escape sequences in string literals, such as
    // var foo = 'Copyright \251';
    'no-octal-escape': 'error',

    // disallow reassignment of function parameters
    // disallow parameter object manipulation
    // rule: http://eslint.org/docs/rules/no-param-reassign.html
    'no-param-reassign': 'off',

    // disallow usage of __proto__ property
    'no-proto': 'error',

    // disallow declaring the same variable more then once
    'no-redeclare': 'error',

    // disallow certain object properties
    // http://eslint.org/docs/rules/no-restricted-properties
    'no-restricted-properties': [ 'error', {
      object: 'arguments',
      property: 'callee',
      message: 'arguments.callee is deprecated,',
    }, {
      property: '__defineGetter__',
      message: 'Please use Object.defineProperty instead.',
    }, {
      property: '__defineSetter__',
      message: 'Please use Object.defineProperty instead.',
    } ],

    // disallow use of assignment in return statement
    'no-return-assign': 'warn',

    // disallow use of `javascript:` urls.
    'no-script-url': 'error',

    // disallow self assignment
    // http://eslint.org/docs/rules/no-self-assign
    'no-self-assign': 'error',

    // disallow comparisons where both sides are exactly the same
    'no-self-compare': 'error',

    // disallow use of comma operator
    'no-sequences': 'warn',

    // disallow declaration of variables already declared in the outer scope
    'no-shadow': 'warn',

    // disallow shadowing of names such as arguments
    'no-shadow-restricted-names': 'error',

    // restrict what can be thrown as an exception
    'no-throw-literal': 'error',

    // disallow use of undeclared variables unless mentioned in a /*global */ block
    'no-undef': 'error',

    // disallow unmodified conditions of loops
    // http://eslint.org/docs/rules/no-unmodified-loop-condition
    'no-unmodified-loop-condition': 'off',

    // warn about unreachable code in functions
    'no-unreachable': 'warn',

    // disallow dangerous use of finally
    'no-unsafe-finally': 'error',

    // disallow dangerous negations
    'no-unsafe-negation': 'error',

    // disallow usage of expressions in statement position
    'no-unused-expressions': [ 'warn', {
      allowShortCircuit: true,
      allowTernary: false,
    } ],

    // disallow declaration of variables that are not used in the code
    'no-unused-vars': [ 'error', { vars: 'local', args: 'after-used' } ],

    // disallow unused labels
    // http://eslint.org/docs/rules/no-unused-labels
    'no-unused-labels': 'error',

    // disallow useless string concatenation
    // http://eslint.org/docs/rules/no-useless-concat
    'no-useless-concat': 'error',

    // disallow unnecessary string escaping
    // http://eslint.org/docs/rules/no-useless-escape
    'no-useless-escape': 'error',

    // disallow use of void operator
    // http://eslint.org/docs/rules/no-void
    'no-void': 'error',

    // disallow use of the with statement
    'no-with': 'error',

    // require use of the second argument for parseInt()
    radix: 'error',

    // use isNaN to check for NaN values
    'use-isnan': 'error',

    // ensure that typeof checks are always against actual things
    'valid-typeof': [ 'error', { 'requireStringLiterals': true } ],

    // require immediate function invocation to be wrapped in parentheses
    // http://eslint.org/docs/rules/wrap-iife.html
    'wrap-iife': [ 'error', 'outside' ],

    // require or disallow Yoda conditions
    yoda: 'error',
  },
};
