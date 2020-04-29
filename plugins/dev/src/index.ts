import {
  monorepoName,
  getMonorepoRoot,
  createLogger
} from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import findPackageJson from 'find-package-json';
import { spawn } from 'child_process';
import { watch } from 'chokidar';
import resolve from 'resolve-cwd';

const logger = createLogger({ scope: 'dev' });

/** Filter dependencies for only ones found in the monorepo. */
function filterDeps(
  monorepo: string,
  packageJson: findPackageJson.Package,
  type: 'dependencies' | 'devDependencies'
) {
  const deps = packageJson[type];

  if (deps) {
    return Object.keys(deps).filter(dep => dep.includes(monorepo));
  }

  return [];
}

/** Recursively walk through deps to find packages in the monorepo to build.  */
const createDepsSet = (
  monorepo: string,
  dir: string,
  deps = new Set<string>()
) => {
  const finder = findPackageJson(dir);
  const { value: packageJson } = finder.next();

  if (!packageJson) {
    logger.debug(`No package.json found for "${dir}"`);
    return deps;
  }

  if (packageJson.name) {
    logger.debug(`Adding dependency: "${packageJson.name}"`);
    logger.debug(`From dir: "${dir}"`);
    deps.add(packageJson.name);
  }

  const subDeps = [
    ...filterDeps(monorepo, packageJson, 'dependencies'),
    ...filterDeps(monorepo, packageJson, 'devDependencies'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...filterDeps(monorepo, packageJson, 'storyDependencies' as any)
  ];

  subDeps.forEach(dep => {
    if (!deps.has(dep)) {
      createDepsSet(monorepo, resolve(`${dep}/package.json`), deps);
    }
  });

  return deps;
};

/**
 * A plugin to builds a component, any dependent component in the same
 * monorepo, and start a storybook for just the component.
 */
export default class DevPlugin implements Plugin {
  async run() {
    process.env.NODE_ENV = 'development';

    logger.await('Starting storybook...');
    spawn('npm', ['run', 'storybook'], { stdio: 'inherit' });

    if (process.cwd() === getMonorepoRoot()) {
      logger.info('Ran from root, building all components');
      spawn('npm', ['run', 'start'], { stdio: 'inherit' });
    } else {
      logger.info(
        'Ran from component, building this component and its dependencies'
      );
      this.watchDeps();
    }
  }

  /** Watch dependant directories in the monorepo.  */
  private watchDeps() {
    const finder = findPackageJson(process.cwd());
    const { filename } = finder.next();

    if (!filename) {
      throw new Error("Coudn't find package.json!");
    }

    // Watch package.json for changes so we are always building the correct deps
    const watcher = watch(filename, {
      awaitWriteFinish: true,
      ignoreInitial: false
    });

    this.buildDeps();

    watcher.on('ready', () => {
      watcher.on('change', this.buildDeps);
    });
  }

  /** Build the code for all the needed repos. */
  private buildDeps() {
    const monorepo = monorepoName();
    const deps = createDepsSet(monorepo, process.cwd());

    logger.note(`Found dependencies: ${[...deps].join(', ')}`);

    if (deps.size > 0) {
      const scopes = [...deps].reduce<string[]>(
        (all, dep) => [...all, '--scope', dep],
        []
      );

      spawn('npm', ['run', 'start', '--', ...scopes], {
        stdio: 'inherit',
        cwd: '../..'
      });
    }
  }
}
