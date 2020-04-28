const { getMonorepoRoot } = require('@design-systems/cli-utils');
const fs = require('fs');
const path = require('path');

const userMiddlewarePath = path.join(getMonorepoRoot(), '.storybook/middleware.js');

module.exports = fs.existsSync(userMiddlewarePath)
  ? require(userMiddlewarePath)
  : () => {};