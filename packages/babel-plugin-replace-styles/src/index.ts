// eslint-disable-next-line import/no-extraneous-dependencies
import * as BabelTypes from '@babel/types';
import nodePath from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NodePath, PluginPass } from '@babel/core';
import exists from './exists';

export interface Babel {
  /** Babel base types. */
  types: typeof BabelTypes;
}

export interface ReplaceStylesOptions {
  /** The name of the scoped design-system */
  scope: string;
  /** The name of the import to replace */
  replace: string;
  /** The import to use instead of main */
  use: string;
}

/**
 * Find imports of @design-system/cli components and optionally replaces their style imports.
 */
export default function replaceStyles(
  { types }: Babel,
  { scope, use, replace = 'main' }: ReplaceStylesOptions
): babel.PluginObj {
  /**  Replace an import inside a component */
  function replaceCssImports(
    path: NodePath<BabelTypes.ImportDeclaration>,
    state: PluginPass,
    importName: string
  ) {
    const isScope =
      state?.file?.opts?.filename &&
      state.file.opts.filename.includes(`@${scope}/`);

    if (isScope && importName.includes(`${replace}.css`)) {
      // We found a candidate for replacement
      const dirname = nodePath.dirname(state.file.opts.filename as string);
      const next = nodePath.join(dirname, importName.replace(replace, use));

      if (exists(next)) {
        // Replacement exists
        const importDeclaration = types.importDeclaration(
          [],
          types.stringLiteral(`../${use}.css`)
        );
        path.replaceInline(importDeclaration);
      }
    }
  }

  /**  Replace an css.js import inside a component */
  function replaceCssJsImports(
    path: NodePath<BabelTypes.ImportDeclaration>,
    state: PluginPass,
    importName: string
  ) {
    const isScope =
      state?.file?.opts?.filename &&
      state.file.opts.filename.includes(`@${scope}/`);

    if (
      isScope &&
      path.node.specifiers.length &&
      importName.includes('.css') &&
      !importName.includes(use)
    ) {
      const dirname = nodePath.dirname(state.file.opts.filename as string);
      const newImport = importName.replace('.css', `-${use}.css`);
      const newImportPath = nodePath.join(dirname, newImport);

      if (exists(newImportPath)) {
        const importDeclaration = types.importDeclaration(
          path.node.specifiers,
          types.stringLiteral(newImport)
        );
        path.replaceWith(importDeclaration);
      }
    }
  }

  return {
    visitor: {
      ImportDeclaration(path, state) {
        const importName = path.node.source.value;
        replaceCssImports(path, state, importName);
        replaceCssJsImports(path, state, importName);
      },
    },
  };
}
