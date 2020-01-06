import { app } from 'command-line-application';
import dedent from 'dedent';
import {
  setLogLevel,
  getMonorepoRoot,
  createLogger
} from '@design-systems/cli-utils';
import { CliCommand } from '@design-systems/plugin';

import run, { CreateComponentArgs, CreateSystemArgs } from './run';
import { system } from './cli';

const systemStandalone: CliCommand = {
  ...system,
  examples: [
    'npm init @design-systems',
    'npm init @design-systems --name ids --repo hipstersmoothie/material'
  ],
  options: [
    ...(system.options || []),
    {
      name: 'verbose',
      alias: 'v',
      description: 'Output the debug logs. Debug: -v Trace: -vv',
      type: Boolean,
      multiple: true
    }
  ]
};

const [, , ...processArgs] = process.argv;

const args = app(systemStandalone, { argv: processArgs });
const logger = createLogger({ scope: 'create' });

if (args) {
  // eslint-disable-next-line no-underscore-dangle
  args._command = 'system';
  const verbosity = args.verbose ? args.verbose.length : 0;
  setLogLevel(
    (verbosity === 1 && 'debug') || (verbosity === 2 && 'trace') || 'info'
  );

  const monorepoRoot = getMonorepoRoot();

  if (monorepoRoot && process.cwd().includes(monorepoRoot)) {
    logger.error(dedent`Already in a @design-systems monorepo!

      You seem to be trying to create a new @design-systems monorepo from within another.

      This probably isn\'t what you want. Common situations:

      1. Ran \`yarn run create\` from a sub-package 
        => Change directories to the root of the project and re-run command

      2. Ran \`npm init @design-systems\` within a design system
        => Change directories to a folder that isn't in a monorepo (no lerna.json in parent folders)
    `);
  } else {
    run(args as (CreateComponentArgs | CreateSystemArgs));
  }
}
