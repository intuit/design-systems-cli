import path from 'path';

import { loadConfig } from '../src';

jest.mock('@proof-ui/cli');

test('should handle no config', async () => {
  expect(await loadConfig({ cwd: '/' })).toStrictEqual({});
});

test('should return a valid config', async () => {
  const config = { lint: { noCache: true } };

  expect(
    await loadConfig({ cwd: path.join(__dirname, './configs/extends') })
  ).toStrictEqual(config);
});

test('should throw on invalid config', async () => {
  expect(() =>
    loadConfig({ cwd: path.join(__dirname, './configs/invalid') })
  ).toThrow(Error);
});
