import {
  createLogger,
  getLogLevel,
  getMonorepoRoot
} from '@design-systems/cli-utils';
import fs from 'fs';
import path from 'path';
import { camelCase } from 'change-case';
import ts from 'typescript';
import postcss from 'postcss';
import postcssIcssSelectors from 'postcss-icss-selectors';
import { extractICSS } from 'icss-utils';

import { BuildArgs } from '.';
import { getPostCssConfigSync } from './postcss';

interface DTsFile {
  /** In a d.ts file this is the AST for the actual program */
  externalModuleIndicator: ts.SourceFile;
}

interface TypescriptInternals {
  /** Options that a solution builder with pass through to the program */
  commonOptionsWithBuild: {
    /** The name of the flag */
    name: string;
  }[];
}

interface WithAddDiagnostic {
  /** A function to add a diagnostic error to the compilation */
  addDiagnostic: (diagnostics: ts.Diagnostic) => void;
}

const CSS_EXTENSION_REGEX = /\.css['"]$/;

const FORMAT_HOST = {
  getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
  getNewLine: () => ts.sys.newLine,
  getCanonicalFileName: (filename: string) =>
    ts.sys.useCaseSensitiveFileNames ? filename : filename.toLowerCase()
};

/** Determine the relative file name to the file */
function resolveCssPath(cssPath: string, { fileName }: ts.SourceFile): string {
  const resolvedPath = cssPath.substring(1, cssPath.length - 1);

  if (resolvedPath.startsWith('.')) {
    const sourcePath = fileName;
    return path.resolve(path.dirname(sourcePath), resolvedPath);
  }

  return resolvedPath;
}

/** Find a path relative to wherever the script was ran */
function relativeFile(file: ts.SourceFile) {
  return {
    ...file,
    fileName: path.relative(
      process.env.INIT_CWD || process.cwd(),
      file.fileName
    )
  };
}

/** Find and process all the css files in a typescript AST */
async function processCss(
  processor: postcss.Processor,
  project: ts.BuildInvalidedProject<ts.EmitAndSemanticDiagnosticsBuilderProgram>
) {
  const ignore = ['node_modules', '.d.ts'];
  const files = project
    .getSourceFiles()
    .filter(f => !ignore.find(i => f.fileName.includes(i)));
  const pendingCssResults = new Map<string, postcss.LazyResult>();

  const cssPromises = files.map(async file => {
    const styles = new Map<string, Record<string, string>>();
    const results: [string, postcss.LazyResult][] = [];

    // 1. Find all css imports
    file.forEachChild(node => {
      // Dealing with "import * as css from 'foo.css'" only since namedImports variables get mangled
      if (
        ts.isImportDeclaration(node) &&
        node.importClause &&
        CSS_EXTENSION_REGEX.test(node.moduleSpecifier.getText())
      ) {
        const { importClause } = node;
        const cssPath = resolveCssPath(node.moduleSpecifier.getText(), file);

        // This is the "foo" from "import * as foo from 'foo.css'"
        const importVar = importClause.getText();

        if (!fs.existsSync(cssPath)) {
          throw new Error(
            ts.formatDiagnosticsWithColorAndContext(
              [
                {
                  category: 1,
                  messageText: `Could not find file ${node.moduleSpecifier.getText()}"`,
                  start: node.moduleSpecifier.getStart(),
                  length: node.moduleSpecifier.getText().length,
                  file: relativeFile(file),
                  code: 1337
                }
              ],
              FORMAT_HOST
            )
          );
        }

        const pending = pendingCssResults.get(cssPath);

        if (pending) {
          results.push([importVar, pending]);
        } else {
          const promise = processor.process(fs.readFileSync(cssPath, 'utf8'), {
            from: cssPath
          });

          pendingCssResults.set(cssPath, promise);
          results.push([importVar, promise]);
        }
      }
    });

    // 2. Process the css with postcss to an object containing all the classNames
    await Promise.all(
      results.map(async ([name, promise]) => {
        const result = await promise;

        styles.set(
          name,
          result.root ? extractICSS(result.root, false).icssExports : {}
        );
      })
    );

    return [file.fileName, styles] as const;
  });

  // 3. Return a map of ts sources file => styles in file
  return new Map(await Promise.all(cssPromises));
}

/**
 * Builds type definition for your source files. Will only emit definitions.
 * Also tracks usage of css classnames and provides type errors.
 */
export default class TypescriptCompiler {
  private logger = createLogger({ scope: 'build' });

  private buildArgs: BuildArgs;

  constructor(args: BuildArgs) {
    this.buildArgs = args;
  }

  buildTypes = async (watch: boolean) => {
    const isTrace = getLogLevel() === 'trace';

    if (!fs.existsSync(path.join(process.cwd(), 'tsconfig.json'))) {
      this.logger.debug('No tsconfig.json found, skipping type build.');
      return;
    }

    this.logger.trace('Generating Types...');

    try {
      const diagnostics: ts.Diagnostic[] = [];
      const host = ts.createSolutionBuilderHost(
        undefined,
        undefined,
        d => diagnostics.push(d),
        d => this.logger.trace(d.messageText)
      );

      // The following options are not public but we want to override them
      ((ts as unknown) as TypescriptInternals).commonOptionsWithBuild.push(
        { name: 'emitDeclarationOnly' },
        { name: 'declarationMap' },
        { name: 'outDir' }
      );

      const solution = ts.createSolutionBuilder(host, ['./tsconfig.json'], {
        verbose: isTrace,
        listEmittedFiles: isTrace,
        outDir: this.buildArgs.outputDirectory || '',
        incremental: true,
        declarationMap: true,
        emitDeclarationOnly: true
      });

      const postcssConfig = getPostCssConfigSync({
        cwd: getMonorepoRoot(),
        useModules: false,
        reportError: false
      });

      const cssProcessor = postcss([
        ...postcssConfig.plugins,
        postcssIcssSelectors({
          mode: 'local',
          generateScopedName: name => name
        })
      ]);

      let project = solution.getNextInvalidatedProject();

      while (project) {
        let css = new Map<string, Map<string, Record<string, string>>>();

        if ('getSourceFiles' in project) {
          // eslint-disable-next-line no-await-in-loop
          css = await processCss(cssProcessor, project);
        }

        project.done(undefined, undefined, {
          afterDeclarations: [this.findStyleUsage(css)]
        });

        project = solution.getNextInvalidatedProject();
      }

      if (diagnostics.length > 0) {
        const formattedDiagnostics = ts.formatDiagnosticsWithColorAndContext(
          diagnostics
            .sort((a, b) => (a.start || 0) - (b.start || 0))
            .map(d => ({
              ...d,
              file: d.file ? relativeFile(d.file) : undefined
            })),
          FORMAT_HOST
        );

        throw new Error(formattedDiagnostics);
      }

      this.logger.complete('Generated Types');
    } catch (e) {
      this.logger.error('\n');
      // If we don't do this there is a weird space on the first line of the errors
      // eslint-disable-next-line no-console
      console.log(e.message);
      this.logger.debug(e.stack);

      this.logger.error('Failed to generate types');

      if (!watch) {
        process.exit(1);
      }
    }
  };

  private findStyleUsage(
    css: Map<string, Map<string, Record<string, string>>>
  ) {
    return (
      ctx: ts.TransformationContext
    ): ts.Transformer<ts.SourceFile | ts.Bundle> => sf => {
      if (!('fileName' in sf)) {
        return sf;
      }

      const styles = css.get(sf.fileName) || new Map();

      /** Recursively visit all the node in the ts file looking for css usage and imports */
      const visitor: ts.Visitor = (node: ts.Node): ts.Node => {
        if (ts.isPropertyAccessExpression(node)) {
          const variable = node.expression.getText();
          const style = styles.get(variable);

          if (style) {
            const classes = Object.keys(style);
            const camelClasses = classes.map(s => camelCase(s));
            const className = node.name.getText();
            const exists = Boolean(
              classes.includes(className) || camelClasses.includes(className)
            );

            if (!exists) {
              // We're using internal APIs.... *shh*
              ((ctx as unknown) as WithAddDiagnostic).addDiagnostic({
                category: 1,
                messageText: `ClassName "${className}" does not exists in "${variable}"`,
                start: node.name.getStart(),
                length: className.length,
                file: sf,
                code: 1337
              });
            }
          }
        }

        return ts.visitEachChild(node, visitor, ctx);
      };

      // Must visit source file instead of the .d.ts file, since that contains no actual code
      const external = ((sf as unknown) as DTsFile).externalModuleIndicator;
      ts.visitNode(external ? external.parent : sf, visitor);

      return sf;
    };
  }
}
