# v2.7.3 (Thu Oct 22 2020)

#### 🐛 Bug Fix

- loosen babel dep ranges [#581](https://github.com/intuit/design-systems-cli/pull/581) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.7.1 (Tue Oct 20 2020)

#### 🐛 Bug Fix

- move postcss-themed reloading into postcss-themed package [#579](https://github.com/intuit/design-systems-cli/pull/579) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Update dependency focus-lock to ^0.8.0 [#570](https://github.com/intuit/design-systems-cli/pull/570) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 3

- [@renovate[bot]](https://github.com/renovate[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v2.5.1 (Fri Sep 25 2020)

#### 🐛 Bug Fix

- Only generate .js file mappings for the main css output [#514](https://github.com/intuit/design-systems-cli/pull/514) ([@adierkens](https://github.com/adierkens))

#### Authors: 1

- Adam Dierkens ([@adierkens](https://github.com/adierkens))

---

# v2.3.0 (Fri Sep 18 2020)

### Release Notes

_From #487_

#### CSS Auto Imports

The `build` plugin now supports a `cssImport` option, which automatically inserts an import for your main CSS output into the entry of your ESM build. This will make CSS work automatically for your design system users!

#### Multi-Build CSS

the `build` plugin now supports a `cssConfigs` option which will run multiple PostCSS builds for your CSS source. You can use this to, for example, make a second IE11 prefixed build of your styles.

#### babel-plugin-replace-styles

We added a new babel plugin that allows you to switch between multi-build CSS files, by modifying any automatic imports.

---

#### 🚀 Enhancement

- Multi-Build CSS & CSS ESM Imports [#487](https://github.com/intuit/design-systems-cli/pull/487) ([@tylerkrupicka](https://github.com/tylerkrupicka) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- minor fixes for multi css build config ([@tylerkrupicka](https://github.com/tylerkrupicka))
- iron out configuration ([@tylerkrupicka](https://github.com/tylerkrupicka))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Tyler Krupicka ([@tylerkrupicka](https://github.com/tylerkrupicka))

---

# v2.2.2 (Mon Sep 14 2020)

#### 🐛 Bug Fix

- still print warnings if they are present [#492](https://github.com/intuit/design-systems-cli/pull/492) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.0.3 (Fri Sep 04 2020)

#### 🐛 Bug Fix

- print storybook build error [#478](https://github.com/intuit/design-systems-cli/pull/478) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.0.2 (Mon Aug 31 2020)

#### 🐛 Bug Fix

- Update storybook monorepo [#469](https://github.com/intuit/design-systems-cli/pull/469) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates


#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

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

- Upgrade to "proof" v0.1.0 [#365](https://github.com/intuit/design-systems-cli/pull/365) (raj_vasikarla@intuit.com [@hipstersmoothie](https://github.com/hipstersmoothie) [@adierkens](https://github.com/adierkens))

#### 🐛 Bug Fix

- Merge master into next ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency tslib to v2 ([@renovate-bot](https://github.com/renovate-bot))
- fix lint errors ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency cosmiconfig to v7 ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency flat to v5.0.2 ([@renovate-bot](https://github.com/renovate-bot))
- Bump version to: v1.10.0 \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update CHANGELOG.md \[skip ci\] ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🔩 Dependency Updates

- Update dependency flat to v5.0.2 [#369](https://github.com/intuit/design-systems-cli/pull/369) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency fork-ts-checker-webpack-plugin to v5 [#415](https://github.com/intuit/design-systems-cli/pull/415) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency jest to v26.4.0 [#419](https://github.com/intuit/design-systems-cli/pull/419) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency tslib to v2 [#385](https://github.com/intuit/design-systems-cli/pull/385) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update linters [#374](https://github.com/intuit/design-systems-cli/pull/374) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update auto [#367](https://github.com/intuit/design-systems-cli/pull/367) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency css-loader to v4 [#414](https://github.com/intuit/design-systems-cli/pull/414) ([@renovate-bot](https://github.com/renovate-bot) [@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency mini-css-extract-plugin to v0.10.0 [#370](https://github.com/intuit/design-systems-cli/pull/370) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency typescript to v3.9.7 [#371](https://github.com/intuit/design-systems-cli/pull/371) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency webpack to v4.44.1 [#372](https://github.com/intuit/design-systems-cli/pull/372) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update jest monorepo to v26.3.0 [#373](https://github.com/intuit/design-systems-cli/pull/373) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update storybook monorepo [#375](https://github.com/intuit/design-systems-cli/pull/375) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency cosmiconfig to v7 [#377](https://github.com/intuit/design-systems-cli/pull/377) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 5

- [@renovate[bot]](https://github.com/renovate[bot])
- Adam Dierkens ([@adierkens](https://github.com/adierkens))
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Raj Vasikarla (raj_vasikarla@intuit.com)
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.10.0 (Tue Jun 09 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot)), for all your work!

#### 🔩 Dependency Updates

- Update dependency resolve to v1.17.0 [#228](https://github.com/intuit/design-systems-cli/pull/228) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/flat to v5 [#188](https://github.com/intuit/design-systems-cli/pull/188) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 2

- [@renovate[bot]](https://github.com/renovate[bot])
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.4.7 (Tue Mar 24 2020)

:tada: This release contains work from a new contributor! :tada:

Thank you, WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot)), for all your work!

#### 🔩 Dependency Updates

- Update dependency tslib to v1.11.1 [#152](https://github.com/intuit/design-systems-cli/pull/152) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/dlv to v1.1.2 [#116](https://github.com/intuit/design-systems-cli/pull/116) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency resolve to v1.15.1 [#150](https://github.com/intuit/design-systems-cli/pull/150) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### Authors: 2

- [@renovate[bot]](https://github.com/renovate[bot])
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v1.2.0 (Wed Jan 22 2020)

#### 🐛  Bug Fix

- Update dependency resolve to v1.15.0  ([@renovate-bot](https://github.com/renovate-bot))
- fix build  ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update dependency resolve to v1.14.2  ([@renovate-bot](https://github.com/renovate-bot))
- Update dependency change-case to v4

fix build  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v0.74.1 (Tue Jan 07 2020)

#### ⚠️  Pushed to master

- set access  ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))