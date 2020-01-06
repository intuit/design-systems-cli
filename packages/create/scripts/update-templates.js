#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
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

/** Rebase all branches on to master */
function mergeBranch(branch, templates) {
  templates.forEach(template => {
    if (template.name === 'ts') {
      execSync(`git push origin ${branch}`);
      return;
    }

    execSync(`git checkout ${template.name}`);
    execSync(`git merge ${branch} -m "Merge ${branch}"`);
    execSync(`git push origin ${branch}`);

    // eslint-disable-next-line no-param-reassign
    template.sha = getSha(template.name);
  });
}

Object.entries(currentTemplates).forEach(([type, templates]) => {
  // eslint-disable-next-line no-console
  console.log('TYPE:', type);
  process.chdir(sources[type]);

  templates.forEach(template => {
    const branch = template.name === 'ts' ? 'master' : template.name;
    const sha = getSha(branch);

    if (template.sha !== sha) {
      // eslint-disable-next-line no-console
      console.log(
        `Template "${template.name}" is out of date! Updating to: ${sha}`
      );
      // eslint-disable-next-line no-console
      console.log({ old: template.sha, new: sha });

      // eslint-disable-next-line no-param-reassign
      template.sha = sha;

      if (branch === 'master') {
        mergeBranch(branch, templates);
      }
    }
  });
});

fs.writeFileSync(templatesPath, JSON.stringify(currentTemplates, null, 2));
