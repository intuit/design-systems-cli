import { CliCommand } from '@design-systems/plugin';

const command: CliCommand = {
  name: 'test',
  description:
    'Runs all tests found in `src/**/__tests__/**.test.js` through jest',
  examples: [
    { desc: 'Run all the tests in watch mode', example: 'ds test -w' },
    {
      desc: 'Run tests on specific files',
      example: 'ds test __tests__/basic __tests__/complex'
    }
  ],
  options: [
    {
      name: 'update',
      alias: 'u',
      type: Boolean,
      description: 'Update snapshots'
    },
    {
      name: 'watch',
      alias: 'w',
      type: Boolean,
      description: 'Watch for changes'
    },
    {
      name: 'annotate',
      type: Boolean,
      description: 'Post test results as annotations to PR. Only in CI.',
      config: true
    },
    {
      name: 'files',
      type: String,
      defaultOption: true,
      multiple: true,
      description: 'Array of files or directories to find test'
    },
    {
      name: 'runInBand',
      type: Boolean,
      description: 'Run all tests serially in the current process.'
    }
  ]
};

export default command;
