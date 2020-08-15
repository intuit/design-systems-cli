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

- update storybook deps [#280](https://github.com/intuit/design-systems-cli/pull/280) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Revert "Update dependency css-loader to v4" [#435](https://github.com/intuit/design-systems-cli/pull/435) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- downgrade notes back to working version [#432](https://github.com/intuit/design-systems-cli/pull/432) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- downgrade notes back to working version ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update templates: babel runtime, playroom snippet, story name separator [#428](https://github.com/intuit/design-systems-cli/pull/428) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update storybook monorepo to v6.0.6 ([@renovate-bot](https://github.com/renovate-bot))
- Merge master into next ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency storybook-dark-mode to v1 ([@renovate-bot](https://github.com/renovate-bot))
- remove fork-ts-checker since it's a part of storybook now ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update change option name ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency tslib to v2 ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency fork-ts-checker-webpack-plugin to v5 ([@renovate-bot](https://github.com/renovate-bot))
- Update storybook monorepo to v6.0.5 ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency fast-glob to v3.2.4 ([@renovate-bot](https://github.com/renovate-bot))
- Update babel monorepo ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency source-map-loader to v1 ([@renovate-bot](https://github.com/renovate-bot))
- Update storybook monorepo ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency webpack to v4.44.1 ([@renovate-bot](https://github.com/renovate-bot))
- remove deprecated @proof-ui/storybook plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Bump version to: v1.10.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove unneeded decorator ([@hipstersmoothie](https://github.com/hipstersmoothie))
- upgrade dark mode plugin ([@hipstersmoothie](https://github.com/hipstersmoothie))
- switch to new global param and decorator definition ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update to latest storybook rc ([@hipstersmoothie](https://github.com/hipstersmoothie))
- upgrade storybook [#282](https://github.com/intuit/design-systems-cli/pull/282) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- upgrade storybook ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Revert "Update dependency css-loader to v4" ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update storybook deps ([@hipstersmoothie](https://github.com/hipstersmoothie))
- exclude node_modules [#278](https://github.com/intuit/design-systems-cli/pull/278) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- exclude node_modules ([@hipstersmoothie](https://github.com/hipstersmoothie))
- only load source maps for packages in monorepo [#277](https://github.com/intuit/design-systems-cli/pull/277) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- only load source maps for packages in monorepo ([@hipstersmoothie](https://github.com/hipstersmoothie))
- use a better globbing library [#274](https://github.com/intuit/design-systems-cli/pull/274) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- use a better globbing library ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Fix more storybook 6.0 bugs [#272](https://github.com/intuit/design-systems-cli/pull/272) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- nanomatch is not feature rich ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update storybook-addon-sketch preset usage ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove old function call ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Fix more storybook 6.0 bugs [#271](https://github.com/intuit/design-systems-cli/pull/271) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove react-docgen-typescript-loader dep, provided by storybook now ([@hipstersmoothie](https://github.com/hipstersmoothie))
- upgrade storybook-addon-react-docgen ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update storybook-addon-sketch ([@hipstersmoothie](https://github.com/hipstersmoothie))
- shouldn't need to modifiy babel for ts files anymore ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix stories glob and panel imports ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix preview import ([@hipstersmoothie](https://github.com/hipstersmoothie))
- switch .storybook files to require ([@hipstersmoothie](https://github.com/hipstersmoothie))
- include preset.js and preview.js in package ([@hipstersmoothie](https://github.com/hipstersmoothie))
- correct storybook folder path ([@hipstersmoothie](https://github.com/hipstersmoothie))
- middleware deprecated? ([@hipstersmoothie](https://github.com/hipstersmoothie))
- add docs ([@hipstersmoothie](https://github.com/hipstersmoothie))
- try out new storybook setup ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update backgrounds usage ([@hipstersmoothie](https://github.com/hipstersmoothie))
- update storybook ([@hipstersmoothie](https://github.com/hipstersmoothie))
- upgrade to storybook 6.0 ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Update dependency lerna to v3.22.1 [#401](https://github.com/intuit/design-systems-cli/pull/401) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update storybook monorepo to v6.0.6 [#423](https://github.com/intuit/design-systems-cli/pull/423) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fork-ts-checker-webpack-plugin to v5 [#415](https://github.com/intuit/design-systems-cli/pull/415) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency css-loader to v4 [#414](https://github.com/intuit/design-systems-cli/pull/414) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency jest to v26.4.0 [#419](https://github.com/intuit/design-systems-cli/pull/419) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency tslib to v2 [#385](https://github.com/intuit/design-systems-cli/pull/385) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
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
- Update dependency postcss-hexrgba to v2.0.1 [#404](https://github.com/intuit/design-systems-cli/pull/404) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency playroom to v0.21.2 [#403](https://github.com/intuit/design-systems-cli/pull/403) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency marked to v1.1.1 [#402](https://github.com/intuit/design-systems-cli/pull/402) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency storybook-dark-mode to v1 [#420](https://github.com/intuit/design-systems-cli/pull/420) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency inquirer to v7.3.3 [#400](https://github.com/intuit/design-systems-cli/pull/400) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fast-glob to v3.2.4 [#399](https://github.com/intuit/design-systems-cli/pull/399) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency diff2html to v3.1.11 [#397](https://github.com/intuit/design-systems-cli/pull/397) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency commently to v5.87.0 [#396](https://github.com/intuit/design-systems-cli/pull/396) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency command-line-application to v0.10.1 [#395](https://github.com/intuit/design-systems-cli/pull/395) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency cli-spinners to v2.4.0 [#393](https://github.com/intuit/design-systems-cli/pull/393) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency chokidar to v3.4.2 [#392](https://github.com/intuit/design-systems-cli/pull/392) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency chalk to v4.1.0 [#391](https://github.com/intuit/design-systems-cli/pull/391) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency autoprefixer to v9.8.6 [#389](https://github.com/intuit/design-systems-cli/pull/389) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/semver to v7.3.1 [#388](https://github.com/intuit/design-systems-cli/pull/388) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/babel__core to v7.1.9 [#386](https://github.com/intuit/design-systems-cli/pull/386) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update babel monorepo [#368](https://github.com/intuit/design-systems-cli/pull/368) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency ts-loader to v8 [#384](https://github.com/intuit/design-systems-cli/pull/384) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency source-map-loader to v1 [#383](https://github.com/intuit/design-systems-cli/pull/383) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update auto [#367](https://github.com/intuit/design-systems-cli/pull/367) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency flat to v5.0.2 [#369](https://github.com/intuit/design-systems-cli/pull/369) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency mini-css-extract-plugin to v0.10.0 [#370](https://github.com/intuit/design-systems-cli/pull/370) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency typescript to v3.9.7 [#371](https://github.com/intuit/design-systems-cli/pull/371) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency webpack to v4.44.1 [#372](https://github.com/intuit/design-systems-cli/pull/372) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update jest monorepo to v26.3.0 [#373](https://github.com/intuit/design-systems-cli/pull/373) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update storybook monorepo [#375](https://github.com/intuit/design-systems-cli/pull/375) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update stylelint [#376](https://github.com/intuit/design-systems-cli/pull/376) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

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

- Update babel monorepo [#168](https://github.com/intuit/design-systems-cli/pull/168) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fork-ts-checker-webpack-plugin to v4.1.6 [#260](https://github.com/intuit/design-systems-cli/pull/260) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update proof to ^0.0.19 [#236](https://github.com/intuit/design-systems-cli/pull/236) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency storybook-dark-mode to ^0.6.0 [#180](https://github.com/intuit/design-systems-cli/pull/180) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency core-js to v3.6.5 [#222](https://github.com/intuit/design-systems-cli/pull/222) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency react-docgen-typescript-loader to v3.7.2 [#179](https://github.com/intuit/design-systems-cli/pull/179) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 3

- [@renovate[bot]](https://github.com/renovate[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.7.0 (Wed Apr 29 2020)

#### 🚀 Enhancement

- Move story/snippet/test type-checking to respective plugins [#214](https://github.com/intuit/design-systems-cli/pull/214) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v1.6.0 (Tue Apr 28 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, null[@alan-cruz2](https://github.com/alan-cruz2), for all your work!

#### 🚀 Enhancement

- Enable storybook middleware [#213](https://github.com/intuit/design-systems-cli/pull/213) (alan_cruz@intuit.com [@alan-cruz2](https://github.com/alan-cruz2))

#### Authors: 2

- [@alan-cruz2](https://github.com/alan-cruz2)
- Alan (alan_cruz@intuit.com)

---

# v1.5.1 (Mon Apr 27 2020)

#### 🐛 Bug Fix

- Update only desired babel config [#212](https://github.com/intuit/design-systems-cli/pull/212) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v1.5.0 (Tue Apr 21 2020)

#### 🚀 Enhancement

- feat: adding feature to auto assign a port [#204](https://github.com/intuit/design-systems-cli/pull/204) ([@vasikarla](https://github.com/vasikarla))

#### Authors: 1

- Raj Vasikarla ([@vasikarla](https://github.com/vasikarla))

---

# v1.4.15 (Fri Apr 10 2020)

#### 🐛 Bug Fix

- update storybook-addon-react-docgen dependency [#199](https://github.com/intuit/design-systems-cli/pull/199) ([@vasikarla](https://github.com/vasikarla) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Raj Vasikarla ([@vasikarla](https://github.com/vasikarla))

---

# v1.4.13 (Wed Apr 08 2020)

#### 🐛 Bug Fix

- update proof in storybook plugin too [#197](https://github.com/intuit/design-systems-cli/pull/197) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v1.4.9 (Mon Mar 30 2020)

#### 🐛 Bug Fix

- fix loading css in storybook [#166](https://github.com/intuit/design-systems-cli/pull/166) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v1.4.7 (Tue Mar 24 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot)), for all your work!

#### 🔩 Dependency Updates

- Update babel monorepo [#115](https://github.com/intuit/design-systems-cli/pull/115) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency tslib to v1.11.1 [#152](https://github.com/intuit/design-systems-cli/pull/152) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update storybook monorepo to v5.3.17 [#129](https://github.com/intuit/design-systems-cli/pull/129) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update react monorepo to v16.13.1 [#156](https://github.com/intuit/design-systems-cli/pull/156) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency storybook-addon-jsx to v7.1.15 [#125](https://github.com/intuit/design-systems-cli/pull/125) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency storybook-dark-mode to v0.3.1 [#151](https://github.com/intuit/design-systems-cli/pull/151) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 3

- [@renovate[bot]](https://github.com/renovate[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.4.6 (Wed Mar 18 2020)

#### 🐛  Bug Fix

- don't load stories in node_modules  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v1.2.1 (Wed Jan 22 2020)

#### 🐛  Bug Fix

- update some thing for storybook 5.3  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v1.2.0 (Wed Jan 22 2020)

#### 🐛  Bug Fix

- Update proof to v0.0.12  ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency webpack to v4.41.5  ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency storybook-dark-mode to v0.2.0  ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency core-js to v3.6.4  ([@renovate-bot](https://github.com/renovate-bot))

#### Authors: 1

- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.1.1 (Tue Jan 21 2020)

#### 🐛  Bug Fix

- upgrade storybook  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update babel monorepo to v7.8.3  ([@renovate-bot](https://github.com/renovate-bot))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.0.2 (Wed Jan 15 2020)

#### 🐛  Bug Fix

- add clearer docs around custom storybook config  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.74.10 (Mon Jan 13 2020)

#### 🐛  Bug Fix

- remove mentions of internal tooling  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.74.5 (Tue Jan 07 2020)

#### 🐛  Bug Fix

- fix storybook-addon-sketch dep  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.74.4 (Tue Jan 07 2020)

#### 🐛  Bug Fix

- use oss templates  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v0.74.1 (Tue Jan 07 2020)

#### ⚠️  Pushed to master

- `@design-systems/cli-utils`, `@design-systems/cli`, `@design-systems/core`, `@design-systems/create`, `@design-systems/eslint-config`, `@design-systems/load-config`, `@design-systems/plugin`, `@design-systems/stylelint-config`, `@design-systems/build`, `@design-systems/bundle`, `@design-systems/clean`, `@design-systems/create-command`, `@design-systems/dev`, `@design-systems/lint`, `@design-systems/playroom`, `@design-systems/proof`, `@design-systems/size`, `@design-systems/storybook`, `@design-systems/test`, `@design-systems/update`
  - set access  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))