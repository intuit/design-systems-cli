/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import glob from 'fast-glob';
import jsxToString from 'react-element-to-jsx-string';

interface Snippet {
  /** The name of the snippet */
  name: string;
  /** the actual snippet */ code: React.ReactNode;
}

/** Render a snippet to a string */
const renderSnippet = (code: string | React.ReactNode) =>
  typeof code === 'string'
    ? code
    : jsxToString(code, {
        showDefaultProps: false,
        displayName: component =>
          component &&
          typeof component === 'object' &&
          ((component as åany).type.displayName ||
            (component as any).type.name ||
            (component as any).type)
      });

/** Get all the snippets defined in each component. */
export default function getSnippets() {
  const packageSnippets = glob.sync([
    'components/**/dist/**/cjs/**/*.snippet.js',
    'dist/**/cjs/**/*.snippet.js'
  ]);

  const snippets = packageSnippets.reduce((all, file) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const componentSnippets = require(path.resolve(file.toString())).default;

    if (Array.isArray(componentSnippets)) {
      return [
        ...all,
        ...componentSnippets.map((snippet: Snippet) => ({
          ...snippet,
          code: renderSnippet(snippet.code)
        }))
      ];
    }

    // Support for old format
    return [
      ...all,
      ...Object.entries(componentSnippets).map(
        ([name, code]: [string, any]) => ({
          name,
          code: renderSnippet(code)
        })
      )
    ];
  }, [] as Snippet[]);

  return snippets;
}
