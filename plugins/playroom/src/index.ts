/* eslint-disable no-underscore-dangle */

import { monorepoName, createLogger } from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import playroom from 'playroom/lib';
import glob from 'fast-glob';

import playroomConfig from './playroom.config';

const logger = createLogger({ scope: 'playroom' });
/** Create the entry file for playroom. This file imports all necessary CSS and JS. */
async function createEntry(exclude: string[], excludeNamed: string[]) {
  let globs = ['components/**/package.json', '!**/node_modules/**'];
  if (exclude.length > 0) {
    const excludes = exclude.map(g => `!${g}`);
    globs = globs.concat(excludes);
  }

  logger.debug('Globs: ', globs);
  logger.debug('Exclude Named: ', excludeNamed);
  const components = await glob(globs);

  let entry = '';
  components.forEach(component => {
    let name: string;
    let pathToComponent: string;

    // In this case we are running playroom for just the 1 component
    if (component === 'package.json') {
      name = process
        .cwd()
        .split('/')
        .pop() as string;
      pathToComponent = process.cwd();
    } else {
      const match = component.match(/components\/(\S+)\/./);

      if (!match) {
        return;
      }

      [, name] = match;
      pathToComponent = path.join(process.cwd(), 'components', name);
    }

    const builtCss = path.join(pathToComponent, 'dist/main.css');
    const resolvedPath = require
      .resolve(pathToComponent)
      .replace('/cjs/', '/esm/');

    if (excludeNamed.includes(name)) {
      logger.debug(`Excluding named export: "${name}"`);
    } else {
      entry += `export * from "${pathToComponent}";\n`;
    }

    if (fs.existsSync(builtCss)) {
      entry += `import "${path.join(pathToComponent, 'dist/main.css')}";\n`;
    }

    if (fs.readFileSync(resolvedPath, 'utf8').includes('export default')) {
      entry += `export { default as ${name} } from "${pathToComponent}";\n`;
    }
  });

  const entryPath = path.join(os.tmpdir(), 'playroom.entry.js');
  fs.removeSync(entryPath);
  logger.trace(entry);
  fs.writeFileSync(entryPath, entry, 'utf8');
  return entryPath;
}

interface PlayroomArgs {
  /** The supported sub-commands */
  _command: ['playroom', 'build' | 'start'];
  /** Glob of component directories to ignore */
  exclude: string[];
  /** Glob of components to only use default export */
  excludeNamed: string[];
}

/** A plugin to start and build a playroom for the project's components. */
export default class PlayroomPlugin implements Plugin {
  async run(args: PlayroomArgs) {
    const { exclude, excludeNamed } = args;
    logger.warn('For playroom to work your components should be built first!');

    const command = args._command.includes('build') ? 'build' : 'start';

    const entry = await createEntry(exclude, excludeNamed);
    const instance = playroom({
      cwd: process.cwd(),
      ...playroomConfig({ entry, title: monorepoName() })
    });

    logger.debug(`Running playroom with ${command} command`);

    instance[command](error => {
      if (error) {
        logger.error(error);
      }
    });
  }
}
