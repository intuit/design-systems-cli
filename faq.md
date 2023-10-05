# Frequently Asked Questions

## How should I create dependencies between packages and components in my design-system?

The best way we have found to add inter-dependencies in your repository is to use yarn's `link:` syntax.
To do this simply add a dep as your normally would but for the version you put `link:` with a relative path to the package you want to use.

**Example:**

```json
{
  "dependencies": {
    "@my-design-system/utils": "link:../packages/utils"
  }
}
```

Using `link:` leads to far less merge conflicts than having the actually version numbers in there.
Tools like [lerna](https://github.com/lerna/lerna) and [auto](https://github.com/intuit/auto) handle this out of the box.
The published versions of the package will contain the actual versions and not the `link:`.

## Why isn't my props table showing up correctly?

For the props tables to be complete you have to makes sure you do a few things.

1. `Named Export` - The most important thing the docgen needs is for your component to have a named export. You can also have/use a default export, but the named export must also be present. This is the way that the docgen matches your component usage to definition.

   ```jsx
   export const Card = () => <div />;
   export default Card;
   ```

2. `Description` - The props table section will also utilize any jsDoc style comments you use for both the component and each of its props. These comments will both appear in your storybook as well as in your editor. This works in both TS and JS.

   ```tsx
   interface CardProps {
     /** Whether the card should render with a bold outline */
     bold: boolean;
   }

   /** My card for displaying a small snippet of information */
   export const Card = (props: CardProps) => <div />;
   ```

## How do I add state to my stories?

There are a host of good storybook state packages available. The one that we have found easiest to use is call [storybook-addon-state](https://github.com/adierkens/storybook-addon-state).

## Why aren't my scripts running?

If you are trying to run one of your sub-packages scripts with `npm` you will find that it cannot find the bin file.

This is because `npm` and `yarn` have different resolution strategies for bin files. `npm` only looks in the current working directory's `node_modules`, while `yarn` will walk up to the root of your monorepo to find the bin file.

For that reason you must run the script with `yarn` instead of `npm`.

```sh
# Instead of this
npm run build

# Do This

yarn build
# or
yarn run build
```
