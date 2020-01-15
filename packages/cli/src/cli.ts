#!/usr/bin/env node
/* eslint-disable no-underscore-dangle */

import { app } from 'command-line-application';
import fs from 'fs-extra';
import env from 'env-ci';
import dotenv from 'dotenv';
import path from 'path';
import get from 'dlv';
import checkForUpdate from 'update-check';
import merge from 'deepmerge';

import { createLogger, setLogLevel } from '@design-systems/cli-utils';
import { loadConfig, validateConfig } from '@design-systems/load-config';
import getApplicationDefinition, { getPlugin } from '@design-systems/core';

const log = createLogger({ scope: 'cli' });
const { isCi } = env();

/** Get the package.json of @design-systems/cli */
async function getPackageJson() {
  return JSON.parse(
    await fs.readFile(path.join(__dirname, '../package.json'), 'utf8')
  );
}

/** Warn the user if the installed CLI version is less than the latest. */
async function checkForNewerVersion() {
  if (isCi) {
    return;
  }

  try {
    const pkg = await getPackageJson();
    const update = await checkForUpdate(pkg);

    log.debug('UPDATE FROM CACHE:', update);

    if (update) {
      log.warn(
        `Newer version available!\n\nv${pkg.version} => v${update.latest}\nRun the following command:\n\nyarn ds update`
      );
    }
  } catch (error) {
    // If we can't find the package we probably are running off the network
    // That is when this error will be caught so we can do nothing
    log.debug(error);
  }
}

/** The the CLI and load the appropriate plugin. */
export async function main() {
  setLogLevel(
    (process.argv.includes('-v') && 'debug') ||
      (process.argv.includes('-vv') && 'trace') ||
      'info'
  );

  dotenv.config();
  const config = loadConfig();
  const cli = await getApplicationDefinition(config);
  const args = app(cli);

  if (!args) {
    return;
  }

  if (args.version) {
    const { version } = await getPackageJson();
    log.info(`Current version of "@design-systems/cli": ${version}`);
    checkForNewerVersion();
    return;
  }

  let validatedConfig: ReturnType<typeof validateConfig>;

  try {
    validatedConfig = validateConfig(config, cli);
  } catch (error) {
    log.error(error.message);
    log.debug(error.stack);
    return process.exit(1);
  }

  const commandName = Array.isArray(args._command)
    ? args._command[0]
    : args._command;
  const plugin = await getPlugin(commandName, validatedConfig);

  if (
    commandName !== 'update' &&
    !args.noVersionWarning &&
    !validatedConfig.noVersionWarning
  ) {
    checkForNewerVersion();
  }

  if (plugin) {
    const global = Object.entries(validatedConfig)
      .filter(
        ([key, value]) =>
          (Array.isArray(value) || typeof value !== 'object') &&
          key !== 'plugins'
      )
      .reduce((acc, [name, value]) => ({ ...acc, [name]: value }), {});
    const commandPath = Array.isArray(args._command)
      ? args._command.join('.')
      : args._command;

    return plugin.run(merge.all([global, args, get(config, commandPath, {})]));
  }

  log.error(`No matching command found: ${commandName}`);
  process.exit(1);
}

main();
