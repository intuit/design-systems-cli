# v2.2.2 (Mon Sep 14 2020)

#### 🐛 Bug Fix

- still print warnings if they are present [#492](https://github.com/intuit/design-systems-cli/pull/492) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- still print warnings if they are present ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.2.1 (Mon Sep 14 2020)

#### 🐛 Bug Fix

- increase max number of lint warnings default [#491](https://github.com/intuit/design-systems-cli/pull/491) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- increase max number of lint warnings default ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.1.0 (Mon Sep 14 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, Athitya Kumar ([@athityakumar](https://github.com/athityakumar)), for all your work!

#### 🚀 Enhancement

- Adds support for --max-warnings flag in lint command [#485](https://github.com/intuit/design-systems-cli/pull/485) ([@athityakumar](https://github.com/athityakumar))

#### 🐛 Bug Fix

- Fixes linting issue to preferably not use 'any' type ([@athityakumar](https://github.com/athityakumar))
- Changes docstring and default value to match eslint ([@athityakumar](https://github.com/athityakumar))
- Starts adding support for --max-warnings flag in lint command ([@athityakumar](https://github.com/athityakumar))

#### Authors: 1

- Athitya Kumar ([@athityakumar](https://github.com/athityakumar))

---

# v2.0.2 (Mon Aug 31 2020)

#### 🐛 Bug Fix

- Update storybook monorepo [#469](https://github.com/intuit/design-systems-cli/pull/469) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency stylelint to v13.7.0 ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency @types/eslint to v7.2.2 ([@renovate-bot](https://github.com/renovate-bot))

#### 🔩 Dependency Updates

- Update dependency @types/node to v14.6.2 [#446](https://github.com/intuit/design-systems-cli/pull/446) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/eslint to v7.2.2 [#454](https://github.com/intuit/design-systems-cli/pull/454) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency prettier to v2.1.1 [#457](https://github.com/intuit/design-systems-cli/pull/457) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency mini-css-extract-plugin to v0.11.0 [#459](https://github.com/intuit/design-systems-cli/pull/459) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency pretty-bytes to v5.4.1 [#460](https://github.com/intuit/design-systems-cli/pull/460) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency optimize-css-assets-webpack-plugin to v5.0.4 [#462](https://github.com/intuit/design-systems-cli/pull/462) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency file-loader to v6.1.0 [#464](https://github.com/intuit/design-systems-cli/pull/464) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency stylelint to v13.7.0 [#465](https://github.com/intuit/design-systems-cli/pull/465) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 3

- [@renovate[bot]](https://github.com/renovate[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

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
- lint mdx files [#283](https://github.com/intuit/design-systems-cli/pull/283) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Merge master into next ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency @types/eslint to v7 ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency fast-glob to v3.2.4 ([@renovate-bot](https://github.com/renovate-bot))
- Update linters ([@renovate-bot](https://github.com/renovate-bot))
- Bump version to: v1.10.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency tslib to v2 ([@renovate-bot](https://github.com/renovate-bot))
- Update stylelint ([@renovate-bot](https://github.com/renovate-bot))
- lint mdx files ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update linters ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Update dependency postcss-hexrgba to v2.0.1 [#404](https://github.com/intuit/design-systems-cli/pull/404) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fork-ts-checker-webpack-plugin to v5 [#415](https://github.com/intuit/design-systems-cli/pull/415) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency jest to v26.4.0 [#419](https://github.com/intuit/design-systems-cli/pull/419) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency tslib to v2 [#385](https://github.com/intuit/design-systems-cli/pull/385) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @testing-library/jest-dom to v5 [#409](https://github.com/intuit/design-systems-cli/pull/409) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency progress-estimator to v0.3.0 [#406](https://github.com/intuit/design-systems-cli/pull/406) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency postcss-nested to v4.2.3 [#405](https://github.com/intuit/design-systems-cli/pull/405) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/node to v14 [#412](https://github.com/intuit/design-systems-cli/pull/412) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency colorette to v1.2.1 [#394](https://github.com/intuit/design-systems-cli/pull/394) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency babel-plugin-styled-components to v1.11.1 [#390](https://github.com/intuit/design-systems-cli/pull/390) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/clean-css to v4.2.2 [#387](https://github.com/intuit/design-systems-cli/pull/387) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency type-fest to v0.16.0 [#407](https://github.com/intuit/design-systems-cli/pull/407) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency webpack-cli to v3.3.12 [#408](https://github.com/intuit/design-systems-cli/pull/408) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/eslint to v7 [#410](https://github.com/intuit/design-systems-cli/pull/410) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/jest to v26 [#411](https://github.com/intuit/design-systems-cli/pull/411) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/webpack-sources to v1 [#413](https://github.com/intuit/design-systems-cli/pull/413) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency jest-junit to v11 [#416](https://github.com/intuit/design-systems-cli/pull/416) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency eslint-plugin-react to v7.20.6 [#418](https://github.com/intuit/design-systems-cli/pull/418) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update storybook monorepo to v6.0.5 [#417](https://github.com/intuit/design-systems-cli/pull/417) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency css-loader to v4 [#414](https://github.com/intuit/design-systems-cli/pull/414) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency playroom to v0.21.2 [#403](https://github.com/intuit/design-systems-cli/pull/403) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency marked to v1.1.1 [#402](https://github.com/intuit/design-systems-cli/pull/402) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency lerna to v3.22.1 [#401](https://github.com/intuit/design-systems-cli/pull/401) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency inquirer to v7.3.3 [#400](https://github.com/intuit/design-systems-cli/pull/400) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fast-glob to v3.2.4 [#399](https://github.com/intuit/design-systems-cli/pull/399) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update linters [#374](https://github.com/intuit/design-systems-cli/pull/374) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update auto [#367](https://github.com/intuit/design-systems-cli/pull/367) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency flat to v5.0.2 [#369](https://github.com/intuit/design-systems-cli/pull/369) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency mini-css-extract-plugin to v0.10.0 [#370](https://github.com/intuit/design-systems-cli/pull/370) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency typescript to v3.9.7 [#371](https://github.com/intuit/design-systems-cli/pull/371) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency webpack to v4.44.1 [#372](https://github.com/intuit/design-systems-cli/pull/372) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update jest monorepo to v26.3.0 [#373](https://github.com/intuit/design-systems-cli/pull/373) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update storybook monorepo [#375](https://github.com/intuit/design-systems-cli/pull/375) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency cosmiconfig to v7 [#377](https://github.com/intuit/design-systems-cli/pull/377) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency find-up to v5 [#378](https://github.com/intuit/design-systems-cli/pull/378) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update stylelint [#376](https://github.com/intuit/design-systems-cli/pull/376) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Upgrade Ts eslint [#269](https://github.com/intuit/design-systems-cli/pull/269) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update linters [#265](https://github.com/intuit/design-systems-cli/pull/265) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 5

- [@renovate[bot]](https://github.com/renovate[bot])
- Adam Dierkens ([@adierkens](https://github.com/adierkens))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Raj Vasikarla ([@vasikarla](https://github.com/vasikarla))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.10.0 (Tue Jun 09 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot)), for all your work!

#### 🔩 Dependency Updates

- Update stylelint [#237](https://github.com/intuit/design-systems-cli/pull/237) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/eslint to v6.8.1 [#170](https://github.com/intuit/design-systems-cli/pull/170) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 2

- [@renovate[bot]](https://github.com/renovate[bot])
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.7.2 (Fri May 15 2020)

#### 🐛 Bug Fix

- update github reports [#247](https://github.com/intuit/design-systems-cli/pull/247) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v1.5.1 (Mon Apr 27 2020)

#### 🏠 Internal

- refactor: organizing code [#205](https://github.com/intuit/design-systems-cli/pull/205) ([@vasikarla](https://github.com/vasikarla))

#### Authors: 1

- Raj Vasikarla ([@vasikarla](https://github.com/vasikarla))

---

# v1.4.7 (Tue Mar 24 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot)), for all your work!

#### 🔩 Dependency Updates

- Update dependency tslib to v1.11.1 [#152](https://github.com/intuit/design-systems-cli/pull/152) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/eslint to v6.1.8 [#117](https://github.com/intuit/design-systems-cli/pull/117) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fast-glob to v3.2.2 [#146](https://github.com/intuit/design-systems-cli/pull/146) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update stylelint [#157](https://github.com/intuit/design-systems-cli/pull/157) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 2

- [@renovate[bot]](https://github.com/renovate[bot])
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.2.0 (Wed Jan 22 2020)

#### 🐛  Bug Fix

- Update dependency @types/eslint to v6.1.5  ([@renovate-bot](https://github.com/renovate-bot))
- Update stylelint  ([@renovate-bot](https://github.com/renovate-bot))
- Update linters  ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency @types/eslint to v6.1.4  ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency fast-glob to v3.1.1  ([@renovate-bot](https://github.com/renovate-bot))

#### Authors: 1

- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.1.0 (Thu Jan 16 2020)

#### 🐛  Bug Fix

- fix lint  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.74.1 (Tue Jan 07 2020)

#### ⚠️  Pushed to master

- `@design-systems/cli-utils`, `@design-systems/cli`, `@design-systems/core`, `@design-systems/create`, `@design-systems/eslint-config`, `@design-systems/load-config`, `@design-systems/plugin`, `@design-systems/stylelint-config`, `@design-systems/build`, `@design-systems/bundle`, `@design-systems/clean`, `@design-systems/create-command`, `@design-systems/dev`, `@design-systems/lint`, `@design-systems/playroom`, `@design-systems/proof`, `@design-systems/size`, `@design-systems/storybook`, `@design-systems/test`, `@design-systems/update`
  - set access  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))