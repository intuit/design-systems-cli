import { cosmiconfigSync } from 'cosmiconfig';

import { loadConfig, getValidationSchema, validateConfig } from '../src';

jest.mock('@design-systems/core');
jest.mock('cosmiconfig');

describe('getValidationSchema', () => {
  test('should create a schema for a basic command', async () => {
    expect(
      getValidationSchema({
        name: 'Test',
        description: 'foo'
      })
    ).toStrictEqual({});
  });

  test('should create a schema for a basic command w/options', async () => {
    expect(
      getValidationSchema({
        name: 'Test',
        description: 'foo',
        options: [
          {
            name: 'foo',
            config: true,
            type: String,
            description: 'foo foo'
          }
        ]
      })
    ).toStrictEqual({
      foo: { type: 'string', description: 'foo foo' }
    });
  });

  test('should not load options without config', async () => {
    expect(
      getValidationSchema({
        name: 'Test',
        description: 'foo',
        options: [
          {
            name: 'foo',
            type: String
          }
        ]
      })
    ).toStrictEqual({});
  });

  test('should create schema for sub-commands', async () => {
    expect(
      getValidationSchema({
        name: 'Test',
        description: 'foo',
        options: [
          {
            name: 'foo',
            config: true,
            type: String
          }
        ],
        commands: [
          { name: 'empty', description: 'empty foo' },
          {
            name: 'inner',
            description: 'inner foo',
            options: [
              {
                name: 'bar',
                config: true,
                type: Number
              }
            ]
          }
        ]
      })
    ).toStrictEqual({
      foo: { type: 'string' },
      inner: {
        bar: { type: 'number' }
      }
    });
  });

  test('should know all types', async () => {
    expect(
      getValidationSchema({
        name: 'Test',
        description: 'foo',
        options: [
          {
            name: 'foo',
            config: true,
            type: String
          },
          {
            name: 'bar',
            config: true,
            type: Number
          },
          {
            name: 'baz',
            config: true,
            type: Boolean
          },
          {
            name: 'boo',
            config: true,
            type: Boolean,
            multiple: true
          }
        ]
      })
    ).toStrictEqual({
      foo: { type: 'string' },
      bar: { type: 'number' },
      baz: { type: 'boolean' },
      boo: { type: 'boolean', multiple: true }
    });
  });
});

describe('loadConfig', () => {
  test('should handle no config', async () => {
    // @ts-ignore
    cosmiconfigSync.mockReturnValueOnce({
      search: () => undefined
    });

    expect(await loadConfig()).toStrictEqual({});
  });
});

describe('validateConfig', () => {
  test('should not accept unknown options', () => {
    expect(() =>
      validateConfig(
        { foo: 'bar' },
        {
          name: 'Test',
          description: 'foo'
        }
      )
    ).toThrow(Error);
  });

  test('should throw on invalid string', () => {
    expect(() =>
      validateConfig(
        { foo: 10 },
        {
          name: 'Test',
          description: 'foo',
          options: [{ name: 'foo', config: true, type: String }]
        }
      )
    ).toThrow(Error);
  });

  test('should throw on invalid number', () => {
    expect(() =>
      validateConfig(
        { foo: 'foo' },
        {
          name: 'Test',
          description: 'foo',
          options: [{ name: 'foo', config: true, type: Number }]
        }
      )
    ).toThrow(Error);
  });

  test('should throw on invalid boolean', () => {
    expect(() =>
      validateConfig(
        { foo: 'foo' },
        {
          name: 'Test',
          description: 'foo',
          options: [{ name: 'foo', config: true, type: Boolean }]
        }
      )
    ).toThrow(Error);
  });

  test('should throw on invalid array', () => {
    expect(() =>
      validateConfig(
        { foo: 'foo' },
        {
          name: 'Test',
          description: 'foo',
          options: [
            { name: 'foo', config: true, type: Boolean, multiple: true }
          ]
        }
      )
    ).toThrow(Error);
  });

  test('should throw on invalid array item', () => {
    expect(() =>
      validateConfig(
        { foo: ['foo'] },
        {
          name: 'Test',
          description: 'foo',
          options: [
            { name: 'foo', config: true, type: Boolean, multiple: true }
          ]
        }
      )
    ).toThrow(Error);
  });

  test('should return a valid config', () => {
    const config = { foo: [true], bar: 19, baz: 'something' };

    expect(
      validateConfig(config, {
        name: 'Test',
        description: 'foo',
        options: [
          { name: 'foo', config: true, type: Boolean, multiple: true },
          { name: 'bar', config: true, type: Number },
          { name: 'baz', config: true, type: String }
        ]
      })
    ).toStrictEqual(config);
  });

  test('should validate w/plugins', () => {
    const config = { plugins: ['1'], foo: [true] };

    expect(
      validateConfig(config, {
        name: 'Test',
        description: 'foo',
        options: [{ name: 'foo', config: true, type: Boolean, multiple: true }]
      })
    ).toStrictEqual(config);
  });
});
