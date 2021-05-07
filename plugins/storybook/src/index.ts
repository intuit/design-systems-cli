/* eslint-disable no-underscore-dangle */

import { createLogger, getMonorepoRoot } from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import path from 'path';
import getPort from 'get-port';
import storybook from '@storybook/react/standalone';
import { extract } from '@storybook/cli/dist/cjs/extract';

import Story2sketch from 'story2sketch/lib/server/Story2sketch';
import config from './story2sketch.config';

export interface BuildArgs {
  /** The command identifier */
  _command: ['storybook', 'build'];
  /** Build the sketch asset for a storybook as well */
  sketch?: boolean;
  /** Output a stories.json for storybook composition */
  extract?: boolean;
}

export interface StartArgs {
  /** The command identifier */
  _command: ['storybook', 'start'];
  /** Start the storybook in CI mode. */
  ci?: boolean;
  /** Port to start the server on */
  port?: number;
  /** Automatically finds an available port when the default port is occupied */
  findPort?: boolean;
}

type StorybookArgs = BuildArgs | StartArgs;

/** asserts that we've invoked `storybook build` */
const isBuildCommand = (args: StorybookArgs): args is BuildArgs => {
  return args._command[1] === 'build';
};

/** A plugin to start and build a storybook for your components. */
export default class StorybookPlugin implements Plugin<StorybookArgs> {
  private logger = createLogger({ scope: 'storybook' });

  async run(args: StorybookArgs) {
    try {
      const configDir = path.join(getMonorepoRoot(), '.storybook');
      process.env.COMPONENT = process.cwd();

      if (isBuildCommand(args)) {
        this.logger.debug(`Building storybook for: ${process.env.COMPONENT}`);
        const outputDir = 'out';

        await storybook({
          mode: 'static',
          configDir,
          outputDir,
        });

        if ('extract' in args && args.extract === true) {
          await extract(outputDir, path.join(outputDir, 'stories.json'));
        }

        if ('sketch' in args && args.sketch === true) {
          this.logger.debug('Building sketch assets for storybook...');

          const story2sketch = new Story2sketch(
            config({ input: 'out/iframe.html', output: 'out/sketch' })
          );

          await story2sketch.init();
          await story2sketch.execute();

          this.logger.success('Built sketch assets for storybook!');
        }
      } else {
        this.logger.debug(`Watching storybook for: ${process.env.COMPONENT}`);

        // Checking if the findPort is set to true and auto-assigning a port
        let port = 6006;

        if (args.port) {
          port = args.port;
          this.logger.debug(`Using port: ${port}`);
        }

        if ('findPort' in args && args.findPort === true) {
          port = await getPort();
          this.logger.debug(`Random available port used for Storybook 
            since 6006 is occupied : ${port}`);
        }

        storybook({
          mode: 'dev',
          port,
          configDir,
          ci: 'ci' in args && args.ci,
        });
      }
    } catch (e) {
      this.logger.error('Failed to build storybook');
      this.logger.error(e);
      process.exit(1);
    }
  }
}
