import { CliCommand } from '@design-systems/plugin';

const command: CliCommand = {
  name: 'dev',
  description:
    'Builds a component, any dependent component in the same monorepo, and starts storybook for just the component.',
  examples: ['ds dev'],
  footer: [
    {
      header: 'Solving Circular Dependencies for Stories',
      content:
        dedent`
          In a monorepo full of components you might get circlular dependencies when writing rich component documentation.

          To get around this problem "ds-cli" supports a special package.json property to track these dependenceies called "storyDependencies".
          Because it's not an official part of the package.json "lerna" won't use these dependencies to find the build order.

          The "dev" command will build these dependencies while running.
        `
    },
    {
      code: true,
      content: dedent`
        \`\`\`json
        {
          "storyDependencies": {
            "@my-system/field": "link:../Field"
          }
        }
        \`\`\`
      `
    }
  ]
};

export default command;
