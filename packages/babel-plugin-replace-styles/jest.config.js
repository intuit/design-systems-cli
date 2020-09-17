const base = require('@design-systems/test/jest.config.base');
const { name } = require('./package.json');

module.exports = {
  ...base,
  name,
  displayName: name,
  moduleNameMapper: undefined,
  testPathIgnorePatterns: [...base.testPathIgnorePatterns, '__tests__/utils.ts']
};
