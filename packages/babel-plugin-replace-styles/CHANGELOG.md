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
