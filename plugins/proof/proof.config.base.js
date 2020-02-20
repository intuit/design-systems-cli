const BabelPlugin = require('@proof-ui/babel-plugin').default;
const JunitPlugin = require('@proof-ui/junit-plugin').default;
const SkipPlugin = require('@proof-ui/skip-tests-plugin').default;
const A11yPlugin = require('@proof-ui/a11y-plugin').default;
const AddAllPlugin = require('@proof-ui/add-all-plugin').default;
const { logger } = require('@proof-ui/logger');
const chalk = require('chalk');

const babelConfig = {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    'babel-preset-power-assert'
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true
      }
    ]
  ]
};

class SauceLogger {
  apply(proof) {
    proof.hooks.browserFactory.tap('sauce', browserFactory => {
      browserFactory.hooks.capabilities.tap('sauce', capabilities => {
        logger.info(chalk.gray('Sauce Labs URL'), capabilities.resultsUrl);
        logger.debug(chalk.gray('Connection URL'), capabilities.sessionDashboardURL);
      });
    });
  }
}

module.exports = {
  url: 'localhost:6006',
  logLevel: 'info',
  testMatch: './components/**/__automation__/**/*.proof.ts',
  plugins: [
    new AddAllPlugin(),
    new JunitPlugin(),
    new SkipPlugin(),
    new SauceLogger(),
    new A11yPlugin({ config: {} }),
    new BabelPlugin({
      config: babelConfig
    })
  ]
};
