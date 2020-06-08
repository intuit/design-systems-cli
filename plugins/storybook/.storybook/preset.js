const modifyWebpack = require('./modify-webpack');

const addons = [
  // Panels
  '@storybook/addon-notes', // TODO register panel?
  'storybook-addon-react-docgen',
  'storybook-addon-jsx',
  '@storybook/addon-knobs',
  '@storybook/addon-actions',

  // Tools
  '@storybook/addon-backgrounds',
  'storybook-dark-mode',
  'storybook-addon-sketch', // TODO storybook-addon-sketch/register-options?
  '@storybook/addon-viewport',
  '@storybook/addon-a11y' // TODO check this works
];

// TODO does this work?
const entries = [
  require.context(
    COMPONENT,
    true,
    /^\.\/((?!node_modules).)*\.stories\.(tsx|ts|js|jsx|mdx)$/
  )
];

module.exports = {
  addons,
  entries, 
  webpackFinal: modifyWebpack
}
