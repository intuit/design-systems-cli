const { addDecorator, addParameters } = require('@storybook/react');
const { withA11y } = require('@storybook/addon-a11y');
const { withPropsTable } = require('storybook-addon-react-docgen');
const { withKnobs } = require('@storybook/addon-knobs');
const { themes: storybookThemes, ThemeContext } = require('@storybook/theming');
const { jsxDecorator } = require('storybook-addon-jsx');
const { select } = require('@storybook/addon-knobs');
const configProof = require('@proof-ui/storybook').default;

configProof();

let lightLogo;
let darkLogo;

try {
  lightLogo = require(MONOREPO_ROOT + '/.storybook/light-logo.png');
} catch (error) {
  lightLogo = undefined;
}

try {
  darkLogo = require(MONOREPO_ROOT + '/.storybook/dark-logo.png');
} catch (error) {
  darkLogo = undefined;
}

addDecorator(withKnobs);
addDecorator(withPropsTable);
addDecorator(jsxDecorator);

const brand = {
  brandTitle: MONOREPO_NAME + ' Storybook',
  brandUrl: REPO_URL
};

addParameters({
  backgrounds: {
    default: 'white',
    values: [
      { name: 'white', value: 'white' },
      { name: 'dark', value: '#2f2f2f' },
      { name: 'twitter', value: '#00aced' },
      { name: 'facebook', value: '#3b5998' }
    ],
  },
  knobs: {
    escapeHTML: false
  },
  darkMode: {
    light: Object.assign({}, storybookThemes.light, brand, {
      brandImage: lightLogo
    }),
    dark: Object.assign({}, storybookThemes.dark, brand, {
      brandImage: darkLogo
    })
  },
  a11y: {
    config: {
      rules: [
        {
          id: 'duplicate-id',
          enabled: false
        },
        {
          id: 'heading-order',
          enabled: false
        },
        {
          id: 'label',
          none: ['help-same-as-label', 'multiple-label']
        }
      ]
    }
  }
});
