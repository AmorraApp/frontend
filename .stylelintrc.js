module.exports = exports = {
  "plugins": [
    "stylelint-scss",
  ],
  "extends": [
    "stylelint-config-recommended",
    "stylelint-config-recommended-scss",
  ],
  "rules": {
    "no-descending-specificity": null,
    "at-rule-no-unknown": null,
    "scss/at-rule-no-unknown": true,
    "scss/selector-no-redundant-nesting-selector": true,
    "selector-pseudo-class-no-unknown": [true, {
      "ignorePseudoClasses": ["global", "local"]
    }]
  }
}
