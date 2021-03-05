# v2.14.0 (Fri Mar 05 2021)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Vitor Freitas Buchalla ([@vfreitas-](https://github.com/vfreitas-))

:heart: Salil Cuncoliencar ([@salilbc](https://github.com/salilbc))

#### 🐛 Bug Fix

- chore(typings): remove and update some types [#537](https://github.com/intuit/design-systems-cli/pull/537) ([@vfreitas-](https://github.com/vfreitas-))
- Merge branch 'master' into master ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Update babel ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Merge branch 'master' into feature/issue-533-update-some-types ([@vfreitas-](https://github.com/vfreitas-))

#### 🔩 Dependency Updates

- Update dependency pretty-bytes to v5.6.0 [#606](https://github.com/intuit/design-systems-cli/pull/606) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update babel [#582](https://github.com/intuit/design-systems-cli/pull/582) ([@hipstersmoothie](https://github.com/hipstersmoothie) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency @types/babel__code-frame to v7.0.2 [#525](https://github.com/intuit/design-systems-cli/pull/525) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency cli-spinners to v2.5.0 [#563](https://github.com/intuit/design-systems-cli/pull/563) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))
- Update dependency file-loader to v6.2.0 [#555](https://github.com/intuit/design-systems-cli/pull/555) ([@renovate-bot](https://github.com/renovate-bot) [@renovate[bot]](https://github.com/renovate[bot]))

#### 📝 Documentation

- Add Contributing Guide #531 [#547](https://github.com/intuit/design-systems-cli/pull/547) ([@salilbc](https://github.com/salilbc))

#### Authors: 5

- [@renovate[bot]](https://github.com/renovate[bot])
- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Salil Cuncoliencar ([@salilbc](https://github.com/salilbc))
- Vitor Freitas Buchalla ([@vfreitas-](https://github.com/vfreitas-))
- WhiteSource Renovate ([@renovate-bot](https://github.com/renovate-bot))

---

# v2.10.1 (Thu Dec 10 2020)

#### 🐛 Bug Fix

- integrate JSON file into single css theme builds [#603](https://github.com/intuit/design-systems-cli/pull/603) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- fix none css imports + path detection + replaceInline ([@hipstersmoothie](https://github.com/hipstersmoothie))
- integrate JSON file into single css theme builds ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

---

# v2.7.3 (Thu Oct 22 2020)

#### 🐛 Bug Fix

- loosen babel dep ranges [#581](https://github.com/intuit/design-systems-cli/pull/581) ([@hipstersmoothie](https://github.com/hipstersmoothie))
- loosen babel dep ranges ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### Authors: 1

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))

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

- fix indentation ([@tylerkrupicka](https://github.com/tylerkrupicka))
- add reference to postcss themed ([@tylerkrupicka](https://github.com/tylerkrupicka))
- update replace styles documentation ([@tylerkrupicka](https://github.com/tylerkrupicka))
- update docs ([@tylerkrupicka](https://github.com/tylerkrupicka))
- add babel-preset-replace-styles ([@tylerkrupicka](https://github.com/tylerkrupicka))

#### Authors: 2

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Tyler Krupicka ([@tylerkrupicka](https://github.com/tylerkrupicka))
