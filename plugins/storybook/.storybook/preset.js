import modifyWebpack from './modify-webpack';

export const addons = [
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
export const entries = [
  require.context(
    COMPONENT,
    true,
    /^\.\/((?!node_modules).)*\.stories\.(tsx|ts|js|jsx|mdx)$/
  )
];

export const webpackFinal = modifyWebpack;
