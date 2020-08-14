const modifyWebpack = require('./modify-webpack');
const path = require('path');
const glob = require('fast-glob');

const addons = [
  // Panels
  '@storybook/addon-notes/register-panel',
  'storybook-addon-react-docgen',
  'storybook-addon-jsx',
  '@storybook/addon-knobs',
  '@storybook/addon-actions',

  // Tools
  '@storybook/addon-backgrounds',
  'storybook-dark-mode',
  'storybook-addon-sketch/preset',
  '@storybook/addon-viewport',
  '@storybook/addon-a11y',
];

const stories = glob.sync(
  path.join(process.env.COMPONENT, '**/*.stories.(tsx|js|jsx|mdx)'),
  { ignore: ['**/node_modules'] }
);

module.exports = {
  addons,
  stories,
  webpackFinal: modifyWebpack,
};
