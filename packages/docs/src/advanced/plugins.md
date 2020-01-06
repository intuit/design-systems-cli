# Plugins

Every command that `@design-systems/cli` comes with is really just a plugin to a generic CLI.

All the CLI does is:

1. Load the command definitions for all the plugins
2. Load the plugin ran from the CLI with the supplied args

## Creating a Plugin

Creating a plugin is dead simple, it's either an npm package or a local folder with at least the following files.

1. `package.json` - this should have the `name` and `main` fields filled out
2. `command.js` or `/dist/command.js` - the [command-line-application](https://github.com/hipstersmoothie/command-line-application) command definition
3. `main` - the actual plugin code, should export a class with a `run` method that take the CLI args as it's only parameter

### Naming Convention

A plugin as an NPM package can be named in 1 of 2 ways:

1. `@scope/design-systems-plugin-${name}`
2. `design-systems-plugin-${name}`

### Example Plugin

**package.json**

```json
{
  "name": "design-systems-plugin-echo",
  "main": "index.js",
  "version": "0.0.1"
}
```

**command.js**

```js
module.exports = {
  name: 'echo',
  description: 'shout into the void',
  examples: ['ds echo "Hello World"'],
  options: [
    {
      name: 'value',
      type: String,
      defaultOption: true,
      description: 'what to shout'
    }
  ]
};
```

**index.js**

```js
module.exports = class {
  run({ value }) {
    console.log(value);
  }
};
```

## Using the Plugin

### npm package

All you need to do to install a plugin on npm is install the plugin the to root of your project. The next time you run the CLI you will be able to use the new command!

### Local files

A simple way to add a non distributed CLI plugin is by using the `file:` syntax.

Simply add the following and re-install your dependencies and you can use the plugin.

```json
{
  "devDependencies": {
    // design-systems-plugin-echo is in a folder in my project
    "design-systems-plugin-echo": "file:./design-systems-plugin-echo"
  }
}
```

### Local Package

If you want to distribute the plugin on npm and have it in your project's monorepo, you can use the `link:` syntax to install the plugin.

Simply add the following and re-install your dependencies and you can use the plugin.

```json
{
  "devDependencies": {
    "design-systems-plugin-echo": "link:./packages/design-systems-plugin-echo"
  }
}
```
