import { CliCommand } from '@design-systems/plugin';
import { cosmiconfigSync as load } from 'cosmiconfig';
import get from 'dlv';
import merge from 'deepmerge';
import dedent from 'dedent';
import resolve from 'resolve';
import path from 'path';
import flat from 'flat';
import changeCase from 'change-case';

type FlagTypes =
  | number
  | boolean
  | string
  | string[]
  | number[]
  | boolean[]
  | Schema;

interface Schema {
  [key: string]: FlagTypes;
}

interface TypedSchema {
  [key: string]:
    | {
        /** The type of the option */
        type: 'string' | 'number' | 'boolean';
        /** If the option is an array */
        multiple?: boolean;
        /** The description of the option */
        description?: string;
      }
    | TypedSchema;
}

/** Recursively build the validation schema */
export function getValidationSchema(command: CliCommand) {
  const schema: TypedSchema = {};

  if (command.options) {
    command.options.forEach(option => {
      if (!option.config) {
        return;
      }

      schema[option.name] = {
        type:
          (option.type === String && 'string') ||
          (option.type === Number && 'number') ||
          'boolean'
      };

      if (option.multiple) {
        schema[option.name].multiple = option.multiple;
      }

      if (option.description) {
        schema[option.name].description = option.description;
      }

      schema[changeCase.camelCase(option.name)] = schema[option.name];
    });
  }

  if ('commands' in command) {
    command.commands.forEach(subCommand => {
      const subSchema = getValidationSchema(subCommand);

      if (Object.keys(subSchema).length > 0) {
        schema[subCommand.name] = subSchema;
        schema[changeCase.camelCase(subCommand.name)] = subSchema;
      }
    });
  }

  return schema;
}

const templates = {
  description: 'A list of user configured templates for the creation type',
  typeName: 'Template',
  type: {
    name: { type: 'string' },
    url: { type: 'string' },
    description: { type: 'string' },
    sha: { type: 'string' }
  },
  multiple: true
};

export const extraConfigurableOptions = {
  create: { package: { templates }, component: { templates } }
};

/** Construct a validation schema with extraConfigurableOptions */
export function constructValidationSchema(command: CliCommand) {
  return merge(getValidationSchema(command), extraConfigurableOptions);
}

/** Turn an array of key value pairs into an object */
const fromEntries = (entries: [string, FlagTypes][]) =>
  Object.assign({}, ...entries.map(([name, value]) => ({ [name]: value })));

/** Ensure that a user's configuration is valid for the configure CLI */
export function validateConfig(schema: Schema, command: CliCommand): Schema {
  const validationSchema = constructValidationSchema(command);
  const config = flat<Schema, Schema>(schema);

  Object.entries(config).forEach(([configPath, value]) => {
    const parts = configPath.split('.');
    const last = parts[parts.length - 1];
    const isArray = last !== '' && !isNaN(Number(last));

    if (isArray) {
      parts.pop();
    }

    if (configPath.startsWith('plugins.')) {
      if (typeof value !== 'string') {
        throw new Error(
          `Invalid configuration for plugins, all items must be strings`
        );
      }

      return;
    }

    const pathWithSubType = parts
      .map(part => (isNaN(Number(part)) ? part : 'type'))
      .join('.');

    const type =
      get(validationSchema, pathWithSubType) ||
      get(validationSchema, configPath);

    if (!type) {
      throw new Error(`Invalid configuration option: "${configPath}"`);
    }

    if (type.multiple) {
      if (!isArray) {
        throw new Error(dedent`
          Invalid configuration type ("${typeof value}") for option: "${configPath}"

          Should be: "${type.type}"
        `);
      } else if (isArray && typeof value !== type.type) {
        throw new Error(dedent`
          Invalid configuration type for option array item: "${configPath}" === ${typeof value}

          Should be: "${type.type}"
        `);
      }
    } else if (typeof value !== type.type) {
      throw new Error(dedent`
        Invalid configuration type ("${typeof value}") for option: "${configPath}"

        Should be: "${type.type}"
      `);
    }
  });

  return flat.unflatten(
    fromEntries(
      Object.entries(config).map(([configPath, value]) => [
        configPath
          .split('.')
          .map(part => changeCase.camelCase(part))
          .join('.'),
        value
      ])
    )
  );
}

interface LoadConfigOptions {
  /** Directory to start looking for configs in */
  cwd?: string;
}

/** Load the configuration file from the system */
export function loadConfig({ cwd }: LoadConfigOptions = {}): Schema {
  const moduleName = 'ds';
  const explorer = load(moduleName, {
    searchPlaces: [
      'package.json',
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `${moduleName}.config.js`,
      `${moduleName}.config.json`
    ],
    transform: result => {
      // Config extending ripped from https://github.com/prettier/prettier/pull/5963
      if (result && result.config) {
        if (typeof result.config === 'string') {
          const modulePath = resolve.sync(result.config, {
            basedir: path.dirname(result.filepath)
          });

          // eslint-disable-next-line no-param-reassign, no-eval
          result.config = eval('require')(modulePath);
        }

        if (typeof result.config !== 'object') {
          throw new Error(
            `Config is only allowed to be an object, ` +
              `but received ${typeof result.config} in "${result.filepath}"`
          );
        }

        // eslint-disable-next-line no-param-reassign
        delete result.config.$schema;
      }

      return result;
    }
  });

  const results = explorer.search(cwd || process.cwd());

  if (!results) {
    return {};
  }

  return results.config;
}
