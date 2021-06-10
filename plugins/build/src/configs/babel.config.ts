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
      // Explicitly adding these here so they are added in { 'loose': false } mode
      // See https://github.com/babel/babel/issues/11622#issuecomment-638609015
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-private-methods',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-private-property-in-object',
      'babel-plugin-styled-components',
      'macros',
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true,
          version: '7.13.9',
        },
      ],
    ].filter(Boolean),
  };
}
