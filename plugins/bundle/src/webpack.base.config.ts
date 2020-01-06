import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import { getBabelConfig, getPostCssConfig } from '@design-systems/build';
import path from 'path';
import webpack from 'webpack';

export interface ConfigOptions {
  debug?: boolean;
  entry: string;
}

export default async function(
  options: ConfigOptions = {
    entry: './src/index'
  }
): Promise<webpack.Configuration> {
  const debug = Boolean(options.debug);

  return {
    entry: options.entry,
    output: {
      path: path.resolve('./dist'),
      filename: 'bundle.js',
      globalObject: 'this',
      libraryTarget: 'umd'
    },
    mode: debug ? 'development' : 'production',
    resolve: {
      extensions: ['.wasm', '.mjs', '.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              ...(await getBabelConfig(path.resolve(options.entry))).options
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'postcss-loader',
              options: await getPostCssConfig({
                useModules: false
              })
            }
          ]
        }
      ]
    },
    optimization: {
      minimizer: options.debug
        ? []
        : [
            new TerserPlugin({
              terserOptions: {
                ecma: 5,
                compress: {
                  warnings: false,
                  comparisons: false,
                  inline: 2
                },
                mangle: {
                  safari10: true
                },
                output: {
                  ecma: 5,
                  comments: false,
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  ascii_only: true
                }
              },
              parallel: true,
              cache: true,
              sourceMap: true
            })
          ]
    },

    plugins: [
      new CaseSensitivePathsPlugin(),
      new DuplicatePackageCheckerPlugin(),

      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(
            options.debug ? 'development' : 'production'
          ),
          DEBUG: options.debug
        }
      })
    ]
  };
}
