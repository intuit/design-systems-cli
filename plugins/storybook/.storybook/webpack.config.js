const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const {
  monorepoName,
  getMonorepoRoot,
  loadUserWebpackConfig
} = require('@design-systems/cli-utils');
const { getPostCssConfig } = require('@design-systems/build');
const githubUrlToObject = require('github-url-to-object');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const BABEL_CONFIG = require.resolve('@design-systems/build/babel.config');

function findBabelRules(config) {
  return config.module.rules.filter(rule => {
    let isBabelLoader = false;

    if (rule.loader && rule.loader.includes('babel-loader')) {
      isBabelLoader = true;
    }

    if (rule.use) {
      rule.use.forEach(use => {
        if (typeof use === 'string' && use.includes('babel-loader')) {
          isBabelLoader = true;
        } else if (
          typeof use === 'object' &&
          use.loader &&
          use.loader.includes('babel-loader')
        ) {
          isBabelLoader = true;
        }
      });
    }

    return isBabelLoader;
  });
}

function modifyBabel(config, callback) {
  findBabelRules(config).forEach(callback);
}

function addTypescript(config) {
  const tsconfigPath = path.resolve(getMonorepoRoot(), 'tsconfig.json');

  if (!fs.existsSync(tsconfigPath)) {
    return;
  }

  config.resolve.extensions.push('.ts', '.tsx', '.json');
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          ...getUserBabelConfig(),
          configFile: BABEL_CONFIG
        }
      },
      {
        loader: require.resolve('react-docgen-typescript-loader'),
        options: {
          tsconfigPath,
          propFilter(prop) {
            if (prop.parent) {
              return !prop.parent.fileName.includes('@types/react');
            }

            return true;
          }
        }
      }
    ]
  });
}

async function addCss(config) {
  const cssRuleIndex = config.module.rules.findIndex(rule =>
    '.css'.match(rule.test)
  );

  config.module.rules[cssRuleIndex] = {
    test: /\.css$/,
    oneOf: [
      {
        include: /(dist|node_modules)/,
        loader: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } }
        ]
      },

      {
        exclude: /(dist|node_modules)/,
        loader: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              localsConvention: 'camelCase',
              importLoaders: 1,
              modules: {
                localIdentName: '[name]-[local]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              ident: 'postcss',
              plugins: (
                await getPostCssConfig({
                  useModules: false
                })
              ).plugins
            }
          }
        ]
      }
    ]
  };
}

function getUserBabelConfig() {
  const { babel = {} } = JSON.parse(
    fs.readFileSync(path.join(getMonorepoRoot(), 'package.json'))
  );
  const userBabelConfig = path.join(getMonorepoRoot(), 'babel.config.js');

  return fs.existsSync(userBabelConfig)
    ? require(userBabelConfig, 'utf8')({
        cache: () => {},
        env: () => 'storybook'
      })
    : babel;
}

function addCustomBabelOptions(config) {
  const { presets = [], plugins = [], ...rest } = getUserBabelConfig();

  modifyBabel(config, rule => {
    rule.use[0].options = { ...rule.use[0].options, ...rest };
    rule.use[0].options.configFile = BABEL_CONFIG;

    const {
      presets: defaultPresets = [],
      plugins: defaultPlugins = []
    } = rule.use[0].options;

    rule.use[0].options.presets = [...defaultPresets, ...presets];
    rule.use[0].options.plugins = [...defaultPlugins, ...plugins];

    // TODO: remove when storybook hits 6.0.0.
    rule.exclude = [/node_modules/];
  });
}

function addSourceMaps(config) {
  // TODO only load source maps for current monorepo
  config.module.rules.push({
    test: /\.(js|css)$/,
    exclude: /core-js/,
    use: ['source-map-loader'],
    enforce: 'pre'
  });
}

function addReactElementHacksssss(config) {
  config.module.rules.push({
    test: /\.js$/,
    include: /react-element-to-jsx-string/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          plugins: ['@babel/plugin-transform-arrow-functions']
        }
      }
    ]
  });
}

module.exports = async ({ config }) => {
  addReactElementHacksssss(config);
  addCustomBabelOptions(config);
  addTypescript(config);
  await addCss(config);
  addSourceMaps(config);

  config.devtool = 'eval-source-map';
  config.entry.push(require.resolve('storybook-addon-sketch/entry'));

  const projectRoot = getMonorepoRoot();
  const configPath = path.join(
    path.resolve(projectRoot),
    '.storybook/config.js'
  );
  const { homepage, repository } = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')
  );

  config.plugins.push(
    new webpack.DefinePlugin({
      MONOREPO_NAME: JSON.stringify(monorepoName()),
      MONOREPO_ROOT: JSON.stringify(projectRoot),
      REPO_URL: JSON.stringify(
        homepage || githubUrlToObject(repository) || repository
      ),
      COMPONENT: JSON.stringify(process.env.COMPONENT),
      CONFIG_PATH: JSON.stringify(
        fs.existsSync(configPath) ? configPath : './defaultConfig.js'
      )
    })
  );

  // Rebuild CSS when `theme.ts` changes
  config.plugins.push({
    apply(compiler) {
      compiler.hooks.emit.tap('Add Extra Resource Deps', compilation => {
        compilation.modules.forEach(module => {
          if (module.resource && module.resource.match(/\.css$/)) {
            const themeFile = path.join(
              path.dirname(module.resource),
              'theme.ts'
            );

            if (fs.existsSync(themeFile)) {
              module.buildInfo.fileDependencies.add(themeFile);
            }
          }
        });
      });
    }
  });

  config.plugins.push(
    new FilterWarningsPlugin({
      exclude: /\.storybook\/(?:(light|dark))-logo/
    })
  );

  // react-element-to-jsx-string has a `browser` output which webpack doesn't seem to parse
  config.resolve.mainFields = ['module', 'main'];

  return loadUserWebpackConfig(config, 'storybook');
};
