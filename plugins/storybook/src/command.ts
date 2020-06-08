import { CliCommand } from '@design-systems/plugin';
import dedent from 'dedent';

const command: CliCommand = {
  name: 'storybook',
  description: 'Create a storybook for your component',
  commands: [
    {
      name: 'build',
      description: 'Build the storybook for deployment',
      examples: ['ds storybook build'],
      options: [
        {
          name: 'sketch',
          type: Boolean,
          description: 'Generate sketch assets for the storybook',
          config: true
        }
      ]
    },
    {
      name: 'start',
      description: 'Start the storybook development server',
      examples: ['ds storybook dev'],
      options: [
        {
          name: 'ci',
          type: Boolean,
          description: 'Start the storybook server in CI mode'
        },
        {
          name: 'findPort',
          type: Boolean,
          description: 'Automatically assign a port if the default (6006) is occupied'
        }        
      ]
    }
  ],
  footer: {
    header: 'Custom Storybook Configuration',
    content: dedent`
      The configuration for this package is now just a normal storybook preset!
      This means that you configure storybook just like the story book docs suggests.
      All you need to do is use our preset + load our "preview.js" if you want the default features we load.

      It supports the following additional custom files:

      1. dark-logo.png - Logo for the storybook when it's in dark mode
      2. light-logo.png - Logo for the storybook when it's in light mode
      3. middleware.js - provide express middleware to be used by storybook
    `
  }
};

export default command;
