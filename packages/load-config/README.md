# @design-systems/load-config

This package handles loading the config for a `@design-systems/cli` project.

## Installation

```sh
npm i @design-systems/load-config
# or with yarn
yarn add @design-systems/load-config
```

```js
import { loadConfig, validateConfig } from '@design-systems/load-config';

loadConfig().then(config => {
  const validatedConfig = validateConfig(config);
  console.log('Loaded with config', validatedConfig);
});
```
