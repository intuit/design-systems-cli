# Using `@design-systems/cli`

Out of the box, `@design-systems/cli` comes with a lot of different scripts.
When to use what script can be a little confusing.

Most of the scripts are ran infrequently locally or are used by other scripts, so you really only need to know about a few.
The following will detail the default workflow you and your teammates should use while developing with the CLI.

## Creating new packages

To create a new component in your repo run `yarn run create` from the root.
This will create a new templated component in the `components` folder.
To create a new package in your repo, maybe for a set of shared utils, run `yarn create:package` from the root.
This will create a new templated package in the `packages` folder.

## Developing

The command you will most often use while developing is the `dev` command.
This command can be used at the root of the project or from the component level (example: `components/Card`).

When `dev` is run from the root it will build all of your components and serve a storybook with all of their stories.
This will reflect what your published storybook will look like.
Once you start adding more components you might notice that builds are taking longer.
Usually you don't need to see all the stories at once, this might even be distracting.

Instead of developing with a storybook for all of your components you can run `dev` from the component level.
This will do a few things differently:

- Build the component and any component or package withing the repo it depends on

  _Example_: `@my-design-system/card` => `@my-design-system/icon` => `@my-design-system/styles` = `card` + `icon` + `styles` will all be built)

- Start a storybook for _just_ that component's stories

This allows you to develop just a subset of your storybook, decreasing build times and focusing your development.

## Testing

To test your project the commands you will run the most are:

- `lint`
- `test`

These commands can be run from the root or package level.
From the root all files will be tested.
From the package only the contents of that package will tested.

## Cleaning up

Sometimes you need to reset your local repo.
To do this use the `clean` command.
It will delete every generated file from your project:

This includes:

- `node_modules`
- `dist`
- `out`
- `coverage`
- `tsbuildinfo.json`
