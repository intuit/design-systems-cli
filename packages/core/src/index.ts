import BuildCommand from '@design-systems/build/dist/command';
import TestCommand from '@design-systems/test/dist/command';
import LintCommand from '@design-systems/lint/dist/command';
import CreateCommand from '@design-systems/create-command/dist/command';
import StorybookCommand from '@design-systems/storybook/dist/command';
import SizeCommand from '@design-systems/size/dist/command';
import DevCommand from '@design-systems/dev/dist/command';
import PlayroomCommand from '@design-systems/playroom/dist/command';
import CleanCommand from '@design-systems/clean/dist/command';
import UpdateCommand from '@design-systems/update/dist/command';
import ProofCommand from '@design-systems/proof/dist/command';
import BundleCommand from '@design-systems/bundle/dist/command';

import { CliCommand } from '@design-systems/plugin';
import { getPlugins, Configuration, requirePlugin } from './plugins';

export * from './plugins';

const commands = [
  DevCommand,
  CleanCommand,
  BuildCommand,
  TestCommand,
  LintCommand,
  StorybookCommand,
  PlayroomCommand,
  SizeCommand,
  CreateCommand,
  UpdateCommand,
  ProofCommand,
  BundleCommand
];

/** Get all the commands that @design-systems/cli ships with */
async function getOfficialCommands() {
  return Promise.all(
    commands.map(async command => {
      if (typeof command === 'function') {
        return command();
      }

      return command;
    })
  );
}

/**
 * Generate the command-line-args schema for the design-systems cli.
 */
export async function getCommands(
  config: Configuration = {}
): Promise<CliCommand[]> {
  const user = getPlugins(config).map(([, c]) => c);
  const official = await getOfficialCommands();

  return [...official, ...user];
}

/**
 * Get the plugin to run from the CLI arg.
 *
 * User plugins take precendence over official in the case someone
 * wants to override behavior.
 */
export async function getPlugin(
  commandName: string,
  config: Configuration = {}
) {
  const officialCommands = await getOfficialCommands();

  const officialPluginName =
    officialCommands.find(c => c.name === commandName) && commandName;
  const userPlugin = getPlugins(config).find(([, c]) => c.name === commandName);
  const plugin =
    (userPlugin && userPlugin[0]) || officialPluginName || undefined;

  if (!plugin) {
    return;
  }

  return requirePlugin(plugin);
}

/** Return the CLI program definition. */
export default async function getApplicationDefinition(
  config: Configuration = {}
): Promise<CliCommand> {
  return {
    name: 'ds',
    description: 'A toolbox for creating design systems',
    commands: await getCommands(config),
    options: [
      {
        name: 'verbose',
        alias: 'v',
        description: 'Output the debug logs. Debug: -v Trace: -vv',
        type: Boolean,
        multiple: true
      },
      {
        name: 'version',
        description:
          'Print the current version of the current @design-systems/cli',
        type: Boolean
      },
      {
        name: 'no-version-warning',
        description: 'Prevent the CLI from warning about new versions',
        type: Boolean,
        config: true
      }
    ]
  };
}
