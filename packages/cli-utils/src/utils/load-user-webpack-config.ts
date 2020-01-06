import path from 'path';
import fs from 'fs';
import webpack from 'webpack';

import getMonorepoRoot from './get-monorepo-root';

/**
 * Modifies the webpack config used for storybook and playroom by trying
 * to load the user's custom config.
 */
const loadUserWebpackConfig = (
  config: webpack.Configuration,
  env: 'storybook' | 'playroom'
) => {
  const customConfig = path.join(
    getMonorepoRoot(),
    '.storybook/webpack.config.js'
  );

  if (fs.existsSync(customConfig)) {
    // eslint-disable-next-line
    const userConfig = require(customConfig);
    return userConfig({ config, env });
  }

  return config;
};

export default loadUserWebpackConfig;
