/**
 * Attempt to retrieve a prop from a react node.
 *
 * @param el - The react node to get props from
 * @param prop - The name of the prop to get
 *
 * @example
 * getProp(child, 'id');
 */
export const getProp = (el: React.ReactNode, prop: string) =>
  el && typeof el === 'object' && 'props' in el && el.props[prop];
