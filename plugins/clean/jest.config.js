const base = require('@design-systems/test/jest.config.base');
const { name } = require('./package.json');

module.exports = {
  ...base,
  name,
  collectCoverageFrom: [...base.collectCoverageFrom, '!**/command.ts'],
  displayName: name,
  setupFilesAfterEnv: undefined
};
