import { setLogLevel } from '@design-systems/cli-utils';
import { vol, fs } from 'memfs';

import CleanPlugin from '.';

jest.mock('fs');

const mockPackage = (name: string) => ({
  [`/packages/${name}/node_modules/other/package.json`]: '{}',
  [`/packages/${name}/dist/${name}.txt`]: 'foo',
  [`/packages/${name}/src/${name}.txt`]: 'bar',
  [`/packages/${name}/package.json`]: `{ "name": "${name}", "version": "0.0.0" }`,
  [`/packages/${name}/tsconfig.tsbuildinfo`]: 'info'
});

const mockMonorepo = () => {
  const packages = ['a', 'b', 'c'].map(p => mockPackage(p));

  vol.fromJSON(
    Object.assign(
      {},
      {
        '/package.json': JSON.stringify({
          name: 'root',
          private: true,
          devDependencies: {
            lerna: '^3.16.1'
          }
        }),
        '/lerna.json': JSON.stringify({
          version: '0.0.0',
          packages: ['packages/*']
        }),
        '/coverage/test.json': '{ "test": 0 }',
        '/out/make': 'make it real good',
        '/node_modules/some/a.json': '{}'
      },
      ...packages
    )
  );
};

describe('Clean Plugin', () => {
  beforeEach(mockMonorepo);
  afterEach(vol.reset.bind(vol));

  beforeAll(() => setLogLevel('silent'));

  // We cannot test the result of the lerna clean because it is in
  // an execed child process. lerna itself also execs a child process
  // to remove the directories. Jest cannot mock fs in child process.
  // Therefore we cannot test this behavior.
  describe('monorepo', () => {
    beforeEach(() => {
      process.cwd = () => '/';
    });

    test('it removes files', async () => {
      await new CleanPlugin().run();

      expect(fs.existsSync('/packages/a/src/a.txt')).toBe(true);
      expect(fs.existsSync('/coverage/test.json')).not.toBe(true);
      expect(fs.existsSync('/out/make')).not.toBe(true);
      expect(fs.existsSync('/node_modules/some/a.json')).not.toBe(true);
      expect(fs.existsSync('/packages/a/dist/a.txt')).not.toBe(true);
      expect(fs.existsSync('/packages/a/tsconfig.tsbuildinfo')).not.toBe(true);
    });

    test('it should skip node_modules with no-modules flag', async () => {
      await new CleanPlugin().run({ noModules: true });

      expect(fs.existsSync('/node_modules/some/a.json')).toBe(true);
    });
  });

  describe('package', () => {
    beforeEach(() => {
      process.cwd = () => '/packages/a/';
    });

    test('it removes files', async () => {
      await new CleanPlugin().run();

      // Keeps root intact
      expect(fs.existsSync('/packages/a/src/a.txt')).toBe(true);
      expect(fs.existsSync('/coverage/test.json')).toBe(true);
      expect(fs.existsSync('/out/make')).toBe(true);
      expect(fs.existsSync('/node_modules/some/a.json')).toBe(true);

      expect(
        fs.existsSync('/packages/a/node_modules/other/package.json')
      ).not.toBe(true);
      expect(fs.existsSync('/packages/a/dist/a.txt')).not.toBe(true);
      expect(fs.existsSync('/packages/a/src/tsconfig.tsbuildinfo')).not.toBe(
        true
      );
    });

    test('it should skip node_modules with no-modules flag', async () => {
      await new CleanPlugin().run({ noModules: true });

      expect(fs.existsSync('/packages/a/dist/a.txt')).not.toBe(true);
      expect(fs.existsSync('/packages/a/node_modules/other/package.json')).toBe(
        true
      );
    });
  });
});
