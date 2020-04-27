<div style="margin: 4rem 0;text-align: center;">
  <img src="./start.svg" alt="Designing a system" />
</div>

# Getting Started

## Prerequisites

`@design-systems/cli` creates monorepos that use a bunch of different
[yarn](https://yarnpkg.com/en/) features. So before you do anything [install](https://yarnpkg.com/en/docs/install#mac-stable)
`yarn` on your system.

```sh
curl -o- -L https://yarnpkg.com/install.sh | bash
```

## Creating your Design System

To scaffold your design system monorepo run the following command:

```sh
npm init @design-systems
```

> Note! If asked to enter your Github username and password, create a [Personal Auth Token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) and use that as your password.

This command will walk you through the initial set up of your system.

After you are done `cd` to the generated folder and start adding components with the following command:

```sh
yarn # install dependencies
yarn run create --name component
```

Now you have a design system with 1 component in it! Hooray!

<div style="margin: 4rem 0;text-align: center;">
  <img src="./celebration.svg" alt="Designing a system" />
</div>

Now we can start developing our components. To start the storybook and build your components run the following command:

```sh
yarn dev
```

Now you are all set to develop your components locally!

!> You **must** run sub-package scripts with `yarn`! Read more [here](/faq?id=why-arent-my-scripts-running).

## Continuous Integration

The default template for a `@design-systems/cli` comes with our preferred workflow for developing design systems.
You can use other CI platforms and should use our circleCI config as a guide.

It does a lot for you:

- Runs lint
- Runs tests (unit + proofs)
- Builds storybook and playroom + deploys as build artifact
- Publishes code to npm
- Runs size checks
- Runs a11y checks

To get started building your design system with circleCI navigate to circleCi and:

1. Click `Add Projects`
2. Find you project and click `Set Up Project`

### Setting up `auto`

The `@design-systems/cli` uses [auto](https://github.com/intuit/auto) to post comments on PRs and automate releases.
To post comments it will need a `GH_TOKEN`, and to publish releases a `NPM_TOKEN`.

To setup your project for use with `auto`:

1. Navigate to your project nad click the gear icon
2. Go to `Environment Variables`
3. Add [`GH_TOKEN`](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)
4. Add [`NPM_TOKEN`](https://docs.npmjs.com/creating-and-viewing-authentication-tokens)
5. Add [`CIRCLE_TOKEN`](https://circleci.com/docs/2.0/managing-api-tokens/#creating-a-project-api-token)
6. Go to `Advanced Settings`
7. Enable `Build forked pull requests` (ensure PRs get build too)
8. Run `GH_TOKEN=YOUR_GH_TOKEN yarn auto create-labels`

#### Turning on canary releases

`auto` can make `canary` releases of your code upon every push to a pull request.
These are tests releases that normal consumers will not see, but others can use for testing.

Canary releases come with some security risks.
They expose your publishing keys when PRs are being built, but they are also a great way to test.

To enable `canary` releases:

1. Go to `Advanced Settings`
2. Enable `Pass secrets to builds from forked pull requests`

And modify release step in the workflow to match the following:

```yml
- release:
    requires:
      - documentation
```
