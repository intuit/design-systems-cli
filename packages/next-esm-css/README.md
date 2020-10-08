# @design-systems/next-esm-css

This package enables using the `esm` output from the `ds build` command in a Next.js based project.
Currently Next.js doesn't allow `node_modules` to import their own CSS so using components from a `ds` based project doesn't work.
[See this issue](https://github.com/vercel/next.js/issues/13282).

## Installation

```sh
npm i @design-systems/next-esm-css
# or with yarn
yarn add @design-systems/next-esm-css
```

## Usage

Simply require this package in your `next.config.js` and provide either a list of package names or a regex for everything in your design system scope.

**`next.config.js`:**

```js
const withEsmCss = require('@design-systems/next-esm-css')([
  '@your-design-system-scope/.*',
]);

module.exports = withEsmCss();
```

Now Next.js won't break when you import a component build with `ds`!

## Inspration

This package heavily borrows from [next-transpiled-modules](https://www.npmjs.com/package/next-transpile-modules).
You could use that package instead, but this package is a bit faster when building since it only affects CSS.
