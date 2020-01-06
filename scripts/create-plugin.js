#!/usr/bin/env node

const copy = require('copy-template-dir');
const path = require('path');
const log = require('signale');
const fs = require('fs');
const changeCase = require('change-case');
const { app } = require('command-line-application');
const inquirer = require('inquirer');

const { version } = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../lerna.json'), 'utf8')
);
const inDir = path.join(__dirname, './template-plugin');

function updateCliTsConfig(name) {
  const configPath = path.join(__dirname, '../packages/cli/tsconfig.json');
  const config = JSON.parse(fs.readFileSync(configPath), 'utf8');

  config.references.push({ path: `../../plugins/${name}` });

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

async function create(options) {
  let { name } = options;

  if (!name) {
    ({ name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: `What's the plugin name?`
      }
    ]));
  }

  const kebab = changeCase.paramCase(name);
  const outDir = path.join(__dirname, '../plugins', kebab);

  fs.mkdirSync(outDir);

  const vars = {
    version,
    title: changeCase.titleCase(name),
    kebab,
    pascal: changeCase.pascalCase(name)
  };

  copy(inDir, outDir, vars, (err, createdFiles) => {
    if (err) {
      throw err;
    }

    createdFiles.forEach(filePath =>
      log.info(`Created ${path.relative(outDir, filePath)}`)
    );
    log.success(`Created @design-systems/${kebab} plugin!`);
  });

  updateCliTsConfig(kebab);
}

const args = app(
  {
    name: 'create-plugin',
    description: 'Add a new plugin to the @design-sytems/cli project',
    examples: ['create-plugin ProgressBar', 'create-plugin --name ProgressBar'],
    options: [
      {
        name: 'name',
        description: 'The name of the new plugin',
        type: String,
        defaultOption: true
      }
    ]
  },
  { argv: process.argv }
);

if (args) {
  create(args).catch(e => {
    console.error(e);
  });
}
