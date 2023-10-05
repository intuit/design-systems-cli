# `dev`

Builds a component, any dependent component in the same monorepo, and starts storybook for just the component.

## Examples

```sh
ds dev
```

## Solving Circular Dependencies for Stories

In a monorepo full of components you might get circlular dependencies when writing rich component documentation.

To get around this problem "ds-cli" supports a special package.json property to track these dependenceies called "storyDependencies".
Because it's not an official part of the package.json "lerna" won't use these dependencies to find the build order.

The "dev" command will build these dependencies while running.

```json
{
  "storyDependencies": {
    "@my-system/field": "link:../Field"
  }
}
```

