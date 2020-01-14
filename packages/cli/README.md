<div align="center">
  <img src="https://github.com/intuit/design-systems-cli/raw/master/logo.png" />

  <h1></h1>

  <p>A CLI toolbox for creating design systems.</p>
</div>

[Read the full documentation](https://intuit.github.io/design-systems-cli/#/welcome)

```
ds

  A toolbox for creating design systems

Synopsis

  $ ds <command> <options>

Commands

  dev         Builds a component, any dependent component in the same monorepo, and starts storybook for just the component.
  clean       Remove dependencies and build files
  build       Builds a React Component located in `./src` and outputs `cjs`, `mjs`, and `css` into `dist`
  test        Runs all tests found in `src/**/__tests__/**.test.js` through jest
  lint        Lint the project using eslint + stylelint
  storybook   Create a storybook for your component
  playroom    Create a playroom for your components
  size        Determine how the bundle size will be affected by your changes.
  create      Scaffold a new `ds` component or system
  update      Update the installed version of `@design-systems/cli`
  proof       Run automation against a storybook
  bundle      Creates a webpack bundle of your component

Global Options

  -v, --verbose           Output the debug logs. Debug: -v Trace: -vv
  --version               Print the current version of the current @design-systems/cli
  --no-version-warning    Prevent the CLI from warning about new versions
  -h, --help              Display the help output
```
