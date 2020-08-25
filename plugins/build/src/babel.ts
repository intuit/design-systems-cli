import { getMonorepoRoot, createLogger } from '@design-systems/cli-utils';
import path from 'path';
import * as babel from '@babel/core';
import fs from 'fs-extra';

import { getOutPath, formatError } from './utils';

export const BABEL_CONFIG = path.join(__dirname, './configs/babel.config.js');

const logger = createLogger({ scope: 'build' });
type SupportedEnvironments = 'commonjs' | 'module';

export interface SuccessState {
  /** Whether the transpilation was successful. */
  success: boolean;
}

/** Write a babel compilation result to the file system. */
async function write(
  result: babel.BabelFileResult | null,
  dest: string
): Promise<void> {
  if (!result) {
    return;
  }

  let { code } = result;

  if (result.map) {
    await fs.outputJson(`${dest}.map`, result.map);
    code = `${code}\n//# sourceMappingURL=${path.basename(dest)}.map`;
  }

  await fs.outputFile(dest, code);
}

/** Transpiled the file to all of the supported formats. */
export function getJSOutputFiles(
  inFile: string,
  inDir: string,
  outDir: string
) {
  const ext = path.extname(inFile);
  const base = path.basename(inFile, ext);
  const cjsFile = path.join(
    getOutPath(inDir, inFile, path.join(outDir, 'cjs')),
    `${base}.js`
  );
  const mjsFile = path.join(
    getOutPath(inDir, inFile, path.join(outDir, 'esm')),
    `${base}.js`
  );

  return {
    cjsFile,
    mjsFile
  };
}

/** Load @design-systems/cli's default babel.config.js */
export function getBabelConfig(
  filename: string,
  envName?: SupportedEnvironments,
  configFile = BABEL_CONFIG
): babel.PartialConfig {
  const babelConfig = babel.loadPartialConfig({
    configFile,
    filename,
    envName
  });

  if (!babelConfig) {
    throw new Error('Could not find babel config!');
  }

  return babelConfig;
}

/** Load the options (cli's + user) for babel. */
export function getBabelOptions(
  filename: string,
  envName?: SupportedEnvironments,
  configFile = BABEL_CONFIG
): babel.TransformOptions {
  const { options } = getBabelConfig(filename, envName, configFile);
  const customConfigPath = path.join(getMonorepoRoot(), 'babel.config.js');
  const customConfig = fs.existsSync(customConfigPath)
    ? customConfigPath
    : undefined;

  return {
    ...options,
    configFile: customConfig,
    babelrc: true
  };
}

/** Transpile code using babel for a specific environment. */
async function transpileForEnv(
  filename: string,
  envName: SupportedEnvironments,
  configFile: string
) {
  const options = getBabelOptions(filename, envName, configFile);

  return babel.transformFileAsync(filename, {
    ...options,
    envName
  });
}

/**
 * Transpile a JS file using babel.
 * Write the CJS and ESM versions to disk.
 */
export default async function transpile(
  inFile: string,
  inDir: string,
  outDir: string,
  configFile: string
): Promise<SuccessState> {
  const { cjsFile, mjsFile } = getJSOutputFiles(inFile, inDir, outDir);
  const filename = path.resolve(inFile);

  try {
    const [cjsOut, mjsOut] = await Promise.all([
      transpileForEnv(filename, 'commonjs', configFile),
      transpileForEnv(filename, 'module', configFile)
    ]);

    await Promise.all([write(cjsOut, cjsFile), write(mjsOut, mjsFile)]);
  } catch (error) {
    const parts = error.message.match(/^(\S+): (.+) \((\d+):(\d+)\)([\S\s]*)/);

    if (parts) {
      logger.error('Transpilation failed');

      // eslint-disable-next-line no-console
      console.log(
        formatError({
          file: parts[1],
          line: parts[3],
          column: parts[4],
          tool: 'BABEL',
          message: parts[2],
          code: parts[5]
        })
      );
    } else {
      logger.error(error.message);
    }

    logger.trace(error.stack);

    process.exit(1);
  }

  return { success: true };
}
