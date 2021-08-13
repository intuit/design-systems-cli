import {
  createLogger
} from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import fs from 'fs-extra';
import {
  SizeArgs,
  SizeResult} from "./interfaces"
import { formatLine, formatExports } from "./utils/formatUtils";
import { buildPackages } from "./utils/BuildUtils";
import { calcSizeForAllPackages, reportResults, table, diffSizeForPackage } from "./utils/CalcSizeUtils";
import { startAnalyze } from "./utils/WebpackUtils";
import { createDiff } from "./utils/DiffUtils";

const logger = createLogger({ scope: 'size' });

const cssHeader = [
  'master: js',
  'pr: js',
  '+/-',
  '%',
  'master: css',
  'pr: css',
  '+/-',
  '%'
];

const defaultHeader = ['master', 'pr', '+/-', '%'];

/** A plugin to determine the size changes of packages. */
export default class SizePlugin implements Plugin<SizeArgs> {
  async run(args: SizeArgs) {

    const FAILURE_THRESHOLD = args.failureThreshold || 5;
    logger.info(`FAILURE_THRESHOLD : ${FAILURE_THRESHOLD}`);

    if (args.ci) {
      logger.disable();
    }

    if (Object.prototype.hasOwnProperty.call(args, 'mergeBase') && !args.mergeBase) {
      throw new Error('You must specify a commit-ish when --merge-base is set')
    }

    let local;
    if (fs.existsSync('lerna.json')) {
      if (args.mergeBase) {
        local = buildPackages({ mergeBase: args.mergeBase });
      }

      calcSizeForAllPackages({
        ...args,
        local
      });
      return;
    }

    const name = process.env.npm_package_name;

    if (!name) {
      throw new Error('Could not find "process.env.npm_package_name"');
    }

    if (args.mergeBase) {
      local = buildPackages({ mergeBase: args.mergeBase, name });
    }

    if (args.analyze) {
      await startAnalyze(name, args.registry, local);
      return;
    }

    if (args.diff) {
      logger.warn(
        'Bundle sizes will be larger during `--diff` because we do not minify for readability'
      );
    }

    const size: SizeResult = await diffSizeForPackage({
      name,
      main: process.cwd(),
      persist: args.persist || args.diff,
      chunkByExport: args.detailed,
      diff: args.diff,
      registry: args.registry,
      local
    });
    const header = args.css ? cssHeader : defaultHeader;

    await reportResults(
      name,
      size.percent <= FAILURE_THRESHOLD || size.percent === Infinity,
      Boolean(args.comment),
      table(
        args.detailed
          ? [['name', ...header], ...formatExports(size, args.css)]
          : [header, formatLine(size, args.css)],
        args.ci
      )
    );

    if (args.persist) {
      logger.success('Generated `bundle-master` and `bundle-pr`!');
    }

    if (args.diff) {
      createDiff();
    }

    if (size && size.percent > FAILURE_THRESHOLD && size.percent !== Infinity) {
      process.exit(1);
    }
  }
}
