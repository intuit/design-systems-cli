/* eslint-disable @typescript-eslint/ban-ts-ignore, @typescript-eslint/no-var-requires */

import path from 'path';
import fs from 'fs';
// @ts-ignore
import babelConfig from '@design-systems/build/babel.config';
import {
  createLogger,
  loadUserWebpackConfig,
  getMonorepoRoot
} from '@design-systems/cli-utils';

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { Snippet } from 'playroom';

const logger = createLogger({ scope: 'playroom' });
const config = babelConfig({ env: () => '' });

// Allows us to define snippets in TypeScript
require('@babel/register')({
  ...config,
  plugins: [
    ...config.plugins,
    // Ignore the css as it is loaded elsewhere. All the snippets
    // need is for the jsx to be stringified
    [
      'babel-plugin-import-redirect',
      {
        suppressResolveWarning: true,
        redirect: {
          '.*main\\.css$': {}
        }
      }
    ]
  ],
  extensions: ['.ts', '.tsx', '.jsx', '.js', '.mjs']
});

// TODO: remove this or change based on advice after PR
interface PlayroomConfig {
  components: string;
  outputPath: string;
  title?: string;
  themes?: string;
  widths?: number[];
  snippets?: Snippet[] | string;
  frameComponent?: string;
  exampleCode?: string;
  cwd?: string;
  storageKey?: string;
  webpackConfig?: () => void;
  baseUrl?: string;
}

/**
 * Modifies the playroom config by trying to load the user's custom config.
 */
const loadUserPlayroomConfig = (config: PlayroomConfig): PlayroomConfig => {
  const userConfigPath = path.join(getMonorepoRoot(), 'playroom.config.js');

  if (fs.existsSync(userConfigPath)) {
    logger.debug(`Custom playroom config file: ${userConfigPath}`);
    const getUserConfig = require(userConfigPath);
    const userConfig = getUserConfig({ config });

    logger.trace('Customized playroom config:', userConfig);
    return userConfig;
  }

  return config;
};

export default async ({
  entry,
  title,
  snippets
}: {
  entry: string;
  title: string;
  snippets: string;
}) => {
  const webpackConfig = await loadUserWebpackConfig(
    {
      plugins: [],
      resolve: {},
      module: {
        rules: [
          {
            type: 'javascript/auto',
            test: /\.mjs$/
          },
          {
            test: /\.css$/,
            exclude: /codemirror/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
            use: ['file-loader']
          }
        ]
      }
    },
    'playroom'
  );

  config.plugins.push(
    new ForkTsCheckerWebpackPlugin({
      formatter: 'codeframe',
      checkSyntacticErrors: true,
      reportFiles: ['**/*.snippet.tsx', '!**/node_modules/**']
    })
  );

  const playroomConfig = {
    components: entry,
    outputPath: './out/playroom',

    // Optional:
    title,
    widths: [320, 768, 992, 1200],
    snippets,
    typeScriptFiles: ['components/**/src/**/*.{ts,tsx}', '!**/node_modules'],
    webpackConfig: () => webpackConfig
  };

  logger.trace('Default playroom config:', playroomConfig);
  return loadUserPlayroomConfig(playroomConfig);
};
