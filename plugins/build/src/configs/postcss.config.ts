import url from 'postcss-url';
import nested from 'postcss-nested';
import autoprefixer from 'autoprefixer';
import hexRGBA from 'postcss-hexrgba';
import modules from 'postcss-modules';
import fs from 'fs-extra';
import crypto from 'crypto';
import path from 'path';
import pkgUp from 'pkg-up';

interface PostCSSContext {
  env?: string;
  outDir: string;
  moduleHash?: string;
}

module.exports = function (ctx: PostCSSContext = { outDir: 'dist' }) {
  return {
    plugins: [
      nested,
      modules({
        localsConvention: 'camelCase',
        generateScopedName(name: string, filename: string, css: string) {
          const base = path.basename(filename, '.css');
          const pkgJson = pkgUp.sync({ cwd: path.dirname(filename) });

          if (ctx.env !== 'module') {
            return name;
          }

          const hash = crypto
            .createHash('md5')
            .update(base)
            .update(name)
            .update(css);

          if (ctx.moduleHash) {
            hash.update(ctx.moduleHash);
          }

          if (pkgJson) {
            try {
              const pkgJsonContent = fs.readFileSync(pkgJson, 'utf-8');
              hash.update(pkgJsonContent);
            } catch (e) {}
          }

          const hashString = hash.digest('hex');
          return `${base}-${name}-${hashString.substr(hashString.length - 7)}`;
        },
        async getJSON(
          _: string,
          json: Record<string, string>,
          outputFileName: string
        ) {
          if (outputFileName) {
            const cjs = `${outputFileName.replace('dist', 'dist/cjs')}.js`;
            const esm = `${outputFileName.replace('dist', 'dist/esm')}.js`;

            return Promise.all([
              fs.outputFile(cjs, `module.exports = ${JSON.stringify(json)};`),
              fs.outputFile(esm, `export default ${JSON.stringify(json)};`),
            ]);
          }
        },
      }),
      hexRGBA,
      autoprefixer,
      url({ url: 'inline' }),
    ],
  };
};
