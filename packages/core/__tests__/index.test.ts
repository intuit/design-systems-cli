import path from 'path';
import getApplicationDefinition, { getCommands, getPlugin } from '../src';

describe('getCommands', () => {
  test('should find commands', async () => {
    const commands = await getCommands();
    expect(commands.length > 0).toBe(true);
  });
});

describe('getPlugin', () => {
  test('should not find fake plugin', async () => {
    const plugin = await getPlugin('foo-bar');
    expect(plugin).toBeUndefined();
  });

  test('should find real plugin', async () => {
    const plugin = await getPlugin('test');
    expect(plugin).not.toBeUndefined();
  });

  test('should find user plugin', async () => {
    const plugin = await getPlugin('echo', {
      plugins: [path.join(__dirname, './test-plugin')]
    });
    expect(plugin).not.toBeUndefined();
  });
});

describe('getApplicationDefinition', () => {
  test('get CLI definition', async () => {
    const cli = await getApplicationDefinition();
    expect(cli.name).not.toBeUndefined();
    expect(cli.description).not.toBeUndefined();
    // @ts-ignore
    expect(cli.commands.length > 0).toBe(true);
  });
});
