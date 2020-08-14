import {
  createLogger,
  getMonorepoRoot,
  monorepoName,
  getLogLevel,
} from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import { execSync, ExecSyncOptions } from 'child_process';

import path from 'path';
import colorette from 'colorette';
import fs from 'fs-extra';
import fetch from 'node-fetch';
import { coerce, eq } from 'semver';
import marked from 'marked';
import TerminalRenderer from 'marked-terminal';

const logger = createLogger({ scope: 'update' });

marked.setOptions({
  renderer: new TerminalRenderer({
    /** Render the heading */
    firstHeading: (heading) =>
      colorette.bgBlackBright(colorette.whiteBright(heading)),
    heading: colorette.yellow,
    link: colorette.cyan,
    /** Render links */
    href: (href) => colorette.cyan(colorette.underline(href)),
    codespan: colorette.gray,
    tab: 2,
  }),
});

interface UpdatePluginOptions {
  /**
   * Get the release notes of what you would get by running `ds update`.
   * Will not perform the update.
   */
  releaseNotes?: boolean;
}

const logLevel = getLogLevel();
const execOptions: ExecSyncOptions = {
  stdio: logLevel === 'debug' || logLevel === 'trace' ? 'inherit' : 'ignore',
};

/** Get the current installed version of @design-systems/cli */
async function getCliVersion() {
  const monorepoRoot = getMonorepoRoot();
  const packageJson = JSON.parse(
    await fs.readFile(path.join(monorepoRoot, 'package.json'), 'utf8')
  );
  const { dependencies = {}, devDependencies = {} } = packageJson;
  const cli = Object.entries<string>({
    ...dependencies,
    ...devDependencies,
  }).find(([dep]) => dep === '@design-systems/cli');

  return cli ? cli[1] : '';
}

/** Get the release notes for @design-systems/cli */
async function getReleaseNotes(since: string) {
  logger.debug(`Getting release notes since v${since}`);

  const res = await fetch(
    'https://raw.githubusercontent.com/intuit/design-systems-cli/master/CHANGELOG.md'
  );
  const changelog = await res.text();

  const upToLastVersion = changelog.slice(0, changelog.indexOf(since) - 9);
  const withoutAuthors = upToLastVersion
    .replace(/#### Authors.*?\n(---|$)/gs, '')
    .trim();

  const markdown = marked(withoutAuthors);

  return markdown.replace(/####/g, '');
}

/** A plugin to update @design-systems/cli in all the projects in a monorepo. */
export default class UpdatePlugin implements Plugin<UpdatePluginOptions> {
  async run(options: UpdatePluginOptions) {
    const rawVersion = await getCliVersion();
    const { version } = coerce(rawVersion) || { version: '' };
    const notes = await getReleaseNotes(version);
    const latest = execSync('npm view @design-systems/cli version', {
      encoding: 'utf8',
    }).trim();

    if (eq(latest, rawVersion)) {
      logger.info(
        `You're already on the latest version! "@design-systems/cli@${latest}"`
      );
      return;
    }

    if (options.releaseNotes) {
      logger.info('Updates to be installed:\n');
      // eslint-disable-next-line no-console
      console.log(notes);
      return;
    }

    process.chdir(getMonorepoRoot());

    if (fs.existsSync('./packages/babel-preset')) {
      logger.info('Updating babel-plugin in preset...');

      // --no-bootstrap because we let the last yarn handle it so
      // we only run the install once
      try {
        execSync(
          `yarn lerna add @design-systems/babel-plugin-include-styles --exact --no-bootstrap --scope @${monorepoName()}/babel-preset`,
          execOptions
        );
      } catch (error) {
        logger.trace(error);
        logger.note(
          'No update found for @design-systems/babel-plugin-include-styles'
        );
      }
    }

    logger.info('Updating CLI version in root...');
    execSync(`yarn add -DW @design-systems/cli`, {
      ...execOptions,
      stdio: 'inherit',
    });

    logger.success('Updated to latest version of `@design-systems/cli`!');
    logger.success('Updates include:\n');
    // eslint-disable-next-line no-console
    console.log(notes);
  }
}
