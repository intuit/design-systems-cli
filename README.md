<div align="center">
  <img src="./logo.png" />

  <h1></h1>

  <p>A CLI toolbox for creating design systems in minutes</p>

  <p>Uses: Typescript, CSS, styled-components support</p>
  <p>Outputs: CJS and MJS</p>
  <p>No tooling configuration required</p>
</div>

<div align="center">
<a href="https://circleci.com/gh/intuit/design-systems-cli/tree/master"><img src="https://img.shields.io/circleci/project/github/intuit/design-systems-cli/master.svg?style=flat-square&logo=circleci" alt="CircleCI" /></a>
<a href="https://www.npmjs.com/package/@design-systems/cli"><img src="https://img.shields.io/npm/v/@design-systems/cli.svg?style=flat-square&logo=npm" alt="npm" /></a>
<a href="https://www.npmjs.com/package/@design-systems/cli"><img src="https://img.shields.io/npm/dt/@design-systems/cli.svg?style=flat-square&logo=npm" alt="npm" /></a>
<img src="https://camo.githubusercontent.com/1e90782cb83e8540fdb707b54ce8d055c8224b07/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e6f64652d25334525334425323031302e31382e312d627269676874677265656e" />
<a href="https://github.com/intuit/auto"><img src="https://img.shields.io/badge/release-auto.svg?style=flat-square&colorA=888888&amp;colorB=9B065A&amp;label=auto&amp;logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACzElEQVR4AYXBW2iVBQAA4O+/nLlLO9NM7JSXasko2ASZMaKyhRKEDH2ohxHVWy6EiIiiLOgiZG9CtdgG0VNQoJEXRogVgZYylI1skiKVITPTTtnv3M7+v8UvnG3M+r7APLIRxStn69qzqeBBrMYyBDiL4SD0VeFmRwtrkrI5IjP0F7rjzrSjvbTqwubiLZffySrhRrSghBJa8EBYY0NyLJt8bDBOtzbEY72TldQ1kRm6otana8JK3/kzN/3V/NBPU6HsNnNlZAz/ukOalb0RBJKeQnykd7LiX5Fp/YXuQlfUuhXbg8Di5GL9jbXFq/tLa86PpxPhAPrwCYaiorS8L/uuPJh1hZFbcR8mewrx0d7JShr3F7pNW4vX0GRakKWVk7taDq7uPvFWw8YkMcPVb+vfvfRZ1i7zqFwjtmFouL72y6C/0L0Ie3GvaQXRyYVB3YZNE32/+A/D9bVLcRB3yw3hkRCdaDUtFl6Ykr20aaLvKoqIXUdbMj6GFzAmdxfWx9iIRrkDr1f27cFONGMUo/gRI/jNbIMYxJOoR1cY0OGaVPb5z9mlKbyJP/EsdmIXvsFmM7Ql42nEblX3xI1BbYbTkXCqRnxUbgzPo4T7sQBNeBG7zbAiDI8nWfZDhQWYCG4PFr+HMBQ6l5VPJybeRyJXwsdYJ/cRnlJV0yB4ZlUYtFQIkMZnst8fRrPcKezHCblz2IInMIkPzbbyb9mW42nWInc2xmE0y61AJ06oGsXL5rcOK1UdCbEXiVwNXsEy/6+EbaiVG8eeEAfxvaoSBnCH61uOD7BS1Ul8ESHBKWxCrdyd6EYNKihgEVrwOAbQruoytuBYIFfAc3gVN6iawhjKyNCEpYhVJXgbOzARyaU4hCtYizq5EI1YgiUoIlT1B7ZjByqmRWYbwtdYjoWoN7+LOIQefIqKawLzK6ID69GGpQgwhhEcwGGUzfEPAiPqsCXadFsAAAAASUVORK5CYII=" alt="Auto Release" /></a>
</div>

<br />

## Overview

Design-systems-cli is basically a [Create React App](https://github.com/facebook/create-react-app) for design systems.

The main benefit it brings you as a developer is time savings. Setting up all of the monorepo, [storybook](https://storybook.js.org/), and build tools for a design system takes over a week if you piece it together yourself. You can do it with this project in minutes.

### Features
:star: Scaffold components and entire design systems

:star: Build your components for multiple outputs (cjs and esm)

:star: Write styles with styled-components or css-modules

:star: Craft excellent components using Storybook

:star: Let component consumer try your components with playroom

:star: Testing and linting support

:star: Typescript supported out of the box

:star: Track the size of your components and debug the changes

For the full documentation, go [here](https://intuit.github.io/design-systems-cli/#).

## Installation

Ensure you have the following softwares installed:
* `Node >= 10.18.1` - [Installation guide](https://nodejs.org/en/download/)
* `Yarn` - [Installation guide](https://classic.yarnpkg.com/en/docs/install)

### To get started:

To get set up, fork and clone the project then run the following command:

```sh
yarn && yarn start
```

### Creating a new Plugin

To scaffold a new plugin inside this repo run the following command:

```sh
yarn run create:plugin "my plugin"
```

## Contributing

Feel free to open an [issue](https://github.com/intuit/design-systems-cli/issues) or a [pull request](https://github.com/intuit/design-systems-cli/pulls)!

Make sure to read our [code of conduct](./CODE_OF_CONDUCT.md).

We actively welcome pull requests. Learn how to [contribute](./CONTRIBUTING.md).

## Contributors ✨

Thank you to all these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://adamdierkens.com"><img src="https://avatars1.githubusercontent.com/u/13004162?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adam Dierkens</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=adierkens" title="Code">💻</a> <a href="#design-adierkens" title="Design">🎨</a> <a href="#ideas-adierkens" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=adierkens" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=adierkens" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://hipstersmoothie.com"><img src="https://avatars3.githubusercontent.com/u/1192452?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Lisowski</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=hipstersmoothie" title="Code">💻</a> <a href="#design-hipstersmoothie" title="Design">🎨</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=hipstersmoothie" title="Documentation">📖</a> <a href="#ideas-hipstersmoothie" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-hipstersmoothie" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=hipstersmoothie" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://tylerkrupicka.com"><img src="https://avatars1.githubusercontent.com/u/5761061?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tyler Krupicka</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=tylerkrupicka" title="Code">💻</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=tylerkrupicka" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=tylerkrupicka" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kendallgassner"><img src="https://avatars0.githubusercontent.com/u/15275462?s=400&v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kendall Gassner</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=kendallgassner" title="Code">💻</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=kendallgassner" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=kendallgassner" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kharrop"><img src="https://avatars0.githubusercontent.com/u/24794756?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kelly Harrop</b></sub></a><br /><a href="#design-kharrop" title="Design">🎨</a></td>
    <td align="center"><a href="http://peter.mikit.sh"><img src="https://avatars3.githubusercontent.com/u/1571918?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Peter Mikitsh</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=petermikitsh" title="Documentation">📖</a></td>
    <td align="center"><a href="https://renovate.whitesourcesoftware.com"><img src="https://avatars0.githubusercontent.com/u/25180681?v=4?s=100" width="100px;" alt=""/><br /><sub><b>WhiteSource Renovate</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=renovate-bot" title="Code">💻</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=renovate-bot" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/mishavp2001"><img src="https://avatars2.githubusercontent.com/u/1007097?v=4?s=100" width="100px;" alt=""/><br /><sub><b>mishavp2001</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=mishavp2001" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/vasikarla"><img src="https://avatars0.githubusercontent.com/u/1945958?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Raj Vasikarla</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=vasikarla" title="Code">💻</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=vasikarla" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=vasikarla" title="Tests">⚠️</a></td>
    <td align="center"><a href="http://uptrend.tech"><img src="https://avatars3.githubusercontent.com/u/126236?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Brandon Orther</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=orther" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=orther" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/alan-cruz2"><img src="https://avatars3.githubusercontent.com/u/11319336?v=4?s=100" width="100px;" alt=""/><br /><sub><b>alan-cruz2</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=alan-cruz2" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/hainessss"><img src="https://avatars1.githubusercontent.com/u/6373177?v=4?s=100" width="100px;" alt=""/><br /><sub><b>hainessss</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=hainessss" title="Code">💻</a></td>
    <td align="center"><a href="http://athityakumar.github.io/"><img src="https://avatars0.githubusercontent.com/u/17109060?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Athitya Kumar</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=athityakumar" title="Code">💻</a></td>
    <td align="center"><a href="https://jasonrundell.com/"><img src="https://avatars0.githubusercontent.com/u/524344?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jason Rundell (he/him)</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=jasonrundell" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=jasonrundell" title="Tests">⚠️</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=jasonrundell" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/reubenae"><img src="https://avatars1.githubusercontent.com/u/17691502?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Reuben</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=reubenae" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/vzsky"><img src="https://avatars1.githubusercontent.com/u/20735983?v=4?s=100" width="100px;" alt=""/><br /><sub><b>my99N</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=vzsky" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=vzsky" title="Tests">⚠️</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=vzsky" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/anjaliguptaz"><img src="https://avatars2.githubusercontent.com/u/13619573?v=4?s=100" width="100px;" alt=""/><br /><sub><b>anjaliguptaz</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=anjaliguptaz" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/chaopan"><img src="https://avatars3.githubusercontent.com/u/7483159?v=4?s=100" width="100px;" alt=""/><br /><sub><b>chaopan</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=chaopan" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Talor-A"><img src="https://avatars2.githubusercontent.com/u/11509865?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Talor Anderson</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=Talor-A" title="Code">💻</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=Talor-A" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=Talor-A" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/spentacular"><img src="https://avatars2.githubusercontent.com/u/1043478?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Spencer Hamm</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=spentacular" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/amalik2"><img src="https://avatars.githubusercontent.com/u/25858348?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Adil Malik</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=amalik2" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/salilbc"><img src="https://avatars.githubusercontent.com/u/9673247?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Salil Cuncoliencar</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=salilbc" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=salilbc" title="Tests">⚠️</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=salilbc" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/GauravKesarwani"><img src="https://avatars.githubusercontent.com/u/5545506?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gaurav Kesarwani</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=GauravKesarwani" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=GauravKesarwani" title="Tests">⚠️</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=GauravKesarwani" title="Code">💻</a></td>
    <td align="center"><a href="https://nicolas-hoizey.com/"><img src="https://avatars.githubusercontent.com/u/78213?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nicolas Hoizey</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=nhoizey" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/hborawski"><img src="https://avatars.githubusercontent.com/u/1325154?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Harris Borawski</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=hborawski" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/fattslug"><img src="https://avatars.githubusercontent.com/u/18297343?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sean Powell</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=fattslug" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/melindali255"><img src="https://avatars.githubusercontent.com/u/29384338?v=4?s=100" width="100px;" alt=""/><br /><sub><b>melindali255</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=melindali255" title="Documentation">📖</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=melindali255" title="Tests">⚠️</a> <a href="https://github.com/intuit/design-systems-cli/commits?author=melindali255" title="Code">💻</a></td>
    <td align="center"><a href="https://yuchoho.com/"><img src="https://avatars.githubusercontent.com/u/9959271?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yucho Ho</b></sub></a><br /><a href="https://github.com/intuit/design-systems-cli/commits?author=yucho" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
