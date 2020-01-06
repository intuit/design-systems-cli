import { CliCommand } from '@design-systems/plugin';
import dedent from 'dedent';

const command: CliCommand = {
  name: 'bundle',
  description: 'Creates a webpack bundle of your component',
  options: [
    {
      name: 'debug',
      alias: 'd',
      type: Boolean,
      description: 'Produce a non-minified "debug" bundle'
    }
  ],
  footer: [
    {
      header: 'Custom Babel Config',
      content:
        'To customize your babel configuration, create a .babelrc at the root of your project'
    },
    {
      header: 'Custom webpack config',
      content: [
        dedent`
          To customize your webpack configuration, create webpack.config.js file at the root of the project.

          You'll want to extend the base config: \`@design-systems/bundle/webpack.config.base.js\` for things to function properly.
        `
      ]
    }
  ]
};

export default command;
