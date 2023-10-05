# `storybook`

Create a storybook for your component

## Commands

  - **build** - Build the storybook for deployment
  - **start** - Start the storybook development server

## `build`

Build the storybook for deployment

### Options

| Flag | Type | Description |
| - | - | - |
| `--sketch` | Boolean | Generate sketch assets for the storybook |
| `--extract` | Boolean | Output a stories.json for storybook composition |

### Examples

```sh
ds storybook build
```

## `start`

Start the storybook development server

### Options

| Flag | Type | Description |
| - | - | - |
| `--ci` | Boolean | Start the storybook server in CI mode |
| `--port` | Number | Port to start the server on |
| `--findPort` | Boolean | Automatically assign a port if the default (6006) is occupied |

### Examples

```sh
ds storybook dev
```

## Custom Storybook Configuration

The configuration for this package is now just a normal storybook preset!
This means that you configure storybook just like the story book docs suggests.
All you need to do is use our preset + load our "preview.js" if you want the default features we load.

It supports the following additional custom files:

1. dark-logo.png - Logo for the storybook when it's in dark mode
2. light-logo.png - Logo for the storybook when it's in light mode

```js
import * as dsPreview from "@design-systems/storybook/preview";

export const decorators = [
  ...dsPreview.decorators,
  // YOUR DECORATORS
];

export const parameters = {
  ...dsPreview.parameters,
  // YOUR PARAMETERS
};
```

