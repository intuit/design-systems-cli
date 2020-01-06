import { configure } from '@storybook/react';

configure(
  require.context(
    COMPONENT,
    true,
    /^\.\/(?!(?:node_modules)).*\.stories\.(tsx|ts|js|jsx)$/
  ),
  module
);
