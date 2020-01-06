// eslint-disable-next-line import/no-extraneous-dependencies
import * as BabelTypes from '@babel/types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NodePath } from '@babel/core';

import exists from './exists';

export interface Babel {
  /** Babel base types. */
  types: typeof BabelTypes;
}

export interface IncludeStylesOptions {
  /** The name of the scoped design-system */
  scope: string;
}

/**
 * Find imports of @design-system/cli components and automatically includes their styles.
 */
export default function includeStyles(
  { types }: Babel,
  { scope }: IncludeStylesOptions
): babel.PluginObj {
  const SCOPE_REGEX = new RegExp(`^@${scope}\\/`);
  let cssImports = new Set<string>();

  /** Insert an import for a component */
  function insertCssImports(
    path: NodePath<BabelTypes.ImportDeclaration>,
    importName: string
  ) {
    if (!SCOPE_REGEX.test(importName)) {
      return;
    }

    if (importName.includes('main.css')) {
      // Only keep 1 import per imported css file
      if (cssImports.has(importName)) {
        path.remove();
      } else {
        cssImports.add(importName);
      }

      return;
    }

    const cssImport = `${importName}/dist/main.css`;

    if (exists(cssImport)) {
      path.insertAfter(
        types.importDeclaration([], types.stringLiteral(cssImport))
      );
    }

    // After walk dependencies to find more css to include
    // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
    const { dependencies = {} } = require(`${importName}/package.json`);

    Object.keys(dependencies).forEach((dependency: string) =>
      insertCssImports(path, dependency)
    );
  }

  return {
    pre: () => {
      cssImports = new Set<string>();
    },

    visitor: {
      ImportDeclaration(path) {
        const importName = path.node.source.value;
        insertCssImports(path, importName);
      }
    }
  };
}
