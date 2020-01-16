import {
  getMonorepoRoot,
  createLogger,
  monorepoName
} from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import path from 'path';
import fs from 'fs';
import glob from 'fast-glob';
import getPackages from 'get-monorepo-packages';

import { CLIEngine } from 'eslint';
import createESLintAnnotations from 'eslint-formatter-github/dist/create-check';
import jsFormatter from 'eslint-formatter-pretty';

import stylelint from 'stylelint';
import createStylelint from 'stylelint/lib/createStylelint';
import createStylelintAnnotations from 'stylelint-formatter-github/dist/create-check';
import cssFormatter from 'stylelint-formatter-pretty';
import { tmpdir } from 'os';

const logger = createLogger({ scope: 'lint' });

/** Get the folders that contain packages in the monorepo. */
function getPackageFolders() {
  return [
    ...getPackages('.').reduce((all, p) => {
      all.add(p.location.split('/')[0]);
      return all;
    }, new Set<string>())
  ];
}

/** Determine when a file was last edited */
function getLastEdited(filename: string) {
  try {
    return fs.statSync(filename).mtimeMs;
  } catch (error) {
    return 0;
  }
}

/** Return a list of files to lint */
function files(args: LintArgs, types: string) {
  const isRoot = getMonorepoRoot() === process.cwd();

  if (args.files) {
    const fileExt = new Set(types.split('|'));
    return args.files.filter(f => fileExt.has(path.extname(f).substr(1)));
  }

  if (isRoot) {
    return [`components/**/src/**/*.(${types})`];
  }

  return [`src/**/*.(${types})`];
}

type StylelintResult = stylelint.LinterResult & {
  /** Lines with needless disables */
  needlessDisables?: {
    /** The files the needless disables are found in */
    source: string;
    /** Ranges with needless disables */
    ranges: {
      /** Rule name */
      unusedRule: string;
      /** Line number */
      start: number;
    }[];
  }[];
};

/** Run stylelint with the given options. */
async function attemptStylelint(
  options: Partial<stylelint.LinterOptions>
): Promise<StylelintResult> {
  try {
    return (await stylelint.lint(options)) as StylelintResult;
  } catch (error) {
    if (error.message.includes('No files matching the pattern')) {
      return {
        results: [],
        output: 'no match',
        errored: false
      };
    }

    throw error;
  }
}

export interface LintArgs {
  /** Attempt to fix the lint errors. */
  fix?: boolean;
  /** Do not use any cached results from previous runs. */
  noCache?: boolean;
  /** Post lint results as annotations to PR. Only in CI. */
  annotate?: boolean;
  /** An optional list of files to lint */
  files?: string[];
}

/** A plugin to lint the project's files for errors. */
export default class LintPlugin implements Plugin<LintArgs> {
  async run(args: LintArgs) {
    if (process.env.CLI_APP_ID && process.env.CLI_PRIVATE_KEY) {
      process.env.ESLINT_APP_ID =
        process.env.ESLINT_APP_ID || process.env.CLI_APP_ID;
      process.env.ESLINT_PRIVATE_KEY =
        process.env.ESLINT_PRIVATE_KEY || process.env.CLI_PRIVATE_KEY;

      process.env.STYLELINT_APP_ID =
        process.env.STYLELINT_APP_ID || process.env.CLI_APP_ID;
      process.env.STYLELINT_PRIVATE_KEY =
        process.env.STYLELINT_PRIVATE_KEY || process.env.CLI_PRIVATE_KEY;
    }

    try {
      const jsErrors = await this.lintJS(args);
      const cssErrors = await this.lintCSS(args);

      logger.debug({ jsErrors, cssErrors });

      if (jsErrors + cssErrors > 0) {
        process.exit(1);
      }
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  }

  private async lintJS(args: LintArgs): Promise<number> {
    const root = getMonorepoRoot();
    const isRoot = root === process.cwd();

    const cacheLocation = path.join(tmpdir(), `eslint-${monorepoName()}`);
    const lastCacheUpdate = getLastEdited(cacheLocation);
    const lastEslintRcUpdate = getLastEdited(path.join(root, '.eslintrc'));

    logger.debug(`Using .eslintcache located at: "${cacheLocation}"`);
    logger.debug(`Cache was last updated: ${lastCacheUpdate}`);
    logger.debug(`RC was last updated: ${lastEslintRcUpdate}`);

    // Eslint cache will only re-run a file if a file has changed.
    // This doesn't interact well with plugins that rely on non-js files
    //
    // We need to also bust the cache in the following situations
    //
    // - .eslintrc - when rules change
    // - **/package.json - when new deps are added (for import plugin)
    let bustCache = false;
    const packages = (await glob(['**/package.json', '!**/node_modules'])).map(
      getLastEdited
    );

    if (lastCacheUpdate > 0) {
      if (lastEslintRcUpdate > lastCacheUpdate) {
        logger.debug(`RC has been updated since last run, deleting cache.`);
        bustCache = true;
      } else if (packages.find(c => c > lastCacheUpdate)) {
        logger.debug(
          `A package.json has been updated since last run, deleting cache.`
        );
        bustCache = true;
      }
    }

    const linter = new CLIEngine({
      fix: args.fix,
      cache: !args.noCache && !bustCache,
      cacheLocation,
      extensions: ['ts', 'tsx', 'js', 'jsx'],
      ignorePath: path.join(__dirname, '../.eslintignore'),
      reportUnusedDisableDirectives: true
    });

    const lintFiles = isRoot ? getPackageFolders() : ['src'];

    const report = linter.executeOnFiles(
      args.files ? files(args, 'ts|tsx|js|jsx') : lintFiles
    );

    if (args.fix) {
      CLIEngine.outputFixes(report);
    }

    const annotate = Boolean(
      args.annotate || (process.env.CLI_APP_ID && process.env.CLI_PRIVATE_KEY)
    );
    const formattedResults = jsFormatter(report.results);

    if (report.errorCount > 0) {
      logger.error('Project contains JS errors', formattedResults);
    } else if (report.warningCount > 0) {
      logger.warn('Project contains JS warnings', formattedResults);
    } else {
      logger.success('JS');
    }

    if (annotate) {
      await createESLintAnnotations(report.results);
    }

    return report.errorCount;
  }

  private async lintCSS(args: LintArgs): Promise<number> {
    try {
      const { config } = await createStylelint({}).getConfigForFile(
        getMonorepoRoot()
      );

      // styled-components preprocessor disables autofixing
      // here we override the processor so it fixes css files
      if (args.fix) {
        const results = await attemptStylelint({
          fix: true,
          files: files(args, 'css'),
          config: {
            ...config,
            processors: undefined,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            codeProcessors: undefined
          }
        });

        if (results.output.includes('no match')) {
          logger.info(
            'No CSS files were found, cannot automatically fix issues.'
          );
        }
      }

      const cacheLocation = path.join(tmpdir(), `stylelint-${monorepoName()}`);
      const css = await attemptStylelint({
        files: files(args, 'css'),
        cache: !args.noCache,
        cacheLocation
      });
      // Must run twice because https://github.com/stylelint/stylelint/issues/4203
      // Caching should help with speed
      const { needlessDisables = [] } = await attemptStylelint({
        files: files(args, 'css'),
        reportNeedlessDisables: true,
        cache: !args.noCache,
        cacheLocation
      });
      const scripts = await attemptStylelint({
        files: files(args, 'js|jsx|ts|tsx'),
        cache: !args.noCache,
        cacheLocation,
        config: {
          ...config,
          rules: {
            ...config.rules,
            // None of these rules play too nicely in css-in-js
            'a11y/media-prefers-reduced-motion': null,
            'rule-empty-line-before': null,
            'at-rule-empty-line-before': null,
            'declaration-empty-line-before': null,
            'order/order': null
          }
        }
      });
      const hasError =
        (css.errored && css.output) || (scripts.errored && scripts.output);
      const results = [...css.results, ...scripts.results].map(result => {
        const disables = needlessDisables.find(
          file => file.source === result.source
        );

        if (!disables) {
          return result;
        }

        return {
          ...result,
          warnings: [
            ...result.warnings,
            ...disables.ranges.map(range => ({
              rule: range.unusedRule,
              severity: 'warning' as stylelint.Severity,
              text: 'Needless stylint-disable',
              line: range.start,
              column: 0
            }))
          ]
        };
      });

      logger.trace('Stylelint Results', JSON.stringify(results, null, 2));

      if (hasError) {
        logger.error('Project contains CSS errors', cssFormatter(results));
      } else {
        logger.success('CSS');
      }

      if (
        args.annotate ||
        (process.env.CLI_APP_ID && process.env.CLI_PRIVATE_KEY)
      ) {
        await createStylelintAnnotations(results);
      }

      return hasError ? results.length : 0;
    } catch (error) {
      if (error.message.includes('No configuration provided')) {
        logger.debug(
          "No configuration provided for stylelint. To lint CSS please include a .stylelintrc in your project's root."
        );
      } else {
        logger.debug(error);
      }

      return 0;
    }
  }
}
