import { CliCommand } from '@design-systems/plugin';
import { getAppDefinition } from '@proof-ui/cli';
import { getConfig } from '@proof-ui/config';

/**
 * Use the proof config to generate the CLI arg definitions
 */
async function getCommand(): Promise<CliCommand> {
  const base = await getAppDefinition(await getConfig());

  const options = (base.options || []).filter(command => {
    if (command.name === 'verbose') {
      return false;
    }

    return true;
  });

  return {
    name: 'proof',
    description: 'Run automation against a storybook',
    examples: [
      {
        desc: 'Run an axe scan on your local storybook',
        example: 'ds proof --local --local-grid --a11y'
      }
    ],
    options
  };
}

export default getCommand;
