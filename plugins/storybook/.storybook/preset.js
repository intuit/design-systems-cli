const modifyWebpack = require('./modify-webpack');
const path = require('path')

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
  'storybook-addon-sketch/register-options',
  '@storybook/addon-viewport',
  '@storybook/addon-a11y'
];

const stories = [
  path.join(process.env.COMPONENT, '**/*.stories.tsx')
];

module.exports = {
  addons,
  stories, 
  webpackFinal: modifyWebpack
}
