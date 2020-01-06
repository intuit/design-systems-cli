/* eslint-disable max-nested-callbacks */

import webpack from 'webpack';
import { RawSource } from 'webpack-sources';
import { monorepoName } from '@design-systems/cli-utils';
import changeCase from 'change-case';

interface RelativeCommentsPluginOptions {
  /** The name of the package */
  importName: string;
}

/** Normalizes comments for better diffs */
export default class RelativeCommentsPlugin {
  private options: RelativeCommentsPluginOptions;

  constructor(options: RelativeCommentsPluginOptions) {
    this.options = options;
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap('RelativeCommentsPlugin', compilation => {
      compilation.hooks.optimizeChunkAssets.tap(
        'RelativeCommentsPlugin',
        chunks => {
          chunks.forEach(chunk => {
            const transformList: string[] = chunk.files.filter(
              file => /\.js$/.test(file) && !/^css/.test(file)
            );

            if (!transformList.length) {
              return;
            }

            transformList.forEach(file => {
              /** Normalize the path in a comment */
              const replacePath = (match: string, p1: string) => {
                let newPath = p1;

                if (p1.includes('node_modules')) {
                  newPath = p1
                    .split('node_modules/')[1]
                    .replace(this.options.importName, '.');
                } else if (p1.startsWith('../') && p1.includes('dist/')) {
                  newPath = p1.replace(
                    /\.\.\/([a-zA-Z0-9_-]+)\//,
                    (whole: string, packageName: string) =>
                      `@${monorepoName()}/${changeCase.kebabCase(
                        packageName
                      )}/`.trim()
                  );
                }

                return match.replace(p1, newPath);
              };

              const modifiedSource = compilation.assets[file]
                .source()
                .replace(/\/\/ CONCATENATED MODULE: (\S+)/g, replacePath)
                .replace(/\/\/ EXTERNAL MODULE: (\S+)/g, replacePath)
                .split('\n')
                .filter((p: string) => p.trim() !== '')
                .join('\n');

              // eslint-disable-next-line no-param-reassign
              compilation.assets[file] = new RawSource(modifiedSource);
            });
          });
        }
      );
    });
  }
}
