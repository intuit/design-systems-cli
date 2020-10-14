import * as React from 'react';

/**
 * Create an instance of the component only if the element is defined.
 *
 * @param node - The node to check if it's defined
 * @param Component - The component to wrap the node in
 *
 * @example
 * const child = 'Foo'
 * createInstanceIfDefined(child, Wrapper)
 * // <Wrapper>'Foo'</Wrapper>
 * const other = null
 * createInstanceIfDefined(other, Wrapper)
 * // undefined
 */
export const createInstanceIfDefined = (
  node: React.ReactNode,
  Component: React.ComponentType
) => (node ? <Component>{node}</Component> : undefined);
