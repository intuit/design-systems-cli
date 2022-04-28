import { monorepoName, createLogger } from '@design-systems/cli-utils';
import { loadConfig } from '@design-systems/load-config';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import gitlog from 'gitlog';
import chunk from 'lodash.chunk';
import getPackages from 'get-monorepo-packages';
import { table as cliTable } from 'table';
import Commently from 'commently';
import { execSync } from 'child_process';
import markdownTable from 'markdown-table';
import signale from 'signale';
import { formatLine, defaultTotals, formatExports } from './formatUtils';
import {
  SizeArgs,
  Size,
  SizeResult,
  CommonOptions,
  CommonCalcSizeOptions,
  DiffSizeForPackageOptions
} from '../interfaces';
import { getSizes } from './WebpackUtils';
import { getLocalPackage, loadPackage } from './BuildUtils';

const RUNTIME_SIZE = 537;

export const logger = createLogger({ scope: 'size' });

const cssHeader = [
  'master: js',
  'pr: js',
  '+/-',
  '%',
  'master: css',
  'pr: css',
  '+/-',
  '%',
];

const defaultHeader = ['master', 'pr', '+/-', '%'];

/** Calculate the bundled CSS and JS size. */
async function calcSizeForPackage({
  name,
  importName,
  scope,
  persist,
  chunkByExport,
  diff,
  registry,
  local
}: CommonOptions & CommonCalcSizeOptions): Promise<Size> {
  const packageName = local ? getLocalPackage(importName, local) : name;
  const dir = await loadPackage({
    name: packageName,
    registry
  });
  const sizes = await getSizes({
    name: packageName,
    importName,
    scope,
    persist,
    chunkByExport,
    diff,
    registry,
    dir
  });
  const packageConfig = loadConfig({
    cwd: path.join(dir, 'node_modules', packageName)
  });
  fs.removeSync(dir);

  const js = sizes.filter((size) => !size.chunkNames.includes('css'));
  const css = sizes.filter((size) => size.chunkNames.includes('css'));

  if (!js) {
    logger.warn(`No JS found for ${name}`);
  }

  if (!css) {
    logger.warn(`No CSS found for ${name}`);
  }

  // Must use minified values because comments in the un-minified version differ
  return {
    js: js.length ? js.reduce((acc, i) => i.size + acc, 0) - RUNTIME_SIZE : 0, // Minus webpack runtime size;
    css: css.length ? css.reduce((acc, i) => i.size + acc, 0) : 0,
    exported: sizes,
    limit: packageConfig?.size?.sizeLimit
  };
}

/** Compare the local package vs the current release. */
async function diffSizeForPackage({
  name,
  main,
  persist = false,
  chunkByExport = false,
  diff = false,
  registry,
  local
}: DiffSizeForPackageOptions): Promise<SizeResult> {
  let master: Size;

  try {
    master = await calcSizeForPackage({
      name,
      importName: name,
      scope: 'master',
      persist,
      chunkByExport,
      diff,
      registry,
      local
    });
  } catch (error) {
    logger.error(
      'Something went wrong building the master version of your package\n',
      error.message
    );
    logger.trace(error.stack);
    master = { js: 0, css: 0 };
  }

  const pr = await calcSizeForPackage({
    name: main,
    importName: name,
    scope: 'pr',
    persist,
    chunkByExport,
    diff,
    registry
  });
  const masterSize = master.js + master.css;
  const prSize = pr.js + pr.css;
  const difference = prSize - masterSize;
  const percent = (difference / masterSize) * 100;

  return {
    master,
    pr,
    percent,
    localBudget: pr.limit
  };
}

/** Create a mock npm package in a tmp dir on the system. */
export function mockPackage(): string {
  const id = Math.random().toString(36).substring(7);
  const dir = path.join(os.tmpdir(), `package-size-${id}`);

  fs.mkdirSync(dir);
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      name: id,
      private: true,
      license: 'MIT',
    }),
    'utf8'
  );

  return dir;
}

/** Determine which packages have git changes. */
function getChangedPackages({ mergeBase }: SizeArgs) {
  const all = getPackages('.');

  try {
    // this assumes on master whereas we want the last tag
    const packages = execSync('lerna changed --ndjson --toposort', {
      stdio: ['pipe'],
    })
      .toString()
      .trim()
      .split('\n');
    const lastTag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8',
    });
    // Use commit-ish hash instead of the last tag if provided
    const hash = mergeBase?.trim();
    const changedFiles = gitlog({
      repo: process.cwd(),
      number: Number.MAX_SAFE_INTEGER,
      fields: ['hash', 'authorName', 'authorEmail', 'rawBody'],
      execOptions: { maxBuffer: Infinity },
      branch: `${hash || lastTag.trim()}..HEAD`,
    })
      .reduce<string[]>((files, commit) => [...files, ...commit.files], [])
      .map((file) => path.resolve(path.join(process.cwd(), file)));
    const changedDeps: string[] = [];

    return packages
      .map((p: string) => JSON.parse(p))
      .filter((json: Record<string, unknown>) =>
        changedFiles.some((file) => {
          const hasChangedFiles = file.includes(String(json.location));

          if (hasChangedFiles) {
            changedDeps.push(String(json.name));
          } else {
            // Check if a dep has changed too
            const packageJson = JSON.parse(
              fs.readFileSync(path.join(String(json.location), 'package.json'), {
                encoding: 'utf-8',
              })
            );
            const hasChangedDep = Object.keys(packageJson).some((dep) =>
              changedDeps.includes(dep)
            );

            if (hasChangedDep) {
              changedDeps.push(String(json.name));
              return hasChangedDep;
            }
          }

          return hasChangedFiles;
        })
      )
      .map((json) => {
        return { location: json.location, package: { ...json } };
      });
  } catch (error) {
    if (!error.message.includes('fatal: ambiguous argument')) {
      throw error;
    }

    return all;
  }
}

/** Report the results and success/failure. */
async function reportResults(
  name: string,
  success: boolean,
  comment: boolean,
  tableOutput: string
) {
  if (success) {
    logger.success(name);
  } else {
    logger.error(name);
  }

  // eslint-disable-next-line no-console
  console.log(tableOutput);

  if (comment && process.env.GH_TOKEN) {
    const footer = success
      ? '✅ No size breaking changes detected'
      : '❌  Failed! ❌';

    const commenter = new Commently({
      title: 'Bundle Size Report',
      key: 'bundle-size',
      // Jenkin doesn't support owner/repo or any slug so a user must
      // provide these values themselves
      owner: process.env.OWNER,
      repo: process.env.REPO,
      useHistory: false,
    });

    try {
      await commenter.autoComment(`${tableOutput}\n\n${footer}`);
    } catch (error) {
      logger.error(error);
    }
  }
}

/** Create a table. */
function table(data: (string | number)[][], isCi?: boolean) {
  if (isCi) {
    return markdownTable(data as (string)[][]);
  }

  return cliTable(data);
}

/** Generate diff for all changed packages in the monorepo. */
async function calcSizeForAllPackages(args: SizeArgs & CommonCalcSizeOptions) {
  const ignore = args.ignore || [];
  const interactive = new signale.Signale({
    interactive: true,
    disabled: args.ci,
  });
  const changedPackages = (args.all
    ? getPackages('.')
    : getChangedPackages(args)
  ).filter((p) => !p.package.private && !ignore.includes(p.package.name));
  let success = true;

  const rowLength = changedPackages.length >= 5 ? 5 : changedPackages.length;

  if (changedPackages.length > 0) {
    logger.info(
      `Calculating size difference for:\n${cliTable(
        chunk(
          changedPackages.map((packageJson) => packageJson.package.name),
          rowLength
        ).map((row) =>
          row.length === rowLength
            ? row
            : [...Array(rowLength)].map((v, i) => row[i] || ' ')
        )
      )}`
    );
  }

  const results: SizeResult[] = [];
  const sizes = await Promise.all(
    changedPackages.map(async (packageJson) => {
      interactive.await(`Building: ${packageJson.package.name}`);

      const packagePath = packageJson.location.includes(process.cwd())
        ? packageJson.location
        : path.join(process.cwd(), packageJson.location);

      const size = await diffSizeForPackage({
        name: packageJson.package.name,
        main: packagePath,
        persist: args.persist,
        chunkByExport: args.detailed,
        registry: args.registry,
        local: args.local
      });
      results.push(size);

      const FAILURE_THRESHOLD = args.failureThreshold || 5;
      if (size.percent > FAILURE_THRESHOLD && size.percent !== Infinity) {
        success = false;
        logger.error(`${packageJson.package.name} failed bundle size check :(`);
      } else {
        logger.success(`${packageJson.package.name} passed bundle size check!`);
      }

      return args.detailed
        ? formatExports(size, args.css, `${packageJson.package.name} - `)
        : [[packageJson.package.name, ...formatLine(size, args.css)]];
    })
  );

  const header = args.css ? cssHeader : defaultHeader;
  const data = [
    ['name', ...header],
    ...sizes.reduce((acc, i) => [...acc, ...i], []),
  ];

  if (sizes.length > 1 && !args.detailed) {
    data.push(defaultTotals(results, args.css));
  }

  await reportResults(
    monorepoName(),
    success,
    Boolean(args.comment),
    sizes.length > 0 ? table(data, args.ci) : ''
  );

  if (!success) {
    process.exit(1);
  }
}

export { calcSizeForAllPackages, reportResults, table, diffSizeForPackage };
