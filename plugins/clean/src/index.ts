import { getMonorepoRoot, createLogger } from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import { exec as execAsync } from 'child_process';
import fs from 'fs-extra';
import glob from 'fast-glob';

export interface CleanArgs {
  /** Do not delete the node_modules */
  noModules?: boolean;
  /** Don't delete the built dist directories */
  noDist?: boolean;
}

/** Run child_process.exec as a promise. */
function exec(cmd: string) {
  return new Promise((resolve, reject) => {
    execAsync(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }

      resolve(stdout || stderr);
    });
  });
}

/** A plugin to reset a project back to a clean starting state. */
export default class CleanPlugin implements Plugin<CleanArgs> {
  async run(args: CleanArgs = {}) {
    const cleanModules = !args.noModules;
    const cleanDist = !args.noDist;
    const isRoot = getMonorepoRoot() === process.cwd();
    const progressLogger = createLogger({ scope: 'clean', interactive: true });

    if (isRoot) {
      progressLogger.debug('Detected root...');

      if (cleanModules) {
        progressLogger.pending('Cleaning node_modules...');
        await new Promise((r) => {
          setTimeout(r, 1000);
        });

        try {
          const result = await exec('yarn lerna clean --yes');
          progressLogger.debug(result);
        } catch (error) {
          progressLogger.debug(error);
        }

        await fs.remove('node_modules');
        progressLogger.success('Cleaned all node_modules');
      }

      progressLogger.pending(
        `Cleaning ${cleanDist ? 'all' : 'some'} dist files...`
      );
      await new Promise((r) => {
        setTimeout(r, 2000);
      });

      const dist = await glob('{packages,components}/**/dist', {
        onlyDirectories: true,
      });
      const tsBuildInfo = await glob(
        '{packages,components}/**/tsconfig.tsbuildinfo'
      );

      await Promise.all([
        ...(cleanDist ? dist.map((d) => fs.remove(d)) : []),
        ...(cleanDist ? tsBuildInfo.map((d) => fs.remove(d)) : []),
        fs.remove('coverage'),
        fs.remove('out'),
      ]);

      progressLogger.success('Cleaned build files');
    } else {
      progressLogger.debug('Detected run from component...');

      if (cleanModules) {
        progressLogger.pending('Cleaning node_modules...');
        await fs.remove('node_modules');
        progressLogger.complete('Cleaned node_modules for component');
      }

      if (cleanDist) {
        progressLogger.pending('Cleaning dist files...');
        await fs.remove('dist');
        await fs.remove('tsconfig.tsbuildinfo');
        progressLogger.success('Cleaned build files for component');
      }

      await fs.remove('target');
      progressLogger.success('Cleaned code coverage for component');
    }

    progressLogger.complete('Cleaned project!');
  }
}
