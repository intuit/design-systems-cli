const { getMonorepoRoot } = require('@design-systems/cli-utils');
const fs = require('fs');
const path = require('path');

function addons(entry = []) {
  const projectRoot = getMonorepoRoot();
  const hasAddons =
    fs.existsSync(path.join(projectRoot, '.storybook/addons.js')) ||
    fs.existsSync(path.join(projectRoot, '.storybook/addons.ts'));
  let newAddons = [...entry];

  if (hasAddons) {
    newAddons = [...newAddons, path.join(projectRoot, '.storybook/addons')];
  } else {
    newAddons = [
      ...newAddons, // Panels
      require.resolve('@storybook/addon-notes/register-panel'),
      require.resolve('storybook-addon-react-docgen/register'),
      require.resolve('storybook-addon-jsx/register'),
      require.resolve('@storybook/addon-knobs/register'),
      require.resolve('@storybook/addon-actions/register'),
      require.resolve('@storybook/addon-a11y/register'),

      // Tools
      require.resolve('@storybook/addon-backgrounds/register'),
      require.resolve('storybook-dark-mode/register'),
      require.resolve('storybook-addon-sketch/register-options'),
      require.resolve('@storybook/addon-viewport/register')
    ];
  }

  return newAddons;
}

module.exports = { addons };
