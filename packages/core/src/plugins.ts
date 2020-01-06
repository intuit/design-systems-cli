import fs from 'fs';
import path from 'path';
import importCwd from 'import-cwd';
import { getMonorepoRoot, createLogger } from '@design-systems/cli-utils';
import { Plugin, CliCommand } from '@design-systems/plugin';

export interface Configuration {
  /** Plugins loaded into @design-systems/cli */
  plugins?: string[];
}

const log = createLogger({ scope: 'plugins' });

/** Try to require some path. */
export function tryRequire(name: string) {
  try {
    log.debug(`Trying to require: ${name}`);
    return importCwd(name);
  } catch (error) {
    log.trace(error);
    return {};
  }
}

type Imported<T> = T & {
  /** default export */
  default: T;
};

/** Try to match a plugin name to a command definition. */
function getCommand(plugin: string) {
  let command = tryRequire(`${plugin}/command.js`) as Imported<CliCommand>;

  if (Object.keys(command).length === 0) {
    command = tryRequire(`${plugin}/dist/command.js`) as Imported<CliCommand>;
  }

  return 'default' in command ? command.default : command;
}

interface Constructable<T> {
  new (): T;
}

/** Attempt to require a plugin. */
function tryRequirePlugin(name: string) {
  const command = getCommand(name);

  // If it has a command file it's probably a plugin
  if (typeof command === 'function' || Object.keys(command).length > 0) {
    const plugin = tryRequire(name) as Imported<Constructable<Plugin>>;
    log.debug(`Found plugin "${command.name}": "${name}"`);
    return plugin.default || plugin;
  }
}

/** Attempt to require all supported plugin naming schemes. */
export function requirePlugin(name: string): Plugin | undefined {
  try {
    const Official = tryRequirePlugin(`@design-systems/${name}`);

    if (Official) {
      return new Official();
    }

    const OfficialCommand = tryRequirePlugin(`@design-systems/${name}-command`);

    if (OfficialCommand) {
      return new OfficialCommand();
    }

    const Module = tryRequirePlugin(name);

    if (Module) {
      return new Module();
    }
  } catch (error) {
    log.trace(error);
  }
}

/** Get plugins that are installed on the root package.json */
function getPluginsInstalled(): [string, CliCommand][] {
  try {
    const { dependencies = {}, devDependencies = {} } = JSON.parse(
      fs.readFileSync(path.join(getMonorepoRoot(), 'package.json'), 'utf8')
    );

    return Object.keys({ ...dependencies, ...devDependencies })
      .filter(
        dep =>
          /\S+\/design-systems-plugin/.test(dep) ||
          /design-systems-plugin-\S+/.test(dep)
      )
      .map((plugin: string) => [plugin, getCommand(plugin)]);
  } catch (error) {
    return [];
  }
}

/** Get plugins that are installed on the root package.json */
function getPluginsFromConfiguration(
  config: Configuration
): [string, CliCommand][] {
  if (!config.plugins) {
    return [];
  }

  try {
    return config.plugins.map((plugin: string) => [plugin, getCommand(plugin)]);
  } catch (error) {
    return [];
  }
}

/** Get all plugins found in the package.json. */
export const getPlugins = (
  config: Configuration = {}
): [string, CliCommand][] => [
  ...getPluginsInstalled(),
  ...getPluginsFromConfiguration(config)
];
