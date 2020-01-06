import path from 'path';
import glob from 'fast-glob';
import jsxToString from 'react-element-to-jsx-string';

interface DisplayNamed {
  /** The type of react component. */
  type: {
    /** The display name set on the component */
    displayName?: string;
    /** The name of the component's function. */
    name: string;
  };
}

/** Get all the snippets defined in each component. */
export default function getSnippets() {
  const packageSnippets = glob.sync([
    'components/**/dist/**/cjs/**/*.snippet.js',
    'dist/**/cjs/**/*.snippet.js'
  ]);

  const snippets = packageSnippets.reduce((all, file) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const snippet = require(path.resolve(file.toString())).default;

    return Object.assign(
      all,
      ...Object.entries(snippet).map(([name, jsx]) => ({
        [name]:
          typeof jsx === 'string'
            ? jsx
            : jsxToString(jsx, {
                showDefaultProps: false,
                displayName: (component: DisplayNamed) =>
                  component.type.displayName ||
                  component.type.name ||
                  component.type
              })
      }))
    );
  }, {});

  return Object.assign(
    {},
    ...Object.entries(snippets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, snippet]) => ({
        [name]: snippet
      }))
  );
}
