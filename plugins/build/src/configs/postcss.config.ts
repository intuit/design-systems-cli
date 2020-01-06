import url from 'postcss-url';
import nested from 'postcss-nested';
import autoprefixer from 'autoprefixer';
import hexRGBA from 'postcss-hexrgba';
import modules from 'postcss-modules';
import fs from 'fs-extra';

interface PostCSSContext {
  env?: string;
  outDir: string;
}

module.exports = function(ctx: PostCSSContext = { outDir: 'dist' }) {
  const generateScopedName =
    (ctx.env !== 'module' && '[local]') ||
    (process.env.NODE_ENV === 'development' && '[name]-[local]') ||
    '[hash:base64:7]';

  return {
    plugins: [
      nested,
      modules({
        camelCase: true,
        generateScopedName,
        async getJSON(
          cssFileName: string,
          json: Record<string, string>,
          outputFileName: string
        ) {
          if (outputFileName) {
            const cjs = `${outputFileName.replace('dist', 'dist/cjs')}.js`;
            const esm = `${outputFileName.replace('dist', 'dist/esm')}.js`;
            const code = `module.exports = ${JSON.stringify(json)};`;

            return Promise.all([
              fs.outputFile(cjs, code),
              fs.outputFile(esm, code)
            ]);
          }
        }
      }),
      hexRGBA,
      autoprefixer,
      url({ url: 'inline' })
    ]
  };
};
