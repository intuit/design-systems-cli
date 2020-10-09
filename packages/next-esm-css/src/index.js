/* eslint-disable */

const path = require('path');

const PATH_DELIMITER = '[\\\\/]'; // match 2 antislashes or one slash

// Use me when needed
// const inspect = (object) => {
//   console.log(util.inspect(object, { showHidden: false, depth: null }));
// };

/**
 * Stolen from https://stackoverflow.com/questions/10776600/testing-for-equality-of-regular-expressions
 */
const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};

const generateIncludes = (modules) => {
  return [
    new RegExp(`(${modules.map(safePath).join('|')})$`),
    new RegExp(
      `(${modules.map(safePath).join('|')})${PATH_DELIMITER}(?!.*node_modules)`
    ),
  ];
};

const generateExcludes = (modules) => {
  return [
    new RegExp(
      `node_modules${PATH_DELIMITER}(?!(${modules
        .map(safePath)
        .join('|')})(${PATH_DELIMITER}|$)(?!.*node_modules))`
    ),
  ];
};

/**
 * On Windows, the Regex won't match as Webpack tries to resolve the
 * paths of the modules. So we need to check for \\ and /
 */
const safePath = (module) => module.split(/[\\\/]/g).join(PATH_DELIMITER);

/**
 * Actual Next.js plugin
 */
const withTmInitializer = (modules = []) => {
  const withTM = (nextConfig = {}) => {
    const includes = generateIncludes(modules);
    const excludes = generateExcludes(modules);

    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        // Support CSS modules + global in node_modules
        // TODO ask Next.js maintainer to expose the css-loader via defaultLoaders
        const nextCssLoaders = config.module.rules.find(
          (rule) => typeof rule.oneOf === 'object'
        );

        // .module.css
        if (nextCssLoaders) {
          const nextCssLoader = nextCssLoaders.oneOf.find((rule) =>
            regexEqual(rule.test, /(?<!\.module)\.css$/)
          );

          if (nextCssLoader) {
            nextCssLoader.issuer.or = nextCssLoader.issuer.and
              ? nextCssLoader.issuer.and.concat(includes)
              : includes;
            nextCssLoader.issuer.not = excludes;
            delete nextCssLoader.issuer.and;
          }

          // Hack our way to disable errors on node_modules CSS modules
          const nextErrorCssModuleLoader = nextCssLoaders.oneOf.find(
            (rule) =>
              rule.use &&
              rule.use.loader === 'error-loader' &&
              rule.use.options &&
              (rule.use.options.reason ===
                'CSS Modules \u001b[1mcannot\u001b[22m be imported from within \u001b[1mnode_modules\u001b[22m.\n' +
                  'Read more: https://err.sh/next.js/css-modules-npm' ||
                rule.use.options.reason ===
                  'CSS Modules cannot be imported from within node_modules.\nRead more: https://err.sh/next.js/css-modules-npm')
          );

          if (nextErrorCssModuleLoader) {
            nextErrorCssModuleLoader.exclude = includes;
          }

          const nextErrorCssGlobalLoader = nextCssLoaders.oneOf.find(
            (rule) =>
              rule.use &&
              rule.use.loader === 'error-loader' &&
              rule.use.options &&
              (rule.use.options.reason ===
                'Global CSS \u001b[1mcannot\u001b[22m be imported from within \u001b[1mnode_modules\u001b[22m.\n' +
                  'Read more: https://err.sh/next.js/css-npm' ||
                rule.use.options.reason ===
                  'Global CSS cannot be imported from within node_modules.\nRead more: https://err.sh/next.js/css-npm')
          );

          if (nextErrorCssGlobalLoader) {
            nextErrorCssGlobalLoader.exclude = includes;
          }
        }

        // Overload the Webpack config if it was already overloaded
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    });
  };

  return withTM;
};

module.exports = withTmInitializer;
