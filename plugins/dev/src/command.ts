import { CliCommand } from '@design-systems/plugin';

const command: CliCommand = {
  name: 'dev',
  description:
    'Builds a component, any dependent component in the same monorepo, and starts storybook for just the component.',
  examples: ['ds dev']
};

export default command;
