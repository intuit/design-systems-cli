/* eslint-disable @typescript-eslint/ban-ts-ignore, @typescript-eslint/no-var-requires */

// @ts-ignore
import babelConfig from '@design-systems/build/babel.config';
import { loadUserWebpackConfig } from '@design-systems/cli-utils';

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

  return {
    components: entry,
    outputPath: './out/playroom',

    // Optional:
    title,
    widths: [320, 768, 992, 1200],
    snippets,
    typeScriptFiles: ['components/**/src/**/*.{ts,tsx}', '!**/node_modules'],
    webpackConfig: () => webpackConfig
  };
};
