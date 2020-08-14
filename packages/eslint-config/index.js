const fs = require('fs');
const path = require('path');

const monorepoRoot = require('@design-systems/cli-utils').getMonorepoRoot();

/** Determine if a filepath exists. */
const exists = (filepath) => {
  if (fs.existsSync(filepath)) {
    return filepath;
  }
};

const arrowContext = 'VariableDeclarator > ArrowFunctionExpression';

module.exports = {
  env: { jest: true, browser: true },

  parser: 'babel-eslint',

  extends: [
    'airbnb',
    'xo',
    'xo-react/space',
    'plugin:jest/recommended',
    'prettier',
    'prettier/react',
  ],

  plugins: ['prettier', 'jest', 'react-hooks', 'eslint-plugin-jsdoc'],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      'eslint-import-resolver-lerna': {
        packages: [
          exists(path.join(monorepoRoot, 'components')),
          exists(path.join(monorepoRoot, 'packages')),
          exists(path.join(monorepoRoot, 'plugins')),
        ].filter(Boolean),
      },
    },
  },
  rules: {
    // stylistic

    // Bugs in parser typescript prevent use from using this rule
    // 'padding-line-between-statements': [
    //   'warn',
    //   {
    //     blankLine: 'always',
    //     prev: '*',
    //     next: ['return', 'block', 'block-like']
    //   }
    // ]
    /* xo config */
    'import/no-unassigned-import': [2, { allow: ['**/*.css'] }],
    'import/no-named-as-default': 0,
    // makes commenting out lines quickly a hassle
    'capitalized-comments': 0,
    'import/extensions': [
      2,
      'always',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],

    /* airbnb */

    // Need to name function for some stringification
    'func-names': 0,
    'import/no-unresolved': [2, { ignore: ['.css$'] }],
    'import/no-duplicates': 0,
    'consistent-return': 0,
    // We have some complicated functions
    complexity: ['error', { max: 30 }],
    // JSDoc comments are used for react docgen so they don't have to be valid
    'valid-jsdoc': 0,
    // DEPRECATED
    'jsx-a11y/label-has-for': 0,
    // use this instead
    'jsx-a11y/label-has-associated-control': 2,
    // Some of our components have a role prop
    'jsx-a11y/aria-role': [
      2,
      {
        ignoreNonDOM: true,
      },
    ],
    // Sometimes it makes sense not to
    'import/prefer-default-export': 0,
    // plugins generally do not use this
    'class-methods-use-this': 0,
    // Very common and we like to use it
    'no-plusplus': 0,

    /* jest plugin */

    // This is a pattern devs should use! gimme html attributes or give me death
    'react/jsx-props-no-spreading': 0,
    'react/state-in-constructor': 0,
    'react/static-property-placement': 0,
    'react/jsx-tag-spacing': 0, // from xo
    'react/jsx-indent': 0, // from xo
    'react/sort-comp': 0, // from airbnb
    // Adds a lot of extra code
    'react/destructuring-assignment': 0, // from airbnb
    // Only allow JSX in tsx + js files
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.tsx'] },
    ],
    'react/default-props-match-prop-types': 2,

    /* jest plugin */

    'jest/valid-title': 2,
    'jest/prefer-strict-equal': 2,
    'jest/prefer-spy-on': 2,
    'jest/no-standalone-expect': 2,
    'jest/no-try-expect': 2,
    'jest/no-export': 2,
    'jest/no-truthy-falsy': 1,
    'jest/no-duplicate-hooks': 1,
    'jest/no-if': 1,
    'jest/prefer-to-have-length': 1,

    /* jsdoc plugin */

    'jsdoc/check-alignment': 1,
    'jsdoc/check-param-names': 1,
    'jsdoc/check-tag-names': 1,
    'jsdoc/implements-on-classes': 1,
    'jsdoc/newline-after-description': 1,
    'jsdoc/no-types': 1,
    'jsdoc/require-param-description': 1,
    'jsdoc/require-returns-check': 1,
    'jsdoc/require-returns-description': 1,
    'jsdoc/require-hyphen-before-param-description': [1, 'always'],
    'jsdoc/require-jsdoc': [
      2,
      {
        require: {
          FunctionDeclaration: true,
          ClassDeclaration: true,
        },
        contexts: [arrowContext],
      },
    ],
  },
  overrides: [
    {
      files: ['*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      plugins: ['@typescript-eslint', 'eslint-plugin-no-explicit-type-exports'],
      rules: {
        'react/prop-types': 0,
        'react/default-props-match-prop-types': 0,
        'no-explicit-type-exports/no-explicit-type-exports': 2,
        'no-unused-expressions': 0,
        //  !!! Add this back once TS plugins supports `as const`
        '@typescript-eslint/no-object-literal-type-assertion': 0,
        '@typescript-eslint/no-this-alias': 2,
        '@typescript-eslint/no-unnecessary-type-assertion': 2,
        '@typescript-eslint/no-useless-constructor': 2,
        // if we turn this on babel adds regeneratorRuntime which makes builds harder and larger
        '@typescript-eslint/promise-function-async': 0,
        // just rely on typescript inference
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-member-accessibility': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,

        'jsdoc/require-jsdoc': [
          2,
          {
            require: {
              FunctionDeclaration: true,
              ClassDeclaration: true,
            },
            contexts: ['TSPropertySignature', arrowContext],
          },
        ],
      },
    },
    {
      files: ['*.{js,jsx}'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: [
        '*.proof.*',
        '*.test.*',
        '*.stories.*',
        'theme.*',
        '*.config.*',
        '*.d.ts',
        '*.snippet.*',
      ],
      rules: {
        'jsdoc/require-jsdoc': 0,
        'react/prefer-stateless-function': 0,
        'react/button-has-type': 0,
        'jsx-a11y/control-has-associated-label': 0,
        'jsx-a11y/no-static-element-interactions': 0,
        'jsx-a11y/jsx-a11y/anchor-has-content': 0,
        // devDependencies are all in the root
        'import/no-extraneous-dependencies': 0,
        '@typescript-eslint/ban-ts-comment': 0,
      },
    },
    {
      files: ['*.test.{ts,tsx}', '*.stories.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/ban-ts-ignore': 0,
      },
    },
    {
      files: ['*.mdx'],
      parser: 'eslint-mdx',
      plugins: ['mdx'],
      globals: {
        React: true,
      },
      rules: {
        'import/no-extraneous-dependencies': 0,
        // This is how we use jsx in mdx
        'no-unused-expressions': 0,
        // in mdx it's already in scope
        'react/react-in-jsx-scope': 0,
        // jsx is allowed in mdx
        'react/jsx-filename-extension': 0,
        // No exported function in MDX
        'jsdoc/require-jsdoc': 0,
      },
    },
  ].filter(Boolean),
};
