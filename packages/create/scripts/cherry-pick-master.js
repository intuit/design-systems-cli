#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const { execSync } = require('child_process');

const templatesPath = path.join(__dirname, '../src/templates.json');
const currentTemplates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));

const sources = {
  system: path.join(__dirname, '../../../../monorepo-template'),
  component: path.join(__dirname, '../../../../component-template'),
  package: path.join(__dirname, '../../../../package-template')
};

/** Get the SHA for the HEAD of a branch */
function getSha(branch) {
  return execSync(`git rev-parse ${branch}`)
    .toString()
    .trim();
}

/** cherry pick a commit to a branch */
function cherryPick(branch, sha) {
  execSync(`git checkout ${branch}`);
  execSync(`git cherry-pick --ff ${sha}`);
}

/** Update all the templates only if needed */
async function updateTemplate(info) {
  const [type, templates] = info;
  console.log('TYPE:', type);

  process.chdir(sources[type]);
  const masterSha = getSha('master');

  // Master has not changed, do nothing
  if (masterSha === templates.find(t => t.name === 'ts').sha) {
    console.log(`No update to ${type}`);
    return;
  }

  await templates.reduce(async (last, template) => {
    await last;
    const branch = template.name === 'ts' ? 'master' : template.name;

    // Master is the base for everything else, we should never cherry pick
    // to it.
    if (branch === 'master') {
      return;
    }

    console.log(`Updating ${branch}`);

    try {
      cherryPick(branch, masterSha);
    } catch (error) {
      // cherry pick was a noop
      if (error.message.includes('could not apply')) {
        const done = await inquirer.prompt({
          name: 'addressed',
          type: 'confirm'
        });

        if (done.addressed) {
          execSync('git add .').toString();

          const diff = execSync('git diff HEAD').toString();
          console.log({ diff });

          if (diff) {
            execSync('git commit -m "cherry picked"');
          } else {
            execSync('git reset');
          }
        }
      } else {
        console.log(error.message);
      }
    }
  });

  execSync('git checkout master');
  execSync('git push --all origin');
}

/** Cherry pick the commits */
async function main() {
  /** Go through each template and update their sha if needed */
  await Object.entries(currentTemplates).reduce(async (last, template) => {
    await last;
    return updateTemplate(template);
  }, Promise.resolve());
}

main();
