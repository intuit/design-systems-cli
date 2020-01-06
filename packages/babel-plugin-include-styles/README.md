# @design-systems/babel-plugin-include-styles

This babel plugin will automatically include the styles for a scoped monorepo design system built with `@design-systems/cli`.

## Usage

.babelrc:

```json
{
  "plugins": [
    ["@design-systems/babel-plugin-include-styles", { "scope": "my-scope" }]
  ]
}
```

## Example

Input:

```js
import Card from '@my-scope/card';
```

Output:

```js
import Card from '@my-scope/card';
import '@my-scope/card/dist/main.css';
```
