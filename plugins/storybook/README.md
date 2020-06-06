# @design-systems/storybook

A plugin for `@design-syste/cli` to run and build a storybook.

This package also contains:

- `@design-systems/storybook/preset` - A preset with all of our recommended defaults for storybook
- `@design-systems/storybook/preview` - Configures the preset in the preview

## Manual Configuration

If you scafolded your design system on v2 then you should not need to do anything.
If you are migrating from v1 to v2 you will need to add the following.
v2 removed lots of custom logic around storybook and now everything is basically just a preset!

### Steps

The preset *must* be in your `.storybook/main.js`.

```js
{
  "presets": ["@design-systems/storybook/preset"]
}
```

And you *must* import `@design-systems/storybook/preview` in your `.storybook/preview.js`.

```js
import '@design-systems/storybook/preview';
```
