# @design-systems/create

Initialize a `@design-systems/cli` monorepo.

## Usage

```sh
npm init @design-systems
```

## Updating templates

1. Update the master branch of one of the templates
2. Run the `templates:pick` then `templates:pick` scripts from `packages/create`

These scripts will do the following:

- Checkout each branch
- Cherry pick master
- Push updated branch to remote
- Record new SHA for updated template
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
