# `bundle`

Creates a webpack bundle of your component

## Options

| Flag | Type | Description |
| - | - | - |
| `--debug`, `-d` | Boolean | Produce a non-minified "debug" bundle |

## Custom Babel Config

To customize your babel configuration, create a .babelrc at the root of your project

## Custom webpack config

To customize your webpack configuration, create webpack.config.js file at the root of the project.

You'll want to extend the base config: `@design-systems/bundle/webpack.config.base.js` for things to function properly.

