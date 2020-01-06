# @design-systems/create

Initialize a `@design-systems/cli` monorepo.

## Usage

```sh
npm init @design-systems
```

## Updating templates

1. Update the master branch of one of the templates
2. Run the `templates:update` script from `packages/create`

This script will do the following:

- Checkout each branch
- Merge master
- Record new SHA for updated template
- Push updated branch to remote
- Edit the `templates.json` file locally

You should then make a pull request to [@design-systems/cli](https://github.com/intuit/design-systems-cli) with the updated SHAs.

### Setup

For this script to work you must have the templates cloned to you machine and the must be siblings to the `cli`.

```txt
cli/
monorepo-template/
component-template/
package-template/
```
