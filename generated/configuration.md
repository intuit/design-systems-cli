# Configuration

You can configure the defaults for a few options for commands in `@design-systems/cli`.
Not all options are configurable.

## File Types

`@design-systems/cli` supports a wide array of configuration files. 

Add one of the following to to the root of the project:

- a `ds` key in the `package.json`
- `.dsrc`
- `.dsrc.json`
- `.dsrc.yaml`
- `.dsrc.yml`
- `.dsrc.js`
- `ds.config.js`
- `ds.config.json`

## Structure

The config is structured with each key being a command name and the value being an object configuring options.
If a command is a `multi-command` then value will be an object with the same structure for each `sub-command`.

```json
{
  "noVersionWarning": true,
  "lint": { "noCache": true },
  "playroom": { "exclude": ["**/generated"] },
  "storybook": {
    "build": { "sketch": true }
  }
}
```

## Sharing configurations

Sharing a `@design-systems/cli` configuration is very easy: 

1. publish a module that's `main` is a configuration object
2. reference it in your root `package.json`:

```json
{
  "name": "@my-design-system",
  "version": "0.1.0",
  "ds": "@company/design-system-config"
}
```

If you don't want to use `package.json`, you can use any of the supported file types
and add a string, e.g. `ds.config.json`:

```json
"@company/prettier-config"
```

!> This method does **not** offer a way to _extend_ the configuration to overwrite some properties from the shared configuration. If you need to do the following in a `ds.config.js`

```js
const merge = require('merge-deep')

module.exports = merge(
  require("@company/design-system-config"),
  { lint: { noCache: false } }
);
```

## Configurable Options

| Name | Type | Description |
| ---- | ---- | ----------- |
| plugins | string[] | Custom commands to load into the CLI |
| noVersionWarning | boolean | Prevent the CLI from warning about new versions |

### `build`

| Name | Type | Description |
| ---- | ---- | ----------- |
| ignore | string[] | A minimatch to ignore |
| cssOptimizationLevel | number | What clean-css optimization level to use |
| cssMain | string | Customaize the name of the main output css file. |
| cssImport | boolean | Automatically add a CSS import into the ESM output file. |
| cssConfigs | CSSBuild[] | An object defining multiple CSS build configurations |

### `test`

| Name | Type | Description |
| ---- | ---- | ----------- |
| annotate | boolean | Post test results as annotations to PR. Only in CI. |

### `lint`

| Name | Type | Description |
| ---- | ---- | ----------- |
| noCache | boolean | Do not use any cached results from previous runs. |
| annotate | boolean | Post lint results as annotations to PR. Only in CI. |

### `storybook`

#### `build`

| Name | Type | Description |
| ---- | ---- | ----------- |
| sketch | boolean | Generate sketch assets for the storybook |
| extract | boolean | Output a stories.json for storybook composition |

### `playroom`

| Name | Type | Description |
| ---- | ---- | ----------- |
| exclude | string[] | Glob of files to exclude from playroom. |
| excludeNamed | string[] | Array of component names to only use the default export. |

### `size`

| Name | Type | Description |
| ---- | ---- | ----------- |
| css | boolean | Show separate diffs for the JS and CSS |
| ignore | string[] | Package names to ignore |
| registry | string | The registry to install packages from. The plugin will use a local .npmrc file if available for authentication. |
| comment | boolean | Comment on the Pull request with the results. (Only from CI + must set env var GH_TOKEN. In jenkins OWNER and REPO must also be set. In enterprise you must also set GITHUB_URL) |
| failureThreshold | number | Failure Threshold for Size |

### `create`

#### `component`

| Name | Type | Description |
| ---- | ---- | ----------- |
| template | string | Override the template directory with a URL to a git repo. Repo must comply with template structure! |
| templates | Template[] | A list of user configured templates for the creation type |

#### `package`

| Name | Type | Description |
| ---- | ---- | ----------- |
| template | string | Override the template directory with a URL to a git repo. Repo must comply with template structure! |
| templates | Template[] | A list of user configured templates for the creation type |

#### `system`

| Name | Type | Description |
| ---- | ---- | ----------- |
| template | string | Override the template directory with a URL to a git repo. Repo must comply with template structure! |