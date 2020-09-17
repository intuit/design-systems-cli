import { transformSync } from '@babel/core';
import plugin from '../../index';

/** Run the plugin on some code */
export const transform = (source: string, filename = 'test/test.js') => {
  const results = transformSync(source, {
    filename,
    plugins: [[plugin, { scope: 'cgds', use: 'test' }]],
    configFile: false,
  });

  if (results && results.code) {
    return results.code;
  }

  throw Error('Something went wrong.');
};
