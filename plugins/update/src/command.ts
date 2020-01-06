import { CliCommand } from '@design-systems/plugin';

const command: CliCommand = {
  name: 'update',
  description: 'Update the installed version of `@design-systems/cli`',
  examples: ['ds update'],
  options: [
    {
      name: 'release-notes',
      type: Boolean,
      description:
        'Get the release notes of what you would get by running `ds update`. Will not perform the update.'
    }
  ]
};

export default command;
