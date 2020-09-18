# @design-systems/babel-plugin-replace-styles

This babel plugin lets you overwrite CSS imports that are happening inside your design system.

### Why would you want to do that?

Here's a simple example that showcases a potential use-case:

You have a `Button` component, built using the Design Systems CLI. It has a `main.css` output that gets generated when you build,
and you have a single `PostCSS` build that generates it. Now, another team wants you to auto-prefix your CSS to support older browsers.
Without this plugin, you would need to just add the prefixes and now everyone has to download those, just to support the extra use case.

_OR_

We could use the DS-CLI `build` plugin's multi-build CSS feature, and generate two CSS files: `main.css` and `prefixed.css`.
The only issue is, if we turn on automatic CSS imports, everyone will get `main` and not `prefixed`.

Enter this plugin. Now the team who needs prefixed CSS can install this and configure it to replace `main` with `prefixed` if it exists.
Everyone only gets the CSS they need imported, and we can still have a nice auto-import by default.

_Note: This also works well with [postcss-themed](https://github.com/intuit/postcss-themed); you can use this plugin to swap between different css files that contain different themes!_

## Usage

babel.config.json:

```json
{
  "plugins": [
    [
      "@design-systems/babel-plugin-include-styles",
      { "scope": "your-ds", "replace": "main", "use": "prefixed" }
    ]
  ]
}
```

## Example

Input:

```js
// In node_modules/my-ds/component/dist/esm/index.js
import '../main.css';
```

Output:

```js
import '../prefixed.css';
```

Notes for setup:

`babel-loader` will _not_ parse `node_modules` by default. You'll need to use [babel.config.json](https://babeljs.io/docs/en/configuration#babelconfigjs) (a `.babelrc` will not work), and you'll need to configure webpack to parse your node_modules. I've provided an example below:

```js
module: {
      rules: [
        {
          include: [
            path.join(__dirname, 'node_modules/@your-ds/'),
            path.join(__dirname, 'src'),
          ],
          test: /\.(js|jsx|mjs|tsx|ts)$/,
          loader: 'babel-loader',
        },
```
