/* eslint-disable no-underscore-dangle */

// eslint-disable import/no-extraneous-dependencies
import {
  lerna,
  monorepoName,
  createLogger,
  getLogLevel,
  getMonorepoRoot
} from '@design-systems/cli-utils';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { pascalCase, paramCase, camelCase } from 'change-case';
import { titleCase } from 'title-case';
import dedent from 'dedent';
import createEstimator, { LogOption } from 'progress-estimator';
import spinners from 'cli-spinners';
import degit from 'degit';
import crypto from 'crypto';

import copy from './copy';
import {
  getTemplate,
  CreationChoice,
  listTemplates,
  Template
} from './template';

const lernaInfo = lerna();

const estimator = createEstimator({
  spinner: spinners.clock
});

// The location of `packages/` (where we want to add the new component)
const BASE_DIR = getMonorepoRoot();
const pkgLocation = path.join(__dirname, '..', 'package.json');
const cliVersion = JSON.parse(fs.readFileSync(pkgLocation, 'utf-8')).version;

/** Get the repo for the project. */
const repo = () => {
  try {
    const { repository } = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
    );

    return typeof repository === 'object' ? repository.url : repository;
  } catch (error) {}
};

export interface TemplateOptions {
  /** The name of the package */
  name: string;
  /** The package author's name */
  authorName: string;
  /** The package author's email */
  authorEmail: string;
  /** Version of the package to create */
  version: string;
  /** A url to where the repo is stored */
  repoUrl: string;
  /** The name of the monorepo */
  monorepoName: string;
}

const defaultVersion = (lernaInfo && lernaInfo.version) || '0.0.0';

/** Get the default author name from the local system. */
const defaultAuthorName = () => {
  try {
    return String(execSync('git config --get user.name')).trim();
  } catch (error) {
    return '';
  }
};

/** Get the default author email from the local system. */
const defaultAuthorEmail = () => {
  try {
    return String(execSync('git config --get user.email')).trim();
  } catch (error) {
    return '';
  }
};

/** Determine the destination directory of the templated package. */
function getDestDirectory(
  command: CreationChoice,
  name: string,
  dest?: string
) {
  const pascal = pascalCase(name);
  const kebab = paramCase(name);

  return (
    (command === 'component' &&
      path.join(BASE_DIR, dest ?? 'components', pascal)) ||
    (command === 'package' && path.join(BASE_DIR, dest ?? 'packages', kebab)) ||
    dest ||
    name
  );
}

/** Prompt the user with a question. */
const prompt = async (questions: inquirer.QuestionCollection) => {
  const res = await inquirer.prompt<{
    /** The input value from the user */
    value: string;
  }>({
    ...questions,
    name: 'value'
  });

  return res.value;
};

/** Ask the user for the name of the new thing to create. */
const askName = async (type: CreationChoice, force?: boolean) =>
  prompt({
    type: 'input',
    message: `What's the ${type} name?`,

    /** Validate the user's name input */
    validate: input => {
      if (force) {
        return true;
      }

      if (!input) {
        return 'Name is required';
      }

      if (fs.existsSync(getDestDirectory(type, input))) {
        return 'Name already exists as a directory';
      }

      if (type !== 'system') {
        try {
          const name = `@${monorepoName()}/${paramCase(input)}`;
          execSync(`npm view ${name}`, { stdio: 'ignore' });

          return `Package already exists on the registry: "${name}"`;
        } catch (error) {}
      }

      return true;
    }
  });

/** Ask the user for their name. */
const askAuthor = async () =>
  prompt({
    type: 'input',
    message: "What's your name?",
    default: defaultAuthorName,

    /** Validate the user's name input */
    validate: input => {
      if (!input) {
        return 'Author name is required';
      }

      return true;
    }
  });

/** Ask the user for their email. */
const askEmail = async () =>
  prompt({
    type: 'input',
    message: "What's your email?",
    default: defaultAuthorEmail,

    /** Validate the user's email input */
    validate: input => {
      if (!input) {
        return 'Author email is required';
      }

      return true;
    }
  });

/** Ask the what version they want their package to be. */
const askVersion = async () =>
  prompt({
    type: 'input',
    message: "Starting version? You probably don't want to change this",
    default: defaultVersion
  });

/** Ask the user for the repo of the monorepo. */
const askRepo = async () =>
  prompt({
    type: 'input',
    message: 'Repository url or owner/repo:',

    /** Validate the user's repo input */
    validate: input => {
      if (!input) {
        return 'Repository is required';
      }

      return true;
    }
  });

export interface CreateArgsBase {
  /** The name of the thing to create */
  name?: string;
  /** Ignore if a directory already exists */
  force?: boolean;
  /** The GitHub repo to pull the template from */
  template?: string;
  /** List available templates */
  listTemplates?: boolean;
  /** A list of user configured templates for the command */
  templates?: Template[];
}

export interface CreateComponentArgs extends CreateArgsBase {
  /** The create component sub-command */
  _command: ['create', 'component'];

  /** A custom directory to use instead of `components` */
  destination?: string;
}

export interface CreateSystemArgs extends CreateArgsBase {
  /** The create system sub-command */
  _command: ['create', 'system'];
  /** Create the system in the CWD */
  cwd?: boolean;
  /** Repository url for the new repo */
  repo?: string;
}

export interface CreatePackageArgs extends CreateArgsBase {
  /** The create package sub-command */
  _command: ['create', 'package'];

  /** A custom directory to use instead of `packages` */
  destination?: string;
}

type CreateArgs = CreateComponentArgs | CreateSystemArgs | CreatePackageArgs;

/** Determine which sub-command was run. */
const getCommand = (args: CreateArgs) =>
  Array.isArray(args._command) ? args._command[1] : args._command;

const logger = createLogger({ scope: 'create' });

/** Get the path to the template on GitHub. */
async function getTemplatePath(args: CreateArgs): Promise<string> {
  const command = getCommand(args);
  const template = getTemplate(command, args.template || 'ts', args.templates);

  logger.pending('Cloning template...');
  logger.debug(template);

  const emitter = degit(template, {
    cache: false,
    force: true,
    verbose: true
  });

  emitter.on(
    'info',
    (info: {
      /** A message from the degit process. */
      message: string;
    }) => {
      logger.debug(info.message);
    }
  );

  const dir = path.join(
    os.tmpdir(),
    `design-systems-${crypto.randomBytes(16).toString('hex')}`
  );

  try {
    await emitter.clone(dir);
  } catch (error) {
    logger.error(error.message);
    logger.debug(error.stack);
    process.exit(0);
  }

  return dir;
}

/** A plugin to create a completely new system or a new package in a system. */
export default async function run(args: CreateArgs) {
  const command = getCommand(args);

  if (args.listTemplates) {
    logger.info(listTemplates(command, args.template, args.templates));
    return;
  }

  const template = await getTemplatePath(args);
  const skipUnnecessaryPrompts = Boolean(args.name);
  const name = args.name || (await askName(command, args.force));
  const config: TemplateOptions = {
    name,
    authorName:
      (skipUnnecessaryPrompts && defaultAuthorName()) || (await askAuthor()),
    authorEmail:
      (skipUnnecessaryPrompts && defaultAuthorEmail()) || (await askEmail()),
    version: (skipUnnecessaryPrompts && defaultVersion) || (await askVersion()),
    repoUrl:
      ('repo' in args && args.repo) ||
      (skipUnnecessaryPrompts && repo()) ||
      repo() ||
      (await askRepo()),
    monorepoName: monorepoName()
  };
  const pascal = pascalCase(config.name);
  const kebab = paramCase(config.name);
  let destinationDirectory = getDestDirectory(
    command,
    config.name,
    'destination' in args ? args.destination : undefined
  );

  if ('cwd' in args && args.cwd) {
    logger.debug('Creating repo in current working directory...');
    destinationDirectory = '.';
  }

  if ('force' in args && args.force) {
    await fs.remove(destinationDirectory);
  } else if (fs.existsSync(destinationDirectory)) {
    logger.error(
      `Destination directory already exists! '${destinationDirectory}'\n\nRun with --force to ignore`
    );
    process.exit(1);
  }

  logger.debug('Creating templated directory...');
  await copy(template, destinationDirectory, {
    ...config,
    cliVersion,
    title: titleCase(config.name),
    kebab,
    pascal,
    camel: camelCase(config.name)
  });
  logger.debug('Created templated directory!');

  if (command === 'component') {
    logger.success(dedent`\n
      ✨   You made a component  ✨

      🏎️   Start developing:

      yarn
      cd ${destinationDirectory}
      yarn dev
    `);
  } else if (command === 'package') {
    logger.success(dedent`\n
      ✨   You made a package  ✨

      📦   Start developing:

      yarn
      cd ${destinationDirectory}
      yarn start
    `);
  } else {
    if ('cwd' in args && !args.cwd) {
      logger.info('Initializing git repo');

      execSync(`cd ${config.name} && git init`);
      execSync(`cd ${config.name} && git remote add origin ${config.repoUrl}`);

      logger.await('Running yarn. This may take a bit...');

      await estimator(
        new Promise((res, rej) => {
          try {
            const isVerbose =
              getLogLevel() === 'debug' || getLogLevel() === 'trace';
            execSync(`cd ${config.name} && yarn`, {
              stdio: isVerbose ? 'inherit' : 'ignore'
            });
            res();
          } catch (error) {
            rej(error);
          }
        }),
        'Installing dependencies',
        72 * 1000 as LogOption
      );
      execSync(
        `cd ${config.name} && git add . && git commit --no-verify -m 'Create new design system'`
      );
    }

    logger.success(dedent`\n
      ✨  You made a design system  ✨
        
      🧬   Create your first component:
      ${destinationDirectory === '.' ? '' : `\ncd ${destinationDirectory}`}
      yarn run create
    `);
  }
}
