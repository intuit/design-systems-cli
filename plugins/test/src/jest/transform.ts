/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Transformer } from '@jest/transform';
import { TransformOptions, transformSync as babelTransform } from '@babel/core';
import { getBabelConfig, getBabelOptions } from '@design-systems/build';

const babelIstanbulPlugin = require.resolve('babel-plugin-istanbul');
const THIS_FILE = fs.readFileSync(__filename);

const options: TransformOptions = {
  caller: {
    name: '@design-systems/cli-jest',
    supportsStaticESM: false
  },
  compact: false,
  sourceMaps: 'both'
};

export const canInstrument = true;

/** Lifted from the official jest-babel code. */
export const getCacheKey: Transformer['getCacheKey'] = (
  fileData,
  filename,
  configString,
  { instrument, rootDir }
) => {
  const babelOptions = getBabelConfig(filename);
  const configPath = [babelOptions.config || '', babelOptions.babelrc || ''];

  return crypto
    .createHash('md5')
    .update(THIS_FILE)
    .update('\0', 'utf8')
    .update(JSON.stringify(babelOptions.options))
    .update('\0', 'utf8')
    .update(fileData)
    .update('\0', 'utf8')
    .update(path.relative(rootDir, filename))
    .update('\0', 'utf8')
    .update(configString)
    .update('\0', 'utf8')
    .update(configPath.join(''))
    .update('\0', 'utf8')
    .update(instrument ? 'instrument' : '')
    .digest('hex');
};

/** Process a javascript file for jest to consume. */
export const process: Transformer['process'] = (
  src,
  filename,
  config,
  transformOptions
) => {
  const babelOptions = {
    ...getBabelOptions(filename),
    ...options,
    minified: false
  };

  if (transformOptions && transformOptions.instrument) {
    babelOptions.auxiliaryCommentBefore = ' istanbul ignore next ';
    // Copied from jest-runtime transform.js
    babelOptions.plugins = (babelOptions.plugins || []).concat([
      [
        babelIstanbulPlugin,
        {
          // files outside `cwd` will not be instrumented
          cwd: config.rootDir,
          exclude: []
        }
      ]
    ]);
  }

  const transformResult = babelTransform(src, babelOptions);

  if (transformResult && typeof transformResult.code === 'string') {
    const { code, map } = transformResult;

    if (typeof code === 'string') {
      return { code, map };
    }
  }

  return src;
};
