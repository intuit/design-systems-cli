import { transformSync } from '@babel/core';
import plugin from '../..';

/** Run the plugin on some code */
export const transform = (source: string, filename = '/test.js') => {
  const results = transformSync(source, {
    filename,
    plugins: [[plugin, { scope: 'cgds' }]],
    configFile: false
  });

  if (results && results.code) {
    return results.code;
  }

  throw Error('Something went wrong.');
};
