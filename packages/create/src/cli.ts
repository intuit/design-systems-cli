import { CliCommand, Option } from '@design-systems/plugin';
import dedent from 'dedent';

const name: Option = {
  name: 'name',
  type: String
};

const template: Option = {
  name: 'template',
  alias: 't',
  description:
    'Override the template directory with a URL to a git repo. Repo must comply with template structure!',
  typeLabel: 'js | string',
  type: String,
  config: true
};

const listTemplates: Option = {
  name: 'list-templates',
  description: 'List available templates',
  type: Boolean
};

const force: Option = {
  name: 'force',
  description: 'Remove destination folder if it exits',
  alias: 'f',
  defaultValue: false,
  type: Boolean
};

export const system: CliCommand = {
  name: 'system',
  description: 'Scaffold a new `ds` system',
  examples: [
    'ds create system --name my-design-system',
    'ds create system --name my-design-system --repo hipstersmoothie/material'
  ],
  options: [
    listTemplates,
    {
      ...name,
      description:
        'Name of the system to create. If provided this will skip the initialization prompt'
    },
    {
      name: 'repo',
      description: 'Repository url or owner/repo',
      type: String
    },
    template,
    {
      name: 'cwd',
      description: 'Create the system in the current working directory',
      defaultValue: false,
      type: Boolean
    },
    force
  ]
};

const cli: CliCommand = {
  name: 'create',
  description: 'Scaffold a new `ds` component or system',
  commands: [
    {
      name: 'component',
      description: 'Scaffold a new `ds` component',
      examples: ['ds create component --name dropdown'],
      options: [
        listTemplates,
        {
          ...name,
          description:
            'Name of the component to create. If provided this will skip the initialization prompt'
        },
        template,
        force
      ]
    },
    {
      name: 'package',
      description: 'Scaffold a new helper package for your components.',
      examples: ['ds create package --name utils'],
      options: [
        listTemplates,
        {
          ...name,
          description:
            'Name of the package to create. If provided this will skip the initialization prompt'
        },
        template,
        force
      ]
    },
    system
  ],
  footer: [
    {
      header: 'Custom Templates',
      content: dedent`
      You can create your own custom template for a design system, component, or template.  

      1. Fork one of our templates (https://github.com/design-systems-templates)
      2. Modify the template without removing the 'components' directory
      3. Push your template to a git repo 

      Now that you've created a custom template you can use it by passing the 
      repo URL to the create command.

      \`\`\`
      ds create system --template hipstersmoothie/ds-monorepo 
      \`\`\`\n

      If you want to include a set of templates for your developers to choose from you can add them in your \`ds.config.json\`
    `
    },
    {
      code: true,
      content: dedent`
        \`\`\`json
        {
          "create": {
            "package": {
              "templates": [
                {
                  "name": "custom-js",
                  "url": "https://github.com/me/my-template",
                  "description": "A custom package template",
                  "sha": "4b9c7b627307380fb31acae059f7c095d0c626b8"
                }
              ]
            }
          }
        }      
       \`\`\``
    }
  ]
};

export default cli;
