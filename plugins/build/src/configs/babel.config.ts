import babel from '@babel/core';

export default function (api: babel.ConfigAPI) {
  const isTest = api.env('test');

  return {
    sourceMaps: true,
    presets: [
      ['@babel/preset-env', { modules: api.env('module') ? false : 'auto' }],
      // This must come after env! otherwise interfaces might remain in the mjs files
      '@babel/preset-typescript',
      '@babel/preset-react',
      isTest && 'jest',
    ].filter(Boolean),
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
      'babel-plugin-styled-components',
      'macros',
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true,
          version: '7.11.2',
        },
      ],
    ].filter(Boolean),
  };
}
