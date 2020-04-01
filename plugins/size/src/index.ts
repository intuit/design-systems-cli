import {
  monorepoName,
  getMonorepoRoot,
  createLogger,
  getLogLevel
} from '@design-systems/cli-utils';
import {
  SizeArgs,
  Size,
  SizeResult
} from "./interfaces"
import { Plugin } from '@design-systems/plugin';
import { execSync, ExecSyncOptions } from 'child_process';
import path from 'path';
import os from 'os';
import chunk from 'lodash.chunk';
import fs from 'fs-extra';
import Commently from 'commently';
import getExports from '@royriojas/get-exports-from-file';
import { camelCase } from 'change-case';
import InjectPlugin from 'webpack-inject-plugin';

import { table as cliTable } from 'table';
import markdownTable from 'markdown-table';
import signale from 'signale';
import getPackages from 'get-monorepo-packages';
import Diff2Html from 'diff2html';
import opn from 'opn';
import { formatLine, defaultTotals, formatExports } from "./formatUtils";
import webpack from 'webpack';
import Terser from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import RelativeCommentsPlugin from './RelativeCommentsPlugin';

const FAILURE_THRESHOLD = 5;
const logger = createLogger({ scope: 'size' });
const RUNTIME_SIZE = 537;

/** Turn an array of key value pairs into an object */
export const fromEntries = <T>(entries: [string, T][]): Record<string, T> =>
  Object.assign({}, ...entries.map(([name, value]) => ({ [name]: value })));

/** Run webpack with a configuration. */
async function runWebpack(
  config: webpack.Configuration
): Promise<webpack.Stats> {
  return new Promise((resolve, reject) => {
    try {
      const compiler = webpack(config);

      compiler.run((err, stats) => {
        if (err) return reject(err);
        return resolve(stats);
      });
    } catch (error) {
      logger.error('Something went wrong!');
      logger.error(error);
      logger.trace('Webpack Configuration:\n', config);
    }
  });
}









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

/** Create a mock npm package in a tmp dir on the system. */
function mockPackage() {
  const id = Math.random()
    .toString(36)
    .substring(7);
  const dir = path.join(os.tmpdir(), `package-size-${id}`);

  fs.mkdirSync(dir);
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({
      name: id,
      private: true,
      license: 'MIT'
    }),
    'utf8'
  );

  return dir;
}

interface ConfigOptions {
  /** The directory to make a webpack config for */
  dir: string;
}

/** Generate webpack config. */
const config = async ({
  dir,
  name,
  importName,
  analyze,
  analyzerPort,
  chunkByExport,
  diff
}: ConfigOptions & CommonOptions & GetSizesOptions) => {
  const isLocal = name[0] !== '@';
  const js = isLocal ? name : path.join(dir, 'node_modules', name);
  const packageJsonPath = isLocal
    ? path.join(name, 'package.json')
    : path.join(dir, 'node_modules', name, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const cssFile = path.join(name, 'dist/main.css');
  const css = isLocal ? cssFile : path.join(dir, 'node_modules', cssFile);
  const peers = Object.keys(packageJson.peerDependencies || {});

  const jsPath = require.resolve(js);
  const { exported } = await getExports.es6(jsPath.replace('cjs', 'esm'));
  const { exported: cjsExports } = await getExports.cjs(jsPath);
  const allExports = exported.length ? exported : cjsExports;

  logger.debug(`Using JS file: ${jsPath}`);
  logger.debug(`Using CSS file: ${css}`);
  logger.debug('Found exported:\n', allExports);

  const plugins: webpack.Plugin[] = [];
  const entry = fromEntries(
    chunkByExport
      ? allExports.map(e => {
        const content = e.default
          ? `export { default as ${camelCase(e.name)} } from "${importName}";`
          : `export { ${e.name} } from "${importName}";`;

        plugins.push(new InjectPlugin(() => content, { entryName: e.name }));

        // This is the actual package "undefined"
        return [e.name, [path.join(__dirname, 'undefined.js')]];
      })
      : [['js', [js]]]
  );

  if (fs.existsSync(css)) {
    entry.css = [css];
  }

  logger.debug('Webpack Entry Files:\n', entry);

  return {
    devtool: false,
    mode: 'production',
    entry,
    output: {
      path: dir
    },
    externals: [
      /^react(-dom)?$/,
      fromEntries(
        Object.keys(packageJson.peerDependencies || {}).map(c => [c, c])
      ),
      /*
       * We need to account for peer dependency sub-paths since webpack does
       * not handle this for us.
       *
       * EX:
       * externals: { "@fuego/gsap-premium": "@fuego/gsap-premium" }
       * will not externalize the following path
       * import "@fuego/gsap-premium/CssPlugin"
       *
       * so this function aims to exclude any sub-path.
       */
      function (context, request, callback) {
        if (peers.find(peer => request.startsWith(`${peer}/`))) {
          logger.debug(`Externalizing: ${request}`);
          return callback(null, JSON.stringify(request));
        }

        callback(undefined, undefined);
      }
    ],
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin()]
    },
    module: {
      rules: [
        // https://github.com/apollographql/react-apollo/issues/1737#issuecomment-372946515
        {
          type: 'javascript/auto',
          test: /\.mjs$/,
          use: []
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      analyze && new BundleAnalyzerPlugin({ analyzerPort }),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      ...plugins,
      diff
        ? new RelativeCommentsPlugin({ importName })
        : new Terser({
          extractComments: false,
          cache: true,
          parallel: true,
          sourceMap: false,
          terserOptions: {
            output: {
              comments: false
            }
          }
        })
    ].filter(Boolean)
  } as webpack.Configuration;
};

type Scope = 'pr' | 'master';

interface CommonOptions {
  /** The name of the package to get size for */
  name: string;
  /** The name of to import the pacakge with */
  importName: string;
  /** Where the code is located. */
  scope: Scope;
  /** Whether to persist the generated bundle to the filesystem */
  persist?: boolean;
  /** Create chunks based on the exports from the component */
  chunkByExport?: boolean;
  /** Whether the size output will be diffed */
  diff?: boolean;
  /** The registry to install packages from */
  registry?: string;
}

interface GetSizesOptions {
  /** Whether to start the analyzer */
  analyze?: boolean;
  /** What port to start the analyzer on */
  analyzerPort?: number;
}

/** Install package to tmp dir and run webpack on it to calculate size. */
async function getSizes(options: GetSizesOptions & CommonOptions) {
  const dir = mockPackage();
  const execOptions: ExecSyncOptions = {
    cwd: dir,
    stdio: getLogLevel() === 'trace' ? 'inherit' : 'ignore'
  };

  try {
    const browsersList = path.join(getMonorepoRoot(), '.browserslistrc');

    if (fs.existsSync(browsersList)) {
      fs.copyFileSync(browsersList, path.join(dir, '.browserslistrc'));
    }

    logger.debug(`Installing: ${options.name}`);

    if (options.registry) {
      execSync(
        `yarn add ${options.name} --registry ${options.registry}`,
        execOptions
      );
    } else {
      execSync(`yarn add ${options.name}`, execOptions);
    }
  } catch (error) {
    logger.debug(error);
    logger.warn(`Could not find package ${options.name}...`);
    return [];
  }

  const result = await runWebpack(
    await config({
      dir,
      ...options
    })
  );

  logger.debug(`Completed building: ${dir}`);

  if (options.persist) {
    const folder = `bundle-${options.scope}`;
    const out = path.join(process.cwd(), folder);

    logger.info(`Persisting output to: ${folder}`);

    await fs.remove(out);
    await fs.copy(dir, out);
    await fs.writeFile(`${out}/stats.json`, JSON.stringify(result.toJson()));
    await fs.writeFile(
      `${out}/.gitignore`,
      'node_modules\npackage.json\npackage-lock.json\nstats.json'
    );
    execSync('git init', { cwd: out });
    execSync('prettier --single-quote "**/*.{css,js}" --write', { cwd: out });
    execSync('git add .', { cwd: out });
    execSync('git commit -m "init"', { cwd: out });
  }

  fs.removeSync(dir);

  if (result.hasErrors()) {
    throw new Error(result.toString('errors-only'));
  }

  const { assets } = result.toJson();

  if (!assets) {
    return [];
  }

  return assets;
}

/** Calculate the bundled CSS and JS size. */
async function calcSizeForPackage({
  name,
  importName,
  scope,
  persist,
  chunkByExport,
  diff,
  registry
}: CommonOptions): Promise<Size> {
  const sizes = await getSizes({
    name,
    importName,
    scope,
    persist,
    chunkByExport,
    diff,
    registry
  });

  const js = sizes.filter(size => !size.chunkNames.includes('css'));
  const css = sizes.filter(size => size.chunkNames.includes('css'));

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
    exported: sizes
  };
}

interface DiffSizeForPackageOptions
  extends Omit<CommonOptions, 'importName' | 'scope'> {
  /** Path to the local built pacakge */
  main: string;
}

/** Compare the local package vs the current release. */
async function diffSizeForPackage({
  name,
  main,
  persist = false,
  chunkByExport = false,
  diff = false,
  registry
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
      registry
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
    percent
  };
}

/** Create a table. */
function table(data: (string | number)[][], isCi?: boolean) {
  if (isCi) {
    return markdownTable(data);
  }

  return cliTable(data);
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
      useHistory: false
    });

    try {
      await commenter.autoComment(`${tableOutput}\n\n${footer}`);
    } catch (error) {
      logger.error(error);
    }
  }
}

/** Determine which packages have git changes. */
function getChangedPackages() {
  const all = getPackages('.');

  try {
    const packages = execSync('lerna changed --ndjson', { stdio: ['pipe'] })
      .toString()
      .trim()
      .split('\n');

    return packages.map((p: string) => {
      const json = JSON.parse(p);
      return { location: json.location, package: { ...json } };
    });
  } catch (error) {
    if (!error.message.includes('fatal: ambiguous argument')) {
      throw error;
    }

    return all;
  }
}

/** Generate diff for all changed packages in the monorepo. */
async function calcSizeForAllPackages(args: SizeArgs) {
  const ignore = args.ignore || [];
  const interactive = new signale.Signale({
    interactive: true,
    disabled: args.ci
  });
  const changedPackages = (args.all
    ? getPackages('.')
    : getChangedPackages()
  ).filter(p => !p.package.private && !ignore.includes(p.package.name));
  let success = true;

  const rowLength = changedPackages.length >= 5 ? 5 : changedPackages.length;

  if (changedPackages.length > 0) {
    logger.info(
      `Calculating size difference for:\n${cliTable(
        chunk(
          changedPackages.map(packageJson => packageJson.package.name),
          rowLength
        ).map(row =>
          row.length === rowLength
            ? row
            : [...Array(rowLength)].map((v, i) => row[i] || ' ')
        )
      )}`
    );
  }

  const results: SizeResult[] = [];
  const sizes = await Promise.all(
    changedPackages.map(async packageJson => {
      interactive.await(`Building: ${packageJson.package.name}`);

      const packagePath = packageJson.location.includes(process.cwd())
        ? packageJson.location
        : path.join(process.cwd(), packageJson.location);

      const size = await diffSizeForPackage({
        name: packageJson.package.name,
        main: packagePath,
        persist: undefined,
        chunkByExport: args.detailed,
        registry: args.registry
      });
      results.push(size);

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
    ...sizes.reduce((acc, i) => [...acc, ...i], [])
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

/** Start the webpack bundle analyzer for both of the bundles. */
async function startAnalyze(name: string, registry?: string) {
  logger.start('Analyzing build output...');

  await Promise.all([
    getSizes({
      name,
      importName: name,
      scope: 'master',
      analyze: true,
      registry
    }),
    getSizes({
      name: process.cwd(),
      importName: name,
      scope: 'pr',
      analyze: true,
      analyzerPort: 9000,
      registry
    })
  ]);
}

/** Open a html git diff of the two bundles. */
function createDiff() {
  logger.start('Creating diff of build output...');

  execSync('git remote add pr ../bundle-pr && git fetch pr', {
    cwd: 'bundle-master',
    stdio: 'ignore'
  });

  const diff = execSync(
    "git --no-pager diff master pr/master -- ':!package-lock.json' ':!yarn.lock'",
    {
      cwd: 'bundle-master'
    }
  ).toString();

  if (!diff) {
    logger.success('No differences found in bundles!');
    return;
  }

  const outputHtml = Diff2Html.html(diff, {
    drawFileList: true,
    matching: 'lines',
    outputFormat: 'side-by-side'
  });

  fs.writeFileSync(
    'diff.html',
    `
      <html>
        <head>
          <!-- CSS -->
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/github.min.css">
          <link rel="stylesheet" type="text/css" href="https://unpkg.com/diff2html@2.7.0/dist/diff2html.css">

          <!-- Javascripts -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/css.min.js"></script>

          <script type="text/javascript" src="https://unpkg.com/diff2html@2.7.0/dist/diff2html.js"></script>
          <script type="text/javascript" src="https://unpkg.com/diff2html@2.7.0/dist/diff2html-ui.js"></script>
          <style>
            .d2h-files-diff {
              height: inherit;
            }
            
            .d2h-file-side-diff {
              margin-bottom: -4px;
            }
          </style>
        </head>
        <body id="main" style="font-family: Roboto,sans-serif;">
          ${outputHtml}
        </body>
        <script>
          $(document).ready(function() {
            var diff2htmlUi = new Diff2HtmlUI();
            diff2htmlUi.highlightCode('#main');
            diff2htmlUi.fileListCloseable('#main', true);
          });
        </script>
      </html>
    `
  );

  opn('diff.html', { wait: false }).then(() =>
    logger.info('Diff opened in browser!')
  );
}

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
