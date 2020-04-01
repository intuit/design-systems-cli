import {
  monorepoName,
  createLogger
} from '@design-systems/cli-utils';
import {
  SizeArgs,
  Size,
  SizeResult,
  CommonOptions
} from "./interfaces"
import { Plugin } from '@design-systems/plugin';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import Commently from 'commently';
import { table as cliTable } from 'table';
import signale from 'signale';
import Diff2Html from 'diff2html';
import opn from 'opn';
import { formatLine, defaultTotals, formatExports } from "./formatUtils";
import { startAnalyze, getSizes, calcSizeForAllPackages, reportResults, table, diffSizeForPackage } from "./CalcSizeUtils";
import { createDiff } from "./utils/DiffUtils";
const FAILURE_THRESHOLD = 5;
const logger = createLogger({ scope: 'size' });
const RUNTIME_SIZE = 537;


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
    if (args.ci) {
      logger.disable();
    }

    if (fs.existsSync('lerna.json')) {
      calcSizeForAllPackages(args);
      return;
    }

    const name = process.env.npm_package_name;

    if (!name) {
      throw new Error('Could not find "process.env.npm_package_name"');
    }

    if (args.analyze) {
      await startAnalyze(name, args.registry);
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
      registry: args.registry
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
