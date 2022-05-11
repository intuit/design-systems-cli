# @design-systems/svg-icon-builder

A simple script for converting SVG files into icon React components.

## Installation

```sh
npm i @design-systems/svg-icon-builder
# or with yarn
yarn add @design-systems/svg-icon-builder
```

## Usage

```bash

 ➜ icon-build help

cli

  Convert a directory of SVG files to wrapped React Components.

Options

  --svg string [required]        The path to the directory of .svg files to convert.
  --template string              The path to the template where the SVG will be added.
  --out string [required]        The directory to put the results in.
  --overwrite                    Overwrite output files that already exist.
  --no-mapping                   Whether to disable the mapping file.
  --no-strip-color               Whether to disable removing color from the SVGs. Default: false
  --name-suffix string            The suffix to put after the name of a generated icon. Default: 'Icon'
  -h, --help                     Display the help output

Examples

  icon-build --svg ./svg --template ./templates/icon.template

```

## Example

You can see how the program works by running the testing script `yarn test`.

The `svg` folder is read, processed, and then placed in the `output` directory with the following structure.

```
output/
  ExampleIcon.tsx <- Each icon gets its own component file.
  exports.ts <- A generated file that lets you easily export every icon.
  mappings.ts <- A file that maps all the icons to a single icon API with types.
```

## What it Does

This package is in many regards an alternate version of the great [SVGR](https://github.com/smooth-code/svgr) package but made specifically for icons. The basic things it does:

- Reads SVG files from a directory.
- Runs them through a custom SVGO config to minifies and optimizing for adding icon styles. SVGO is run multiple times to remove nested groups, similar to SVGO `multipass`.
- Converts SVG fields to camelCase for JSX.
- Removes existing colors if necessary to make the icon easier to style.
- Removes the `<svg>` tag to allow us to add props in our template.
- Injects the SVG and all necessary variables into a template.
- Names the icon and writes the processed template to an output folder.
- Can output a map of strings to components, to allow for a single-component API.
- Sets up TypeScript types.

If you're familiar with SVGR you'll know that it does some similar steps. There are some differences:

- The template syntax is just a simple {{mustache}}-style.
- All of the file processing logic is more custom to enforce a convention.
- We can output a component mapping that allows you to easily create an index file, and a single-component API like `<Icon variant="alert" />`.
- Ability to remove colors so icon color can be a React property.
- Improved TypeScript support.

### Template Variables

You can see an example template in `/src/icon.template`. The basic variables available to the template are:

- `iconName`: The icon name (AchievementIcon).
- `titleCase`: Icon title with spaces (Achievement Icon).
- `viewBox`: The viewBox attribute, which is needed to get nice resizing.
- `svg`: All of the SVG inside the svg tag.
- `fill`: The fill attribute from the SVG, if a top level fill is needed.

The default template uses TypeScript and makes some assumptions about your project structure, so you'll probably want to copy and modify it.

### Known Issues

- Masking - Sometimes the `mask` property doesn't convert properly.

- JSX Conversion - Occasionally we encounter properties that aren't camelCased.
