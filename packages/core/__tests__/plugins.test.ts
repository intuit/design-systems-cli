import path from 'path';
import { tryRequire, requirePlugin, getPlugins } from '../src/plugins';

describe('tryRequire', () => {
  test("should not find module that doesn't exists", async () => {
    expect(tryRequire('foo-bar')).toStrictEqual({});
  });

  test('should find module that does exists', async () => {
    const plugin = tryRequire('@design-systems/test');
    expect(plugin).not.toStrictEqual({});
    expect(plugin).not.toBeUndefined();
  });
});

describe('requirePlugin', () => {
  test('should find official plugin', async () => {
    expect(requirePlugin('test')).not.toBeUndefined();
  });

  test('should find official plugin-command', async () => {
    expect(requirePlugin('create')).not.toBeUndefined();
  });

  test('should find plugin from path', async () => {
    expect(
      requirePlugin(path.join(__dirname, './test-plugin'))
    ).not.toBeUndefined();
  });

  test("should not find plugins that don't exist", async () => {
    expect(requirePlugin('foo-bar')).toBeUndefined();
  });
});

describe('getPlugins', () => {
  test('should work with no plugins in config', async () => {
    expect(getPlugins()).toHaveLength(0);
  });

  test('should get plugins from config', async () => {
    const plugins = getPlugins({
      plugins: [path.join(__dirname, './test-plugin')]
    });
    expect(Object.keys(plugins[0][1]).length > 0).toBe(true);
  });
});
