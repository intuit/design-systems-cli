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

/** Go through each template and update their sha if needed */
Object.entries(currentTemplates).forEach(([type, templates]) => {
  // eslint-disable-next-line no-console
  console.log('TYPE:', type);
  process.chdir(sources[type]);

  templates.forEach(template => {
    const branch = template.name === 'ts' ? 'master' : template.name;
    const sha = getSha(branch);

    // The templates.json is out of date with the SHAs on the system
    if (template.sha !== sha) {
      // eslint-disable-next-line no-console
      console.log(
        `Template "${template.name}" is out of date! Updating to: ${sha}`
      );
      // eslint-disable-next-line no-console
      console.log({ old: template.sha, new: sha });

      // eslint-disable-next-line no-param-reassign
      template.sha = sha;
    }
  });
});

fs.writeFileSync(templatesPath, JSON.stringify(currentTemplates, null, 2));
