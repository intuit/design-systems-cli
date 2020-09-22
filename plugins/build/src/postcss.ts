import { createLogger } from '@design-systems/cli-utils';
import { getMonorepoRoot } from '@design-systems/cli-utils';
import fs from 'fs-extra';
import path from 'path';
import postcss, { Result } from 'postcss';
import postcssload, { PostCSSConfig } from 'postcss-load-config';
import { codeFrameColumns } from '@babel/code-frame';

import { getOutPath, formatError } from './utils';

const logger = createLogger({ scope: 'build' });

/** Get the output path for a css file. */
export function getCSSPath(inFile: string, inDir: string, outDir: string) {
  const name = path.basename(inFile);
  const outPath = getOutPath(inDir, inFile, outDir);
  const cssFile = path.join(outPath, name);
  return cssFile;
}

/**
 * Check package and monorepo cwd for postcss.config.js and returns
 * path. Defaults to empty string.
 */
function getUserPostcssConfig(
  multiBuildConfigFile?: string,
  cwd: string = process.cwd(),
  configFilename = 'postcss.config.js'
): string {
  logger.trace('Getting User PostCSS config at', configFilename);
  // Try package cwd
  const pkgConfigPath = path.join(cwd, configFilename);

  if (fs.existsSync(pkgConfigPath)) {
    return pkgConfigPath;
  }

  if (multiBuildConfigFile) {
    // Try multi-build cwd
    const monoRepoConfigPath = path.join(
      getMonorepoRoot(cwd),
      multiBuildConfigFile
    );

    if (fs.existsSync(monoRepoConfigPath)) {
      return monoRepoConfigPath;
    }
  }

  // Try monorepo cwd
  const monoRepoConfigPath = path.join(getMonorepoRoot(cwd), configFilename);

  if (fs.existsSync(monoRepoConfigPath)) {
    return monoRepoConfigPath;
  }

  // Default to empty string
  return '';
}

interface LoadOptions {
  /** Use css modules */
  useModules?: boolean;
  /** The path to the config file */
  configFile?: string;
  /** The path to the multibuild config file */
  multiBuildConfigFile?: string;
  /** Where to store the build results */
  outDir?: string;
  /** Dir to start looking for configs in */
  cwd?: string;
  /**
   * Report whether there were errors when loading the config.
   * If we are building a package that runs before everything is built
   * and it doesn't have css (in the typescript build). We don't care about the error.
   */
  reportError?: boolean;
}

/** Fail the process if the postcss.config has errors */
const reportConfigError = (error: Error) => {
  // Error on anything but the following message. This message is
  // present when the user hasn't configured postcss
  if (!error.message.includes('No PostCSS Config found')) {
    logger.error('Something is wrong in your postcss.config!');
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  }
};

/** Load the user's postcss config or our default. */
export async function getPostCssConfig({
  useModules,
  configFile = require.resolve('./configs/postcss.config'),
  multiBuildConfigFile = undefined,
  outDir = 'dist',
  cwd = process.cwd(),
  reportError = true,
}: LoadOptions) {
  const context = useModules
    ? {
        env: 'module',
        outDir,
      }
    : {};

  try {
    return await postcssload(
      context,
      getUserPostcssConfig(multiBuildConfigFile, cwd)
    );
  } catch (error) {
    if (reportError) {
      reportConfigError(error);
      logger.trace(error);
    }

    return postcssload(context, configFile);
  }
}

/** Load the user's postcss config or our default synchronously. */
export function getPostCssConfigSync({
  useModules,
  configFile = require.resolve('./configs/postcss.config'),
  multiBuildConfigFile = undefined,
  outDir = 'dist',
  cwd = process.cwd(),
  reportError = true,
}: LoadOptions): PostCSSConfig {
  const context = useModules
    ? {
        env: 'module',
        outDir,
      }
    : {};

  try {
    return postcssload.sync(
      context,
      getUserPostcssConfig(multiBuildConfigFile, cwd)
    );
  } catch (error) {
    if (reportError) {
      reportConfigError(error);
      logger.trace(error);
    }

    return postcssload.sync(context, configFile);
  }
}

interface TranspileOptions {
  /** Css file to transpile */
  inFile: string;
  /** Directory file is in */
  inDir: string;
  /** Directory to put the build output */
  outDir: string;
  /** Where the postcss.config is */
  configFile: string;
  /** A multibuild config file to use if not overridden */
  multiBuildConfigFile?: string;
  /** The builder was started in watch mode */
  watch: boolean;
}

/**
 * Transpile a CSS file using babel.
 * Write the CJS version to disk.
 * Write the transpiled version to disk.
 *
 * @returns the transpiled CSS
 */
export default async function transpile({
  inFile,
  inDir,
  outDir,
  configFile,
  multiBuildConfigFile,
  watch,
}: TranspileOptions): Promise<Result | void> {
  // Append .js to the end of the file so auto importing works
  const cssFile = getCSSPath(inFile, inDir, outDir);
  const { plugins, options } = await getPostCssConfig({
    useModules: true,
    configFile,
    multiBuildConfigFile,
    outDir,
  });

  const processor = postcss(plugins);
  const fileContents = await fs.readFile(inFile);

  try {
    const result = await processor.process(fileContents, {
      ...options,
      plugins,
      to: cssFile,
      from: inFile,
      map: { inline: false },
    });

    await fs.outputFile(
      `${cssFile}.map`,
      result.map
        .toString()
        .replace(/<input css (\d+)>/g, '../src/<input css $1>')
    );

    return result;
  } catch (error) {
    logger.error('Something went wrong building your css!');

    let message = error;

    if (error.name === 'CssSyntaxError') {
      const { line, column, file, reason } = error;

      message = formatError({
        file,
        line,
        column,
        message: reason,
        tool: 'POSTCSS',
        code: codeFrameColumns(
          error.source,
          { start: { line, column } },
          { highlightCode: true }
        ),
      });
    }

    // eslint-disable-next-line no-console
    console.log(message);

    if (!watch) {
      process.exit(1);
    }
  }
}
