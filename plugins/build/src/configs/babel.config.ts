import babel from '@babel/core';

export default function(api: babel.ConfigAPI) {
  const isTest = api.env('test');

  return {
    comments: false,
    minified: true,
    compact: true,
    sourceMaps: true,
    presets: [
      ['@babel/preset-env', { modules: api.env('module') ? false : 'auto' }],
      // This must come after env! otherwise interfaces might remain in the mjs files
      '@babel/preset-typescript',
      '@babel/preset-react',
      isTest && 'jest'
    ].filter(Boolean),
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
      'babel-plugin-styled-components',
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true
        }
      ]
    ].filter(Boolean)
  };
}
