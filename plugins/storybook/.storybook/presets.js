const { getMonorepoRoot } = require('@design-systems/cli-utils');
const fs = require('fs');
const path = require('path');

const userPath = path.join(getMonorepoRoot(), '.storybook/presets.js');
const defaults = [path.join(__dirname, 'addons-preset.js')];

module.exports = fs.existsSync(userPath)
  ? require(userPath).concat(defaults)
  : defaults;
