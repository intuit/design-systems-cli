import { CliCommand } from '@design-systems/plugin';
import dedent from 'dedent';

export const defaults = {
  watch: false,
  cssOptimizationLevel: 2 as const,
  inputDirectory: 'src',
  outputDirectory: 'dist',
  cssMain: 'main.css',
  cssImport: false,
  cssConfigs: [],
  ignore: [
    '**/*.+(md|mdx)',
    '**/__tests__/**',
    '**/__snapshots__/**',
    '**/*.+(stories|test).*',
    '**/stories/*',
  ],
};

const command: CliCommand = {
  name: 'build',
  description:
    'Builds a React Component located in `./src` and outputs `cjs`, `mjs`, and `css` into `dist`',
  options: [
    {
      name: 'watch',
      alias: 'w',
      type: Boolean,
      description: 'Watch for file changes and recompile.',
    },
    {
      name: 'ignore',
      type: String,
      multiple: true,
      description: 'A minimatch to ignore',
      defaultValue: defaults.ignore,
      config: true,
    },
    {
      name: 'css-optimization-level',
      type: Number,
      description: 'What clean-css optimization level to use',
      defaultValue: defaults.cssOptimizationLevel,
      config: true,
    },
    {
      name: 'cssMain',
      type: String,
      description: 'Customaize the name of the main output css file.',
      defaultValue: defaults.cssMain,
      config: true,
    },
    {
      name: 'cssImport',
      type: Boolean,
      description: 'Automatically add a CSS import into the ESM output file.',
      defaultValue: defaults.cssImport,
      config: true,
    },
  ],
  footer: [
    {
      header: 'Custom Babel Config',
      content:
        'To customize your babel configuration, create a .babelrc at the root of the project.',
    },
    {
      header: 'Custom PostCSS Config',
      content: [
        dedent`
          To customize your postcss configuration, create a postcss.config.js at your package or monorepo root.

          It must use the base config for css modules to function properly.
        `,
      ],
    },
    {
      code: true,
      content: dedent`
        \`\`\`js
        const defaultConfig = require('@design-systems/build/postcss.config');
        const mixins = require('postcss-mixins');

        module.exports = (ctx) => {
          const config = defaultConfig(ctx);

          return {
            ...config,
            plugins: [
              mixins({ mixinsFiles }),
              ...config.plugins
            ]
          }
        });
        \`\`\`
      `,
    },
  ],
};

export default command;
