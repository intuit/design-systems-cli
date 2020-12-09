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
    {
      header: 'Multi-Build CSS',
      content: [
        dedent`
          If you want your project to build _multiple_ output CSS files, you can set up multiple PostCSS configs to be run.

          Our PostCSS config loader requires normal PostCSS config filenames, so you'll need to put the files in separate directories.
          The example below will generate two css files: \`main.css\` and \`alternate.css\`.

          You can also use this in conjunction with our [postcss-themed](https://github.com/intuit/postcss-themed) package to create
          a different CSS file per theme!
        `,
      ],
    },
    {
      code: true,
      content: dedent`
        \`\`\`js
        {
          "build": {
            "cssImport": true,
            "cssMain": "main",
            "cssConfigs": [
              {
                "name": "main",
                "path": "./postcss/main/postcss.config.js"
              },
              {
                "name": "alternate",
                "path": "./postcss/alternate/postcss.config.js"
              }
            ]
          }
        }
        \`\`\`
      `,
    },
    {
      header: 'Module Hash',
      content: [
        dedent`
          If you are doing multi build css you might want to use our postcss config's \`moduleHash\` option.
          This option will be added to the classnames that are produced so that if the application loads the single theme and multi-theme version of you component the classNames won't clash.
        `,
      ],
    },
    {
      code: true,
      content: dedent`
        \`\`\`js
        const defaultConfig = require('@design-systems/build/postcss.config');

        module.exports = (ctx) => {
          return defaultConfig({ ...ctx, moduleHash: 'my-theme' })
        });
        \`\`\`
      `,
    },
  ],
};

export default command;
