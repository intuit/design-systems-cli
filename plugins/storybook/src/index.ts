/* eslint-disable no-underscore-dangle */

import { createLogger } from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import path from 'path';
import getPort from 'get-port';
import storybook from '@storybook/react/standalone';
import Story2sketch from 'story2sketch/lib/server/Story2sketch';
import config from './story2sketch.config';

export interface BuildArgs {
  /** The command identifier */
  _command: ['storybook', 'build'];
  /** Build the sketch asset for a storybook as well */
  sketch?: boolean;
}

export interface StartArgs {
  /** The command identifier */
  _command: ['storybook', 'start'];
  /** Start the storybook in CI mode. */
  ci?: boolean;
  /** Automatically finds an available port when the default port is occupied */
  findPort?: boolean;
}

type StorybookArgs = BuildArgs | StartArgs;

/** A plugin to start and build a storybook for your components. */
export default class StorybookPlugin implements Plugin<StorybookArgs> {
  private logger = createLogger({ scope: 'storybook' });

  async run(args: StorybookArgs) {
    try {
      process.env.COMPONENT = process.cwd();

      if (args._command[1] === 'build') {
        this.logger.debug(`Building storybook for: ${process.env.COMPONENT}`);

        await storybook({
          mode: 'static',
          configDir: path.join(__dirname, '../.storybook'),
          outputDir: 'out'
        });

        if ('sketch' in args && args.sketch === true) {
          this.logger.debug('Building sketch assets for storybook...');

          const story2sketch = new Story2sketch(
            config({ input: 'out/iframe.html', output: 'out/sketch' })
          );

          await story2sketch.init();
          await story2sketch.execute();

          this.logger.success('Built sketch assets for storybook!');
        }
      } else if (args._command[1] === 'start') {
        this.logger.debug(`Watching storybook for: ${process.env.COMPONENT}`);
        
        // Checking if the findPort is set to true and auto-assigning a port
        let port = 6006;
        if ('findPort' in args && args.findPort === true) {
          port = await getPort();
          this.logger.debug(`Random available port used for Storybook 
            since 6006 is occupied : ${port}`);
        }

        storybook({
          mode: 'dev',
          port,
          configDir: path.join(__dirname, '../.storybook'),
          ci: 'ci' in args && args.ci
        });
      }
    } catch (e) {
      this.logger.error(e);
      process.exit(1);
    }
  }
}
