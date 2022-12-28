module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-prettier'
  ],
  plugins: [
    'stylelint-order',
    'stylelint-a11y',
    'stylelint-declaration-block-no-ignored-properties',
    'stylelint-selector-tag-no-without-class'
  ],
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: require.resolve('postcss-scss')
    },
    {
      files: ['**/*.less'],
      customSyntax: require.resolve('postcss-less')
    }
  ],
  rules: {
    'length-zero-no-unit': true,
    'shorthand-property-no-redundant-values': true,
    'no-descending-specificity': null,
    indentation: 2,
    'order/order': [
      'dollar-variables',
      'custom-properties',
      'declarations',
      'rules'
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['theme-root']
      }
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['mixin', 'define-mixin']
      }
    ],
    'rule-empty-line-before': [
      'always-multi-line',
      {
        ignore: ['first-nested'],
        except: ['after-single-line-comment']
      }
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-blockless', 'first-nested']
      }
    ],
    'declaration-empty-line-before': [
      'always',
      {
        ignore: ['after-comment'],
        except: ['first-nested', 'after-declaration']
      }
    ],
    'plugin/declaration-block-no-ignored-properties': true,
    'a11y/media-prefers-reduced-motion': true,
    'a11y/no-obsolete-attribute': true,
    'a11y/no-obsolete-element': true,
    'a11y/selector-pseudo-class-focus': true,
    'plugin/selector-tag-no-without-class': ['div', 'span']
  }
};
