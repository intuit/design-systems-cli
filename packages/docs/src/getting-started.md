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

To scaffold you design system monorepo run the following command:

```sh
npm init @design-systems
```

> Note! If asked to enter your Github username and password, create a [Personal Auth Token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line) and use that as your password.

This command will walk you through the initial set up of your system.

After you are done `cd` to the generated folder and start adding components with the following command:

```sh
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

!> You **must** run sub-package scripts with `yarn`! Read more [here](/faq?id=why-arent-my-scripts-running).
