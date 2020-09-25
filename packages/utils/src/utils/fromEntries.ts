/**
 * Object.fromEntries ponyfill while we wait for better babel support.
 *
 * @param entries - Array of object entries.
 * @example
 * fromEntries([['key', 'value']])
 */
export const fromEntries = (entries: [string, any][]) =>
  Object.assign({}, ...entries.map(([name, value]) => ({ [name]: value })));
