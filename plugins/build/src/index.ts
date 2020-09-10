import { createLogger } from '@design-systems/cli-utils';
import { Plugin } from '@design-systems/plugin';
import { SyncBailHook } from 'tapable';
import path from 'path';
import dedent from 'dedent';
import fs from 'fs-extra';
import minimatch from 'minimatch';
import { watch as fileWatcher } from 'chokidar';
import glob from 'fast-glob';
import formatBytes from 'pretty-bytes';
import formatTime from 'pretty-ms';

import CleanCSS from 'clean-css';
import postcss from 'postcss';

import { getOutPath } from './utils';
import transpileJS, {
  getJSOutputFiles,
  BABEL_CONFIG,
  SuccessState,
} from './babel';
import transpileCSS, { getCSSPath } from './postcss';
import { defaults } from './command';
import TypescriptCompiler from './typescript';

interface CSSBuild {
  /** Name of the CSS build ex "main" */
  name: string;
  /** Path to the PostCSS configuration */
  path: string;
}

export interface BuildArgs {
  /** Start the build in watch mode */
  watch: boolean;
  /** Optimization level for clean-css */
  cssOptimizationLevel: 0 | 1 | 2;
  /** Directory with all the source files */
  inputDirectory: string;
  /** Directory to place all the build files */
  outputDirectory: string;
  /** The name of the concatenated css for the component */
  cssMain: string;
  /** Whether to add an automatic CSS import to the ESM entry */
  cssImport: boolean;
  /** List of multiple extra PostCSS config files to run */
  cssConfigs: CSSBuild[];
  /** What files to ignore during the build. */
  ignore: string | string[];
}

const POSTCSS_CONFIG = path.join(__dirname, './configs/postcss.config.js');

/** Find all matching globs. */
function match(file: string, globs: string | string[]) {
  const resolved = path.resolve(file);
  const globArr = Array.isArray(globs) ? globs : [globs];
  return globArr.find((currGlob) => minimatch(resolved, currGlob));
}

/** Allow users to specify filename without the extension */
function makeCSSFilename(filename: string) {
  if (filename.endsWith('.css')) return filename;
  return `${filename}.css`;
}

export { getPostCssConfig, getPostCssConfigSync } from './postcss';
export { getBabelConfig, getBabelOptions } from './babel';

type CSSResult = { [key: string]: Map<string, postcss.Result> };

/**
 * Build looks for js and css files in src/ and outputs a CJS, ESM, and CSS builds to /dist.
 * By default the same folder structure is maintained.
 *
 * - css files are replaced with their js equivalent.
 * - ESM builds use the .mjs extension, CJS uses .js.
 */
export default class BuildPlugin implements Plugin<BuildArgs> {
  public hooks = {
    processCSSFiles: new SyncBailHook<CleanCSS.Source[]>(['cssFiles']),
  };

  private logger = createLogger({ scope: 'build' });

  private cssFiles: CSSResult = {};

  private buildArgs: BuildArgs = defaults;

  private typescriptCompiler!: TypescriptCompiler;

  /**
   * Add a CSS import to the module build of the package
   * This makes CSS imports automatic, while not adding it for NodeJS tools
   */
  addCSSImport = async () => {
    this.logger.trace('Import CSS: Adding CSS import to ESM entry');

    // Don't add an import if there is no CSS file
    if (Object.keys(this.cssFiles).length === 0) {
      this.logger.trace(
        'Import CSS: Skipping CSS import because no CSS was built for this package'
      );
      return;
    }

    const packageExists = fs.existsSync(
      path.join(process.cwd(), 'package.json')
    );
    if (!packageExists) return;

    let entry = path.join(
      process.cwd(),
      this.buildArgs.outputDirectory,
      'esm',
      'index.js'
    );
    const packageJson = JSON.parse(
      await fs.readFile(path.join(process.cwd(), 'package.json'), 'utf8')
    );

    if (packageJson && packageJson.module) {
      entry = path.join(process.cwd(), packageJson.module);
      this.logger.trace('Import CSS: Module entry found', entry);
    }

    const entryExists = fs.existsSync(entry);
    if (!entryExists) return;

    try {
      fs.appendFileSync(
        entry,
        `\nimport "../${makeCSSFilename(this.buildArgs.cssMain)}"`
      );
      this.logger.complete('Added CSS import to module entry');
    } catch (e) {
      this.logger.error('Import CSS: Error appending CSS import', e);
    }
  };

  /** Minify and combine all the css */
  generateCSS = async () => {
    if (Object.keys(this.cssFiles).length === 0) {
      return;
    }

    for (const [buildName, files] of Object.entries(this.cssFiles)) {
      this.logger.trace(
        `Generating merged css for ${makeCSSFilename(buildName)}`
      );

      const outFile = path.join(
        this.buildArgs.outputDirectory,
        makeCSSFilename(buildName)
      );

      const clean = new CleanCSS({
        sourceMap: true,
        sourceMapInlineSources: true,
        level: this.buildArgs.cssOptimizationLevel,
        rebase: false,
        rebaseTo: this.buildArgs.outputDirectory,
      });

      const cssToMinify = Array.from(files.entries()).map(
        ([file, { css, map }]) => ({
          [file]: {
            styles: css,
            sourceMap: map
              .toString()
              .replace(/<input css (\d+)>/g, '../src/<input css $1>'),
          },
        })
      );

      const minified = clean.minify(
        this.hooks.processCSSFiles.call(cssToMinify) || cssToMinify
      );

      if (minified.errors.length > 0) {
        this.logger.debug('Errors\n\n', minified.errors.join('\n '), '\n');
      }

      if (minified.warnings.length > 0) {
        this.logger.debug('Warnings\n\n', minified.warnings.join('\n '), '\n');
      }

      const duration = formatTime(minified.stats.timeSpent);
      const efficiency = minified.stats.efficiency.toPrecision(2);
      const difference = formatBytes(
        minified.stats.originalSize - minified.stats.minifiedSize
      );

      this.logger.debug(dedent`
      CSS minification results:

      Original: ${formatBytes(minified.stats.originalSize)}
      Minified: ${formatBytes(minified.stats.minifiedSize)}

      ${difference} -${efficiency}% ${duration}\n
    `);

      await fs.outputFile(`${outFile}.map`, minified.sourceMap);
      await fs.outputFile(
        outFile,
        `${minified.styles}\n/*# sourceMappingURL=${makeCSSFilename(
          buildName
        )}.map */`
      );

      this.logger.complete(`Generated merged ${makeCSSFilename(buildName)}`);
    }
  };

  /** Getall all files in the input directory */
  getFileList = async () => glob(`${this.buildArgs.inputDirectory}/**/*.*`);

  /** Run relevant transforms on a file */
  transformFile = async (file: string) => {
    const { inputDirectory, outputDirectory } = this.buildArgs;

    if (this.isIgnored(file)) {
      return;
    }

    switch (path.extname(file)) {
      case '.css': {
        this.logger.pending(`CSS -> ${file}`);

        if (this.buildArgs.cssConfigs.length === 0) {
          // Single PostCSS build
          const CSSMain = this.buildArgs.cssMain;
          this.logger.trace(`Single PostCSS build requested`);
          if (!this.cssFiles[CSSMain]) {
            this.logger.trace(`Creating map for ${CSSMain}`);
            this.cssFiles[CSSMain] = new Map<string, postcss.Result>();
          }

          return (
            transpileCSS({
              inFile: file,
              inDir: inputDirectory,
              outDir: outputDirectory,
              configFile: POSTCSS_CONFIG,
              watch: this.buildArgs.watch,
            })
              // Save the CSS output for merging later
              .then((css) => {
                this.logger.trace(`Completed CSS transpile for ${file}`);
                css && this.cssFiles[CSSMain].set(path.resolve(file), css);
              })
          );
        }

        // Multiple PostCSS Builds
        const promises: Promise<
          void | postcss.Result | Map<string, postcss.Result>
        >[] = [];
        for (const config of this.buildArgs.cssConfigs) {
          this.logger.trace(
            `Multiple CSS Builds detected, building file for ${makeCSSFilename(
              config.name
            )}`
          );
          if (!this.cssFiles[config.name]) {
            this.cssFiles[config.name] = new Map<string, postcss.Result>();
          }

          promises.push(
            transpileCSS({
              inFile: file,
              inDir: inputDirectory,
              outDir: outputDirectory,
              configFile: config.path,
              watch: this.buildArgs.watch,
            })
              // Save the CSS output for merging later
              .then(
                (css) =>
                  css && this.cssFiles[config.name].set(path.resolve(file), css)
              )
          );
        }

        return Promise.all(promises);
      }

      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        this.logger.pending(`transpiling -> ${file}`);

        return transpileJS(file, inputDirectory, outputDirectory, BABEL_CONFIG);
      default:
        this.logger.pending(`copy -> ${file}`);

        await fs.copy(
          file,
          path.join(
            getOutPath(inputDirectory, file, path.join(outputDirectory, 'cjs')),
            path.basename(file)
          )
        );
        await fs.copy(
          file,
          path.join(
            getOutPath(inputDirectory, file, path.join(outputDirectory, 'esm')),
            path.basename(file)
          )
        );
        break;
    }
  };

  /** Logic on what to do when a file changes */
  onAddOrChanged = async (file: string) => {
    this.logger.info(`File changed: ${file}`);
    const extname = path.extname(file);

    try {
      const result = await this.transformFile(file);

      if (
        result &&
        'success' in result &&
        result.success &&
        (extname === '.ts' || extname === '.tsx')
      ) {
        await this.typescriptCompiler.buildTypes(true);
      }
    } catch (error) {
      this.logger.trace(error);
    }

    if (file.includes('theme.')) {
      await Promise.all(
        Object.keys(this.cssFiles).map((buildName) => {
          return [...this.cssFiles[buildName].keys()].map(async (cssFile) =>
            this.transformFile(cssFile)
          );
        })
      );
    }

    if (extname === '.css' || file.includes('theme.')) {
      await this.generateCSS();
      await this.typescriptCompiler.buildTypes(true);
    }

    if (file.includes('tsconfig.json')) {
      await this.typescriptCompiler.buildTypes(true);
    }

    this.logger.watch('Watching for changes');
  };

  /** Logic on what to do when a file is deleted */
  onDelete = async (file: string) => {
    const { inputDirectory, outputDirectory } = this.buildArgs;
    this.logger.info(`File deleted: ${file}`);

    switch (path.extname(file)) {
      case '.css': {
        const fName = path.resolve(file);

        for (const [, files] of Object.entries(this.cssFiles)) {
          if (files.has(fName)) {
            files.delete(fName);
          }
        }

        const cssPath = getCSSPath(file, inputDirectory, outputDirectory);

        await Promise.all([
          this.generateCSS(),
          fs.remove(cssPath),
          fs.remove(`${cssPath}.json`),
        ]);
        return;
      }

      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx': {
        const { cjsFile, mjsFile } = getJSOutputFiles(
          file,
          inputDirectory,
          outputDirectory
        );
        await Promise.all([fs.remove(cjsFile), fs.remove(mjsFile)]);
        return;
      }

      default:
        await fs.remove(
          path.join(
            getOutPath(inputDirectory, file, outputDirectory),
            path.basename(file)
          )
        );
    }
  };

  /** Check if a file is ignored */
  isIgnored = (filename: string) => match(filename, this.buildArgs.ignore);

  /** Run the build in watch mode */
  watch = async () => {
    const watcher = fileWatcher(
      [this.buildArgs.inputDirectory, 'tsconfig.json'],
      {
        awaitWriteFinish: true,
        ignoreInitial: false,
      }
    );

    /** Only run a function for non-ignored files. */
    const withIgnore = (fn: (f: string) => void) => (file: string) => {
      if (this.isIgnored(file)) {
        return;
      }

      fn(file);
    };

    return new Promise<void>((resolve, reject) => {
      watcher.on('error', reject);
      watcher.on('ready', () => {
        this.logger.watch('Watching for changes');
        watcher.on('add', withIgnore(this.onAddOrChanged));
        watcher.on('change', withIgnore(this.onAddOrChanged));
        watcher.on('unlink', withIgnore(this.onDelete));
      });
    });
  };

  /** Run the plugin */
  async run(args: BuildArgs) {
    this.buildArgs = { ...this.buildArgs, ...args };
    this.typescriptCompiler = new TypescriptCompiler(this.buildArgs);
    const startTime = Date.now();
    const { watch, outputDirectory, cssImport } = this.buildArgs;

    // Since watching happens across everything in parallel,
    // leave any old build there for now
    if (!watch && !fs.existsSync(outputDirectory)) {
      await fs.remove('tsconfig.tsbuildinfo');
    }

    const files = await this.getFileList();

    // Kick off all of the transforms in parallel
    const transformed = files
      .map(
        (nextFile) => !this.isIgnored(nextFile) && this.transformFile(nextFile)
      )
      .filter(
        (i): i is Promise<undefined | SuccessState> => typeof i !== 'boolean'
      );

    // We need to wait until all the CSS is done before merging them
    const results = await Promise.all(transformed);
    this.logger.trace(
      'CSS Files after transform',
      JSON.stringify(this.cssFiles, null, 3)
    );
    await this.generateCSS();

    if (cssImport) {
      await this.addCSSImport();
    }

    const hasTSFiles = files.some((file) =>
      path.extname(file).startsWith('.ts')
    );
    if (hasTSFiles) {
      if (
        results.find(
          (result) => result && result.success !== undefined && !result.success
        )
      ) {
        this.logger.info('Skipping type build. Build errors found.');
      } else {
        await this.typescriptCompiler.buildTypes(watch);
      }
    } else {
      this.logger.info('Skipping type build. No .ts(x) files found.');
    }

    const runtime = formatTime(Date.now() - startTime);
    this.logger.done(
      `Transformed ${transformed.length} files in ${runtime} seconds`
    );

    if (watch) {
      return this.watch();
    }
  }
}
