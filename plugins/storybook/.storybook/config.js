import { addDecorator, addParameters } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withPropsTable } from 'storybook-addon-react-docgen';
import { withKnobs } from '@storybook/addon-knobs';
import { themes as storybookThemes, ThemeContext } from '@storybook/theming';
import { jsxDecorator } from 'storybook-addon-jsx';
import { select } from '@storybook/addon-knobs';
import configProof from '@proof-ui/storybook';

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

require(CONFIG_PATH);
