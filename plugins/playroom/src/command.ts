import { CliCommand } from '@design-systems/plugin';

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
    }
  ]
};

export default command;
