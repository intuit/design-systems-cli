import { CliCommand } from '@design-systems/plugin';

const command: CliCommand = {
  name: 'clean',
  description: 'Remove dependencies and build files',
  options: [
    {
      name: 'no-modules',
      description: "Don't delete the node_modules",
      type: Boolean
    },
    {
      name: 'no-dist',
      description: "Don't delete the built dist directories",
      type: Boolean
    }
  ]
};

export default command;
