import { CliCommand } from '@design-systems/plugin';

const command: CliCommand = {
  name: 'lint',
  description: 'Lint the project using eslint + stylelint',
  examples: ['ds lint'],
  options: [
    {
      name: 'fix',
      type: Boolean,
      description: 'Try to fix the errors.'
    },
    {
      name: 'no-cache',
      type: Boolean,
      description: 'Do not use any cached results from previous runs.',
      config: true
    },
    {
      name: 'annotate',
      type: Boolean,
      description: 'Post lint results as annotations to PR. Only in CI.',
      config: true
    },
    {
      name: 'files',
      type: String,
      description:
        'A list of files to lint. Omit to automatically scan the repo.',
      multiple: true,
      defaultOption: true
    },
    {
      name: 'max-warnings',
      type: Number,
      description: 'An optional maximum number of warnings to show.',
      multiple: false,
      defaultValue: 0
    }
  ]
};

export default command;
