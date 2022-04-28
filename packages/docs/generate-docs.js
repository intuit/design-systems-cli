#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const dedent = require('dedent');
const docs = require('command-line-docs').default;
const getApplicationDefinition = require('@design-systems/core').default;
const { getCommands } = require('@design-systems/core');
const { constructValidationSchema } = require('@design-systems/load-config');

/** Generate the docs for all of @design-systems/cli commands. */
async function generateCommandDocs() {
  try {
    fs.mkdirSync('src/commands');
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // dir already exists
  }

  const commands = await getCommands({});
  const commandDocs = [];

  commands
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(doc => {
      const text = docs(doc).replace('<port>', '\\<port\\>');
      const outPath = path.join('src/generated', `${doc.name}.md`);

      fs.writeFileSync(outPath, text);

      // eslint-disable-next-line no-console
      console.log(`Created docs for ${doc.name} command`);
      commandDocs.push([
        `ds ${doc.name}`,
        path.join('generated', `${doc.name}.md`)
      ]);
    });

  return commandDocs;
}

/** Create a type string for an option */
const makeType = ({ type, typeName, multiple }) => {
  const typeString = typeof type === 'string' ? type : typeName;
  return multiple ? `${typeString}[]` : typeString;
};

/** Determine supported scope for option */
const makeScope = ({ scope }) => {
  return scope || 'Global'
}

/** Generate a table for an array of options */
function generateOptionTable(options) {
  let text = dedent`\n
    | Name | Type | Scope | Description |
    | ---- | ---- | ----- | ----------- |
  `;

  Object.entries(options).forEach(([option, value]) => {
    if (option.includes('-')) {
      return;
    }

    text += `\n| ${option} | ${makeType(value)} | ${makeScope(value)} | ${value.description} |`;
  });

  return text;
}

/** Create an object from an array of entries */
const fromEntries = entries =>
  Object.assign({}, ...entries.map(([name, value]) => ({ [name]: value })));

/** Generate a docs page for all of the configurable flags */
async function generateConfigDocs() {
  const cli = await getApplicationDefinition({});
  const validationSchema = constructValidationSchema(cli);
  let text = dedent`    
    # Configuration

    You can configure the defaults for a few options for commands in \`@design-systems/cli\`.
    Not all options are configurable.

    ## File Types

    \`@design-systems/cli\` supports a wide array of configuration files. 
    
    Add one of the following to to the root of the project and/or the root of a given submodule:

    - a \`ds\` key in the \`package.json\`
    - \`.dsrc\`
    - \`.dsrc.json\`
    - \`.dsrc.yaml\`
    - \`.dsrc.yml\`
    - \`.dsrc.js\`
    - \`ds.config.js\`
    - \`ds.config.json\`

    !> The package-specific configuration feature is in very early stages, and only supports options with the **Local** scope.

    ## Structure

    The config is structured with each key being a command name and the value being an object configuring options.
    If a command is a \`multi-command\` then value will be an object with the same structure for each \`sub-command\`.

    \`\`\`json
    {
      "noVersionWarning": true,
      "lint": { "noCache": true },
      "playroom": { "exclude": ["**/generated"] },
      "storybook": {
        "build": { "sketch": true }
      }
    }
    \`\`\`

    ## Sharing configurations

    Sharing a \`@design-systems/cli\` configuration is very easy: 
    
    1. publish a module that's \`main\` is a configuration object
    2. reference it in your root \`package.json\`:
    
    \`\`\`json
    {
      "name": "@my-design-system",
      "version": "0.1.0",
      "ds": "@company/design-system-config"
    }
    \`\`\`
    
    If you don't want to use \`package.json\`, you can use any of the supported file types
    and add a string, e.g. \`ds.config.json\`:
    
    \`\`\`json
    "@company/prettier-config"
    \`\`\`
    
    !> This method does **not** offer a way to _extend_ the configuration to overwrite some properties from the shared configuration. If you need to do the following in a \`ds.config.js\`

    \`\`\`js
    const merge = require('merge-deep')
  
    module.exports = merge(
      require("@company/design-system-config"),
      { lint: { noCache: false } }
    );
    \`\`\`
    
    ## Configurable Options
  `;

  const plugins = {
    type: 'string',
    multiple: true,
    description: 'Custom commands to load into the CLI'
  };

  text += generateOptionTable(
    fromEntries(
      Object.entries({
        plugins,
        ...validationSchema
      }).filter(
        ([name, options]) =>
          typeof Object.values(options)[0] !== 'object' && !name.includes('-')
      )
    )
  );

  Object.entries(validationSchema)
    .filter(([, options]) => typeof Object.values(options)[0] === 'object')
    .forEach(([command, options]) => {
      text += dedent`\n
      ### \`${command}\`
    `;
      if (Object.values(options)[0].type) {
        text += generateOptionTable(options);
      } else {
        Object.entries(options).forEach(([subCommand, subOptions]) => {
          text += dedent`\n
          #### \`${subCommand}\`${generateOptionTable(subOptions)}
        `;
        });
      }
    });

  fs.writeFileSync(path.join('src/generated', 'configuration.md'), text);
  // eslint-disable-next-line no-console
  console.log(`Created docs for configuration`);

  return path.join('generated', 'configuration.md');
}

/** Generate plugin and config documentation */
async function generateDocs() {
  mkdirp.sync('src/generated');
  const commandDocs = await generateCommandDocs();
  const configFile = await generateConfigDocs();

  fs.writeFileSync(
    'src/_sidebar.md',
    `
- [Introduction](welcome.md)
- [Getting Started](getting-started.md)
- [Usage](usage.md)

- Commands

${commandDocs.map(([name, docPath]) => `  - [${name}](${docPath})`).join('\n')}

- Advanced

  - [Configuration](${configFile})
  - [GitHub Annotations](advanced/annotate.md)
  - [Plugins](advanced/plugins.md)

- [Deploy](deploy.md)
- [FAQ](faq.md)
`
  );
}

generateDocs();
