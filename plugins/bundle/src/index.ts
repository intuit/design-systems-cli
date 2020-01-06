import { createLogger, getMonorepoRoot } from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import baseWebpackConfig, { ConfigOptions } from './webpack.base.config';

export interface BundleArgs {
  /**
   * Run the build in debug mode, skipping minification
   */
  debug?: boolean;
}

/**
 * Promisify the webpack API
 */
function pack(config: webpack.Configuration): Promise<webpack.Stats> {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        return reject(err);
      }

      return resolve(stats);
    });
  });
}

/**
 * Resolve the webpack config to use when building
 */
async function getConfig(
  options: ConfigOptions
): Promise<webpack.Configuration> {
  const root = getMonorepoRoot();
  const customConfigPath = path.join(root, 'webpack.config.js');
  let config = baseWebpackConfig;
  if (fs.existsSync(customConfigPath)) {
    // eslint-disable-next-line
    const overrideConfig = require(customConfigPath);
    config = overrideConfig.default || overrideConfig;
  }

  if (typeof config === 'function') {
    return config(options);
  }

  return config;
}

/**
 * A plugin to _bundle_ a component
 */
export default class BundlePlugin implements Plugin<BundleArgs> {
  private logger = createLogger({ scope: 'bundle' });

  async bundle(args: BundleArgs, entry: string): Promise<void> {
    const stats = await pack(
      await getConfig({
        ...args,
        entry
      })
    );
    const buildInfo = stats.toJson();

    if (stats.hasErrors()) {
      this.logger.error(buildInfo.errors.join(''));
      process.exit(1);
    }

    this.logger.log(stats.toString({ colors: true }));
  }

  async bundleCurrent(args: BundleArgs) {
    await this.bundle(args, './src');
  }

  async run(args: BundleArgs) {
    // Generate the webpack config

    if (fs.existsSync('lerna.json')) {
      this.logger.error('Run this from a component folder instead');
      process.exit(1);
    } else {
      await this.bundleCurrent(args);
    }

    this.logger.await('Created bundle');
  }
}
