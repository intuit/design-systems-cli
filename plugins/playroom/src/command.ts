import { CliCommand } from '@design-systems/plugin';
import dedent from 'dedent';

const command: CliCommand = {
  name: 'playroom',
  description: 'Create a playroom for your components',
  commands: [
    {
      name: 'start',
      description: 'Start a playroom for your components',
      examples: ['ds playroom start']
    },
    {
      name: 'build',
      description: 'Build the playroom for deployment',
      examples: ['ds playroom build']
    }
  ],
  options: [
    {
      name: 'exclude',
      multiple: true,
      type: String,
      defaultValue: [],
      description: 'Glob of files to exclude from playroom.',
      config: true
    },
    {
      name: 'excludeNamed',
      multiple: true,
      type: String,
      defaultValue: [],
      description: 'Array of component names to only use the default export.',
      config: true
    }
  ],
  footer: [
    {
      header: 'Snippets',
      content:
        'Export an arrary of Playroom Snippets in each of your components. These will all be loaded into playroom at once.'
    },
    {
      header: 'Custom playroom config',
      content: dedent`
        To customize your playroom configuration, create a playroom.config.js at your package or monorepo root. Export a function that takes the base config as an argument.

        It must uses the passed in base config for playroom to function properly.
      `
    },
    {
      code: true,
      content: dedent`
        \`\`\`js
        module.exports = baseConfig => ({
          ...baseConfig,
          port: 9001,
          openBrowser: false,
          title: 'Custom Title',
        });
        \`\`\`
      `
    }
  ]
};

export default command;
