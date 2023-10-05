# `playroom`

Create a playroom for your components

## Commands

  - **start** - Start a playroom for your components
  - **build** - Build the playroom for deployment

## Options

| Flag | Type | Description |
| - | - | - |
| `--exclude` | String | Glob of files to exclude from playroom. |
| `--excludeNamed` | String | Array of component names to only use the default export. |

## `start`

Start a playroom for your components

### Examples

```sh
ds playroom start
```

## `build`

Build the playroom for deployment

### Examples

```sh
ds playroom build
```

## Snippets

Export an arrary of Playroom Snippets in each of your components. These will all be loaded into playroom at once.

## Custom playroom config

To customize your playroom configuration, create a playroom.config.js at your package or monorepo root. Export a function that takes the base config as an argument.

It must uses the passed in base config for playroom to function properly.

```js
module.exports = baseConfig => ({
  ...baseConfig,
  port: 9001,
  openBrowser: false,
  title: 'Custom Title',
});
```

