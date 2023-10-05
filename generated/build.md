# `build`

Builds a React Component located in `./src` and outputs `cjs`, `mjs`, and `css` into `dist`

## Options

| Flag | Type | Description |
| - | - | - |
| `--watch`, `-w` | Boolean | Watch for file changes and recompile. |
| `--ignore` | String | A minimatch to ignore |
| `--css-optimization-level` | Number | What clean-css optimization level to use |
| `--cssMain` | String | Customaize the name of the main output css file. |
| `--cssImport` | Boolean | Automatically add a CSS import into the ESM output file. |

## Custom Babel Config

To customize your babel configuration, create a .babelrc at the root of the project.

## Custom PostCSS Config

To customize your postcss configuration, create a postcss.config.js at your package or monorepo root.

It must use the base config for css modules to function properly.

```js
const defaultConfig = require('@design-systems/build/postcss.config');
const mixins = require('postcss-mixins');

module.exports = (ctx) => {
  const config = defaultConfig(ctx);

  return {
    ...config,
    plugins: [
      mixins({ mixinsFiles }),
      ...config.plugins
    ]
  }
});
```

## Multi-Build CSS

If you want your project to build _multiple_ output CSS files, you can set up multiple PostCSS configs to be run.

Our PostCSS config loader requires normal PostCSS config filenames, so you'll need to put the files in separate directories.
The example below will generate two css files: `main.css` and `alternate.css`.

You can also use this in conjunction with our [postcss-themed](https://github.com/intuit/postcss-themed) package to create
a different CSS file per theme!

```js
{
  "build": {
    "cssImport": true,
    "cssMain": "main",
    "cssConfigs": [
      {
        "name": "main",
        "path": "./postcss/main/postcss.config.js"
      },
      {
        "name": "alternate",
        "path": "./postcss/alternate/postcss.config.js"
      }
    ]
  }
}
```

