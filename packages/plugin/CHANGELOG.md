# v2.1.0 (Mon Sep 14 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Athitya Kumar ([@athityakumar](https://github.com/athityakumar)), for all your work!

#### 🚀 Enhancement

- Adds support for --max-warnings flag in lint command [#485](https://github.com/intuit/design-systems-cli/pull/485) ([@athityakumar](https://github.com/athityakumar))

#### 🐛 Bug Fix

- Fixes linting issue to preferably not use 'any' type ([@athityakumar](https://github.com/athityakumar))

#### Authors: 1

- Athitya Kumar ([@athityakumar](https://github.com/athityakumar))

---

# v2.0.0 (Fri Aug 14 2020)

### Release Notes

_From #365_

WDIO Breaking changes:

- host -> hostname in proof.config.js
- Change all tests to use wdio updated APIs
- Removal of assert from proof. Consumer provides their own assertion library now

_From #270_

This release upgrades storybook from 5.3 to 6.0. This release will deprecate the old storybook configuration format in favor of the new format.

This allows use to package all of our storybook configuration into a `preset` that you can use like any other storybook preset.
Instead of `ds-cli` managing a `.storybook` folder for you, you now have full control (much like with all the other tools).

## Storybook Configuration Update Guide

If you have no `.storybook` folder currently, create one, then fill it with the following.

**`.storybook/main.js`:**

```js
module.exports = {
  presets: ["@design-systems/storybook/preset"]
};
```

**`.storybook/preview.js`:**

```js
import * as dsPreview from "@design-systems/storybook/preview";

export const decorators = [...dsPreview.decorators];

export const parameters = {
  ...dsPreview.parameters,
};
```

If you already have a `.storybook` folder please read through `storybook`'s [migration guide](https://github.com/storybookjs/storybook/blob/master/MIGRATION.md#to-mainjs-configuration).

---

#### 💥 Breaking Change

- Upgrade to "proof" v0.1.0 [#365](https://github.com/intuit/design-systems-cli/pull/365) ([@vasikarla](https://github.com/vasikarla) [@hipstersmoothie](https://github.com/hipstersmoothie) [@adierkens](https://github.com/adierkens))
- Upgrade to storybook 6.0 and standardize configuration [#270](https://github.com/intuit/design-systems-cli/pull/270) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🚀 Enhancement

- feat: adding ability to send failure threshold from args [#275](https://github.com/intuit/design-systems-cli/pull/275) ([@vasikarla](https://github.com/vasikarla))

#### 🐛 Bug Fix

- Merge master into next ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency tslib to v2 ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency command-line-application to v0.10.1 ([@renovate-bot](https://github.com/renovate-bot))
- Bump version to: v1.10.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Update dependency eslint-plugin-react to v7.20.6 [#418](https://github.com/intuit/design-systems-cli/pull/418) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fork-ts-checker-webpack-plugin to v5 [#415](https://github.com/intuit/design-systems-cli/pull/415) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency jest to v26.4.0 [#419](https://github.com/intuit/design-systems-cli/pull/419) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency tslib to v2 [#385](https://github.com/intuit/design-systems-cli/pull/385) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency babel-plugin-styled-components to v1.11.1 [#390](https://github.com/intuit/design-systems-cli/pull/390) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/clean-css to v4.2.2 [#387](https://github.com/intuit/design-systems-cli/pull/387) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency type-fest to v0.16.0 [#407](https://github.com/intuit/design-systems-cli/pull/407) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency webpack-cli to v3.3.12 [#408](https://github.com/intuit/design-systems-cli/pull/408) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/eslint to v7 [#410](https://github.com/intuit/design-systems-cli/pull/410) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/jest to v26 [#411](https://github.com/intuit/design-systems-cli/pull/411) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/webpack-sources to v1 [#413](https://github.com/intuit/design-systems-cli/pull/413) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency jest-junit to v11 [#416](https://github.com/intuit/design-systems-cli/pull/416) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency css-loader to v4 [#414](https://github.com/intuit/design-systems-cli/pull/414) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update storybook monorepo to v6.0.5 [#417](https://github.com/intuit/design-systems-cli/pull/417) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency postcss-hexrgba to v2.0.1 [#404](https://github.com/intuit/design-systems-cli/pull/404) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency playroom to v0.21.2 [#403](https://github.com/intuit/design-systems-cli/pull/403) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency marked to v1.1.1 [#402](https://github.com/intuit/design-systems-cli/pull/402) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency lerna to v3.22.1 [#401](https://github.com/intuit/design-systems-cli/pull/401) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency inquirer to v7.3.3 [#400](https://github.com/intuit/design-systems-cli/pull/400) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fast-glob to v3.2.4 [#399](https://github.com/intuit/design-systems-cli/pull/399) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency diff2html to v3.1.11 [#397](https://github.com/intuit/design-systems-cli/pull/397) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency commently to v5.87.0 [#396](https://github.com/intuit/design-systems-cli/pull/396) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency command-line-application to v0.10.1 [#395](https://github.com/intuit/design-systems-cli/pull/395) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update stylelint [#376](https://github.com/intuit/design-systems-cli/pull/376) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Upgrade Ts eslint [#269](https://github.com/intuit/design-systems-cli/pull/269) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 5

- [@renovate[bot]](https://github.com/renovate[bot])
- Adam Dierkens ([@adierkens](https://github.com/adierkens))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Raj Vasikarla ([@vasikarla](https://github.com/vasikarla))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.4.7 (Tue Mar 24 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot)), for all your work!

#### 🔩 Dependency Updates

- Update dependency tslib to v1.11.1 [#152](https://github.com/intuit/design-systems-cli/pull/152) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 2

- [@renovate[bot]](https://github.com/renovate[bot])
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.0.1 (Wed Jan 15 2020)

#### 🐛  Bug Fix

- upgrade command-line-application  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.74.10 (Mon Jan 13 2020)

#### 🐛  Bug Fix

- remove mentions of internal tooling  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.74.1 (Tue Jan 07 2020)

#### ⚠️  Pushed to master

- `@design-systems/cli-utils`, `@design-systems/cli`, `@design-systems/core`, `@design-systems/create`, `@design-systems/eslint-config`, `@design-systems/load-config`, `@design-systems/plugin`, `@design-systems/stylelint-config`, `@design-systems/build`, `@design-systems/bundle`, `@design-systems/clean`, `@design-systems/create-command`, `@design-systems/dev`, `@design-systems/lint`, `@design-systems/playroom`, `@design-systems/proof`, `@design-systems/size`, `@design-systems/storybook`, `@design-systems/test`, `@design-systems/update`
  - set access  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))