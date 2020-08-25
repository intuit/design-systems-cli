# v2.0.1 (Tue Aug 25 2020)

#### 🐛 Bug Fix

- fail build if code doesn't transpile [#458](https://github.com/intuit/design-systems-cli/pull/458) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.0.0 (Fri Aug 14 2020)

### Release Notes

_From #365_

WDIO Breaking changes:

- host -> hostname in proof.config.js
- Change all tests to use wdio updated APIs
- Removal of assert from proof. Consumer provides their own assertion library now

---

#### 💥 Breaking Change

- Upgrade to "proof" v0.1.0 [#365](https://github.com/intuit/design-systems-cli/pull/365) ([@vasikarla](https://github.com/vasikarla) [@hipstersmoothie](https://github.com/hipstersmoothie) [@adierkens](https://github.com/adierkens))

#### 🚀 Enhancement

- feat: adding ability to send failure threshold from args [#275](https://github.com/intuit/design-systems-cli/pull/275) ([@vasikarla](https://github.com/vasikarla))

#### 🐛 Bug Fix

- Update dependency playroom to v0.21.2 ([@renovate-bot](https://github.com/renovate-bot))
- Revert "Update dependency css-loader to v4" [#435](https://github.com/intuit/design-systems-cli/pull/435) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Merge master into next ([@hipstersmoothie](https://github.com/hipstersmoothie))
- remove fork-ts-checker since it's a part of storybook now ([@hipstersmoothie](https://github.com/hipstersmoothie))
- switch to new way to check for syntax errors ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency tslib to v2 ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency fork-ts-checker-webpack-plugin to v5 ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency css-loader to v4 ([@renovate-bot](https://github.com/renovate-bot))
- Revert "Update dependency css-loader to v4" ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency fast-glob to v3.2.4 ([@renovate-bot](https://github.com/renovate-bot))
- Update babel monorepo ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint errors ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency webpack to v4.44.1 ([@renovate-bot](https://github.com/renovate-bot))
- Bump version to: v1.10.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix lint ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix build ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Update dependency lerna to v3.22.1 [#401](https://github.com/intuit/design-systems-cli/pull/401) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fork-ts-checker-webpack-plugin to v5 [#415](https://github.com/intuit/design-systems-cli/pull/415) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
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
- Update dependency css-loader to v4 [#414](https://github.com/intuit/design-systems-cli/pull/414) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
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
- Update linters [#374](https://github.com/intuit/design-systems-cli/pull/374) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update auto [#367](https://github.com/intuit/design-systems-cli/pull/367) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency flat to v5.0.2 [#369](https://github.com/intuit/design-systems-cli/pull/369) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency mini-css-extract-plugin to v0.10.0 [#370](https://github.com/intuit/design-systems-cli/pull/370) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency typescript to v3.9.7 [#371](https://github.com/intuit/design-systems-cli/pull/371) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency webpack to v4.44.1 [#372](https://github.com/intuit/design-systems-cli/pull/372) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
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

- Update babel monorepo [#168](https://github.com/intuit/design-systems-cli/pull/168) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency css-loader to v3.5.3 [#224](https://github.com/intuit/design-systems-cli/pull/224) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency playroom to v0.21.1 [#227](https://github.com/intuit/design-systems-cli/pull/227) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fork-ts-checker-webpack-plugin to v4.1.6 [#260](https://github.com/intuit/design-systems-cli/pull/260) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fs-extra to v9 [#190](https://github.com/intuit/design-systems-cli/pull/190) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency style-loader to v1.2.1 [#230](https://github.com/intuit/design-systems-cli/pull/230) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency file-loader to v6 [#189](https://github.com/intuit/design-systems-cli/pull/189) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 3

- [@renovate[bot]](https://github.com/renovate[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.8.0 (Tue May 19 2020)

#### 🚀 Enhancement

- feat: enable custom playroom config [#251](https://github.com/intuit/design-systems-cli/pull/251) ([@orther](https://github.com/orther))

#### Authors: 1

- Brandon Orther ([@orther](https://github.com/orther))

---

# v1.7.3 (Mon May 18 2020)

#### 🐛 Bug Fix

- fix playroom snippets old format support [#250](https://github.com/intuit/design-systems-cli/pull/250) ([@orther](https://github.com/orther))

#### Authors: 1

- Brandon Orther ([@orther](https://github.com/orther))

---

# v1.7.0 (Wed Apr 29 2020)

#### 🚀 Enhancement

- Move story/snippet/test type-checking to respective plugins [#214](https://github.com/intuit/design-systems-cli/pull/214) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v1.4.8 (Wed Mar 25 2020)

#### 🐛 Bug Fix

- Update playroom for official snippet support :tada: [#165](https://github.com/intuit/design-systems-cli/pull/165) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v1.4.7 (Tue Mar 24 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot)), for all your work!

#### 🔩 Dependency Updates

- Update babel monorepo [#115](https://github.com/intuit/design-systems-cli/pull/115) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency tslib to v1.11.1 [#152](https://github.com/intuit/design-systems-cli/pull/152) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fast-glob to v3.2.2 [#146](https://github.com/intuit/design-systems-cli/pull/146) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 3

- [@renovate[bot]](https://github.com/renovate[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.2.0 (Wed Jan 22 2020)

#### 🐛  Bug Fix

- fix build  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency react-element-to-jsx-string to v14.3.1  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency file-loader to v5  ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency fast-glob to v3.1.1  ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency webpack to v4.41.5  ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency style-loader to v1.1.3  ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency css-loader to v3.4.2  ([@renovate-bot](https://github.com/renovate-bot))

#### Authors: 1

- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.1.1 (Tue Jan 21 2020)

#### 🐛  Bug Fix

- Update babel monorepo to v7.8.3  ([@renovate-bot](https://github.com/renovate-bot))

#### Authors: 1

- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v0.74.1 (Tue Jan 07 2020)

#### ⚠️  Pushed to master

- `@design-systems/cli-utils`, `@design-systems/cli`, `@design-systems/core`, `@design-systems/create`, `@design-systems/eslint-config`, `@design-systems/load-config`, `@design-systems/plugin`, `@design-systems/stylelint-config`, `@design-systems/build`, `@design-systems/bundle`, `@design-systems/clean`, `@design-systems/create-command`, `@design-systems/dev`, `@design-systems/lint`, `@design-systems/playroom`, `@design-systems/proof`, `@design-systems/size`, `@design-systems/storybook`, `@design-systems/test`, `@design-systems/update`
  - set access  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))