# @design-systems/build

The main build plugin for the design-systems cli.

### Hooks

The build plugin exposes some hooks to allow for plugins to manipulate the build output.

**processCSSFiles**

The **processCSSFiles** hook allows you to change the final CSS output. It's passed an array of CSS files to be minified and merged -- enabling you to change the order or contents of the CSS.
