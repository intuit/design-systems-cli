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
  'storybook-addon-sketch/preset',
  '@storybook/addon-viewport',
  '@storybook/addon-a11y'
];

const stories = [
  path.join(process.env.COMPONENT, '**/*.stories.tsx'),
  path.join(process.env.COMPONENT, '**/*.stories.js'),
  path.join(process.env.COMPONENT, '**/*.stories.jsx'),
  path.join(process.env.COMPONENT, '**/*.stories.mdx'),
];

module.exports = {
  addons,
  stories, 
  webpackFinal: modifyWebpack
}
